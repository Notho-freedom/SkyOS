"use client"
import { motion } from "framer-motion"
import { Globe, Monitor, Dock, Layout } from "lucide-react"
import { ContentItem } from "../components/UIComponents"
import { useTranslation } from "react-i18next"
// Icônes utilisées dans ce composant
const icons = {
  globe: <Globe />,
  monitor: <Monitor />,
  dock: <Dock />,
  layout: <Layout />,
}

const GeneralSettings = ({ settingsState, updateSettings, contentVariants, navigateToSubSection }) => {

  const { t } = useTranslation()

const texts = {
  wallpaper: t("parametre.wallpaper"),
  chooseDesktop: t("parametre.chooseDesktop"),
  screenSaver: t("parametre.screenSaver"),
  setupScreenSaver: t("parametre.setupScreenSaver"),
  dockAndMenuBar: t("parametre.dockAndMenuBar"),
  customizeDock: t("parametre.customizeDock"),
  missionControl: t("parametre.missionControl"),
  organizeWindows: t("parametre.organizeWindows"),
}

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
