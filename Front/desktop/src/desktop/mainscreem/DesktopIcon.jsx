import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "tailwindcss/tailwind.css";

const ReactGridLayout = WidthProvider(RGL);

const IconGrid = ({ icons, action }) => {
  const layout = icons.map((icon, index) => ({
    i: icon.id,
    x: index % 6, // Ajuste dynamiquement les colonnes
    y: Math.floor(index / 7),
    w: 1,
    h: 1,
  }));

  return (
    <div className="w-full h-full">
      <ReactGridLayout
        className="layout"
        layout={layout}
        //cols={14} // S'adapte aux écrans larges
        rowHeight={window.innerHeight / 10} // Ajuste la hauteur selon l'écran
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
          >
            <img src={icon.icon} alt="icon" className="w-12 h-12 rounded-lg p-1 bg-gray-100/20 hover:bg-gray-100/30 transition-colors duration-200" />
            <span className="mt-1 text-xs text-white truncate sm:w-10 md:w-15 lg:w-20 text-center">{icon.name}</span>
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

export default IconGrid;
