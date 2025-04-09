import { AnimatePresence } from "framer-motion"
import AppIcon from "./AppIcon"
import { useTheme } from "../../theme/ThemeContext";

const DockBar = ({ apps, visibleAppsCount, dockRef, addWindow }) => {

    const { theme } = useTheme();

  return (
    <div
      ref={dockRef}
      className={`flex flex-row justify-center items-center gap-2 px-2 bg-[${theme.colors.background}] bg-opacity-25 backdrop-blur-xl border rounded-2xl shadow-xl z-50`}
      style={{ minHeight: `10%` }}  // Applique la hauteur dynamique
    >
      <AnimatePresence>
        {apps.slice(0, visibleAppsCount / 2).map((app) => (
          <AppIcon key={app.id} app={app} onClick={() => addWindow(app)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default DockBar
