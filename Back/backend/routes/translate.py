from fastapi import APIRouter, Response, HTTPException
from models.schemas import TranslateRequest, TranslatedTTSRequest
from services.translator import translate as do_translate
from services.edge_tts_engine import synthesize_full
from utils.voice_picker import pick_voice_for_lang

router = APIRouter()


@router.post("/translate")
async def translate_text(req: TranslateRequest):
    try:
        result = do_translate(req.text, req.target_lang, req.source_lang or "auto")
    except Exception as e:
        raise HTTPException(500, f"Translation failed: {e}")
    return result


@router.post("/tts/translated")
async def tts_translated(req: TranslatedTTSRequest):
    """Translate then synthesize in one call."""
    try:
        translated = do_translate(req.text, req.target_lang)["translated"]
    except Exception as e:
        raise HTTPException(500, f"Translation failed: {e}")

    voice = req.voice or await pick_voice_for_lang(req.target_lang, req.persona)
    try:
        audio = await synthesize_full(translated, voice)
    except Exception as e:
        raise HTTPException(500, f"Synthesis failed: {e}")

    return Response(
        content=audio,
        media_type="audio/mpeg",
        headers={
            "X-Used-Voice": voice,
            "X-Translated-Text": translated[:500],
            "Cache-Control": "no-store",
        },
    )
