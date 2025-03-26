// server.js (CommonJS)
const express = require('express');
const cors = require('cors');
const { URL } = require('url');
const { JSDOM } = require('jsdom');

const app = express();
app.use(cors());
const PORT = 3001;

app.get('/fetchMetadata', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL param missing' });
  }
  
  try {
    // Import dynamique de node-fetch
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: 'Erreur lors du fetch de l’URL' });
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const title = doc.querySelector('title')?.textContent || '';

    let favicon = '';
    const iconLink = doc.querySelector('link[rel*="icon"]');
    if (iconLink) {
      favicon = iconLink.href;
    } else {
      favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`;
    }

    return res.json({ title, favicon });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
