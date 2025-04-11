// hooks/useDynamicGrid.js
import { useEffect, useState, useRef, useCallback } from "react";

export const useDynamicGrid = (
  itemCount,
  baseRowHeight = 55,
  margin = [12, 12],
  padding = [15, 15],
  containerRef = null // optionnel si on veut un conteneur spécifique
) => {
  const [cols, setCols] = useState(6);
  const [rowsPerColumn, setRowsPerColumn] = useState(1);
  const [rowHeight, setRowHeight] = useState(baseRowHeight);

  const updateGrid = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Breakpoints type Tailwind pour les colonnes
    let calculatedCols = 4;
    if (width >= 1536) calculatedCols = 8;
    else if (width >= 1280) calculatedCols = 7;
    else if (width >= 1024) calculatedCols = 6;
    else if (width >= 768) calculatedCols = 5;

    // Calcul dynamique de rowHeight
    const maxHeight = height - (padding[1] * 2) - (margin[1] * 2);
    const estimatedRowHeight = Math.max(75, Math.floor(maxHeight / 12)); // jusqu'à 12 lignes max
    const calculatedRowHeight = Math.min(estimatedRowHeight, baseRowHeight);
    setRowHeight(calculatedRowHeight);

    const totalRows = Math.max(1, Math.floor(maxHeight / (calculatedRowHeight + margin[1])));
    const adaptedCols = Math.ceil(itemCount / totalRows);

    setCols(Math.max(calculatedCols, adaptedCols));
    setRowsPerColumn(totalRows);
  }, [itemCount, baseRowHeight, margin, padding]);

  useEffect(() => {
    updateGrid();

    const resizeTarget = containerRef?.current || window;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateGrid);
    });

    if (resizeTarget === window) {
      window.addEventListener("resize", updateGrid);
    } else {
      observer.observe(resizeTarget);
    }

    return () => {
      if (resizeTarget === window) {
        window.removeEventListener("resize", updateGrid);
      } else {
        observer.disconnect();
      }
    };
  }, [updateGrid, containerRef]);

  return { cols, rowsPerColumn, rowHeight };
};
