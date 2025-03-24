import React, { useState, useRef } from 'react';
import { FiFolder, FiFile, FiTrash2 } from 'react-icons/fi';
import './icon.css';
import { useDrag } from 'react-dnd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { createPortal } from 'react-dom';

const DesktopIcon = ({ name, type, position: initialPosition, desktopBounds }) => {
  const IconComponent = type === 'folder' ? FiFolder : FiFile;
  const [iconPosition, setIconPosition] = useState(initialPosition);
  const iconRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  // Suppression de contextMenuRef inutile
  const getConstrainedPosition = (newX, newY) => {
    if (!desktopBounds || !iconRef.current) return { x: newX, y: newY };

    const iconWidth = iconRef.current.offsetWidth;
    const iconHeight = iconRef.current.offsetHeight;

    return {
      x: Math.max(0, Math.min(desktopBounds.width - iconWidth, newX)),
      y: Math.max(desktopBounds.topOffset, Math.min(desktopBounds.height - iconHeight - desktopBounds.bottomOffset, newY))
    };
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'ICON',
    item: { name, initialPosition },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newX = initialPosition.x + delta.x;
        const newY = initialPosition.y + delta.y;
        const constrained = getConstrainedPosition(newX, newY);
        setIconPosition(constrained);
      }
    },
  });

  const handleContextMenu = (e) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    
    setMenuPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: iconPosition.x,
        top: iconPosition.y,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="icon-wrapper w-20 text-center select-none cursor-move"
      onContextMenu={handleContextMenu}
    >
      <div ref={iconRef}>
        <ContextMenuTrigger 
          id={`context-${name}`} 
          collect={() => ({ name })}
          holdToDisplay={500} // Augmentez ce délai pour éviter les conflits
          disable={isDragging}
        >
          <div className="icon-content p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <IconComponent className="w-12 h-12 mx-auto text-blue-500" />
            <span className="text-xs mt-1 break-all">{name}</span>
          </div>
        </ContextMenuTrigger>
      </div>

      {!isDragging && createPortal(
        <ContextMenu 
          id={`context-${name}`}
          style={{
            position: 'fixed',
            left: menuPosition.x,
            top: menuPosition.y,
            zIndex: 1000
          }}
        >
          <MenuItem onClick={(_, { name }) => console.log('Open', name)}>
            Ouvrir
          </MenuItem>
          <MenuItem onClick={(_, { name }) => console.log('Rename', name)}>
            Renommer
          </MenuItem>
          <MenuItem onClick={(_, { name }) => console.log('Delete', name)}>
            <FiTrash2 className="inline mr-2" /> Supprimer
          </MenuItem>
        </ContextMenu>,
        document.body
      )}
    </div>
  );
};

export default DesktopIcon;