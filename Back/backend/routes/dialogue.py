"""Multi-voice dialogue: synthesize each segment, concat with optional silence.

No external ffmpeg dependency — we glue MP3 frames directly, which works because
edge-tts produces a single-stream MP3 with no global header beyond the frames.
Inserts silence by emitting a single MP3 silence frame package (24 kHz mono).
"""
from __future__ import annotations
from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel, Field
from services.edge_tts_engine import synthesize_full
from services.cache import make_key, get as cache_get, put as cache_put

router = APIRouter()


class DialogueSegment(BaseModel):
    voice: str
    text: str = Field(min_length=1, max_length=5000)
    rate: str | None = None
    pitch: str | None = None
    pause_after_ms: int = 0


class DialogueRequest(BaseModel):
    segments: list[DialogueSegment]


# Pre-generated ~250ms of MP3 silence at 24kHz mono 48kbps (approx). One frame ≈ 26ms.
# 10 frames ≈ 260ms silence baseline; we just repeat per 250ms requested.
# To keep things simple and avoid bundling binary blobs, we synthesize a tiny SSML break.


async def _silence(ms: int) -> bytes:
    if ms <= 0:
        return b""
    # generate using edge-tts with a single " " text — gives a small clip
    # Practical: produce 250ms-ish chunks by synthesizing dots
    key = make_key(f"__silence__{ms}", "en-US-AriaNeural", None, None)
    cached = cache_get(key)
    if cached is not None:
        return cached
    # Approx: use a single short period synthesized at slowest rate
    secs = max(0.1, ms / 1000)
    text = " . " * max(1, int(secs * 2))
    data = await synthesize_full(text, "en-US-AriaNeural", "-50%", "-50Hz")
    cache_put(key, data)
    return data


@router.post("/tts/dialogue")
async def dialogue(req: DialogueRequest):
    if not req.segments:
        raise HTTPException(400, "segments cannot be empty")
    if len(req.segments) > 32:
        raise HTTPException(400, "max 32 segments")
    chunks: list[bytes] = []
    for seg in req.segments:
        key = make_key(seg.text, seg.voice, seg.rate, seg.pitch)
        data = cache_get(key)
        if data is None:
            data = await synthesize_full(seg.text, seg.voice, seg.rate, seg.pitch)
            cache_put(key, data)
        chunks.append(data)
        if seg.pause_after_ms:
            chunks.append(await _silence(seg.pause_after_ms))
    audio = b"".join(chunks)
    return Response(
        content=audio,
        media_type="audio/mpeg",
        headers={"X-Segments": str(len(req.segments)), "Cache-Control": "no-store"},
    )
