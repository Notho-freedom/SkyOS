from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.schemas import TTSRequest
from services.edge_tts_engine import synthesize_stream
from services.language import detect_language
from utils.voice_picker import pick_voice_for_lang

router = APIRouter()


@router.post("/tts/stream")
async def tts_stream(req: TTSRequest):
    voice = req.voice
    if not voice:
        det = detect_language(req.text)
        voice = await pick_voice_for_lang(det["lang"], req.persona)

    async def gen():
        try:
            async for chunk in synthesize_stream(req.text, voice, req.rate, req.pitch):
                yield chunk
        except Exception as e:
            raise HTTPException(500, f"Stream failed: {e}")

    return StreamingResponse(
        gen(),
        media_type="audio/mpeg",
        headers={
            "X-Used-Voice": voice,
            "Cache-Control": "no-store",
            "Transfer-Encoding": "chunked",
        },
    )
