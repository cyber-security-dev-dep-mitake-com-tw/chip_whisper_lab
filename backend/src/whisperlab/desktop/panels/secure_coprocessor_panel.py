"""PUF-based Secure Co-processor / Attestation panel.

Walks through a host <-> secure co-processor challenge/response
attestation flow, matching "PUF-based Secure Co-processor" (docs/
references/ch-4): the co-processor is an autonomous subsystem that
never exposes its PUF-derived Hardware Unique Key (HUK) across the
mailbox/IPC boundary - only the final attestation tag crosses to the
host. Key steps:

1. Host sends a challenge (nonce) into the co-processor's mailbox.
2. The co-processor's fuzzy extractor reproduces its HUK from a fresh
   (noisy) PUF reading plus previously-enrolled helper data - this
   mirrors ``puf_core.FuzzyExtractor`` used by the PUF Enrollment panel.
3. The co-processor computes an HMAC-SHA256 attestation tag over the
   challenge and current firmware measurement, keyed by the HUK - the
   same HMAC-based signing approach ``boot_chain_panel.py`` uses for
   its boot-stage signatures.
4. The host independently verifies the tag against its own expected
   value; a "simulate compromised firmware" tamper toggle changes the
   firmware measurement the co-processor signs, which must make
   verification fail, mirroring boot_chain_panel's tamper checkboxes.
"""

from __future__ import annotations

import hashlib
import hmac
import os

