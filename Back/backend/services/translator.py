"""Free translation via deep-translator (GoogleTranslator)."""
from deep_translator import GoogleTranslator


def translate(text: str, target_lang: str, source_lang: str = "auto") -> dict:
    translator = GoogleTranslator(source=source_lang or "auto", target=target_lang)
    translated = translator.translate(text)
    return {
        "translated": translated,
        "source_lang": source_lang,
        "target_lang": target_lang,
    }
