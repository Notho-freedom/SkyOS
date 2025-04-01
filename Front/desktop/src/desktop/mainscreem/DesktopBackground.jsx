import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useMemo
} from 'react';
import PropTypes from 'prop-types';
import db from './db/backgroundsDb'; // IndexedDB via Dexie

const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const DesktopBackground = forwardRef(({
  children,
  width = window.innerWidth,
  height = window.innerHeight
}, ref) => {
  const [currentBg, setCurrentBg] = useState(null);
  const [nextBg, setNextBg] = useState(null);
  const [loading, setLoading] = useState(true); // État de chargement des images
  const [imageLoaded, setImageLoaded] = useState(false); // Gère l'état de chargement de l'image
  const API_KEY = 'eDfjR7DwNjtup2rMR4B4fQ==yzwNblaGbUAgT1MQ';

  //['nature', 'city', 'technology', 'food','still_life', 'abstract', 'wildlife']
  const categories = useMemo(() => [
    'nature', 'city', 'technology'
  ], []);

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
      console.error('Erreur de récupération de l’image en ligne:', error);
      return null;
    }
  }, [width, height, API_KEY, categories]);

  const refreshBackground = useCallback(async () => {
    setLoading(true); // Afficher le loader uniquement au début
    setImageLoaded(false); // Réinitialiser le statut de chargement de l'image
    try {
      const newBg = await fetchRandomImage();
      if (!newBg) {
        const savedBackgrounds = await db.getAllBackgrounds();
        if (savedBackgrounds.length > 0) {
          const fallback = savedBackgrounds[Math.floor(Math.random() * savedBackgrounds.length)].dataUrl;
          setCurrentBg(fallback);
          setLoading(false);
          return;
        }
        setLoading(false);
        return;
      }

      const savedBackgrounds = await db.getAllBackgrounds();
      if (savedBackgrounds.length === 0) {
        try {
          const response = await fetch(newBg);
          const blob = await response.blob();
          const dataUrl = await blobToDataURL(blob);
          await db.addBackground(dataUrl);
          console.log("Fond d'écran sauvegardé dans IndexedDB.");
        } catch (err) {
          console.error("Erreur lors de la sauvegarde dans IndexedDB :", err);
        }
      }

      setNextBg(newBg);
      setImageLoaded(false); // Réinitialiser l'état de chargement de l'image suivante
    } catch (error) {
      console.error('Erreur de rafraîchissement:', error);
      setLoading(false);
    }
  }, [fetchRandomImage]);

  const saveCurrentBackground = useCallback(async () => {
    if (!currentBg) return;
    try {
      const response = await fetch(currentBg);
      const blob = await response.blob();
      const dataUrl = await blobToDataURL(blob);
      await db.addBackground(dataUrl);
      console.log("Fond d'écran sauvegardé manuellement dans IndexedDB.");
    } catch (err) {
      console.error("Erreur lors de la sauvegarde manuelle du fond d'écran :", err);
    }
  }, [currentBg]);

  const handleImageLoad = () => {
    setImageLoaded(true); // Indiquer que l'image a bien été chargée
    setLoading(false); // Masquer le loader une fois l'image prête
  };

  useImperativeHandle(ref, () => ({
    refreshBackground,
    saveCurrentBackground: () => saveCurrentBackground()
  }));

  useEffect(() => {
    refreshBackground();
  }, []); // Exécuter au montage

  useEffect(() => {
    return () => {
      [currentBg, nextBg].forEach(url => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [currentBg, nextBg]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Loader affiché pendant le chargement initial */}
      {loading && !nextBg && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping"></div>
            <div className="absolute inset-0 w-full h-full border-4 border-gray-300 rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Fond d'écran actuel sans animation */}
      {currentBg && imageLoaded && (
        <img
          alt="Fond d'écran actuel"
          className="absolute inset-0 w-full h-full object-cover z-[-1]"
          src={currentBg}
        />
      )}

      {/* Fond d'écran suivant sans animation */}
      {nextBg && (
        <img
          alt="Fond d'écran suivant"
          className="absolute inset-0 w-full h-full object-cover z-[-1]"
          src={nextBg}
          onLoad={handleImageLoad} // Déclenchement lorsque l'image suivante est chargée
        />
      )}

      {/* Conteneur pour les enfants */}
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  );
});

DesktopBackground.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number,
  height: PropTypes.number
};

export default DesktopBackground;