import numpy as np
from PySide6.QtWidgets import (
    QCheckBox,
    QGroupBox,
    QHBoxLayout,
    QLabel,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

from ..puf_core import FuzzyExtractor, apply_noise, generate_puf_response

_EXPECTED_FIRMWARE_MEASUREMENT = b"firmware-v2.3-golden-hash"


class AttestationStepWidget(QWidget):
    """A single labelled step in the attestation flow, with a status marker."""

    def __init__(self, title: str, description: str, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        layout = QHBoxLayout(self)
        layout.setContentsMargins(0, 4, 0, 4)

        self.status_label = QLabel("○")
        self.status_label.setFixedWidth(28)
        self.status_label.setStyleSheet("font-size: 20px; color: #888888;")
        layout.addWidget(self.status_label)

        text_box = QVBoxLayout()
        title_label = QLabel(f"<b>{title}</b>")
        self.detail_label = QLabel(description)
        self.detail_label.setWordWrap(True)
        text_box.addWidget(title_label)
        text_box.addWidget(self.detail_label)
        layout.addLayout(text_box, stretch=1)

    def set_state(self, passed: bool | None, detail: str | None = None) -> None:
        if detail is not None:
            self.detail_label.setText(detail)
        if passed is None:
            self.status_label.setText("○")
            self.status_label.setStyleSheet("font-size: 20px; color: #888888;")
        elif passed:
            self.status_label.setText("✓")
            self.status_label.setStyleSheet("font-size: 20px; color: #4fbf6f; font-weight: bold;")
        else:
            self.status_label.setText("✗")
            self.status_label.setStyleSheet("font-size: 20px; color: #e05561; font-weight: bold;")


class SecureCoprocessorPanel(QWidget):
    """Interactive host <-> secure co-processor attestation walkthrough."""

    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        # Enroll a co-processor PUF instance once, at panel construction,
        # standing in for a one-time factory enrollment step.
        response, self._used_hardware = generate_puf_response(224, seed=42)
        self._enrolled_response = response
        self._extractor = FuzzyExtractor(repetition_factor=7)
        self._huk, self._helper = self._extractor.gen(response, seed=42)

        layout = QVBoxLayout(self)

        intro = QLabel(
            "<b>PUF-based Secure Co-processor - Attestation Walkthrough</b><br>"
            "The co-processor never reveals its PUF-derived Hardware Unique Key "
            "(HUK) across the host/mailbox boundary - only the challenge (in) and "
            "the attestation tag (out) cross that line. Each run below re-derives "
            "the HUK from a fresh, noisy PUF reading via the fuzzy extractor, then "
            "signs the challenge and firmware measurement with HMAC-SHA256."
        )
        intro.setWordWrap(True)
        layout.addWidget(intro)

        self.hw_status = QLabel(
            "Entropy source: real ChipWhisperer capture (hardware jitter)"
            if self._used_hardware
            else "Entropy source: simulated (no ChipWhisperer hardware detected) - offline mode"
        )
        self.hw_status.setStyleSheet("color: #e0a34f; font-style: italic;")
        layout.addWidget(self.hw_status)

        self.tamper_checkbox = QCheckBox(
            "Simulate compromised firmware (co-processor signs a tampered measurement)"
        )
        layout.addWidget(self.tamper_checkbox)

        flow_box = QGroupBox("Challenge / Response flow")
        flow_layout = QVBoxLayout(flow_box)

        self.step_challenge = AttestationStepWidget(
            "1. Host -> Mailbox: challenge",
            "Host generates a fresh random nonce and places it in the mailbox.",
        )
        self.step_key = AttestationStepWidget(
            "2. Co-processor: reproduce HUK",
            "Fuzzy extractor Rep() reconstructs the enrolled key from a fresh, "
            "noisy PUF reading plus the stored helper data.",
        )
        self.step_tag = AttestationStepWidget(
            "3. Co-processor: compute attestation tag",
            "HMAC-SHA256(HUK, challenge || firmware measurement) - the HUK itself "
            "never leaves the co-processor.",
        )
        self.step_verify = AttestationStepWidget(
            "4. Host: verify attestation tag",
            "Host recomputes the expected tag using its own record of the golden "
            "firmware measurement and compares.",
        )
        for step in (self.step_challenge, self.step_key, self.step_tag, self.step_verify):
            flow_layout.addWidget(step)
        layout.addWidget(flow_box)

        self.run_button = QPushButton("Run attestation exchange")
        self.run_button.clicked.connect(self._run_attestation)
        layout.addWidget(self.run_button)

        self.result_label = QLabel("Attestation not yet run.")
        self.result_label.setWordWrap(True)
        self.result_label.setStyleSheet("font-weight: bold;")
        layout.addWidget(self.result_label)

        layout.addStretch(1)

    def _run_attestation(self) -> None:
        for step in (self.step_challenge, self.step_key, self.step_tag, self.step_verify):
            step.set_state(None)

        # Step 1: host issues a fresh random challenge nonce.
        challenge = os.urandom(16)
        self.step_challenge.set_state(True, f"Challenge nonce: {challenge.hex()}")

        # Step 2: co-processor reproduces its HUK from a fresh noisy PUF read.
        # Noise here is deliberately small (aging/temp jitter, not tampering) -
        # the fuzzy extractor's error correction should still recover the HUK.
        noisy_response = apply_noise(self._enrolled_response, 0.03)
        reproduced_huk = self._extractor.rep(noisy_response, self._helper)
        huk_ok = np.array_equal(reproduced_huk, self._huk)
        self.step_key.set_state(
            huk_ok,
            f"Reproduced HUK ({len(reproduced_huk)} bits) "
            f"{'matches' if huk_ok else 'DOES NOT match'} the enrolled key.",
        )

        # Step 3: co-processor signs challenge + (possibly tampered) firmware
        # measurement, keyed by its reproduced HUK.
        huk_bytes = np.packbits(reproduced_huk).tobytes()
        actual_measurement = (
            _EXPECTED_FIRMWARE_MEASUREMENT + b"-TAMPERED"
            if self.tamper_checkbox.isChecked()
            else _EXPECTED_FIRMWARE_MEASUREMENT
        )
        tag = hmac.new(huk_bytes, challenge + actual_measurement, hashlib.sha256).digest()
        self.step_tag.set_state(True, f"Attestation tag: {tag.hex()[:32]}...")

        # Step 4: host independently verifies using its own expected values.
        # The host knows the enrolled HUK only via the same enrollment record
        # (standing in for a provisioning-time public commitment), the golden
        # firmware measurement, and the challenge it issued.
        expected_huk_bytes = np.packbits(self._huk).tobytes()
        expected_tag = hmac.new(
            expected_huk_bytes, challenge + _EXPECTED_FIRMWARE_MEASUREMENT, hashlib.sha256
        ).digest()
        verified = hmac.compare_digest(tag, expected_tag)
        self.step_verify.set_state(
            verified,
            f"Expected tag: {expected_tag.hex()[:32]}... -> "
            f"{'MATCH' if verified else 'MISMATCH'}",
        )

        if verified:
            self.result_label.setText(
                "ATTESTATION SUCCEEDED: the co-processor proved possession of the "
                "enrolled HUK and an untampered firmware measurement, without ever "
                "exposing the HUK itself across the mailbox boundary."
            )
            self.result_label.setStyleSheet("font-weight: bold; color: #4fbf6f;")
        else:
            self.result_label.setText(
                "ATTESTATION FAILED: the host rejected the tag - either the "
                "reproduced HUK diverged (noise exceeded error-correction capacity) "
                "or the firmware measurement was tampered with."
            )
            self.result_label.setStyleSheet("font-weight: bold; color: #e05561;")
