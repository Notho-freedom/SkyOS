import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_voices():
    r = client.get("/api/voices")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_tts_minimal():
    r = client.post("/api/tts", json={"text": "Hello world", "voice": "en-US-AriaNeural"})
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("audio/")
    assert r.headers.get("x-used-voice") == "en-US-AriaNeural"
    assert len(r.content) > 1000


def test_tts_auto_voice():
    r = client.post("/api/tts", json={"text": "Bonjour le monde."})
    assert r.status_code == 200
    assert r.headers.get("x-used-voice", "").startswith("fr-")


def test_tts_validation():
    r = client.post("/api/tts", json={"text": ""})
    assert r.status_code == 422
