import React, { createContext, useState, useContext, useCallback } from 'react';
import apps from './../../Apps/apps'; // Importer la liste des applications

// Créer un contexte pour les fenêtres
const WindowContext = createContext();

// Hook personnalisé pour accéder au contexte
export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowContext doit être utilisé à l\'intérieur de WindowProvider');
  }
  return context;
};

// Définir le Provider qui va entourer ton application
export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);

  // Une variable pour le décalage horizontal de chaque nouvelle fenêtre
  const WINDOW_OFFSET = 50;

  // Fonction d'ajout d'une fenêtre
  const addWindow = useCallback((config) => {
    if (windows.some(win => win.id === config.id)) return; // Empêche les doublons

    // Calcul de la position de la fenêtre
    const newPositionX = windows.length * WINDOW_OFFSET + 100;
    const newPositionY = windows.length * WINDOW_OFFSET + 100;

    const newWindow = {
      ...config,
      zIndex: windows.length + 1,
      minimized: false,
      maximized: false,
      position: config.position || { x: newPositionX, y: newPositionY },
      size: config.size || { width: 1200, height: 800 },
    };
    setWindows(prevWindows => [...prevWindows, newWindow]);
  }, [windows]);

  // Fonction pour ajouter une application par son nom
  const addApp = (appName,config={}) => {
    
    // Trouver l'application correspondante dans la liste
    const app = apps.find(app => app.name === appName);

    if (!app) {
      console.error(`Application "${appName}" non trouvée!`);
      return;
    }
    addWindow({...app,...config}); // Ajouter la fenêtre de l'application
  };

  // Fonction pour gérer les actions sur les fenêtres
  const handleWindowAction = useCallback(({ id, type, payload }) => {
    setWindows(prevWindows => {
      return prevWindows.map(win => {
        if (win.id !== id) return win;
        let updatedWin = { ...win };

        switch (type) {
          case 'FOCUS':
            updatedWin.zIndex = Math.max(...prevWindows.map(w => w.zIndex)) + 1;
            break;
          case 'MINIMIZE':
            updatedWin.minimized = true;
            updatedWin.maximized = false;
            break;
          case 'MAXIMIZE':
            updatedWin.maximized = !updatedWin.maximized;
            if (updatedWin.maximized) {
              updatedWin.position = { x: 0, y: 30 };
              updatedWin.size = { width: window.innerWidth, height: window.innerHeight - 30 };
            } else {
              updatedWin.position = { x: 100, y: 100 };
              updatedWin.size = { width: 350, height: 300 };
            }
            break;
          case 'CLOSE':
            return null;
          case 'MOVE':
            updatedWin.position = payload.position;
            break;
          case 'RESIZE':
            updatedWin.size = payload.size;
            break;
          default:
            break;
        }

        return updatedWin;
      }).filter(win => win !== null);
    });
  }, []);

  return (
    <WindowContext.Provider value={{ windows, addWindow, addApp, handleWindowAction }}>
      {children}
    </WindowContext.Provider>
  );
};
