// App.jsx
import React, {Suspense }  from 'react';
import { AppProvider } from './desktop/AppContext';
import AppInitializer from './desktop/AppInitializer';
import DesktopBackground from './desktop/mainscreem/DesktopBackground';
import TopBar from './desktop/topbar/TopBar';
import Dock from './desktop/bottombar/Dock';
import { useTranslation } from "react-i18next";
import DesktopManager from './desktop/mainscreem/DesktopManager';
import WindowManager from './desktop/window/WindowManager';

const App = () => {
  const { t } = useTranslation();
  return (
    <AppProvider>
      <AppInitializer>
        <Suspense fallback={<div>{t("loading..")}</div>}>
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
