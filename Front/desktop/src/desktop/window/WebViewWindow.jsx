import React, { useState, useRef, useEffect } from 'react';
import Window from './Window';

const WebViewWindow = ({ config, onAction, designWidth = 1280 }) => {
  const webviewRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Gestion du chargement de la webview via l'événement did-finish-load
  useEffect(() => {
    const webview = webviewRef.current;
    if (webview) {
      const handleDidFinishLoad = () => setIsLoading(false);
      webview.addEventListener('did-finish-load', handleDidFinishLoad);
      return () => {
        webview.removeEventListener('did-finish-load', handleDidFinishLoad);
      };
    }
  }, [webviewRef]);

  // Fonction d'ajustement du zoom
  const adjustZoom = () => {
    const webview = webviewRef.current;
    const container = containerRef.current;
    if (webview && container && typeof webview.getWebContents === 'function') {
      const containerWidth = container.clientWidth;
      // Calcul du zoom basé sur la largeur de référence designWidth
      const zoomFactor = containerWidth / designWidth;
      try {
        webview.getWebContents().setZoomFactor(zoomFactor);
      } catch (error) {
        console.error('Erreur lors du réglage du zoom :', error);
      }
    }
  };

  // Utilisation d'un ResizeObserver pour détecter les changements de taille du conteneur
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      adjustZoom();
    });
    observer.observe(container);
    // Appel initial pour régler le zoom dès le montage
    adjustZoom();
    return () => observer.disconnect();
  }, [designWidth]);

  return (
    <Window config={config} onAction={onAction}>
      <div ref={containerRef} className="relative h-full w-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
          </div>
        )}
        <webview
          ref={webviewRef}
          title={config.url}
          src={config.url}
          className="w-full h-full border-none"
        />
      </div>
    </Window>
  );
};

export default WebViewWindow;
