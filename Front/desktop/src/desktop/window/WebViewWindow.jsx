import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import Window from './Window';

const WebViewWindow = forwardRef(({ id, url, active, onFocus, ...windowProps }, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reload: () => {
      setIsLoading(true);
      iframeRef.current.src = url;
    },
    getUrl: () => iframeRef.current?.src
  }));

  return (
    <Window 
      {...windowProps}
      id={id}
      active={active}
      onFocus={onFocus}
      title={windowProps.title || url}
    >
      <div className="relative h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
          </div>
        )}
        <iframe
          title={url}
          ref={iframeRef}
          src={url}
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
        />
      </div>
    </Window>
  );
});

export default WebViewWindow;