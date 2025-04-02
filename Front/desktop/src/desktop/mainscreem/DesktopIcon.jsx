import React, { useCallback, useEffect, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "tailwindcss/tailwind.css";
import { useContextMenu } from "../contextual_menu/ContextMenuContext";
import { useWindowContext } from '../window/WindowContext';
import { useWebApps } from './../../Apps/AppManager';
import { Tooltip } from "react-tooltip";

const ReactGridLayout = WidthProvider(RGL);

const IconGrid = () => {
  const { showContextMenu } = useContextMenu();
  const { addWindow, addApp, handleWindowAction } = useWindowContext();
  const { apps, setSapp } = useWebApps();
  const [cols, setCols] = useState(6);
  const [colMultiplier, setColMultiplier] = useState(1.7);

  const handleIconContextMenu = useCallback((e, icon) => {
    e.preventDefault();
    e.stopPropagation();
    setSapp(icon);
  
    const menuItems = [
      {
        label: `Ouvrir ${icon.name}`,
        action: () => {
          console.log(`Ouvrir l'application: ${icon.name}`);
          addWindow(icon);
        },
      },
      { separator: true },
      {
        label: "Renommer",
        action: () => {
          console.log(`Renommer l'icône: ${icon.name}`);
          //renameIcon(icon.id);
        },
      },
      {
        label: "Ajouter aux favoris",
        action: () => {
          console.log(`Ajouter ${icon.name} aux favoris`);
          //addToFavorites(icon.id);
        },
      },
      {
        label: "Afficher dans un bureau virtuel",
        action: () => {
          console.log(`Afficher ${icon.name} dans un autre bureau virtuel`);
          //showInVirtualDesktop(icon.id);
        },
      },
      { separator: true },
      {
        label: "Fichiers",
        submenu: [
          {
            label: "Déplacer vers le cloud",
            action: () => {
              console.log(`Déplacer ${icon.name} vers le cloud`);
              //moveIconToCloud(icon.id);
            },
          },
          {
            label: "Synchroniser avec un autre appareil",
            action: () => {
              console.log(`Synchroniser ${icon.name} avec un autre appareil`);
              //syncIcon(icon.id);
            },
          },
          {
            label: "Vérifier l'intégrité des fichiers",
            action: () => {
              console.log(`Vérifier l'intégrité des fichiers de ${icon.name}`);
              //checkFileIntegrity(icon.id);
            },
          },
          { separator: true },
          {
            label: "Partager avec SkyOS",
            action: () => {
              console.log(`Partager ${icon.name} avec le réseau SkyOS`);
              //shareIcon(icon.id);
            },
          },
          {
            label: "Compresser l'icône",
            action: () => {
              console.log(`Compresser l'icône ${icon.name}`);
              //compressIcon(icon.id);
            },
          },
          {
            label: "Restaurer depuis la corbeille",
            action: () => {
              console.log(`Restaurer ${icon.name} depuis la corbeille`);
              //restoreIconFromTrash(icon.id);
            },
          },
        ],
      },
      { separator: true },
      {
        label: "Personnalisation",
        submenu: [
          {
            label: "Changer l'icône",
            action: () => {
              console.log(`Changer l'icône de ${icon.name}`);
              //changeIcon(icon.id);
            },
          },
          {
            label: "Modifier le nom affiché",
            action: () => {
              console.log(`Modifier le nom affiché de ${icon.name}`);
              //customizeLabel(icon.id);
            },
          },
          {
            label: "Organiser automatiquement les icônes",
            action: () => {
              console.log("Organiser automatiquement les icônes");
              //organizeIconsAuto();
            },
          },
          {
            label: "Appliquer un thème d'icône",
            action: () => {
              console.log(`Appliquer un thème d'icône pour ${icon.name}`);
              //applyIconTheme(icon.id);
            },
          },
        ],
      },
      { separator: true },
      {
        label: "Sécurité",
        submenu: [
          {
            label: "Protéger par mot de passe",
            action: () => {
              console.log(`Protéger ${icon.name} par mot de passe`);
              //protectIcon(icon.id);
            },
          },
          {
            label: "Crypter l'icône",
            action: () => {
              console.log(`Crypter l'icône ${icon.name}`);
              //encryptIcon(icon.id);
            },
          },
          {
            label: "Restaurer l'icône",
            action: () => {
              console.log(`Restaurer ${icon.name}`);
              //restoreIcon(icon.id);
            },
          },
        ],
      },
      { separator: true },
      {
        label: "Propriétés",
        action: () => {
          addApp('Propriétés', {size: { width: 450, height: 550 }});
        },
      },
      { separator: true },
      {
        label: "Supprimer",
        action: () => {
          console.log(`Supprimer définitivement l'icône ${icon.name}`);
          //deleteIcon(icon.id);
        },
      },
    ];
  
    showContextMenu(menuItems, { x: e.clientX, y: e.clientY });
  }, [addApp, addWindow, setSapp, showContextMenu]);

  const updateGrid = useCallback(() => {
    const iconSize = 90; // Taille d'une icône (48px + padding/marge)
    const margin = 40; // Marge totale
    const availableHeight = window.innerHeight - margin;
    const rows = Math.max(1, Math.floor(availableHeight / iconSize));
  
    // Déterminer le multiplicateur en fonction de la taille de l'écran
    const screenWidth = window.innerWidth;
    let multiplier;
    
    if (screenWidth < 768) { // sm
      multiplier = 1.5;
    } else if (screenWidth < 1024) { // md
      multiplier = 1.7;
    } else { // lg et plus
      multiplier = 2;
    }
    
    setColMultiplier(multiplier);
    setCols(Math.max(1, Math.ceil(apps.length / rows)));
  }, [apps.length]);

  useEffect(() => {
    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, [updateGrid]);

  const layout = apps.map((icon, index) => ({
    i: icon.id,
    x: index % cols, // Placement horizontal
    y: Math.floor(index / cols), // Placement vertical
    w: 1,
    h: 1,
  }));

  return (
    <div className="layout mb-10">
      <ReactGridLayout
        key={cols}
        className=""
        layout={layout}
        cols={cols * colMultiplier}
        rowHeight={75}
        width={window.innerWidth - 40}
        isDraggable
        isResizable={false}
        autoSize={true}
        compactType="vertical"
      >
        {apps.map((icon) => (
          <div
            key={icon.id}
            className="group flex flex-col items-center justify-center rounded-2xl transition-transform duration-300 hover:scale-110 hover:bg-white hover:text-black text-white"
            onDoubleClick={() => handleWindowAction(icon)}
            onContextMenu={(e) => handleIconContextMenu(e, icon)}
            data-tooltip-id={`tooltip-${icon.id}`}
          >
            <img 
              src={icon.icon} 
              alt={icon.name} 
              className="w-10 h-10 rounded-lg p-1 bg-gray-100/20 hover:bg-white transition-colors duration-200"
              onError={(e) => {
                e.currentTarget.src = icon.image || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
              }}
            />
            <span className="mt-1 text-xs truncate sm:w-10 md:w-15 lg:w-20 text-center">{icon.name}</span>
            
            <Tooltip id={`tooltip-${icon.id}`} place="top" effect="solid" 
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "6px 10px",
                borderRadius: "8px",
                fontSize: "12px",
                maxWidth: "150px",
                whiteSpace: "nowrap",
                overflow: "hidden",   
              }}
            >
              {icon.name}
            </Tooltip>
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

export default IconGrid;