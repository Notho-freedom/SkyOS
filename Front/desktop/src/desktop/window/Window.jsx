import React, { useState, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { useWindowContext } from './WindowContext'; // Importer le hook personnalisé
import { useTheme } from "./../../theme/ThemeContext"

const Window = ({ config, children }) => {
  const { windows, handleWindowAction } = useWindowContext();
  const [windowState, setWindowState] = useState(config);
  const {theme} = useTheme();

  useEffect(() => {
    const win = windows.find(w => w.id === config.id);
    if (win) {
      setWindowState(win);
    }
  }, [windows, config.id]);

  // Gérer le focus de la fenêtre
  const handleFocus = () => {
    if (windowState) {
      handleWindowAction({ id: windowState.id, type: 'FOCUS' });
    }
  };

  // Déplacement fluide de la fenêtre
  const handleDragStop = useCallback((e, data) => {
    if (windowState) {
      handleWindowAction({
        id: windowState.id,
        type: 'MOVE',
        payload: { position: { x: data.x, y: data.y } },
      });
    }
  }, [windowState, handleWindowAction]);

  // Redimensionnement fluide de la fenêtre
  const handleResizeStop = useCallback((e, direction, ref, delta, pos) => {
    if (windowState) {
      handleWindowAction({
        id: windowState.id,
        type: 'RESIZE',
        payload: { size: { width: parseInt(ref.style.width), height: parseInt(ref.style.height) }, position: pos },
      });
    }
  }, [windowState, handleWindowAction]);

  // Fonction de fermeture de la fenêtre
  const handleCloseWindow = () => {
    if (windowState) {
      handleWindowAction({ id: windowState.id, type: 'CLOSE' });
    }
  };

  // Si la fenêtre a été fermée, ne rien afficher
  if (!windowState) return null;

  return (
    <Rnd
      size={windowState.size}
      position={windowState.position}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      disableDragging={windowState.maximized}
      onMouseDown={handleFocus} // Appel du handleFocus
      onDragStop={handleDragStop} // Appel du handleDragStop
      onResizeStop={handleResizeStop} // Appel du handleResizeStop
      enableResizing={{
        top: true, right: true, bottom: true, left: true,
        topRight: true, bottomRight: true, bottomLeft: true, topLeft: true,
      }}
      dragHandleClassName="draggable-handle"
      className={`window-container rounded-lg shadow-black shadow-sm ${windowState.maximized ? 'maximized' : ''}`}
      style={{
        zIndex: windowState.zIndex,
        transition: 'all 0.15s ease-out',
      }}
    >
      <div className={`flex rounded-lg flex-col h-full bg-[${theme.colors.background}] bg-opacity-20 shadow-lg backdrop-blur-3xl overflow-hidden`}>
        <div className="draggable-handle flex items-center justify-between backdrop-blur-lg px-4 py-2 cursor-move">
          <div className="flex space-x-2">
            <button
              onClick={() => handleWindowAction({ id: windowState.id, type: 'MINIMIZE' })}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            />
            <button
              onClick={() => handleWindowAction({ id: windowState.id, type: 'MAXIMIZE' })}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
            />
            <button
              onClick={handleCloseWindow} // Appel de la fonction handleCloseWindow
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
            />
          </div>
          <span className="text-white truncate text-[1.5vh] px-3">{windowState.name || windowState.url}</span>
          <div className="w-3 h-3" />
        </div>
        <div className="w-full h-full">{children}</div>
      </div>
    </Rnd>
  );
};

export default Window;
