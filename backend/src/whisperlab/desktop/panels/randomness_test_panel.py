"""NIST SP 800-22 Randomness Test panel.

Implements two of the statistical tests from the NIST SP 800-22 suite
("A Statistical Test Suite for Random and Pseudorandom Number Generators
for Cryptographic Applications"):

* the **Frequency (Monobit) Test** - checks whether the proportion of
  ones and zeros in the sequence is close to 1/2, and
* the **Runs Test** - checks whether the number of "runs" (uninterrupted
  sequences of identical bits) is what would be expected for a truly
  random sequence, which also depends on the proportion of ones/zeros.

Both tests compute a real p-value using the standard erfc-based formulas
from the NIST 800-22 document (not a placeholder), and are declared a
PASS at the conventional significance level alpha = 0.01 when
p-value >= alpha. Background reading: docs/references/ch-1/entropy
source.md (physical/software entropy sources feeding a TRNG) - this
panel tests the *output* bitstream of such a source for statistical
randomness defects.
"""

from __future__ import annotations

import math

import numpy as np
from PySide6.QtWidgets import (
    QComboBox,
    QFormLayout,
    QGroupBox,
    QLabel,
    QPlainTextEdit,
    QPushButton,
    QSpinBox,
    QVBoxLayout,
    QWidget,
)

from ..puf_core import generate_puf_response
from ..widgets import BitStripWidget

ALPHA = 0.01  # conventional NIST SP 800-22 significance level


def monobit_frequency_test(bits: np.ndarray) -> float:
    """NIST SP 800-22 Section 2.1: Frequency (Monobit) Test.

    Maps each bit to +-1, sums them, and computes:
        s_obs = |sum(X)| / sqrt(n)
        p-value = erfc(s_obs / sqrt(2))
    """
    n = len(bits)
    x = 2 * bits.astype(np.int64) - 1  # 0 -> -1, 1 -> +1
    s = int(np.sum(x))
    s_obs = abs(s) / math.sqrt(n)
    p_value = math.erfc(s_obs / math.sqrt(2))
    return p_value


def runs_test(bits: np.ndarray) -> tuple[float, str | None]:
    """NIST SP 800-22 Section 2.3: Runs Test.

    Returns (p_value, prerequisite_failure_message). The test has a
    prerequisite: it is only meaningful if the Frequency test's
    proportion of ones, pi, is close enough to 1/2 that a run-count
    test is applicable; if not, NIST 800-22 defines the test to fail
    immediately with p-value 0.0 (no erfc computed).
    """
    n = len(bits)
    ones = int(np.count_nonzero(bits))
    pi = ones / n

    tau = 2.0 / math.sqrt(n)
    if abs(pi - 0.5) >= tau:
        return 0.0, (
            f"Prerequisite failed: |pi - 0.5| = {abs(pi - 0.5):.4f} >= tau = {tau:.4f}. "
            "The sequence's bit proportion is too skewed for the runs test to be "
            "meaningful (per NIST SP 800-22 Sec. 2.3, the test is declared failed)."
        )

    # Count runs: 1 + number of positions i where bit[i] != bit[i+1].
    v_obs = 1 + int(np.count_nonzero(bits[1:] != bits[:-1]))

    numerator = abs(v_obs - 2 * n * pi * (1 - pi))
    denominator = 2 * math.sqrt(2 * n) * pi * (1 - pi)
    p_value = math.erfc(numerator / denominator)
    return p_value, None


