import './window.css';
import React, { useCallback, useRef } from 'react';
import { Rnd } from 'react-rnd';

const Window = ({ config={}, onAction, children }) => {
  const rndRef = useRef(null);
  const isMd = config.size.width > 700 ? "text-sm" : "text-xs";
  const lastPosition = useRef(config.position);
  const lastSize = useRef(config.size);

  // Mémoisation stable de handleAction
  const handleAction = useCallback((action) => {
    onAction(config.id, action);
  }, [onAction, config.id]);

  // Gestion optimisée du redimensionnement
  const handleResize = useCallback((e, direction, ref, delta, pos) => {
    lastSize.current = { 
      width: parseInt(ref.style.width), 
      height: parseInt(ref.style.height) 
    };
    lastPosition.current = pos;
    
    // Mise à jour visuelle immédiate sans re-render
    rndRef.current.updateSize(lastSize.current);
    rndRef.current.updatePosition(lastPosition.current);
  }, []);

  // Gestion fluide du drag
  const handleDrag = useCallback((e, data) => {
    lastPosition.current = { x: data.x, y: data.y };
    rndRef.current.updatePosition(lastPosition.current);
  }, []);

  // Envoi des dernières valeurs au parent quand l'action est terminée
  const handleDragStop = useCallback(() => {
    handleAction({
      type: 'MOVE',
      position: lastPosition.current
    });
    document.body.classList.remove('dragging-active');
  }, [handleAction]);

  const handleResizeStop = useCallback(() => {
    handleAction({
      type: 'RESIZE',
      size: lastSize.current,
      position: lastPosition.current
    });
  }, [handleAction]);

  return (
    <Rnd
      ref={rndRef}
      size={config.size}
      position={config.position}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      disableDragging={config.maximized}
      onDragStart={() => {
        document.body.classList.add('dragging-active');
        handleAction({ type: 'FOCUS' });
      }}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true
      }}
      resizeHandleClasses={{
        top: 'resize-handle top',
        right: 'resize-handle right',
        bottom: 'resize-handle bottom',
        left: 'resize-handle left',
        topRight: 'resize-handle top-right',
        bottomRight: 'resize-handle bottom-right',
        bottomLeft: 'resize-handle bottom-left',
        topLeft: 'resize-handle top-left'
      }}
      dragHandleClassName="draggable-handle"
      className={`window-container ${config.maximized ? 'maximized' : ''}`}
      style={{ 
        zIndex: config.zIndex,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, width, height'
      }}
    >
      <div 
        className="flex flex-col h-full bg-white bg-opacity-95 rounded-lg shadow-lg overflow-hidden"
        onMouseDown={() => handleAction({ type: 'FOCUS' })}
      >
        <div className="draggable-handle flex items-center justify-between bg-gray-200 px-4 py-2 cursor-move">
          <div className="flex space-x-2">
            <button 
              onClick={() => handleAction({ type: 'MINIMIZE' })}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            />
            <button
              onClick={() => handleAction({ type: 'MAXIMIZE' })}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
            />
            <button
              onClick={() => handleAction({ type: 'CLOSE' })}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
            />
          </div>
          <span className={`${isMd} text-gray-700 truncate px-3`}>{config.url}</span>
          <div className="w-3 h-3" />
        </div>
        
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    </Rnd>
  );
};

export default Window;