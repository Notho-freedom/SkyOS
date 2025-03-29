import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useApp } from './../AppContext';
import { useContextMenu } from "../contextual_menu/ContextMenuContext";
import { useWindowContext } from '../window/WindowContext';
import { useWebApps } from '../../Apps/AppManager';
import IconGrid from './DesktopIcon';
import db from './../../Apps/db';

const DesktopManager = () => {
  const { createNewFolder, bgRef } = useApp();
  const { Refresh, setRefresh } = useWebApps();
  const { showContextMenu } = useContextMenu();
  const { addApp } = useWindowContext();
  const desktopRef = useRef(null);
  const [desktopBounds, setDesktopBounds] = useState({
    width: 0,
    height: 0,
    topOffset: 28,    // Hauteur de la TopBar
    bottomOffset: 70  // Hauteur de la Dock
  });
  

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

  const refresh = () => {
    db.clearDB();
    bgRef.current?.refreshBackground();
    //setRefresh(!Refresh);
    
  }

  const handleDesktopContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  
    const menuItems = [
      { label: 'actualisé', action: () => refresh() },
      { separator: true },
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
      onContextMenu={handleDesktopContextMenu}
    >
        <IconGrid/>

    </div>
  );
};

export default DesktopManager;