class RandomnessTestPanel(QWidget):
    """Generate or paste a bitstring and run NIST SP 800-22 statistical tests."""

    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self._bits: np.ndarray | None = None

        layout = QVBoxLayout(self)

        intro = QLabel(
            "<b>NIST SP 800-22 Randomness Tests</b><br>"
            "Runs the Frequency (Monobit) Test and the Runs Test from the NIST "
            "SP 800-22 statistical test suite against a bitstring - either generated "
            "from the same PUF/noise entropy simulation used elsewhere in this app, "
            "or pasted in manually. A sequence is declared PASS at significance "
            f"level alpha = {ALPHA} when its computed p-value is &gt;= alpha."
        )
        intro.setWordWrap(True)
        layout.addWidget(intro)

        source_box = QGroupBox("Bit source")
        source_layout = QVBoxLayout(source_box)

        gen_row = QFormLayout()
        self.source_combo = QComboBox()
        self.source_combo.addItems(
            [
                "Generate: simulated PUF/random bits (numpy RNG)",
                "Generate: all-zeros (known-bad control sequence)",
                "Generate: all-ones (known-bad control sequence)",
            ]
        )
        gen_row.addRow("Generator:", self.source_combo)

        self.bits_spin = QSpinBox()
        self.bits_spin.setRange(64, 100_000)
        self.bits_spin.setSingleStep(64)
        self.bits_spin.setValue(1000)
        gen_row.addRow("Bit count (if generating):", self.bits_spin)
        source_layout.addLayout(gen_row)

        self.generate_button = QPushButton("Generate bits")
        self.generate_button.clicked.connect(self._generate)
        source_layout.addWidget(self.generate_button)

        source_layout.addWidget(QLabel("...or paste a bitstring of 0s and 1s directly:"))
        self.paste_edit = QPlainTextEdit()
        self.paste_edit.setPlaceholderText("e.g. 1101001011000101...")
        self.paste_edit.setFixedHeight(60)
        source_layout.addWidget(self.paste_edit)

        self.use_pasted_button = QPushButton("Use pasted bits")
        self.use_pasted_button.clicked.connect(self._use_pasted)
        source_layout.addWidget(self.use_pasted_button)

        layout.addWidget(source_box)

        strip_box = QGroupBox("Bit strip (first 200 bits shown)")
        strip_layout = QVBoxLayout(strip_box)
        self.bit_strip = BitStripWidget()
        strip_layout.addWidget(self.bit_strip)
        layout.addWidget(strip_box)

        self.run_button = QPushButton("Run NIST SP 800-22 tests")
        self.run_button.clicked.connect(self._run_tests)
        layout.addWidget(self.run_button)

        results_box = QGroupBox("Results")
        results_layout = QVBoxLayout(results_box)
        self.monobit_label = QLabel("Frequency (Monobit) Test: -")
        self.monobit_label.setWordWrap(True)
        self.runs_label = QLabel("Runs Test: -")
        self.runs_label.setWordWrap(True)
        results_layout.addWidget(self.monobit_label)
        results_layout.addWidget(self.runs_label)
        layout.addWidget(results_box)

        layout.addStretch(1)

    def _set_bits(self, bits: np.ndarray) -> None:
        self._bits = bits
        self.bit_strip.set_bits(bits[:200])
        self.monobit_label.setText("Frequency (Monobit) Test: -")
        self.runs_label.setText("Runs Test: -")

    def _generate(self) -> None:
        n_bits = self.bits_spin.value()
        choice = self.source_combo.currentIndex()
        if choice == 0:
            bits, _ = generate_puf_response(n_bits)
        elif choice == 1:
            bits = np.zeros(n_bits, dtype=np.uint8)
        else:
            bits = np.ones(n_bits, dtype=np.uint8)
        self._set_bits(bits)

    def _use_pasted(self) -> None:
        text = "".join(ch for ch in self.paste_edit.toPlainText() if ch in "01")
        if len(text) < 2:
            self.monobit_label.setText(
                "Frequency (Monobit) Test: paste a bitstring of at least 2 characters (0/1)."
            )
            return
        bits = np.array([int(c) for c in text], dtype=np.uint8)
        self._set_bits(bits)

    def _run_tests(self) -> None:
        if self._bits is None or len(self._bits) < 2:
            self.monobit_label.setText(
                "Frequency (Monobit) Test: no bits loaded - generate or paste a sequence first."
            )
            return

        bits = self._bits
        n = len(bits)

        p_freq = monobit_frequency_test(bits)
        freq_pass = p_freq >= ALPHA
        self.monobit_label.setText(
            f"Frequency (Monobit) Test (n={n}): p-value = {p_freq:.6f} -> "
            f"{'PASS' if freq_pass else 'FAIL'} (alpha = {ALPHA})"
        )
        self.monobit_label.setStyleSheet(
            f"font-weight: bold; color: {'#4fbf6f' if freq_pass else '#e05561'};"
        )

        p_runs, prereq_msg = runs_test(bits)
        runs_pass = prereq_msg is None and p_runs >= ALPHA
        if prereq_msg:
            self.runs_label.setText(f"Runs Test (n={n}): FAIL - {prereq_msg}")
        else:
            self.runs_label.setText(
                f"Runs Test (n={n}): p-value = {p_runs:.6f} -> "
                f"{'PASS' if runs_pass else 'FAIL'} (alpha = {ALPHA})"
            )
        self.runs_label.setStyleSheet(
            f"font-weight: bold; color: {'#4fbf6f' if runs_pass else '#e05561'};"
        )
