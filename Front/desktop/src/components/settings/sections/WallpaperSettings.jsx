"use client"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Info } from "lucide-react"
import { SectionTitle, SectionCard, WallpaperOption } from "../components/UIComponents"
import { useBackground } from '../../../desktop/mainscreem/DesktopBackground/BackgroundContext';

// Textes pour l'internationalisation
const texts = {
  wallpaper: "Fond d'écran",
  builtInDisplay: "Écran intégré",
  dynamicDesktop: "Bureau dynamique",
  lightDarkDesktop: "Bureau clair et sombre",
  showLess: "Afficher moins",
  showAll: "Afficher tout",
  venturaGraphic: "Graphique Ventura",
  desktopChanges: "Ce fond d'écran change tout au long de la journée.",
}

const WallpaperSettings = ({ settingsState, updateSettings, contentVariants }) => {
  const { changeBackgroundManually, currentBg } = useBackground();

  // Fonction pour sélectionner un fond d'écran
  const handleSelectWallpaper = async (wallpaperUrl) => {
    try {
      // Télécharger l'image depuis l'URL
      const response = await fetch(wallpaperUrl);
      if (!response.ok) throw new Error('Erreur de téléchargement');
      const blob = await response.blob();
      
      // Changer le fond d'écran
      await changeBackgroundManually(blob);
      
      // Mettre à jour l'état avec l'index sélectionné
      const selectedIndex = wallpapers.findIndex(w => w === wallpaperUrl);
      if (selectedIndex >= 0) {
        updateSettings("selectedWallpaper", selectedIndex);
      }
    } catch (error) {
      console.error("Erreur lors du changement de fond d'écran:", error);
    }
  }

  // Fonction pour naviguer entre les fonds d'écran
  const handleNavigateWallpapers = async (direction) => {
    let newIndex = settingsState.selectedWallpaper;
    if (direction === "previous") {
      newIndex = (newIndex - 1 + wallpapers.length) % wallpapers.length;
    } else if (direction === "next") {
      newIndex = (newIndex + 1) % wallpapers.length;
    }
    await handleSelectWallpaper(wallpapers[newIndex]);
  }

  // Données pour les wallpapers
  const wallpapers = [
    "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/459203/pexels-photo-459203.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1212693/pexels-photo-1212693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=10",
    "https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];

  return (
    <motion.div
      key="wallpaper"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <SectionTitle
          title={texts.wallpaper}
          action={
            <div className="flex items-center space-x-2">
              <motion.button
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigateWallpapers("previous")}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigateWallpapers("next")}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => console.log("Info clicked")}
              >
                <Info className="w-4 h-4" />
              </motion.button>
            </div>
          }
        />

        <SectionCard className="mb-8">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">{texts.builtInDisplay}</h3>
              <motion.button
                className="text-xs text-blue-500 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectWallpaper(wallpapers[settingsState.selectedWallpaper])}
              >
                Dynamic ▾
              </motion.button>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 flex justify-center">
              <div className="w-48 h-32 rounded-lg shadow-md overflow-hidden">
                <img
                  src={currentBg || wallpapers[settingsState.selectedWallpaper]}
                  alt="Current wallpaper"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-8">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">{texts.dynamicDesktop}</h3>
              <motion.button
                className="text-xs text-blue-500 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {texts.showLess}
              </motion.button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {wallpapers.map((wallpaper, index) => (
                <WallpaperOption
                  key={index}
                  image={wallpaper}
                  isSelected={settingsState.selectedWallpaper === index}
                  onClick={() => handleSelectWallpaper(wallpaper)}
                />
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  )
}




export default WallpaperSettings