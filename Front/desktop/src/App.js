import React, { useState, Suspense } from 'react';
import DesktopBackground from './desktop/mainscreem/DesktopBackground';
import TopBar from './desktop/topbar/TopBar';
import Dock from './desktop/bottombar/Dock';
import WebViewWindow from './desktop/window/WebViewWindow';
import i18n from "./i18n";
import { useTranslation } from "react-i18next";

const App = () => {
  const { t } = useTranslation(); // Vérifie que la traduction fonctionne
  const [activeWindow, setActiveWindow] = useState(null);
  const [windows] = useState([
    { id: 1, url: "https://windows-live.genesis-company.net" },
    { id: 2, url: "https://genesis-company.net" }
  ]);

  return (
    <Suspense fallback={<div>{t("loading")}</div>}>
      <DesktopBackground>
        <TopBar />
        <Dock />
        {windows.map(window => (
          <WebViewWindow
            key={window.id}
            id={window.id}
            url={window.url}
            active={activeWindow === window.id}
            onFocus={() => setActiveWindow(window.id)}
          />
        ))}
      </DesktopBackground>
    </Suspense>
  );
};

export default App;
