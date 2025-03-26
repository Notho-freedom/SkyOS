import React, { useState, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const DesktopBackground = forwardRef(({ 
  children, 
  width = window.innerWidth,
  height = window.innerHeight,
  transitionDuration = 1000
}, ref) => {
  const [currentBg, setCurrentBg] = useState(null);
  const [nextBg, setNextBg] = useState(null);
  const API_KEY = 'eDfjR7DwNjtup2rMR4B4fQ==yzwNblaGbUAgT1MQ';
  
  const categories = [
    'nature', 'city', 'technology', 'food',
    'still_life', 'abstract', 'wildlife'
  ];

  const fetchRandomImage = useCallback(async () => {
    try {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const url = new URL('https://api.api-ninjas.com/v1/randomimage');
      
      url.searchParams.append('category', randomCategory);
      url.searchParams.append('width', Math.max(1600, width));
      url.searchParams.append('height', Math.max(900, height));

      const response = await fetch(url, {
        headers: {
          'X-Api-Key': API_KEY,
          'Accept': 'image/jpg'
        }
      });

      if (!response.ok) throw new Error(`Erreur HTTP! statut: ${response.status}`);
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Erreur de récupération:', error);
      return null;
    }
  }, [width, height]);

  const refreshBackground = useCallback(async () => {
    try {
      const newBg = await fetchRandomImage();
      if (!newBg) return;

      setNextBg(newBg);
      setTimeout(() => {
        setCurrentBg(newBg);
        setNextBg(null);
      }, transitionDuration);
      
      // Préchargement de la prochaine image
      fetchRandomImage().then(preloadBg => {
        if (preloadBg) URL.revokeObjectURL(preloadBg);
      });
    } catch (error) {
      console.error('Erreur de rafraîchissement:', error);
    }
  }, [fetchRandomImage, transitionDuration]);

  useImperativeHandle(ref, () => ({
    refreshBackground
  }));

  // Rafraîchissement initial
  useEffect(() => {
    refreshBackground();
  }, [refreshBackground]);

  // Nettoyage des URLs
  useEffect(() => {
    return () => {
      [currentBg, nextBg].forEach(url => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [currentBg, nextBg]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Image actuelle */}
      {currentBg && (
        <img
          alt="Fond d'écran actuel"
          className="absolute inset-0 w-full h-full object-cover z-[-1] transition-opacity duration-1000"
          style={{ transitionDuration: `${transitionDuration}ms` }}
          src={currentBg}
        />
      )}
      
      {/* Image suivante en pré-transition */}
      {nextBg && (
        <img
          alt="Fond d'écran suivant"
          className="absolute inset-0 w-full h-full object-cover z-[-1] opacity-0"
          style={{ 
            transition: `opacity ${transitionDuration}ms ease-in-out`,
            opacity: 1 // Force le chargement
          }}
          src={nextBg}
        />
      )}
      
      {/* Conteneur enfants */}
      <div className="relative w-full h-full">

        {children}
      </div>
    </div>
  );
});

DesktopBackground.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number,
  height: PropTypes.number,
  transitionDuration: PropTypes.number
};

export default DesktopBackground;