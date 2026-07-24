from __future__ import annotations

import math
import random

from ..schemas import CapturePreview, CaptureRequest, DeviceSummary


class DeviceService:
    def __init__(self, *, simulation: bool) -> None:
        self.simulation = simulation

    def list_devices(self) -> list[DeviceSummary]:
        if self.simulation:
            return [
                DeviceSummary(
                    id="sim-cwlite-001",
                    name="ChipWhisperer-Lite (simulated)",
                    serial_number="SIM-CWLITE-001",
                    firmware_version="sim-1.0",
                    connected=True,
                    simulated=True,
                )
            ]

        try:
            import chipwhisperer as cw
        except ImportError:
            return []

        try:
            found = cw.list_devices()
        except Exception:
            return []

        return [
            DeviceSummary(
                id=str(item.get("sn") or item.get("serial_number") or index),
                name=str(item.get("name") or item.get("product") or "ChipWhisperer"),
                serial_number=item.get("sn") or item.get("serial_number"),
                connected=True,
            )
            for index, item in enumerate(found)
        ]

    def capture_preview(self, request: CaptureRequest) -> CapturePreview:
        if not self.simulation:
            raise RuntimeError("Hardware capture is not enabled in this preview endpoint.")

        displayed_samples = min(request.samples, 2_000)
        rng = random.Random(0xC017)
        trace = []
        for index in range(displayed_samples):
            carrier = 0.018 * math.sin(index / 11) + 0.01 * math.sin(index / 3.7)
            trigger = 0.19 * math.exp(-((index - displayed_samples * 0.38) ** 2) / 36)
            aes_activity = 0.045 * math.sin(index * 0.9) if displayed_samples * 0.42 < index < displayed_samples * 0.67 else 0
            trace.append(round(carrier + trigger + aes_activity + rng.gauss(0, 0.008), 6))

        return CapturePreview(
            device_id="sim-cwlite-001",
            samples=request.samples,
            trace=trace,
            simulated=True,
        )
