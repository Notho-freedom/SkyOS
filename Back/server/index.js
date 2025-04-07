import express from 'express';
import path from 'path';
import pkg from 'node-tts';
const { generate } = pkg;
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 3030;

// Obtenir le répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration pour la synthèse vocale avec node-tts
const generateAudio = (text, filename) => {
  return new Promise((resolve, reject) => {
    generate(text, { lang: 'fr', output: path.join(__dirname, filename) }, (err) => {
      if (err) {
        reject('Erreur lors de la génération de l\'audio');
      } else {
        resolve();
      }
    });
  });
};

app.use(express.json());

// Point de terminaison pour générer l'audio
app.post('/generate-audio', async (req, res) => {
  const { text } = req.body;
  const audioFile = 'output.wav';

  try {
    await generateAudio(text, audioFile);
    res.json({ audioUrl: `/audio/${audioFile}` });
  } catch (error) {
    console.error('Erreur serveur TTS:', error);
    res.status(500).json({ error: 'Impossible de générer l\'audio' });
  }
});

// Servir les fichiers audio générés
app.use('/audio', express.static(path.join(__dirname, 'output.wav')));

app.listen(port, () => {
  console.log(`Serveur Node-tts en ligne sur http://localhost:${port}`);
});
