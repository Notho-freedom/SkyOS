"""Simple in-process TTL cache for synthesized audio.

Key = sha256(text|voice|rate|pitch). Bounded by max_items (LRU) and TTL.
"""
from __future__ import annotations
import hashlib
import time
from cachetools import TTLCache
from threading import Lock

_MAX_ITEMS = 512  # ~50MB-ish for typical clips
_TTL_SECONDS = 60 * 60 * 6  # 6 hours

_cache: TTLCache = TTLCache(maxsize=_MAX_ITEMS, ttl=_TTL_SECONDS)
_lock = Lock()

_hits = 0
_misses = 0


def make_key(text: str, voice: str, rate: str | None, pitch: str | None) -> str:
    h = hashlib.sha256(f"{voice}|{rate or ''}|{pitch or ''}|{text}".encode("utf-8")).hexdigest()
    return h


def get(key: str) -> bytes | None:
    global _hits, _misses
    with _lock:
        v = _cache.get(key)
        if v is not None:
            _hits += 1
            return v
        _misses += 1
        return None


def put(key: str, data: bytes) -> None:
    if len(data) > 2_000_000:  # don't cache >2MB clips
        return
    with _lock:
        _cache[key] = data


def stats() -> dict:
    total = _hits + _misses
    return {
        "items": len(_cache),
        "hits": _hits,
        "misses": _misses,
        "hit_rate": (_hits / total) if total else 0.0,
        "max_items": _MAX_ITEMS,
        "ttl_seconds": _TTL_SECONDS,
    }
