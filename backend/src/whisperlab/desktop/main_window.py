"""Main window: a sidebar of teaching panels for IC hardware-security
concepts, backed by the same whisperlab.services layer the FastAPI
backend uses for real ChipWhisperer hardware access."""

from __future__ import annotations

from PySide6.QtWidgets import (
    QLabel,
    QListWidget,
    QListWidgetItem,
    QMainWindow,
    QSplitter,
    QStackedWidget,
    QStatusBar,
    QVBoxLayout,
    QWidget,
)

from .panels import (
    BootChainPanel,
    PufEnrollmentPanel,
    PufMetricsPanel,
    RandomnessTestPanel,
    SecureCoprocessorPanel,
)
from .puf_core import hardware_available


class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle("WhisperLab Desktop - IC Hardware Security Trainer")
        self.resize(1024, 720)

        splitter = QSplitter()
        self.setCentralWidget(splitter)

        self.sidebar = QListWidget()
        self.sidebar.setFixedWidth(220)
        splitter.addWidget(self.sidebar)

        self.stack = QStackedWidget()
        splitter.addWidget(self.stack)
        splitter.setStretchFactor(1, 1)

        self._add_panel("PUF Enrollment && Reproduction", PufEnrollmentPanel())
        self._add_panel("PUF Metrics", PufMetricsPanel())
        self._add_panel("Secure Boot / HW RoT", BootChainPanel())
        self._add_panel("NIST SP 800-22 Randomness", RandomnessTestPanel())
        self._add_panel("Secure Co-processor / Attestation", SecureCoprocessorPanel())

        self.sidebar.currentRowChanged.connect(self.stack.setCurrentIndex)
        self.sidebar.setCurrentRow(0)

        self._build_status_bar()

    def _add_panel(self, title: str, widget: QWidget) -> None:
        QListWidgetItem(title, self.sidebar)
        wrapper = QWidget()
        layout = QVBoxLayout(wrapper)
        layout.setContentsMargins(16, 16, 16, 16)
        layout.addWidget(widget)
        self.stack.addWidget(wrapper)

    def _build_status_bar(self) -> None:
        status_bar = QStatusBar()
        self.setStatusBar(status_bar)

        hw_present = hardware_available()
        label_text = (
            "ChipWhisperer hardware detected"
            if hw_present
            else "No ChipWhisperer hardware detected - running in simulated/offline mode"
        )
        color = "#4fbf6f" if hw_present else "#e0a34f"
        status_label = QLabel(label_text)
        status_label.setStyleSheet(f"color: {color};")
        status_bar.addWidget(status_label)
