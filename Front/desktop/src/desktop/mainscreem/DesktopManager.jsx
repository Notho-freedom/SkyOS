import React, { useRef, useState, useEffect, useCallback } from 'react';
import DesktopIcon from './DesktopIcon';
import { useApp } from './../AppContext';
import { useContextMenu } from "../contextual_menu/ContextMenuContext";

const DesktopManager = () => {
  const { desktopIcons, handleIconAction, createNewFolder } = useApp();
  const { showContextMenu } = useContextMenu();
  const desktopRef = useRef(null);
  const [desktopBounds, setDesktopBounds] = useState({
    width: 0,
    height: 0,
    topOffset: 28,    // Hauteur de la TopBar
    bottomOffset: 70  // Hauteur de la Dock
  });
  const [selectedIcon, setSelectedIcon] = useState(null);

  const updateBounds = () => {
    if (desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect();
      setDesktopBounds(prev => ({
        ...prev,
        width: rect.width,
        height: rect.height
      }));
    }
  };

  const handleDesktopClick = () => {
    setSelectedIcon(null); 
  };

  const handleIconSelect = (iconId) => {
    setSelectedIcon(iconId);
  };

  function sortIcons(type){};

  const handleDesktopContextMenu = useCallback((e) => {
    e.preventDefault();

    const menuItems = [
      { 
        label: "Nouveau dossier", 
        action: () => createNewFolder("Nouveau dossier", { x: e.clientX, y: e.clientY })
      },
      { separator: true },
      { label: "Actualiser le bureau", action: () => window.location.reload() },
      { separator: true },
      { 
        label: "Affichage", 
        submenu: [
          { label: "Trier par nom", action: () => sortIcons('name') },
          { label: "Trier par date", action: () => sortIcons('date') },
          { label: "Trier par type", action: () => sortIcons('type') },
          { separator: true },
          { label: "Nettoyer" }
        ] 
      },
      { 
        label: "Options", 
        submenu: [
          { label: "Paramètres d'affichage" },
          { label: "Personnaliser" }
        ] 
      }
    ];

    showContextMenu(menuItems, { x: e.clientX, y: e.clientY });
  }, [createNewFolder, showContextMenu]);

  const handleIconContextMenu = useCallback((e, icon) => {
    e.preventDefault();
    e.stopPropagation();
    
    const menuItems = [
      { label: "Ouvrir", action: () => handleIconAction(icon.id, 'open') },
      { label: "Renommer", action: () => handleIconAction(icon.id, 'rename') },
      { separator: true },
      { label: "Copier" },
      { label: "Couper" },
      { label: "Coller", disabled: true },
      { separator: true },
      { 
        label: "Partager", 
        submenu: [
          { label: "AirDrop" },
          { label: "Email" },
          { label: "Messages" }
        ] 
      },
      { separator: true },
      { 
        label: "Supprimer", 
        action: () => handleIconAction(icon.id, 'delete'),
        className: "text-red-500 hover:text-white hover:bg-red-500"
      }
    ];

    showContextMenu(menuItems, { x: e.clientX, y: e.clientY });
  }, [handleIconAction, showContextMenu]);

  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  return (
    <div 
      ref={desktopRef}
      className="desktop-area w-full h-full overflow-hidden relative select-none"
      style={{
        top: `${desktopBounds.topOffset}px`,
        height: `calc(100% - ${desktopBounds.topOffset + desktopBounds.bottomOffset}px)`
      }}
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
    >
      {desktopIcons.map(icon => (
        <DesktopIcon
          key={icon.id}
          {...icon}
          desktopBounds={desktopBounds}
          isSelected={selectedIcon === icon.id}
          onSelect={handleIconSelect}
          onAction={(action) => handleIconAction(icon.id, action)}
          onContextMenu={(e) => handleIconContextMenu(e, icon)}
        />
      ))}
    </div>
  );
};

export default DesktopManager;