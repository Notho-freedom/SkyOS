import { useState, useCallback, useEffect, useMemo } from 'react';
import db from './db/backgroundsDb';
import { showNotification } from '../../notify/notifications';
import fallback from './fallback/fallback.jpeg';
import { useApp } from '../../AppContext';

// Fonction pour convertir un blob en DataURL
const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const useBackgroundManager = () => {
  const [currentBg, setCurrentBg] = useState(null);
  const [nextBg, setNextBg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { userBgPref } = useApp();

  const API_KEY = 'eDfjR7DwNjtup2rMR4B4fQ==yzwNblaGbUAgT1MQ';
  const categories = useMemo(() => userBgPref?.categories || ['nature', 'city', 'technology'], [userBgPref]);

  const loadFallbackImage = useCallback(async () => {
    try {
      const savedBackgrounds = await db.getAllBackgrounds();
      if (savedBackgrounds.length > 0) {
        const chosen = savedBackgrounds[Math.floor(Math.random() * savedBackgrounds.length)].dataUrl;
        setCurrentBg(chosen);
        setNextBg(chosen);
        showNotification('Fond d\'écran', 'Image locale chargée', 'info');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const fetchRandomImage = useCallback(async () => {
    try {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const url = new URL('https://api.api-ninjas.com/v1/randomimage');
      url.searchParams.append('category', category);
      url.searchParams.append('width', Math.max(1600, window.innerWidth));
      url.searchParams.append('height', Math.max(900, window.innerHeight));

      const response = await fetch(url, {
        headers: {
          'X-Api-Key': API_KEY,
          'Accept': 'image/jpeg',
        },
      });

      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const dataUrl = await blobToDataURL(blob);

      return { blobUrl, dataUrl };
    } catch {
      const fallbackWorked = await loadFallbackImage();
      if (!fallbackWorked) {
        showNotification('Erreur', 'Chargement impossible (fallback utilisé)', 'error');
        setCurrentBg(fallback);
        setNextBg(fallback);
      }
      return null;
    }
  }, [categories, loadFallbackImage]);

  const refreshBackground = useCallback(async () => {
    setLoading(true);
    setImageLoaded(false);

    const result = await fetchRandomImage();
    if (!result) {
      setLoading(false);
      return;
    }

    const { blobUrl, dataUrl } = result;

    const saved = await db.getAllBackgrounds();
    const alreadySaved = saved.some(bg => bg.dataUrl === dataUrl);
    if (!alreadySaved) {
      if (saved.length >= 10) {
        await db.deleteOldest();
      }
      await db.addBackground(dataUrl);
      showNotification('Sauvegarde', 'Nouvel arrière-plan enregistré', 'success');
    }

    setNextBg(blobUrl);
  }, [fetchRandomImage]);

  const saveCurrentBackground = useCallback(async () => {
    if (!currentBg) return;
    try {
      const response = await fetch(currentBg);
      const blob = await response.blob();
      const dataUrl = await blobToDataURL(blob);
      await db.addBackground(dataUrl);
      showNotification('Manuelle', 'Image ajoutée à la collection', 'success');
    } catch {
      showNotification('Erreur', 'Sauvegarde échouée', 'error');
    }
  }, [currentBg]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setLoading(false);
    setCurrentBg(nextBg);
  }, [nextBg]);

  const changeBackgroundManually = useCallback(async (file) => {
    if (!file) return;

    const dataUrl = await blobToDataURL(file);
    setCurrentBg(dataUrl);
    setNextBg(dataUrl);

    const savedBackgrounds = await db.getAllBackgrounds();
    const alreadySaved = savedBackgrounds.some(bg => bg.dataUrl === dataUrl);

    if (!alreadySaved) {
      if (savedBackgrounds.length >= 10) {
        await db.deleteOldest();
      }
      await db.addBackground(dataUrl);
      showNotification('Manuel', 'Fond d\'écran changé et sauvegardé', 'success');
    }

  }, []);

  useEffect(() => {
    if (!userBgPref?.autoSwitch) return;
    const interval = setInterval(refreshBackground, userBgPref.switchInterval || 300000);
    return () => clearInterval(interval);
  }, [refreshBackground, userBgPref]);

  useEffect(() => {
    refreshBackground();
  }, [refreshBackground]);

  useEffect(() => {
    return () => {
      [currentBg, nextBg].forEach(url => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [currentBg, nextBg]);

  return {
    currentBg,
    nextBg,
    loading,
    imageLoaded,
    setCurrentBg,
    setImageLoaded,
    handleImageLoad,
    refreshBackground,
    saveCurrentBackground,
    changeBackgroundManually,
    blurEnabled: userBgPref?.enableBlur,
    blurAmount: userBgPref?.blurAmount || 'md',
  };
};

export default useBackgroundManager;
