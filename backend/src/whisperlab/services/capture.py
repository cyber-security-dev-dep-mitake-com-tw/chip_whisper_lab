from __future__ import annotations

import abc
import math
import random
from dataclasses import dataclass


@dataclass
class ScopeConfig:
    samples: int = 5000
    gain_db: float = 22.0
    clock_hz: int = 7_370_000
    num_traces: int = 1


class ScopeInterface(abc.ABC):
    @abc.abstractmethod
    def setup(self, config: ScopeConfig) -> None: ...

    @abc.abstractmethod
    def capture(self) -> list[float]: ...

    @abc.abstractmethod
    def close(self) -> None: ...


class SimulatedScope(ScopeInterface):
    def __init__(self) -> None:
        self._rng = random.Random(0xC017)

    def setup(self, config: ScopeConfig) -> None:
        self._config = config

    def capture(self) -> list[float]:
        displayed = min(self._config.samples, 2_000)
        trace: list[float] = []
        for i in range(displayed):
            carrier = 0.018 * math.sin(i / 11) + 0.01 * math.sin(i / 3.7)
            trigger = 0.19 * math.exp(-((i - displayed * 0.38) ** 2) / 36)
            aes = (
                0.045 * math.sin(i * 0.9)
                if displayed * 0.42 < i < displayed * 0.67
                else 0
            )
            trace.append(round(carrier + trigger + aes + self._rng.gauss(0, 0.008), 6))
        return trace

    def close(self) -> None:
        pass


class RealScope(ScopeInterface):
    def __init__(self) -> None:
        self._scope = None

    def setup(self, config: ScopeConfig) -> None:
        try:
            import chipwhisperer as cw
        except ImportError as e:
            raise RuntimeError("chipwhisperer not installed") from e
        scope = cw.scope()
        self._scope = scope
        scope.setup(gain=config.gain_db, num_samples=config.samples)
        scope.adc.clkplan = config.clock_hz

    def capture(self) -> list[float]:
        if self._scope is None:
            raise RuntimeError("Scope not set up")
        self._scope.arm()
        self._scope.capture()
        return [float(v) for v in self._scope.last_trace]

    def close(self) -> None:
        if self._scope is not None:
            self._scope.close()
            self._scope = None


class CaptureService:
    def __init__(self, *, simulation: bool = True) -> None:
        self.simulation = simulation
        self._scope: ScopeInterface | None = None

    def create_scope(self) -> ScopeInterface:
        return SimulatedScope() if self.simulation else RealScope()

    def capture(self, config: ScopeConfig) -> list[float]:
        scope = self.create_scope()
        try:
            scope.setup(config)
            return scope.capture()
        finally:
            scope.close()
