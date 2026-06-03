from fastapi import APIRouter, HTTPException
from models.schemas import TextOnlyRequest
from services.edge_tts_engine import list_voices
from services.language import detect_language

router = APIRouter()


@router.get("/voices")
async def all_voices():
    return await list_voices()


@router.get("/voices-by-language/{code}")
async def voices_by_language(code: str):
    code = code.lower()
    voices = await list_voices()
    matching = [v for v in voices if v["Locale"].lower().startswith(code)]
    return {
        "language": code,
        "male_voices": [v for v in matching if v["Gender"] == "Male"],
        "female_voices": [v for v in matching if v["Gender"] == "Female"],
    }


@router.post("/voices-by-text")
async def voices_by_text(req: TextOnlyRequest):
    detected = detect_language(req.text)
    code = detected["lang"]
    voices = await list_voices()
    matching = [v for v in voices if v["Locale"].lower().startswith(code)]
    if not matching:
        raise HTTPException(404, f"No voices for detected language '{code}'")
    return {
        "detected_language": code,
        "confidence": detected["confidence"],
        "male_voices": [v for v in matching if v["Gender"] == "Male"],
        "female_voices": [v for v in matching if v["Gender"] == "Female"],
    }
