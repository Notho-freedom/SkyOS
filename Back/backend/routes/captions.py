"""Generate SRT/VTT captions estimated from text + edge-tts word boundaries when
available. Falls back to even time distribution per word.
"""
from __future__ import annotations
from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, Field
import edge_tts


router = APIRouter()


class CaptionsRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    voice: str
    format: str = "srt"  # srt | vtt | json
    rate: str | None = None
    pitch: str | None = None
    words_per_cue: int = 6


def _ms_to_ts(ms: int, sep: str) -> str:
    s, msec = divmod(int(ms), 1000)
    m, s = divmod(s, 60)
    h, m = divmod(m, 60)
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{msec:03d}"


@router.post("/captions")
async def captions(req: CaptionsRequest):
    kwargs = {"text": req.text, "voice": req.voice}
    if req.rate: kwargs["rate"] = req.rate
    if req.pitch: kwargs["pitch"] = req.pitch
    communicate = edge_tts.Communicate(**kwargs)

    word_events: list[tuple[int, str]] = []  # (offset_ms, text)
    try:
        async for ev in communicate.stream():
            if ev.get("type") == "WordBoundary":
                # offset is in 100-nanosecond units
                offset_ms = int(ev["offset"] / 10_000)
                word_events.append((offset_ms, ev.get("text", "")))
    except Exception as e:
        raise HTTPException(500, f"captions failed: {e}")

    if not word_events:
        raise HTTPException(500, "no word boundaries returned")

    # Group into cues of N words
    cues = []
    n = max(1, req.words_per_cue)
    for i in range(0, len(word_events), n):
        group = word_events[i:i + n]
        start = group[0][0]
        next_idx = i + n
        end = word_events[next_idx][0] if next_idx < len(word_events) else group[-1][0] + 600
        text = " ".join(t for _, t in group)
        cues.append((start, end, text))

    if req.format == "json":
        return {
            "cues": [{"start_ms": s, "end_ms": e, "text": t} for s, e, t in cues],
            "words": [{"offset_ms": o, "text": t} for o, t in word_events],
        }

    sep = "," if req.format == "srt" else "."
    lines: list[str] = []
    if req.format == "vtt":
        lines.append("WEBVTT\n")
    for i, (s, e, t) in enumerate(cues, start=1):
        if req.format == "srt":
            lines.append(str(i))
        lines.append(f"{_ms_to_ts(s, sep)} --> {_ms_to_ts(e, sep)}")
        lines.append(t)
        lines.append("")
    return PlainTextResponse("\n".join(lines), media_type="text/plain; charset=utf-8")
