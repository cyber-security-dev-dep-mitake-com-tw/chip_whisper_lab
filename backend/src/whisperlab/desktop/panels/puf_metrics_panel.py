"""PUF Metrics panel: uniqueness (inter-chip) and reliability (intra-chip).

Matches the quality metrics described in "PUF properties" (docs/references/
ch-2): uniqueness should be near 50% Hamming distance between different
chip instances, and reliability should be near 0% Hamming distance between
repeated reads of the same chip instance.
"""

from __future__ import annotations

import numpy as np
from PySide6.QtWidgets import (
    QFormLayout,
    QGroupBox,
    QLabel,
    QPushButton,
    QSpinBox,
    QVBoxLayout,
    QWidget,
)

from ..puf_core import apply_noise, batch_reliability, batch_uniqueness, generate_puf_response
from ..widgets import BarChart


class PufMetricsPanel(QWidget):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        layout = QVBoxLayout(self)

        intro = QLabel(
            "<b>PUF Metrics</b><br>"
            "Generates a batch of simulated PUF instances to compute two of the core "
            "PUF quality metrics: <i>uniqueness</i> (average inter-chip Hamming "
            "distance - ideal is 50%) and <i>reliability</i> (average intra-chip "
            "Hamming distance across repeated reads - ideal is 0%)."
        )
        intro.setWordWrap(True)
        layout.addWidget(intro)

        controls = QFormLayout()
        self.chips_spin = QSpinBox()
        self.chips_spin.setRange(2, 64)
        self.chips_spin.setValue(16)
        controls.addRow("Simulated chip instances:", self.chips_spin)

        self.bits_spin = QSpinBox()
        self.bits_spin.setRange(64, 2048)
        self.bits_spin.setSingleStep(64)
        self.bits_spin.setValue(256)
        controls.addRow("Response length (bits):", self.bits_spin)

        self.reads_spin = QSpinBox()
        self.reads_spin.setRange(2, 50)
        self.reads_spin.setValue(10)
        controls.addRow("Repeated reads per chip:", self.reads_spin)
        layout.addLayout(controls)

        self.run_button = QPushButton("Run batch measurement")
        self.run_button.clicked.connect(self._run)
        layout.addWidget(self.run_button)

        chart_box = QGroupBox("Results (ideal: uniqueness ~50%, reliability ~0%)")
        chart_layout = QVBoxLayout(chart_box)
        self.chart = BarChart()
        chart_layout.addWidget(self.chart)
        self.summary_label = QLabel("Run a measurement to see results.")
        self.summary_label.setWordWrap(True)
        chart_layout.addWidget(self.summary_label)
        layout.addWidget(chart_box)

        layout.addStretch(1)

    def _run(self) -> None:
        n_chips = self.chips_spin.value()
        n_bits = self.bits_spin.value()
        n_reads = self.reads_spin.value()

        # Independent chip instances -> uniqueness.
        chip_responses = np.array(
            [generate_puf_response(n_bits, seed=1000 + i)[0] for i in range(n_chips)]
        )
        uniqueness = batch_uniqueness(chip_responses)

        # Repeated noisy reads of chip #0 -> reliability.
        reference = chip_responses[0]
        repeated_reads = np.array(
            [apply_noise(reference, 0.05, seed=2000 + i) for i in range(n_reads)]
        )
        reliability_error = batch_reliability(reference, repeated_reads)
        reliability_score = 100 - reliability_error

        self.chart.set_data(
            [
                ("Uniqueness", uniqueness, "#4fa8e0"),
                ("Reliability", reliability_score, "#4fbf6f"),
            ],
            max_value=100,
        )
        self.summary_label.setText(
            f"Uniqueness: {uniqueness:.2f}% average inter-chip Hamming distance across "
            f"{n_chips} chip instances (ideal ~50%). Reliability: {reliability_score:.2f}% "
            f"bit-agreement across {n_reads} noisy re-reads of one chip "
            f"({reliability_error:.2f}% intra-chip error rate, ideal ~0%)."
        )
