"use client"
import { motion } from "framer-motion"
import { Wifi, WifiOff, Bluetooth, BluetoothOff, Globe } from "lucide-react"
import { SectionTitle, SectionCard, ToggleSwitch } from "../components/UIComponents"
import { useTranslation } from "react-i18next"

// Icônes utilisées dans ce composant
const icons = {
  wifi: <Wifi />,
  wifiOff: <WifiOff />,
  bluetooth: <Bluetooth />,
  bluetoothOff: <BluetoothOff />,
  globe: <Globe />,
}

const NetworkSettings = ({ settingsState, updateSettings, contentVariants }) => {
  // Fonction pour gérer le changement d'état du WiFi
  const handleWifiToggle = (value) => {
    updateSettings("wifi", value)
  }

  // Fonction pour gérer le changement d'état du Bluetooth
  const handleBluetoothToggle = (value) => {
    updateSettings("bluetooth", value)
  }

  // Fonction pour configurer le VPN
  const handleConfigureVPN = () => {
    console.log("Configuring VPN...")
    // Logique pour configurer le VPN
  }

  const { t } = useTranslation()

const texts = {
  network: t("parametre.network"),
  assistant: t("parametre.assistant"),
  wifiNetwork: t("parametre.wifiNetwork"),
  connected: t("parametre.connected"),
  disconnected: t("parametre.disconnected"),
  enabled: t("parametre.enabled"),
  disabled: t("parametre.disabled"),
  ipAddress: t("parametre.ipAddress"),
  subnetMask: t("parametre.subnetMask"),
  router: t("parametre.router"),
  dns: t("parametre.dns"),
  macAddress: t("parametre.macAddress"),
  bluetooth: t("parametre.bluetooth"),
  vpn: t("parametre.vpn"),
  notConfigured: t("parametre.notConfigured"),
  configure: t("parametre.configure"),
}

  return (
    <motion.div
      key="network"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <SectionTitle
          title={texts.network}
          action={
            <motion.button
              className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => console.log("Assistant clicked")}
            >
              {texts.assistant}
            </motion.button>
          }
        />

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  {settingsState.wifi ? (
                    <Wifi className="w-4 h-4 text-white" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium">{texts.wifiNetwork}</h3>
                  <p className="text-xs text-gray-500">
                    {settingsState.wifi ? `${texts.connected} • Home-Network` : texts.disconnected}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">
                  {settingsState.wifi ? texts.enabled : texts.disabled}
                </span>
                <ToggleSwitch isEnabled={settingsState.wifi} onChange={handleWifiToggle} />
              </div>
            </div>
          </div>
          <div className="p-4">
            {settingsState.wifi && (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{texts.ipAddress}</span>
                  <span className="text-sm font-medium">192.168.1.5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{texts.subnetMask}</span>
                  <span className="text-sm font-medium">255.255.255.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{texts.router}</span>
                  <span className="text-sm font-medium">192.168.1.1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{texts.dns}</span>
                  <span className="text-sm font-medium">8.8.8.8, 8.8.4.4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{texts.macAddress}</span>
                  <span className="text-sm font-medium">00:1B:44:11:3A:B7</span>
                </div>
              </div>
            )}
            {!settingsState.wifi && (
              <div className="flex justify-center items-center p-4">
                <div className="text-center">
                  <WifiOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">{texts.disconnected}</p>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                  {settingsState.bluetooth ? (
                    <Bluetooth className="w-4 h-4 text-white" />
                  ) : (
                    <BluetoothOff className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium">{texts.bluetooth}</h3>
                  <p className="text-xs text-gray-500">{settingsState.bluetooth ? texts.enabled : texts.disabled}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">
                  {settingsState.bluetooth ? texts.enabled : texts.disabled}
                </span>
                <ToggleSwitch isEnabled={settingsState.bluetooth} onChange={handleBluetoothToggle} />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{texts.vpn}</h3>
                  <p className="text-xs text-gray-500">{texts.notConfigured}</p>
                </div>
              </div>
              <motion.button
                className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-xs font-medium text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfigureVPN}
              >
                {texts.configure}
              </motion.button>
            </div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  )
}

export default NetworkSettings
