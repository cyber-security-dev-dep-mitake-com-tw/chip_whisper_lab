"""PUF simulation, fuzzy-extractor key generation, and quality metrics.

These helpers back the desktop teaching panels. When ChipWhisperer
hardware is attached, entropy is drawn from the least-significant bits
of a real captured trace (a rough stand-in for SRAM/RO-PUF jitter,
since no ChipWhisperer target board exposes a first-class PUF API).
When no hardware is present -- true for CI and most development
machines -- responses are generated with a seeded numpy RNG and
clearly labelled as simulated.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np


def hardware_available() -> bool:
    """Best-effort check for an attached ChipWhisperer scope."""
    try:
        from ..services.devices import DeviceService

        devices = DeviceService(simulation=False).list_devices()
        return any(not d.simulated for d in devices)
    except Exception:
        return False


def _entropy_from_hardware(n_bits: int) -> np.ndarray | None:
    """Pull raw bits from a real capture's LSBs, or None if unavailable."""
    try:
        from ..services.capture import RealScope, ScopeConfig

        scope = RealScope()
        scope.setup(ScopeConfig(samples=max(n_bits, 512)))
        trace = scope.capture()
        scope.close()
    except Exception:
        return None

    if not trace:
        return None

    # Quantize each sample's fractional part's low bit as a raw entropy bit.
    bits = [int(abs(v) * 1e6) & 1 for v in trace]
    if len(bits) < n_bits:
        return None
    return np.array(bits[:n_bits], dtype=np.uint8)


def generate_puf_response(n_bits: int, *, seed: int | None = None) -> tuple[np.ndarray, bool]:
    """Return (response_bits, used_hardware)."""
    hw_bits = _entropy_from_hardware(n_bits)
    if hw_bits is not None:
        return hw_bits, True

    rng = np.random.default_rng(seed)
    return rng.integers(0, 2, size=n_bits, dtype=np.uint8), False


def apply_noise(response: np.ndarray, flip_prob: float, *, seed: int | None = None) -> np.ndarray:
    """Simulate a noisy re-read of the same PUF instance (aging/temp/voltage)."""
    rng = np.random.default_rng(seed)
    flips = rng.random(response.shape) < flip_prob
    return np.bitwise_xor(response, flips.astype(np.uint8))


def hamming_distance(a: np.ndarray, b: np.ndarray) -> int:
    return int(np.count_nonzero(a != b))


def fractional_hamming_distance(a: np.ndarray, b: np.ndarray) -> float:
    return hamming_distance(a, b) / len(a)


@dataclass
class HelperData:
    """Public helper data from a fuzzy-extractor Gen() call.

    A code-offset construction: the key is encoded with a repetition
    code, XORed with the noisy PUF response to produce helper data that
    can be published without revealing the key, then used at Rep() time
    to correct noise in a fresh PUF reading via majority-vote decoding.
    """

    codeword_xor_response: np.ndarray
    repetition_factor: int
    key_bits: int


class FuzzyExtractor:
    """Repetition-code fuzzy extractor for PUF-based key generation."""

    def __init__(self, repetition_factor: int = 7) -> None:
        if repetition_factor % 2 == 0:
            raise ValueError("repetition_factor must be odd for majority voting")
        self.repetition_factor = repetition_factor

    def gen(
        self, response: np.ndarray, *, seed: int | None = None
    ) -> tuple[np.ndarray, HelperData]:
        """Enrollment: derive a fresh random key and publish helper data."""
        r = self.repetition_factor
        key_bits = len(response) // r
        if key_bits == 0:
            raise ValueError("response too short for the chosen repetition factor")

        rng = np.random.default_rng(seed)
        key = rng.integers(0, 2, size=key_bits, dtype=np.uint8)
        codeword = np.repeat(key, r)
        trimmed_response = response[: key_bits * r]
        helper = np.bitwise_xor(codeword, trimmed_response)
        return key, HelperData(
            codeword_xor_response=helper, repetition_factor=r, key_bits=key_bits
        )

    def rep(self, noisy_response: np.ndarray, helper: HelperData) -> np.ndarray:
        """Reproduction: recover the enrolled key from a noisy reading."""
        r = helper.repetition_factor
        trimmed = noisy_response[: helper.key_bits * r]
        noisy_codeword = np.bitwise_xor(trimmed, helper.codeword_xor_response)
        blocks = noisy_codeword.reshape(helper.key_bits, r)
        votes = blocks.sum(axis=1)
        return (votes > (r // 2)).astype(np.uint8)


def batch_uniqueness(samples: np.ndarray) -> float:
    """Average pairwise fractional Hamming distance across chip instances.

    ``samples`` is (n_chips, n_bits). Ideal PUF uniqueness is ~50%.
    """
    n_chips = samples.shape[0]
    if n_chips < 2:
        return 0.0
    distances = []
    for i in range(n_chips):
        for j in range(i + 1, n_chips):
            distances.append(fractional_hamming_distance(samples[i], samples[j]))
    return float(np.mean(distances)) * 100


def batch_reliability(reference: np.ndarray, repeated_reads: np.ndarray) -> float:
    """Average fractional Hamming distance between a reference response
    and repeated noisy reads of the *same* chip. Ideal reliability
    means this intra-chip distance is ~0%.
    """
    distances = [fractional_hamming_distance(reference, read) for read in repeated_reads]
    return float(np.mean(distances)) * 100
