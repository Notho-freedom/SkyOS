import React from 'react';
import WebViewWindow from './WebViewWindow';
import Window from './Window';
import { useWindowContext } from './WindowContext'; // Importer le hook personnalisé

const WindowManager = () => {
  // Utilisation du contexte des fenêtres
  const { windows } = useWindowContext();

  return (
    <>
      {windows.map(window => (
        window.url ? (
          <WebViewWindow key={window.id} config={window} />
        ) : window.component ? (
          <Window key={window.id} config={window}>
            {React.createElement(window.component)}
          </Window>
        ) : null
      ))}
    </>
  );
};

export default WindowManager;
