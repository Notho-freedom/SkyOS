from fastapi.testclient import TestClient
from app import app

client = TestClient(app)


def test_detect_french():
    r = client.post("/api/detect-language", json={"text": "Bonjour, comment ça va aujourd'hui?"})
    assert r.status_code == 200
    assert r.json()["lang"] == "fr"


def test_translate():
    r = client.post("/api/translate", json={"text": "Hello world", "target_lang": "fr"})
    assert r.status_code == 200
    body = r.json()
    assert "translated" in body
    assert len(body["translated"]) > 0


def test_tts_translated():
    r = client.post("/api/tts/translated", json={"text": "Hello world", "target_lang": "fr"})
    assert r.status_code == 200
    assert r.headers.get("x-used-voice", "").startswith("fr-")
    assert len(r.content) > 1000
