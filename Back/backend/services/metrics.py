"""Rolling latency metrics (last 5 minutes)."""
from __future__ import annotations
import time
from collections import deque
from threading import Lock

_window_seconds = 300
_samples: deque[tuple[float, float]] = deque()  # (ts, latency_ms)
_lock = Lock()


def record(latency_ms: float) -> None:
    now = time.time()
    with _lock:
        _samples.append((now, latency_ms))
        cutoff = now - _window_seconds
        while _samples and _samples[0][0] < cutoff:
            _samples.popleft()


def _percentile(sorted_vals: list[float], p: float) -> float:
    if not sorted_vals:
        return 0.0
    k = max(0, min(len(sorted_vals) - 1, int(round(p * (len(sorted_vals) - 1)))))
    return sorted_vals[k]


def snapshot() -> dict:
    with _lock:
        vals = sorted(v for _, v in _samples)
        count = len(vals)
    return {
        "window_seconds": _window_seconds,
        "samples": count,
        "p50_ms": round(_percentile(vals, 0.50), 1),
        "p95_ms": round(_percentile(vals, 0.95), 1),
        "p99_ms": round(_percentile(vals, 0.99), 1),
    }
