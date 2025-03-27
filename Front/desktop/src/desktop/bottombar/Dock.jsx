"use client";

import { memo, useEffect, useCallback, useRef, useState } from "react";
import { useTheme } from "./../../theme/ThemeContext";
import { useWebApps } from "../../Apps/AppManager";
import { useApp } from "../AppContext";
import AppList from './../../Apps/AppInit'; // Assure-toi que AppList est un tableau d'URLs à ajouter

const Dock = () => {
  const { theme } = useTheme();
  const { batchAddApps, apps, loading, error } = useWebApps();
  const { setWindows, windows } = useApp();
  // On initialise visibleAppsCount à apps.length par défaut si apps est non vide
  const [visibleAppsCount, setVisibleAppsCount] = useState(apps.length);
  const dockRef = useRef(null);

  // Debug : Affiche les apps dans la console
  useEffect(() => {
    console.log("Apps chargées:", apps);
    // Met à jour visibleAppsCount dès que les apps sont chargées
    setVisibleAppsCount(apps.length);
  }, [apps]);

  // Si AppList est un tableau d'URLs à ajouter, tu peux décommenter la ligne suivante :
  useEffect(() => {
    batchAddApps(AppList);
  }, [batchAddApps]);

  // Calcul du nombre d'apps visibles en fonction de la taille de l'écran
  const handleResize = useCallback(() => {
    if (!dockRef.current) return;

    const viewportWidth = window.innerWidth / 2;
    const paddingX = 32; // px-4 (16px * 2)
    const gap = 8; // gap-2 (8px)
    const appItems = dockRef.current.querySelectorAll('.app-item');

    // Log pour déboguer la largeur et le nombre d'apps rendus
    console.log("Nombre d'appItems rendus:", appItems.length);

    if (!appItems.length) {
      // Si aucun élément n'est encore rendu, on peut afficher toutes les apps
      setVisibleAppsCount(apps.length);
      return;
    }

    const appItemWidth = appItems[0].offsetWidth;
    const maxWidth = viewportWidth - paddingX;
    const availableWidthPerApp = appItemWidth + gap;

    let maxN = Math.floor((maxWidth + gap) / availableWidthPerApp);
    maxN = Math.max(1, Math.min(apps.length, maxN));

    console.log("Nombre maximum d'apps affichées:", maxN);
    setVisibleAppsCount(maxN);
  }, [apps.length]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Réexécute le resize quand apps changent
  useEffect(() => {
    handleResize();
  }, [apps, handleResize]);

  return (
    <div className="relative">
      {/* En cas d'erreur, afficher un message en overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 py-2 bg-red-600 text-white text-sm rounded-md">
            {error}
          </div>
        </div>
      )}

      <div
        ref={dockRef}
        className={`fixed w-auto bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 min-h-[50px] ${
          theme.name === "dark"
            ? "bg-gray-900/80 border-gray-700"
            : "bg-white/20 border-gray-200"
        } backdrop-blur-lg border rounded-2xl flex flex-row justify-center items-center gap-2 z-50 shadow-xl`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>
        ) : (
          // Utiliser app.id comme clé pour une stabilité optimale
          apps.slice(0, visibleAppsCount).map((app) => (
            <div
              key={app.id}
              className="app-item relative flex flex-col items-center group cursor-pointer"
              onClick={() =>
                setWindows([
                  ...windows,
                  {
                    id: app.id,
                    url: app.url,
                    minimized: false,
                    maximized: false,
                    zIndex: 1,
                    position: { x: 100, y: 100 },
                    size: { width: 350, height: 300 },
                  },
                ])
              }
            >
              <div className="rounded-lg p-1.5 bg-gray-100/20 hover:bg-gray-100/30 transition-colors duration-200">
                <img
                  src={app.icon}
                  alt={app.name}
                  className="h-8 w-8 object-cover rounded"
                  onError={(e) => (e.target.src = "/default-icon.png")}
                />
              </div>

              <div
                className={`absolute -top-8 px-2 py-1 ${
                  theme.name === "dark" ? "bg-gray-700" : "bg-gray-800"
                } text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}
              >
                {app.name}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(Dock);
