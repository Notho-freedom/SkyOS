import './window.css';
import React, { useCallback, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';

const Window = ({ children, title, id, active, onFocus }) => {
  const rndRef = useRef(null);
  const [size, setSize] = useState({ width: 400, height: 300 });
  const [position, setPosition] = useState({ x: window.innerWidth/4, y: 80 });
  const isDragging = useRef(false);
  const isMd = size.width > 700 ? "text-sm" : "text-xs";

  const handleFocus = () => {
    onFocus?.();
  };

  // Gestion du redimensionnement
  const handleResize = useCallback((e, direction, ref, delta, pos) => {
    setSize({
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height)
    });
    setPosition(pos);
  }, []);

  // Gestion du drag
  const handleDrag = useCallback((e, data) => {
    if (!isDragging.current) return;
    
    requestAnimationFrame(() => {
      setPosition({ x: data.x, y: data.y });
    });
  }, []);

  return (
    <Rnd
      ref={rndRef}
      size={size}
      position={position}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      onDragStart={() => {
        isDragging.current = true;
        document.body.classList.add('dragging-active');
        handleFocus();
      }}
      onDrag={handleDrag}
      onDragStop={(e, data) => {
        isDragging.current = false;
        document.body.classList.remove('dragging-active');
        setPosition({ x: data.x, y: data.y });
      }}
      onResize={handleResize}
      onMouseDown={handleFocus}
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
      className="window-container"
      style={{ zIndex: active ? 100 : 1 }}
    >
      <div 
        className="flex flex-col h-full bg-white bg-opacity-95 rounded-lg shadow-lg overflow-hidden"
        onMouseDown={handleFocus}
      >
        {/* Barre de titre */}
        <div className="draggable-handle flex items-center justify-between bg-gray-200 px-4 py-2 cursor-move">
          <div className="flex space-x-2">
            <button className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600"/>
            <button className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600"/>
            <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600"/>
          </div>
          <span className={`${isMd} text-gray-700 truncate px-3`}>{title}</span>
          <div className="w-3 h-3"/>
        </div>

        {/* Contenu */}
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    </Rnd>
  );
};

export default Window;