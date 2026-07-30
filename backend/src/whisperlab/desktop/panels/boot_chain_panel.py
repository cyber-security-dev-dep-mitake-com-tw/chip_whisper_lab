"""Secure Boot / Hardware Root of Trust chain-of-trust panel.

A visual step-through of a boot chain: immutable Root of Trust -> first
stage bootloader signature check -> firmware signature check, matching
the "Hardware Root of Trust" and "Building a HW RoT" concepts
(docs/references/ch-2, ch-3).
"""

from __future__ import annotations

import hashlib
import hmac

from PySide6.QtWidgets import (
    QCheckBox,
    QGroupBox,
    QHBoxLayout,
    QLabel,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

_ROT_SECRET = b"immutable-root-of-trust-key-burned-in-efuse"


def _sign(payload: bytes) -> bytes:
    return hmac.new(_ROT_SECRET, payload, hashlib.sha256).digest()


class BootStageWidget(QWidget):
    def __init__(self, title: str, description: str, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        layout = QHBoxLayout(self)
        layout.setContentsMargins(0, 4, 0, 4)

        self.status_label = QLabel("○")  # circle
        self.status_label.setFixedWidth(28)
        self.status_label.setStyleSheet("font-size: 20px; color: #888888;")
        layout.addWidget(self.status_label)

        text_box = QVBoxLayout()
        title_label = QLabel(f"<b>{title}</b>")
        desc_label = QLabel(description)
        desc_label.setWordWrap(True)
        text_box.addWidget(title_label)
        text_box.addWidget(desc_label)
        layout.addLayout(text_box, stretch=1)

    def set_state(self, passed: bool | None) -> None:
        if passed is None:
            self.status_label.setText("○")
            self.status_label.setStyleSheet("font-size: 20px; color: #888888;")
        elif passed:
            self.status_label.setText("✓")
            self.status_label.setStyleSheet("font-size: 20px; color: #4fbf6f; font-weight: bold;")
        else:
            self.status_label.setText("✗")
            self.status_label.setStyleSheet("font-size: 20px; color: #e05561; font-weight: bold;")


class BootChainPanel(QWidget):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        layout = QVBoxLayout(self)

        intro = QLabel(
            "<b>Secure Boot / Hardware Root of Trust</b><br>"
            "Step through a chain of trust anchored in an immutable Root of Trust "
            "(e.g. mask ROM + eFuse-burned key). Each stage only executes if the "
            "previous stage verified the next stage's signature."
        )
        intro.setWordWrap(True)
        layout.addWidget(intro)

        self.tamper_bootloader = QCheckBox("Tamper with bootloader image (simulate attack)")
        self.tamper_firmware = QCheckBox("Tamper with firmware image (simulate attack)")
        layout.addWidget(self.tamper_bootloader)
        layout.addWidget(self.tamper_firmware)

        chain_box = QGroupBox("Boot chain")
        chain_layout = QVBoxLayout(chain_box)

        self.stage_rot = BootStageWidget(
            "0. Root of Trust (immutable)",
            "Mask ROM code and an eFuse-burned public key/hash form the immutable "
            "anchor of trust - it cannot be updated and is trusted unconditionally.",
        )
        self.stage_bootloader = BootStageWidget(
            "1. Bootloader signature check",
            "The RoT verifies the first-stage bootloader's signature using the "
            "eFuse-anchored key before handing off execution.",
        )
        self.stage_firmware = BootStageWidget(
            "2. Firmware signature check",
            "The verified bootloader in turn verifies the application firmware's "
            "signature before jumping to it, extending the chain of trust.",
        )
        for stage in (self.stage_rot, self.stage_bootloader, self.stage_firmware):
            chain_layout.addWidget(stage)
        layout.addWidget(chain_box)

        self.run_button = QPushButton("Run boot sequence")
        self.run_button.clicked.connect(self._run_boot)
        layout.addWidget(self.run_button)

        self.result_label = QLabel("Boot not yet run.")
        self.result_label.setWordWrap(True)
        self.result_label.setStyleSheet("font-weight: bold;")
        layout.addWidget(self.result_label)

        layout.addStretch(1)

    def _run_boot(self) -> None:
        for stage in (self.stage_rot, self.stage_bootloader, self.stage_firmware):
            stage.set_state(None)

        # Stage 0: RoT is immutable and always trusted.
        self.stage_rot.set_state(True)

        # Stage 1: RoT signs the "expected" bootloader; verify against the
        # (possibly tampered) actual bootloader image.
        bootloader_image = b"bootloader-v1.0-image-bytes"
        expected_bootloader_sig = _sign(bootloader_image)
        actual_bootloader_image = (
            bootloader_image + b"-TAMPERED" if self.tamper_bootloader.isChecked() else bootloader_image
        )
        bootloader_ok = hmac.compare_digest(
            _sign(actual_bootloader_image), expected_bootloader_sig
        )
        self.stage_bootloader.set_state(bootloader_ok)

        if not bootloader_ok:
            self.stage_firmware.set_state(None)
            self.result_label.setText(
                "BOOT HALTED at stage 1: bootloader signature verification failed. "
                "The chain of trust is broken - the RoT refuses to hand off execution "
                "to unverified code."
            )
            self.result_label.setStyleSheet("font-weight: bold; color: #e05561;")
            return

        # Stage 2: the (now-trusted) bootloader verifies firmware similarly.
        firmware_image = b"firmware-v2.3-image-bytes"
        expected_firmware_sig = _sign(firmware_image)
        actual_firmware_image = (
            firmware_image + b"-TAMPERED" if self.tamper_firmware.isChecked() else firmware_image
        )
        firmware_ok = hmac.compare_digest(_sign(actual_firmware_image), expected_firmware_sig)
        self.stage_firmware.set_state(firmware_ok)

        if firmware_ok:
            self.result_label.setText(
                "BOOT SUCCEEDED: every stage in the chain of trust verified the next, "
                "from the immutable Root of Trust up to application firmware."
            )
            self.result_label.setStyleSheet("font-weight: bold; color: #4fbf6f;")
        else:
            self.result_label.setText(
                "BOOT HALTED at stage 2: firmware signature verification failed. "
                "The bootloader refuses to jump to unverified firmware."
            )
            self.result_label.setStyleSheet("font-weight: bold; color: #e05561;")
