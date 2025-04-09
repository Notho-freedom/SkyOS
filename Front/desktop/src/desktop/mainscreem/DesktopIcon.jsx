import React, { useCallback, useEffect, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "tailwindcss/tailwind.css";
import { useContextMenu } from "../contextual_menu/ContextMenuContext";
import { useWindowContext } from '../window/WindowContext';
import { useWebApps } from './../../Apps/AppManager';
import { Tooltip } from "react-tooltip";
import { useTheme } from "../../theme/ThemeContext";

const ReactGridLayout = WidthProvider(RGL);

const IconGrid = () => {
  const { showContextMenu } = useContextMenu();
  const { addWindow, addApp, handleWindowAction } = useWindowContext();
  const { apps, setSapp } = useWebApps();
  const [cols, setCols] = useState(6);
  const [rowsPerColumn, setRowsPerColumn] = useState(1);
  const {theme} = useTheme();

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
    const margin = [12, 12]; // Marge [horizontal, vertical]
    const containerPadding = [15, 15]; // Padding du conteneur
    const rowHeight = 55; // Hauteur de ligne fixe

    // Calcul de la hauteur disponible pour les icônes
    const availableHeight = window.innerHeight 
      - (containerPadding[1] * 2) // Padding haut/bas
      - (margin[1] * 2); // Marge verticale totale

    // Calculer le nombre de lignes par colonne
    const rowHeightWithMargin = rowHeight + margin[1];
    const calculatedRowsPerColumn = Math.max(1, Math.floor(availableHeight / rowHeightWithMargin));

    // Calculer le nombre de colonnes nécessaires
    const calculatedCols = Math.ceil(apps.length / calculatedRowsPerColumn);

    setRowsPerColumn(calculatedRowsPerColumn);
    setCols(calculatedCols);
  }, [apps.length]);

  useEffect(() => {
    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, [updateGrid]);

  const layout = apps.map((icon, index) => ({
    i: icon.id,
    x: Math.floor(index / rowsPerColumn), // Colonne calculée
    y: index % rowsPerColumn, // Position verticale dans la colonne
    w: 1,
    h: 1,
  }));

  // Définir une largeur de cellule fixe pour le calcul
  const cellWidth = 60;
  // Calculer la largeur totale de la grille
  const gridWidth = cols * cellWidth + ((cols - 1) * 15) + (10 * 2); // 15 = marge horizontale, 10 = padding horizontal

  return (
    <div className="layout">
      <ReactGridLayout
        key={cols}
        className="icon-grid"
        layout={layout}
        cols={cols * 2 * window.innerWidth / window.innerHeight}
        rowHeight={55}
        margin={[10, 10]}
        containerPadding={[15, 15]}
        width={gridWidth}
        isDraggable
        isResizable={false}
        autoSize={true}
        compactType={null}
      >
        {apps.map((icon) => (
          <div
            key={icon.id}
            className="group gap-1 flex flex-col items-center justify-center rounded-lg transition-all duration-300 hover:scale-105 hover:bg-[rgba(255,255,255,0.11)] hover:backdrop-blur-lg text-white icon-animation"
            onDoubleClick={() => handleWindowAction(icon)}
            data-tooltip-id={`tooltip-${icon.id}`}
            onContextMenu={(e) => handleIconContextMenu(e, icon)}
          >
            <img 
              src={icon.icon} 
              alt={icon.name} 
              className="w-[2.5vh] h-[2.5vh] rounded-md p-0.5"
              onError={(e) => {
                e.currentTarget.src = icon.image || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
              }}
            />
            <span className="text-[1.1vh] font-medium truncate w-20 text-center shadow-s">
              {icon.name}
            </span>
            
            <Tooltip
              id={`tooltip-${icon.id}`}
              place="top"
              effect="solid"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                maxWidth: "120px",
                alignContent: "center",
                justifyContent: "center",
                wordWrap: "break-word",
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
