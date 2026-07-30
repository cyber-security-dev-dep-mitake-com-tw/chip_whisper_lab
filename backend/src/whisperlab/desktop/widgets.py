"""Small reusable QPainter-based widgets, to avoid a matplotlib/QtCharts
dependency for simple bar visualizations."""

from __future__ import annotations

from PySide6.QtCore import QRectF, Qt
from PySide6.QtGui import QColor, QPainter, QPen
from PySide6.QtWidgets import QWidget


class BarChart(QWidget):
    """A minimal horizontal-bar chart: list of (label, value, color)."""

    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self._bars: list[tuple[str, float, QColor]] = []
        self._max_value = 100.0
        self.setMinimumHeight(120)

    def set_data(self, bars: list[tuple[str, float, str]], max_value: float = 100.0) -> None:
        self._bars = [(label, value, QColor(color)) for label, value, color in bars]
        self._max_value = max(max_value, 1e-9)
        self.update()

    def paintEvent(self, event) -> None:  # noqa: N802 (Qt override)
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        if not self._bars:
            painter.end()
            return

        margin = 10
        label_width = 140
        row_height = (self.height() - 2 * margin) / max(len(self._bars), 1)
        chart_left = margin + label_width
        chart_width = self.width() - chart_left - margin - 60

        painter.setPen(QPen(QColor("#888888")))
        for i, (label, value, color) in enumerate(self._bars):
            top = margin + i * row_height
            bar_height = row_height * 0.55
            fraction = min(value / self._max_value, 1.0)

            painter.setPen(QPen(QColor("#dddddd")))
            painter.drawText(
                QRectF(margin, top, label_width - 8, row_height),
                Qt.AlignmentFlag.AlignVCenter | Qt.AlignmentFlag.AlignRight,
                label,
            )

            painter.setPen(Qt.PenStyle.NoPen)
            painter.setBrush(QColor("#333333"))
            painter.drawRoundedRect(
                QRectF(chart_left, top + (row_height - bar_height) / 2, chart_width, bar_height),
                3,
                3,
            )
            painter.setBrush(color)
            painter.drawRoundedRect(
                QRectF(
                    chart_left,
                    top + (row_height - bar_height) / 2,
                    chart_width * fraction,
                    bar_height,
                ),
                3,
                3,
            )

            painter.setPen(QPen(QColor("#dddddd")))
            painter.drawText(
                QRectF(chart_left + chart_width + 6, top, 54, row_height),
                Qt.AlignmentFlag.AlignVCenter | Qt.AlignmentFlag.AlignLeft,
                f"{value:.1f}%",
            )

        painter.end()


class BitStripWidget(QWidget):
    """Renders a bit string as a strip of small colored squares."""

    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self._bits: list[int] = []
        self._diff_mask: list[bool] | None = None
        self.setMinimumHeight(26)

    def set_bits(self, bits, diff_mask=None) -> None:
        self._bits = list(bits)
        self._diff_mask = list(diff_mask) if diff_mask is not None else None
        self.setMinimumWidth(max(len(self._bits) * 12, 100))
        self.update()

    def paintEvent(self, event) -> None:  # noqa: N802
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        cell = 12
        for i, bit in enumerate(self._bits):
            is_diff = bool(self._diff_mask[i]) if self._diff_mask else False
            if is_diff:
                color = QColor("#e05561")
            elif bit:
                color = QColor("#4fa8e0")
            else:
                color = QColor("#3a3f47")
            painter.setPen(Qt.PenStyle.NoPen)
            painter.setBrush(color)
            painter.drawRect(i * cell, 2, cell - 2, cell + 8)
        painter.end()
