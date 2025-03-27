import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import db from './db';  // Assure-toi que db.js est bien configuré pour gérer la base de données
import axios from 'axios';

const API_KEY = '82159ce3ac0da6bed5b7c9f9aeb7f3ce'; // Clé API de mylinkpreview.net

const WebAppContext = createContext();

const initialState = {
  apps: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_APPS':
      return { ...state, apps: action.payload };
    case 'ADD_APP':
      return { ...state, apps: [...state.apps, action.payload] };
    case 'REMOVE_APP':
      return { ...state, apps: state.apps.filter(app => app.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export const WebAppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { apps } = state;

  const appsRef = useRef(apps);
  useEffect(() => {
    appsRef.current = apps;
  }, [apps]);

  // Charger les applications depuis la base de données
  useEffect(() => {
    const loadApps = async () => {
      try {
        const storedApps = await db.getApps();
        dispatch({ type: 'SET_APPS', payload: storedApps });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: 'Erreur de chargement des applications' });
      }
    };
    loadApps();
  }, []);

  const PROXIES = [
    "https://cors-anywhere.herokuapp.com/",
    "https://api.allorigins.win/raw?url=",
    "https://thingproxy.freeboard.io/fetch/",
    "https://jsonp.afeld.me/?url=",
    "https://corsproxy.io/?",
  ];
  
  const fetchAppMetadata = useCallback(async (url) => {
    // Essayer d'abord Microlink
    try {
      const { data } = await axios.get(`https://api.microlink.io?url=${url}`);
      if (data && data.data) {
        const title = data.data.title || new URL(url).hostname;
        const favicon = data.data.icon || `https://www.google.com/s2/favicons?sz=64&domain=${new URL(url).hostname}`;
        console.log("✅ Métadonnées récupérées via Microlink");
        return { title, favicon };
      }
    } catch (err) {
      console.warn(`❌ Erreur avec Microlink: ${err.message}`);
    }
  
    // Si Microlink échoue, essayer les proxies
    for (let proxy of PROXIES) {
      try {
        const response = await fetch(proxy + url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
  
        const title =
          doc.querySelector("meta[property='og:title']")?.content ||
          doc.querySelector("title")?.innerText ||
          new URL(url).hostname;
  
        let favicon = doc.querySelector("link[rel~='icon']")?.href;
        if (!favicon) {
          favicon = `https://www.google.com/s2/favicons?sz=64&domain=${new URL(url).hostname}`;
        }
  
        console.log(`✅ Métadonnées récupérées via ${proxy}`);
        return { title, favicon };
      } catch (err) {
        console.warn(`❌ Proxy échoué: ${proxy} → ${err.message}`);
      }
    }
  
    // Fallback avec l'API mylinkpreview.net si tout échoue
    try {
      const { data } = await axios.get(`https://api.mylinkpreview.net/?key=${API_KEY}&q=${url}`);
      return {
        title: data.title || new URL(url).hostname,
        favicon: data.image || `https://www.google.com/s2/favicons?sz=64&domain=${new URL(url).hostname}`,
      };
    } catch (err) {
      console.error("🚨 Erreur avec l'API mylinkpreview.net :", err.message);
      return { title: "Site inconnu", favicon: "" };
    }
  }, []);
  

  const addApp = useCallback(async (url) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const exists = await db.appExists(url);
      if (exists) {
        throw new Error('Cette application existe déjà');
      }

      const id = uuidv4(); // Générer un UUID unique
      const { title, favicon } = await fetchAppMetadata(url);

      if (!title && !favicon) {
        throw new Error('Impossible de récupérer les métadonnées');
      }

      const newApp = {
        id,
        name: title || new URL(url).hostname,
        url,
        icon: favicon,
        createdAt: new Date().toISOString(),
      };

      await db.addApp(newApp); // Ajouter l'app à la base de données
      dispatch({ type: 'ADD_APP', payload: newApp });
      return newApp;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchAppMetadata]);

  const batchAddApps = useCallback(async (urls) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const uniqueUrls = [...new Set(urls)].filter(async url => !(await db.appExists(url)));
      const results = await Promise.allSettled(uniqueUrls.map(url => addApp(url)));
      return results;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [addApp]);

  const removeApp = useCallback(async (id) => {
    await db.removeApp(id);  // Supprimer l'app de la base de données
    dispatch({ type: 'REMOVE_APP', payload: id });
  }, []);

  return (
    <WebAppContext.Provider
      value={{
        apps,
        loading: state.loading,
        error: state.error,
        addApp,
        batchAddApps,
        removeApp,
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
