from fastapi.testclient import TestClient
from app import app

client = TestClient(app)


def test_stream_chunks():
    with client.stream("POST", "/api/tts/stream", json={"text": "Streaming test sentence.", "voice": "en-US-AriaNeural"}) as r:
        assert r.status_code == 200
        chunks = list(r.iter_bytes())
        assert len(chunks) >= 1
        total = sum(len(c) for c in chunks)
        assert total > 1000
