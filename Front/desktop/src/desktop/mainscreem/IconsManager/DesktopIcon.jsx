import React, { useEffect, useState, useCallback } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { useContextMenu } from "../../contextual_menu/ContextMenuContext";
import { useWindowContext } from '../../window/WindowContext';
import { useWebApps } from "../../../Apps/AppManager";
import IconItem from './IconItem';  // Le composant d'icône refactorisé

const ReactGridLayout = WidthProvider(RGL);

const IconGrid = () => {
  const { showContextMenu } = useContextMenu();
  const { addWindow, addApp, handleWindowAction } = useWindowContext();
  const { apps, setSapp } = useWebApps();
  const [cols, setCols] = useState(6);
  const [rowsPerColumn, setRowsPerColumn] = useState(1);

  // Mise à jour dynamique de la grille
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

  // Fonction de gestion du menu contextuel
  const handleIconContextMenu = (e, icon) => {
    e.preventDefault();
    e.stopPropagation();
    setSapp(icon);

    const menuItems = [
      { label: `Ouvrir ${icon.name}`, action: () => addWindow(icon) },
      { separator: true },
      { label: "Renommer", action: () => console.log(`Renommer ${icon.name}`) },
      { label: "Ajouter aux favoris", action: () => console.log(`Favoris ${icon.name}`) },
      { separator: true },
      { label: "Propriétés", action: () => addApp('Propriétés', {size: { width: 450, height: 550 }}) },
      { separator: true },
      { label: "Supprimer", action: () => console.log(`Supprimer ${icon.name}`) },
    ];

    showContextMenu(menuItems, { x: e.clientX, y: e.clientY });
  };

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
          <div key={icon.id}>
            <IconItem
              icon={icon}
              onDoubleClick={() => handleWindowAction(icon)}
              onContextMenu={(e) => handleIconContextMenu(e, icon)}
            />
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

export default IconGrid;
