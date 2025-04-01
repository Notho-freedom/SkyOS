// AppContext.jsx
import React, { createContext, useRef, useContext, useCallback, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);
  const [desktopIcons, setDesktopIcons] = useState([]);
  const bgRef = useRef();

  const openApp = (config) =>{
    setWindows(...windows, [config]);
  };

  const handleWindowAction = useCallback((id, action) => {
    if (!action || !action.type) {
      console.error('Action invalide', action);
      return; // Si action est undefined ou n'a pas de type, on ne fait rien
    }
  
    setWindows(windows.map(win => {
      if (win.id === id) {
        switch (action.type) {
          case 'FOCUS':
            return {
              ...win,
              minimized: false,
              zIndex: Math.max(...windows.map(w => w.zIndex)) + 1
            };
  
          case 'MINIMIZE':
            return {
              ...win,
              minimized: !win.minimized,
              zIndex: win.minimized ? Math.max(...windows.map(w => w.zIndex)) + 1 : win.zIndex
            };
  
          case 'MAXIMIZE':
            if (!win.maximized) {
              return {
                ...win,
                maximized: true,
                minimized: false,
                originalState: {
                  position: win.position,
                  size: win.size
                },
                position: { x: 0, y: 30 },
                size: {
                  width: window.innerWidth,
                  height: window.innerHeight - 30
                },
                zIndex: Math.max(...windows.map(w => w.zIndex)) + 1
              };
            } else {
              return {
                ...win,
                maximized: false,
                position: win.originalState.position,
                size: win.originalState.size,
                originalState: null
              };
            }
  
          case 'CLOSE':
            return null;
  
          case 'RESIZE':
            return {
              ...win,
              size: action.size,
              originalState: win.maximized ? null : win.originalState
            };
  
          case 'MOVE':
            return {
              ...win,
              position: action.position,
              originalState: win.maximized ? null : win.originalState
            };
  
          default:
            return win;
        }
      }
      return win;
    }).filter(Boolean));
  }, [windows]);
  

  return (
    <AppContext.Provider 
      value={{
        windows,
        desktopIcons,
        handleWindowAction,
        setWindows,
        bgRef,
        openApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};