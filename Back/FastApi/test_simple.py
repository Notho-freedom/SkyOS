import requests

# Test simple du serveur local
base_url = "http://localhost:8000"

print("=== TEST SERVEUR LOCAL ===")

# Test status
response = requests.get(f"{base_url}/api/status")
print(f"Status: {response.json()}")

# Test d'une voix
voice = "fr-FR-DeniseNeural"
response = requests.get(f"{base_url}/api/check-voice/{voice}")
print(f"Voix {voice}: {response.json()}")

# Test TTS simple
text = "Bonjour"
payload = {"text": text, "voice": voice}
response = requests.post(f"{base_url}/api/tts", json=payload)
print(f"TTS Status: {response.status_code}")

if response.status_code == 200:
    print(f"✅ TTS réussi! Taille: {len(response.content)} bytes")
    with open("test_local.mp3", "wb") as f:
        f.write(response.content)
    print("Audio sauvegardé: test_local.mp3")
else:
    print(f"❌ TTS échoué: {response.text}")