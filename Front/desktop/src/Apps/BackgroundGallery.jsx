import React, { useEffect, useState } from 'react';
import db from '../desktop/mainscreem/DesktopBackground/db/backgroundsDb';  // Importer la base de données Dexie
import Window from '../desktop/window/Window';

const BackgroundGallery = () => {
  const [backgrounds, setBackgrounds] = useState([]);

  // Charger les fonds d'écran depuis la base de données
  useEffect(() => {
    const loadBackgrounds = async () => {
      const allBackgrounds = await db.getAllBackgrounds();
      setBackgrounds(allBackgrounds);
    };

    loadBackgrounds();
  }, []);

  const handleDelete = async (id) => {
    // Supprimer le fond d'écran de la base de données
    await db.backgrounds.delete(id);
    // Mettre à jour la galerie après suppression
    const updatedBackgrounds = await db.getAllBackgrounds();
    setBackgrounds(updatedBackgrounds);
  };

  return (
    <div className="gallery-container p-4">
      <h2 className="text-2xl mb-4">Galerie de fonds d'écran</h2>
      <div className="grid grid-cols-3 gap-4">
        {backgrounds.length > 0 ? (
          backgrounds.map((bg) => (
            <div key={bg.id} className="gallery-item relative">
              <img
                src={bg.dataUrl}
                alt={`Fond d'écran ${bg.id}`}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => handleDelete(bg.id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-700 w-2 h-2 text-xs"
                >
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun fond d'écran enregistré.</p>
        )}
      </div>
    </div>
  );
};

export default BackgroundGallery;


export const WallpaperPage = () => {
  return (
    <Window>
      <BackgroundGallery />
    </Window>
  );
};