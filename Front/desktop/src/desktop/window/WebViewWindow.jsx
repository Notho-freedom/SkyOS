import React, { useState, useRef, useEffect } from 'react';
import Window from './Window';
import Loader from './../../animations/loader';

const WebViewWindow = ({ config, designWidth = 1280 }) => {
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
  }, []);

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

  // Retourner le composant Window avec la webview à l'intérieur
  return (
    <Window config={config}>
      <div ref={containerRef} className="relative h-full w-full bg-transparent">
        {isLoading && (
          <Loader/>
        )}
        <webview
          ref={webviewRef}
          src={config.url}
          className="w-full h-full border-none"
        />
      </div>
    </Window>
  );
};

export default WebViewWindow;
