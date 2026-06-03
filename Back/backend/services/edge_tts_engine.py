"""Wrapper around edge-tts."""
from functools import lru_cache
import edge_tts


@lru_cache(maxsize=1)
def _voices_cache_key() -> int:
    return 0


_voices_data = None


async def list_voices():
    """Return the full voice catalog (cached process-wide)."""
    global _voices_data
    if _voices_data is None:
        _voices_data = await edge_tts.list_voices()
    return _voices_data


async def synthesize_full(text: str, voice: str, rate: str | None = None, pitch: str | None = None) -> bytes:
    """Generate the entire MP3 in memory."""
    kwargs = {"text": text, "voice": voice}
    if rate:
        kwargs["rate"] = rate
    if pitch:
        kwargs["pitch"] = pitch
    communicate = edge_tts.Communicate(**kwargs)
    chunks = []
    async for c in communicate.stream():
        if c["type"] == "audio":
            chunks.append(c["data"])
    return b"".join(chunks)


async def synthesize_stream(text: str, voice: str, rate: str | None = None, pitch: str | None = None):
    """Async generator yielding MP3 chunks as they arrive."""
    kwargs = {"text": text, "voice": voice}
    if rate:
        kwargs["rate"] = rate
    if pitch:
        kwargs["pitch"] = pitch
    communicate = edge_tts.Communicate(**kwargs)
    async for c in communicate.stream():
        if c["type"] == "audio":
            yield c["data"]
