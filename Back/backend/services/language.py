"""Language detection via lingua (more robust than langdetect)."""
from functools import lru_cache
from lingua import Language, LanguageDetectorBuilder


@lru_cache(maxsize=1)
def _detector():
    return LanguageDetectorBuilder.from_all_languages().with_preloaded_language_models().build()


def detect_language(text: str) -> dict:
    det = _detector()
    confidence_values = det.compute_language_confidence_values(text)
    if not confidence_values:
        return {"lang": "en", "confidence": 0.0, "alternates": []}
    top = confidence_values[0]
    return {
        "lang": top.language.iso_code_639_1.name.lower(),
        "confidence": round(top.value, 4),
        "alternates": [
            {"lang": cv.language.iso_code_639_1.name.lower(), "confidence": round(cv.value, 4)}
            for cv in confidence_values[1:5]
        ],
    }
