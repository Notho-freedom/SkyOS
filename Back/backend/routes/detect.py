from fastapi import APIRouter
from models.schemas import TextOnlyRequest, DetectResponse
from services.language import detect_language

router = APIRouter()


@router.post("/detect-language", response_model=DetectResponse)
async def detect(req: TextOnlyRequest):
    return detect_language(req.text)
