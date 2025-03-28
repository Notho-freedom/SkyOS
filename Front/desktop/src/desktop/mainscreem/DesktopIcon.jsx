import React, { useCallback } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "tailwindcss/tailwind.css";
import { useContextMenu } from "../contextual_menu/ContextMenuContext";
import { useWindowContext } from '../window/WindowContext';
import { useWebApps } from './../../Apps/AppManager';

const ReactGridLayout = WidthProvider(RGL);

const IconGrid = ({ icons, action }) => {
  const { showContextMenu } = useContextMenu();
  const { addWindow, addApp  } = useWindowContext();
  const { setSapp } = useWebApps();
  
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
          addApp('Propriétés',{size: { width: 450, height: 550 }});
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
  }, []);
  

  const layout = icons.map((icon, index) => ({
    i: icon.id,
    x: index % 5, // Ajuste dynamiquement les colonnes
    y: Math.floor(index / 7),
    w: 1,
    h: 1,
  }));

  return (
    <div className="w-full h-full">
      <ReactGridLayout
        className="layout"
        layout={layout}
        cols={17} // S'adapte aux écrans larges
        rowHeight={window.innerHeight / 11} // Ajuste la hauteur selon l'écran
        width={window.innerWidth - 40} // Garde un padding
        isDraggable
        isResizable={false}
        autoSize={true}
        compactType="vertical"
      >
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="flex flex-col items-center justify-center p-2 rounded-2xl transition-transform duration-300 hover:scale-110 hover:shadow-xl"
            onDoubleClick={() => action(icon)}
            onContextMenu={(e) => handleIconContextMenu(e,icon)}
          >
            <img 
              src={icon.icon} 
              alt="icon" 
              className="w-10 h-10 rounded-lg p-1 bg-gray-100/20 hover:bg-gray-100/30 transition-colors duration-200" 
              onError={(e) => (e.target.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")}
            />
            <span className="mt-1 text-xs text-white truncate sm:w-10 md:w-15 lg:w-20 text-center">{icon.name}</span>
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

export default IconGrid;
