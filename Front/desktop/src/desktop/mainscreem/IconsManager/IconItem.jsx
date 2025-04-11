import React from "react";
import { Tooltip } from "react-tooltip";
import { useTheme } from "../../../theme/ThemeContext";

const IconItem = ({ icon, onDoubleClick, onContextMenu }) => {
  const { theme } = useTheme();

  const handleError = (e) => {
    e.currentTarget.src = icon.image || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
  };

  return (
    <div
      className="group gap-1 flex flex-col items-center justify-center rounded-lg transition-all duration-300 hover:scale-105 hover:bg-[rgba(255,255,255,0.11)] hover:backdrop-blur-lg text-white icon-animation"
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      data-tooltip-id={`tooltip-${icon.id}`}
    >
      <img
        src={icon.icon}
        alt={icon.name}
        className="w-[2.5vh] h-[2.5vh] rounded-md p-0.5"
        onError={handleError}
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
        }}
      >
        {icon.name}
      </Tooltip>
    </div>
  );
};

export default React.memo(IconItem);
