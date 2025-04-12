import React, { useEffect, useState, useCallback } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { useContextMenu } from "../../contextual_menu/ContextMenuContext";
import { useWindowContext } from "../../window/WindowContext";
import { useWebApps } from "../../../Apps/AppManager";
import IconItem from "./IconItem";

const ReactGridLayout = WidthProvider(RGL);

const IconGrid = () => {
  const { showContextMenu } = useContextMenu();
  const { addWindow, addApp, handleWindowAction } = useWindowContext();
  const { apps, setSapp } = useWebApps();

  const [cols, setCols] = useState(1);
  const [rowsPerColumn, setRowsPerColumn] = useState(1);
  const [dynamicRowHeight, setDynamicRowHeight] = useState(60);
  const [gridWidth, setGridWidth] = useState(0);
  const [factor, setFactor] = useState([]);

  const updateGrid = useCallback(() => {
    const margin = window.innerHeight*0.01;
    const padding = window.innerWidth*0.01;
    const iconHeight = window.innerHeight*0.06;
    const windowHeight = window.innerHeight - 2 * padding;
    const windowWidth = window.innerWidth - 2 * padding;

    const maxRows = Math.floor((windowHeight) / (iconHeight));
    
    let neededCols = Math.ceil(apps.length / maxRows);
    
    const iconWidth = window.innerWidth*0.05;
    const maxCols = Math.floor((windowWidth + margin) / (iconWidth + margin));
    const finalCols = Math.min(neededCols, maxCols);

    const newGridWidth = finalCols * iconWidth + (finalCols - 1) * margin + 2 * padding;

    setRowsPerColumn(maxRows);
    setCols(finalCols);
    setGridWidth(newGridWidth);
    setDynamicRowHeight(iconHeight)
    setFactor(maxCols);
  }, [apps.length]);

  useEffect(() => {
    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, [updateGrid]);

    const layout = apps.map((icon, index) => {
      const y = index % rowsPerColumn;
      const x = Math.floor(index / rowsPerColumn);
      return {
        i: icon.id,
        x,
        y,
        w: 1,
        h: 1,
      };
    });
  

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
      {
        label: "Propriétés",
        action: () => addApp("Propriétés", { size: { width: 450, height: 550 } }),
      },
      { separator: true },
      { label: "Supprimer", action: () => console.log(`Supprimer ${icon.name}`) },
    ];

    showContextMenu(menuItems, { x: e.clientX, y: e.clientY });
  };

  return (
    <div className="layout h-screen w-full overflow-hidden">
      <ReactGridLayout
        key={cols}
        className="icon-grid"
        layout={layout}
        cols={factor}
        rowHeight={dynamicRowHeight}
        margin={[10, 10]}
        containerPadding={[20, 20]}
        width={gridWidth}
        isDraggable
        isResizable={false}
        autoSize={false}
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
