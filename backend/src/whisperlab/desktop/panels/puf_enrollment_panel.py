"""PUF Enrollment & Reproduction panel.

Walks the user through the classic fuzzy-extractor Gen()/Rep() flow used
to turn a noisy PUF response into a stable cryptographic key, as
described in "Key Generation with PUF Solutions" (docs/references/ch-3).
"""

from __future__ import annotations

import numpy as np
from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QFormLayout,
    QGroupBox,
    QHBoxLayout,
    QLabel,
    QPushButton,
    QSlider,
    QSpinBox,
    QVBoxLayout,
    QWidget,
)

from ..puf_core import FuzzyExtractor, HelperData, apply_noise, generate_puf_response
from ..widgets import BitStripWidget


def _bits_to_hex(bits: np.ndarray) -> str:
    packed = np.packbits(bits)
    return packed.tobytes().hex()


class PufEnrollmentPanel(QWidget):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self._response: np.ndarray | None = None
        self._helper: HelperData | None = None
        self._key: np.ndarray | None = None
        self._used_hardware = False

        layout = QVBoxLayout(self)

        intro = QLabel(
            "<b>PUF Enrollment &amp; Reproduction</b><br>"
            "Simulates a fuzzy-extractor Gen()/Rep() flow: enroll a stable key from "
            "a noisy PUF response, publish helper data, then reproduce the same key "
            "later from a fresh (noisy) reading of the same physical PUF instance."
        )
        intro.setWordWrap(True)
        layout.addWidget(intro)

        controls = QFormLayout()
        self.bits_spin = QSpinBox()
        self.bits_spin.setRange(56, 1024)
        self.bits_spin.setSingleStep(56)
        self.bits_spin.setValue(280)
        controls.addRow("Response length (bits):", self.bits_spin)

        self.noise_slider = QSlider(Qt.Orientation.Horizontal)
        self.noise_slider.setRange(0, 30)
        self.noise_slider.setValue(8)
        self.noise_label = QLabel("8% bit-flip probability")
        self.noise_slider.valueChanged.connect(
            lambda v: self.noise_label.setText(f"{v}% bit-flip probability")
        )
        noise_row = QHBoxLayout()
        noise_row.addWidget(self.noise_slider)
        noise_row.addWidget(self.noise_label)
        controls.addRow("Simulated noise:", noise_row)
        layout.addLayout(controls)

        self.hw_status = QLabel()
        self.hw_status.setStyleSheet("color: #e0a34f; font-style: italic;")
        layout.addWidget(self.hw_status)

        button_row = QHBoxLayout()
        self.enroll_button = QPushButton("1. Enroll (Gen)")
        self.reproduce_button = QPushButton("2. Reproduce (Rep)")
        self.reproduce_button.setEnabled(False)
        self.enroll_button.clicked.connect(self._enroll)
        self.reproduce_button.clicked.connect(self._reproduce)
        button_row.addWidget(self.enroll_button)
        button_row.addWidget(self.reproduce_button)
        layout.addLayout(button_row)

        enroll_box = QGroupBox("Enrollment (Gen)")
        enroll_layout = QVBoxLayout(enroll_box)
        enroll_layout.addWidget(QLabel("Raw noisy PUF response:"))
        self.response_strip = BitStripWidget()
        enroll_layout.addWidget(self.response_strip)
        self.enrolled_key_label = QLabel("Enrolled key: -")
        self.enrolled_key_label.setWordWrap(True)
        enroll_layout.addWidget(self.enrolled_key_label)
        self.helper_label = QLabel("Helper data published: -")
        self.helper_label.setWordWrap(True)
        enroll_layout.addWidget(self.helper_label)
        layout.addWidget(enroll_box)

        rep_box = QGroupBox("Reproduction (Rep)")
        rep_layout = QVBoxLayout(rep_box)
        rep_layout.addWidget(QLabel("Fresh noisy reading (red = differs from enrollment):"))
        self.noisy_strip = BitStripWidget()
        rep_layout.addWidget(self.noisy_strip)
        self.reproduced_key_label = QLabel("Reproduced key: -")
        self.reproduced_key_label.setWordWrap(True)
        rep_layout.addWidget(self.reproduced_key_label)
        self.match_label = QLabel("Result: -")
        self.match_label.setStyleSheet("font-weight: bold;")
        rep_layout.addWidget(self.match_label)
        layout.addWidget(rep_box)

        layout.addStretch(1)

    def _enroll(self) -> None:
        n_bits = self.bits_spin.value()
        response, used_hardware = generate_puf_response(n_bits)
        self._response = response
        self._used_hardware = used_hardware

        self.hw_status.setText(
            "Entropy source: real ChipWhisperer capture (hardware jitter)"
            if used_hardware
            else "Entropy source: simulated (no ChipWhisperer hardware detected) - offline mode"
        )

        extractor = FuzzyExtractor(repetition_factor=7)
        key, helper = extractor.gen(response)
        self._key = key
        self._helper = helper

        self.response_strip.set_bits(response)
        self.enrolled_key_label.setText(
            f"Enrolled key ({len(key)} bits): {_bits_to_hex(key)}"
        )
        self.helper_label.setText(
            f"Helper data published ({len(helper.codeword_xor_response)} bits, safe to store "
            f"publicly - reveals nothing about the key without the physical PUF): "
            f"{_bits_to_hex(helper.codeword_xor_response)[:48]}..."
        )
        self.reproduce_button.setEnabled(True)
        self.noisy_strip.set_bits([])
        self.reproduced_key_label.setText("Reproduced key: -")
        self.match_label.setText("Result: -")

    def _reproduce(self) -> None:
        if self._response is None or self._helper is None or self._key is None:
            return

        flip_prob = self.noise_slider.value() / 100
        noisy = apply_noise(self._response, flip_prob)
        diff_mask = (noisy != self._response).tolist()
        self.noisy_strip.set_bits(noisy, diff_mask)

        extractor = FuzzyExtractor(repetition_factor=self._helper.repetition_factor)
        reproduced_key = extractor.rep(noisy, self._helper)
        self.reproduced_key_label.setText(
            f"Reproduced key ({len(reproduced_key)} bits): {_bits_to_hex(reproduced_key)}"
        )

        matches = np.array_equal(reproduced_key, self._key)
        if matches:
            self.match_label.setText("Result: MATCH - key successfully reproduced despite noise")
            self.match_label.setStyleSheet("font-weight: bold; color: #4fbf6f;")
        else:
            self.match_label.setText(
                "Result: MISMATCH - noise exceeded the fuzzy extractor's error-correction "
                "capacity; try lowering the noise level or increasing the repetition factor"
            )
            self.match_label.setStyleSheet("font-weight: bold; color: #e05561;")
