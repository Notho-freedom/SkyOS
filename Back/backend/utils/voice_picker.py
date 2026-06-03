"""Pick a voice for a given locale, optionally biased by persona."""
import random
from services.edge_tts_engine import list_voices

PERSONA_KEYWORDS = {
    "news": ["news", "presenter", "anchor"],
    "cheerful": ["cheerful", "joyful", "friendly"],
    "calm": ["calm", "soft", "gentle"],
    "friendly": ["friendly", "warm"],
}

# Popular default voices per language
PREFERRED = {
    "fr": "fr-FR-DeniseNeural",
    "en": "en-US-AriaNeural",
    "es": "es-ES-ElviraNeural",
    "de": "de-DE-KatjaNeural",
    "it": "it-IT-ElsaNeural",
    "pt": "pt-BR-FranciscaNeural",
    "ja": "ja-JP-NanamiNeural",
    "zh": "zh-CN-XiaoxiaoNeural",
    "ar": "ar-SA-ZariyahNeural",
    "ru": "ru-RU-SvetlanaNeural",
    "ko": "ko-KR-SunHiNeural",
    "hi": "hi-IN-SwaraNeural",
}


async def pick_voice_for_lang(lang_code: str, persona: str | None = None) -> str:
    """Return a sensible ShortName for a 2-letter language code."""
    lang_code = (lang_code or "en").split("-")[0].lower()

    # Persona override: search through all voices for matching tags
    if persona and persona in PERSONA_KEYWORDS:
        all_voices = await list_voices()
        keywords = PERSONA_KEYWORDS[persona]
        candidates = []
        for v in all_voices:
            if not v["Locale"].lower().startswith(lang_code):
                continue
            tags = (v.get("VoiceTag") or {}).get("VoicePersonalities") or []
            tags_low = [t.lower() for t in tags]
            if any(kw in t for kw in keywords for t in tags_low):
                candidates.append(v["ShortName"])
        if candidates:
            return random.choice(candidates)

    if lang_code in PREFERRED:
        return PREFERRED[lang_code]

    # Fallback: any voice matching locale
    all_voices = await list_voices()
    matches = [v["ShortName"] for v in all_voices if v["Locale"].lower().startswith(lang_code)]
    if matches:
        return random.choice(matches)
    return PREFERRED["en"]
