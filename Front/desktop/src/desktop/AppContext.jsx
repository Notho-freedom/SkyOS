// AppContext.jsx
import React, { createContext, useContext, useCallback, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);
  const [desktopIcons, setDesktopIcons] = useState([]);
  
  const initializeResources = useCallback(() => {
    setWindows([
        { 
          id: 1, 
          url: "https://windows-live.genesis-company.net",
          minimized: false,
          maximized: false,
          zIndex: 1,
          position: { x: 100, y: 100 },
          size: { width: 350, height: 300 },
          originalState: null
        },
        { 
          id: 2, 
          url: "https://genesis-company.net",
          minimized: false,
          maximized: false,
          zIndex: 1,
          position: { x: 300, y: 150 },
          size: { width: 350, height: 300 },
          originalState: null
        },
        { 
          id: 3, 
          url: "https://mycourses-7pza.onrender.com/",
          minimized: false,
          maximized: false,
          zIndex: 1,
          position: { x: 500, y: 200 },
          size: { width: 350, height: 300 },
          originalState: null
        },
        { 
          id: 4, 
          url: "https://ui-jt50.onrender.com/",
          minimized: false,
          maximized: false,
          zIndex: 1,
          position: { x: 700, y: 250 },
          size: { width: 350, height: 300 },
          originalState: null
        }
      ]);

    setDesktopIcons([
        {
          id: 'documents',
          name: 'Documents',
          type: 'folder',
          position: { x: 50, y: 50 },
          url: 'https://documents.example.com'
        },
        {
          id: 'trash',
          name: 'Corbeille',
          type: 'trash',
          position: { x: 50, y: 150 },
          url: 'about:blank'
        }
      ]);
  }, []);

  const handleWindowAction = useCallback((id, action) => {
    setWindows(windows.map(win => {
      if (win.id === id) {
        switch(action.type) {
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
  },[windows]);

  const handleIconAction = useCallback((iconId, action) => {
    switch(action.type) {
        case 'OPEN':
          const icon = desktopIcons.find(i => i.id === iconId);
          if (icon) {
            // Ouvrir une nouvelle fenêtre
            setWindows([...windows, {
              id: Date.now(),
              url: icon.url,
              minimized: false,
              maximized: false,
              zIndex: Math.max(...windows.map(w => w.zIndex)) + 1,
              position: { x: 100, y: 100 },
              size: { width: 800, height: 600 },
              originalState: null
            }]);
          }
          break;
  
        case 'RENAME':
          setDesktopIcons(desktopIcons.map(icon => 
            icon.id === iconId ? { ...icon, name: action.newName } : icon
          ));
          break;
  
        case 'DELETE':
          setDesktopIcons(desktopIcons.filter(icon => icon.id !== iconId));
          break
  
        default:
          return null;
      }
  },[desktopIcons,windows]);

  return (
    <AppContext.Provider 
      value={{
        windows,
        desktopIcons,
        initializeResources,
        handleWindowAction,
        handleIconAction
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