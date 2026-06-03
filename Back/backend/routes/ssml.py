"""SSML-light: passthrough of <break>, <prosody>, <emphasis>.

edge-tts accepts plain text + rate/pitch but supports SSML if `text` already
contains markup wrapped in <speak>. We forward as-is.
"""
from __future__ import annotations
from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel, Field
import edge_tts


router = APIRouter()


class SsmlRequest(BaseModel):
    ssml: str = Field(min_length=4, max_length=10_000)
    voice: str


@router.post("/tts/ssml")
async def tts_ssml(req: SsmlRequest):
    try:
        # edge-tts SSML expects raw SSML in `text` when used as is — it will be
        # forwarded to Azure backend. The library doesn't have a separate ssml
        # method, so we send as text.
        communicate = edge_tts.Communicate(text=req.ssml, voice=req.voice)
        chunks = []
        async for c in communicate.stream():
            if c["type"] == "audio":
                chunks.append(c["data"])
        return Response(
            content=b"".join(chunks),
            media_type="audio/mpeg",
            headers={"X-Used-Voice": req.voice},
        )
    except Exception as e:
        raise HTTPException(500, f"SSML synthesis failed: {e}")
