// App.jsx
import React, { useState, Suspense }  from 'react';
import { AppProvider } from './desktop/AppContext';
import AppInitializer from './desktop/AppInitializer';
import DesktopBackground from './desktop/mainscreem/DesktopBackground';
import TopBar from './desktop/topbar/TopBar';
import Dock from './desktop/bottombar/Dock';
import i18n from "./i18n";
import { useTranslation } from "react-i18next";
import DesktopManager from './desktop/mainscreem/DesktopManager';
import WindowManager from './desktop/window/WindowManager';

const App = () => {
  const { t } = useTranslation(); // Vérifie que la traduction fonctionne
  // const [activeWindow, setActiveWindow] = useState(null);
  // const [windows] = useState([
  //   { id: 1, url: "https://windows-live.genesis-company.net" },
  //   { id: 2, url: "https://genesis-company.net" }
  // ]);

  return (
    <AppProvider>
      <AppInitializer>
        <Suspense fallback={<div>{t("loading")}</div>}>
          <DesktopBackground>
            <TopBar />
            <Dock />
            <DesktopManager />
            <WindowManager />
          </DesktopBackground>
        </Suspense>
        </AppInitializer>
  </AppProvider>
  );
};

export default App;
