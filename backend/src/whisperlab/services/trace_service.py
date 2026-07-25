from __future__ import annotations

from pathlib import Path

import numpy as np


class TraceService:
    def __init__(self, storage_root: str = "/data/traces") -> None:
        self.storage_root = Path(storage_root)
        self.storage_root.mkdir(parents=True, exist_ok=True)

    def upload(
        self,
        experiment_id: str,
        trace_set_name: str,
        traces: list[list[float]],
    ) -> dict:
        trace_dir = self.storage_root / experiment_id
        trace_dir.mkdir(parents=True, exist_ok=True)
        trace_array = np.array(traces, dtype=np.float64)
        file_path = trace_dir / f"{trace_set_name}.npy"
        np.save(str(file_path), trace_array)
        return {
            "path": str(file_path),
            "num_traces": len(traces),
            "num_samples": len(traces[0]) if traces else 0,
        }

    def download(self, experiment_id: str, trace_set_name: str) -> np.ndarray:
        file_path = self.storage_root / experiment_id / f"{trace_set_name}.npy"
        if not file_path.exists():
            raise FileNotFoundError(f"Trace file not found: {file_path}")
        return np.load(str(file_path))

    def read_chunk(
        self, experiment_id: str, trace_set_name: str, offset: int = 0, limit: int = 100
    ) -> np.ndarray:
        data = self.download(experiment_id, trace_set_name)
        return data[offset : offset + limit]

    def get_metadata(self, experiment_id: str, trace_set_name: str) -> dict:
        data = self.download(experiment_id, trace_set_name)
        return {
            "num_traces": int(data.shape[0]),
            "num_samples": int(data.shape[1]) if data.ndim > 1 else 0,
            "dtype": str(data.dtype),
            "shape": list(data.shape),
        }
