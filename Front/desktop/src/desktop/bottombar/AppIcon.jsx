import { motion } from "framer-motion"
import { Tooltip } from "react-tooltip"
import { useTheme } from "../../theme/ThemeContext"

const AppIcon = ({ app, onClick }) => {
  const tooltipId = `tooltip-${app.name.replace(/\s+/g, "-").toLowerCase()}`;
  const { theme } = useTheme();

  return (
    <>
      <motion.div
        className="app-item relative flex flex-col items-center group cursor-pointer flex-shrink-0 min-w-[50px]"
        onClick={onClick}
        whileHover={{ scale: 1.2, y: -10 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        data-tooltip-id={tooltipId}
        data-tooltip-content={app.name}
      >
        <motion.div
          className="rounded-xl p-1.5 transition-colors duration-200"
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <img
            src={app.icon || "/placeholder.svg"}
            alt={app.name}
            className="h-[2.7vh] w-[2.7vh] object-cover rounded-lg"
            onError={(e) => (e.target.src = app.image)}
          />
        </motion.div>

        <motion.div
          className="w-1 h-1 rounded-full bg-white mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: app.isActive ? 1 : 0 }}
        />
      </motion.div>

      <Tooltip
        id={tooltipId}
        place="top"
        className="flex-wrap"
        effect="solid"
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          padding: "4px 8px",
          borderRadius: "6px",
          fontSize: "11px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          maxWidth: "120px",
          alignContent: "center",
          justifyContent: "center",
          wordWrap: "break-word",
        }}
      />
    </>
  )
}

export default AppIcon
