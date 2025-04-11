"use client"
import { motion } from "framer-motion"
import { Battery, BatteryCharging } from "lucide-react"
import { SectionTitle, SectionCard, ToggleSwitch } from "../components/UIComponents"

// Textes pour l'internationalisation
const texts = {
  battery: "Batterie",
  charged: "Chargé",
  timeRemaining: "restantes",
  showPercentInMenuBar: "Afficher le pourcentage dans la barre de menus",
  powerSavingOptions: "Options d'économie d'énergie",
  optimizeVideoStreaming: "Optimiser la lecture vidéo en streaming",
  enablePowerMode: "Activer le mode économie d'énergie",
  turnOffDisplayAfter: "Mettre en veille l'écran après",
  usageHistory: "Historique d'utilisation",
  last24Hours: "Dernières 24 heures",
  batteryLevel: "Niveau de batterie",
  averageUsage: "Utilisation moyenne",
  chargeCycles: "Cycles de charge",
  condition: "État",
  normal: "Normal",
  perHour: "par heure",
  minutes2: "2 minutes",
  minutes5: "5 minutes",
  minutes10: "10 minutes",
  minutes30: "30 minutes",
  never: "Jamais",
}

// Icônes utilisées dans ce composant
const icons = {
  battery: <Battery />,
  batteryCharging: <BatteryCharging />,
}

const BatterySettings = ({ settingsState, updateSettings, contentVariants }) => {
  // Fonction pour gérer l'affichage du pourcentage dans la barre de menus
  const handleShowPercentInMenuBarToggle = (value) => {
    updateSettings("showPercentInMenuBar", value)
  }

  // Fonction pour gérer l'optimisation de la lecture vidéo en streaming
  const handleOptimizeVideoStreamingToggle = (value) => {
    updateSettings("optimizeVideoStreaming", value)
  }

  // Fonction pour gérer le mode économie d'énergie
  const handleEnablePowerModeToggle = (value) => {
    updateSettings("enablePowerMode", value)
  }

  // Fonction pour gérer le délai de mise en veille de l'écran
  const handleDisplaySleepTimeChange = (e) => {
    console.log(`Display sleep time changed to: ${e.target.value}`)
    // Logique pour changer le délai de mise en veille de l'écran
  }

  return (
    <motion.div
      key="battery"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <SectionTitle title={texts.battery} />

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 mr-4">
                <div className="relative w-full h-full">
                  <BatteryCharging className="w-full h-full text-gray-400" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium">85%</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium">{texts.battery}</h3>
                <p className="text-xs text-gray-500">
                  85% - {texts.charged} - 4:32 {texts.timeRemaining}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.showPercentInMenuBar}</span>
              <ToggleSwitch
                isEnabled={settingsState.showPercentInMenuBar}
                onChange={handleShowPercentInMenuBarToggle}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.powerSavingOptions}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.optimizeVideoStreaming}</span>
              <ToggleSwitch
                isEnabled={settingsState.optimizeVideoStreaming}
                onChange={handleOptimizeVideoStreamingToggle}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.enablePowerMode}</span>
              <ToggleSwitch isEnabled={settingsState.enablePowerMode} onChange={handleEnablePowerModeToggle} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{texts.turnOffDisplayAfter}</span>
              <select
                className="text-sm bg-gray-100 border-gray-200 rounded-md px-2 py-1"
                onChange={handleDisplaySleepTimeChange}
                defaultValue="10"
              >
                <option value="2">{texts.minutes2}</option>
                <option value="5">{texts.minutes5}</option>
                <option value="10">{texts.minutes10}</option>
                <option value="30">{texts.minutes30}</option>
                <option value="never">{texts.never}</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.usageHistory}</h3>
          </div>
          <div className="p-4">
            <div className="h-40 bg-gray-50 rounded-lg mb-4 p-3">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-500">{texts.last24Hours}</span>
                <span className="text-xs text-gray-500">{texts.batteryLevel}</span>
              </div>
              <div className="h-24 relative">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
                <div className="absolute bottom-6 left-0 right-0 h-px bg-gray-200"></div>
                <div className="absolute bottom-12 left-0 right-0 h-px bg-gray-200"></div>
                <div className="absolute bottom-18 left-0 right-0 h-px bg-gray-200"></div>
                <div className="absolute bottom-0 left-0 h-full w-px bg-gray-300"></div>

                {/* Simulated battery graph */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-100 to-green-50 opacity-50 rounded"></div>

                <div className="absolute bottom-0 left-0 right-0 h-px z-10">
                  <svg height="24" width="100%">
                    <path
                      d="M0,24 Q50,5 100,18 T200,12 T300,20 T400,15"
                      stroke="green"
                      fill="transparent"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{texts.averageUsage}</span>
                <span className="text-sm font-medium">12% {texts.perHour}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{texts.chargeCycles}</span>
                <span className="text-sm font-medium">124</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{texts.condition}</span>
                <span className="text-sm font-medium text-green-500">{texts.normal}</span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  )
}

export default BatterySettings
