# Vocalis Backend

FastAPI + edge-tts. Sert l'API publique consommée par le proxy Lovable Cloud.

## Stack
- Python 3.11
- FastAPI / Uvicorn
- edge-tts (voix neurales Microsoft, gratuit)
- lingua-language-detector (détection robuste)
- deep-translator (Google, gratuit, pas de clé)
- slowapi (rate limit)

## Lancer en local
```bash
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## Déploiement (Render / Fly / Docker)
```bash
docker build -t vocalis-backend .
docker run -p 8000:8000 vocalis-backend
```

## Routes

| Méthode | Path                      | Description                                |
| ------- | ------------------------- | ------------------------------------------ |
| GET     | `/api/health`             | Statut, version, uptime                    |
| GET     | `/api/voices`             | Toutes les voix (cache 1h)                 |
| GET     | `/api/voices-by-language/{code}` | Voix filtrées par langue (m/f)      |
| POST    | `/api/voices-by-text`     | Détecte la langue → retourne les voix      |
| POST    | `/api/detect-language`    | Détection seule (lang, confidence, alt.)   |
| POST    | `/api/translate`          | Traduit un texte (Google)                  |
| POST    | `/api/tts`                | Synthèse → MP3 complet                     |
| POST    | `/api/tts/stream`         | Synthèse → MP3 streamé (chunked)           |
| POST    | `/api/tts/translated`     | Traduit puis synthétise dans la langue cible |

Tous les endpoints renvoient `X-Used-Voice` quand pertinent.
