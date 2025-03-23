import React, { useState, useRef } from 'react';
import Window from './Window';

const WebViewWindow = ({ config, onAction }) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Window config={config} onAction={onAction}>
      <div className="relative h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          title={config.url}
          src={config.url}
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-downloads allow-presentation allow-storage-access-by-user-activation allow-top-navigation allow-top-navigation-by-user-activation"
          />
      </div>
    </Window>
  );
};

export default WebViewWindow;