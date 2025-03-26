// WebAppProvider.jsx
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

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
  const { apps, loading, error } = state;

  useEffect(() => {
    try {
      const storedApps = localStorage.getItem('webapps');
      if (storedApps) {
        dispatch({ type: 'SET_APPS', payload: JSON.parse(storedApps) });
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Erreur de chargement des applications' });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('webapps', JSON.stringify(apps));
  }, [apps]);

  const createAppId = useCallback(async (url) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(url);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }, []);

  // Récupération des métadonnées via l'API backend
  const fetchAppMetadata = useCallback(async (url) => {
    try {
      const response = await fetch(`/fetchMetadata?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des métadonnées');
      }
      return await response.json();
    } catch (err) {
      return { title: null, favicon: null };
    }
  }, []);

  const addApp = useCallback(async (url) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      if (apps.some(app => app.url === url)) return; // éviter les doublons

      const id = await createAppId(url);
      const { title, favicon } = await fetchAppMetadata(url);
      if (!title && !favicon) throw new Error('Impossible de récupérer les métadonnées de l\'application');

      const newApp = {
        id,
        name: title || new URL(url).hostname,
        url,
        icon: favicon,
        createdAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_APP', payload: newApp });
      return newApp;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [apps, createAppId, fetchAppMetadata]);

  const batchAddApps = useCallback(async (urls) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const results = await Promise.allSettled(urls.map(url => addApp(url)));
      return results;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [addApp]);

  const removeApp = useCallback((id) => {
    dispatch({ type: 'REMOVE_APP', payload: id });
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
