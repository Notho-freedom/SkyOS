from typing import Optional, List
from pydantic import BaseModel, Field


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    voice: Optional[str] = None
    rate: Optional[str] = Field(None, description="e.g. +10%, -5%")
    pitch: Optional[str] = Field(None, description="e.g. +2Hz, -3Hz")
    persona: Optional[str] = Field(None, description="news / cheerful / calm / friendly")


class TextOnlyRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    target_lang: str = Field(..., min_length=2, max_length=5)
    source_lang: Optional[str] = "auto"


class TranslatedTTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    target_lang: str = Field(..., min_length=2, max_length=5)
    voice: Optional[str] = None
    persona: Optional[str] = None


class DetectResponse(BaseModel):
    lang: str
    confidence: float
    alternates: List[dict]
