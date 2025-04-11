"use client"
import { motion } from "framer-motion"
import { Globe, Monitor, Dock, Layout } from "lucide-react"
import { ContentItem } from "../components/UIComponents"

// Textes pour l'internationalisation
const texts = {
  wallpaper: "Fond d'écran",
  chooseDesktop: "Choisir votre fond d'écran",
  screenSaver: "Économiseur d'écran",
  setupScreenSaver: "Configurer votre économiseur d'écran",
  dockAndMenuBar: "Dock et barre de menus",
  customizeDock: "Personnaliser votre dock et barre de menus",
  missionControl: "Mission Control",
  organizeWindows: "Organiser vos fenêtres",
}

// Icônes utilisées dans ce composant
const icons = {
  globe: <Globe />,
  monitor: <Monitor />,
  dock: <Dock />,
  layout: <Layout />,
}

const GeneralSettings = ({ settingsState, updateSettings, contentVariants, navigateToSubSection }) => {
  return (
    <motion.div
      key="default"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6"
    >
      <ContentItem
        icon={<Globe className="w-5 h-5 text-white" />}
        label={texts.wallpaper}
        description={texts.chooseDesktop}
        color="bg-blue-500"
        onClick={() => navigateToSubSection("wallpaper", "wallpaper")}
      />
      <ContentItem
        icon={<Monitor className="w-5 h-5 text-white" />}
        label={texts.screenSaver}
        description={texts.setupScreenSaver}
        color="bg-purple-500"
        onClick={() => console.log("Screen Saver clicked")}
      />
      <ContentItem
        icon={<Dock className="w-5 h-5 text-white" />}
        label={texts.dockAndMenuBar}
        description={texts.customizeDock}
        color="bg-green-500"
        onClick={() => console.log("Dock & Menu Bar clicked")}
      />
      <ContentItem
        icon={<Layout className="w-5 h-5 text-white" />}
        label={texts.missionControl}
        description={texts.organizeWindows}
        color="bg-orange-500"
        onClick={() => console.log("Mission Control clicked")}
      />
    </motion.div>
  )
}

export default GeneralSettings
