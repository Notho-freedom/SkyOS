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
import { ThemeProvider } from "./theme/ThemeContext"
import { ContextMenuProvider } from "./desktop/contextual_menu/ContextMenuContext";

const App = () => {
  const { t } = useTranslation(); 

  return (
    <AppProvider>
      <ThemeProvider>
        <ContextMenuProvider>
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
        </ContextMenuProvider>
      </ThemeProvider>
  </AppProvider>
  );
};

export default App;
