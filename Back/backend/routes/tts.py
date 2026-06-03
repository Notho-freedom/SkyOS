from fastapi import APIRouter, Response, HTTPException
from models.schemas import TTSRequest
from services.edge_tts_engine import synthesize_full
from services.language import detect_language
from services.cache import make_key, get as cache_get, put as cache_put
from utils.voice_picker import pick_voice_for_lang

router = APIRouter()


@router.post("/tts")
async def tts(req: TTSRequest):
    voice = req.voice
    if not voice:
        det = detect_language(req.text)
        voice = await pick_voice_for_lang(det["lang"], req.persona)
    key = make_key(req.text, voice, req.rate, req.pitch)
    cached = cache_get(key)
    if cached is not None:
        return Response(
            content=cached,
            media_type="audio/mpeg",
            headers={"X-Used-Voice": voice, "X-Cache": "HIT", "Cache-Control": "public, max-age=3600"},
        )
    try:
        audio = await synthesize_full(req.text, voice, req.rate, req.pitch)
    except Exception as e:
        raise HTTPException(500, f"Synthesis failed: {e}")
    cache_put(key, audio)
    return Response(
        content=audio,
        media_type="audio/mpeg",
        headers={"X-Used-Voice": voice, "X-Cache": "MISS", "Cache-Control": "public, max-age=3600"},
    )
