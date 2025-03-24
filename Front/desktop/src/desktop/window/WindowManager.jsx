// WindowManager.jsx
import React from 'react';
import WebViewWindow from './WebViewWindow';
import { useApp } from './../AppContext';

const WindowManager = () => {
  const { windows, handleWindowAction } = useApp();

  return (
    <>
      {windows.map(window => (
        <WebViewWindow
          key={window.id}
          config={window}
          onAction={handleWindowAction}
        />
      ))}
    </>
  );
};

export default WindowManager;