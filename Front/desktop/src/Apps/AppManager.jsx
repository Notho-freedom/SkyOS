// WebAppProvider.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WebAppContext = createContext();

export const WebAppProvider = ({ children }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chargement initial depuis localStorage
  useEffect(() => {
    const loadApps = async () => {
      try {
        const storedApps = localStorage.getItem('webapps');
        if (storedApps) {
          setApps(JSON.parse(storedApps));
        }
      } catch (err) {
        setError('Erreur de chargement des applications');
      }
    };
    loadApps();
  }, []);

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    localStorage.setItem('webapps', JSON.stringify(apps));
  }, [apps]);

  const createAppId = useCallback(async (url) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(url);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }, []);

  const fetchAppMetadata = useCallback(async (url) => {
    try {
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      return {
        title: doc.title,
        favicon: (() => {
          const icons = Array.from(doc.querySelectorAll('link[rel*="icon"]')).sort((a, b) => {
            const aSize = parseInt(a.getAttribute('sizes')?.split('x')[0]) || 0;
            const bSize = parseInt(b.getAttribute('sizes')?.split('x')[0]) || 0;
            return bSize - aSize;
          });
      
          if (icons.length > 0) {
            return icons[0]?.href;
          }
      
          const domainFavicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`;
      
          if (domainFavicon) {
            return domainFavicon;
          }
      
          // Liste d'icônes aléatoires du web
          const randomFavicons = [
            "https://upload.wikimedia.org/wikipedia/commons/a/a3/Favicon.ico",
            "https://www.mozilla.org/media/img/favicons/firefox/browser/favicon.7e02976505d6.ico",
            "https://github.githubassets.com/favicons/favicon.png",
            "https://www.w3.org/favicon.ico",
            "https://developer.mozilla.org/favicon-48x48.cbbd161b.png"
          ];
      
          return randomFavicons[Math.floor(Math.random() * randomFavicons.length)];
        })()
      };

    } catch (err) {
      return { title: null, favicon: null };
    }
  }, []);

  const addApp = useCallback(async (url) => {
    setLoading(true);
    try {
      const existingApp = apps.find(app => app.url === url);
      if (existingApp) {
        return ;
      }

      const id = await createAppId(url);
      const { title, favicon } = await fetchAppMetadata(url);

      const newApp = {
        id,
        name: title || new URL(url).hostname,
        url,
        icon: favicon,
        createdAt: new Date().toISOString()
      };

      setApps(prev => [...prev, newApp]);
      return newApp;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apps, createAppId, fetchAppMetadata]);

  const batchAddApps = useCallback(async (urls) => {
    setLoading(true);
    try {
      const results = await Promise.allSettled(urls.map(url => addApp(url)));
      return results;
    } finally {
      setLoading(false);
    }
  }, [addApp]);

  const removeApp = useCallback((id) => {
    setApps(prev => prev.filter(app => app.id !== id));
  }, []);

  return (
    <WebAppContext.Provider
      value={{
        apps,
        loading,
        error,
        addApp,
        batchAddApps,
        removeApp
      }}
    >
      {children}
    </WebAppContext.Provider>
  );
};

export const useWebApps = () => {
  const context = useContext(WebAppContext);
  if (!context) {
    throw new Error('useWebApps must be used within a WebAppProvider');
  }
  return context;
};