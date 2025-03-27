import React, { useRef, useState, useEffect, useCallback } from 'react';
import DesktopIcon from './DesktopIcon';
import { useApp } from './../AppContext';
import { useContextMenu } from "../contextual_menu/ContextMenuContext";
import { useWindowContext } from '../window/WindowContext';

const DesktopManager = () => {
  const { desktopIcons, handleIconAction, createNewFolder, bgRef } = useApp();
  const { showContextMenu } = useContextMenu();
  const { addApp } = useWindowContext();
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


  const handleDesktopContextMenu = useCallback((e) => {
    e.preventDefault();
  
    const menuItems = [
      { 
        label: "Nouveau dossier", 
        action: () => createNewFolder("Nouveau dossier", { x: e.clientX, y: e.clientY })
      },
      { separator: true },
      { label: "Afficher les Images", action: () => addApp('Galerie') },
      { label: "Changer le fond d'écran", action: () => bgRef.current?.refreshBackground() },
      { label: "Enregistrer le fond d'écran", action: () => bgRef.current?.saveCurrentBackground() },
      { separator: true },
      { 
        label: "Applications", 
        submenu: [
          { label: "Lancer une application" },
          { label: "Ouvrir dans une fenêtre flottante" },
          { label: "Organiser les applications ouvertes" },
          { separator: true },
          { label: "Afficher dans un autre bureau virtuel" }
        ] 
      },
      { 
        label: "Fichiers", 
        submenu: [
          { label: "Déplacer vers le cloud" },
          { label: "Synchroniser avec un autre appareil" },
          { label: "Vérifier l'intégrité des fichiers" },
          { separator: true },
          { label: "Partager avec le réseau SkyOS" }
        ] 
      },
      { separator: true },
      { 
        label: "Personnalisation", 
        submenu: [
          { label: "Changer le thème" },
          { label: "Personnaliser la barre de tâches" },
          { label: "Organiser les icônes automatiquement" },
          { label: "Afficher la météo" },
          { label: "Afficher le calendrier" }
        ] 
      },
      { separator: true },
      { 
        label: "Sécurité et Sauvegarde", 
        submenu: [
          { label: "Activer la sauvegarde automatique" },
          { label: "Restaurer le bureau" },
          { separator: true },
          { label: "Protéger avec un mot de passe" }
        ] 
      },
      { separator: true },
      { 
        label: "Cloud", 
        submenu: [
          { label: "Accéder aux fichiers du cloud" },
          { label: "Synchroniser avec un autre compte" },
          { label: "Envoyer des fichiers vers le cloud" }
        ] 
      },
      { separator: true },
      { 
        label: "Paramètres avancés", 
        submenu: [
          { label: "Activer le mode développeur" },
          { label: "Accéder aux logs du système" },
          { label: "Moniteur des ressources" }
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