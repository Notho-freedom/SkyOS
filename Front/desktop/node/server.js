// server.js (CommonJS)
const express = require('express');
const cors = require('cors');
const { URL } = require('url');
const { JSDOM } = require('jsdom');

const app = express();
app.use(cors());

const PORT = 8000;

app.get('/fetchMetadata', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL param missing' });
  }

  try {
    const fetch = (await import('node-fetch')).default; // Importation dynamique
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const title = doc.querySelector('title')?.textContent || 'No Title';
    
    let favicon = '';
    const iconLink = doc.querySelector('link[rel*="icon"]');
    if (iconLink) {
      favicon = new URL(iconLink.href, url).href;
    } else {
      favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`;
    }

    return res.json({ title, favicon });
  } catch (err) {
    console.error('Erreur serveur:', err.message);
    return res.status(500).json({ error: 'Impossible de récupérer les métadonnées' });
  }
});

app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
