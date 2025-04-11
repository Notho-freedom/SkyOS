"use client"
import { motion } from "framer-motion"
import { Shield, ShieldCheck, Globe, User, CalendarIcon, BellRing } from "lucide-react"
import { SectionTitle, SectionCard, ToggleSwitch } from "../components/UIComponents"
import { useTranslation } from "react-i18next"

// Icônes utilisées dans ce composant
const icons = {
  shield: <Shield />,
  shieldCheck: <ShieldCheck />,
  globe: <Globe />,
  user: <User />,
  calendar: <CalendarIcon />,
  bell: <BellRing />,
}

const SecuritySettings = ({ settingsState, updateSettings, contentVariants }) => {

  const { t } = useTranslation()

const texts = {
  security: t("parametre.security"),
  general: t("parametre.general"),
  requirePasswordAfterSleep: t("parametre.requirePasswordAfterSleep"),
  sleepInactivityNote: t("parametre.sleepInactivityNote"),
  allowAppDownloadedFrom: t("parametre.allowAppDownloadedFrom"),
  appStore: t("parametre.appStore"),
  identifiedDevelopers: t("parametre.identifiedDevelopers"),
  anywhere: t("parametre.anywhere"),
  fileVault: t("parametre.fileVault"),
  fileVaultEnabled: t("parametre.fileVaultEnabled"),
  diskEncrypted: t("parametre.diskEncrypted"),
  fileVaultDescription: t("parametre.fileVaultDescription"),
  firewall: t("parametre.firewall"),
  firewallOn: t("parametre.firewallOn"),
  firewallDescription: t("parametre.firewallDescription"),
  options: t("parametre.options"),
  privacy: t("parametre.privacy"),
  location: t("parametre.location"),
  contacts: t("parametre.contacts"),
  calendar: t("parametre.calendar"),
  notifications: t("parametre.notifications"),
  disabled: t("parametre.disabled"),
}

  // Fonction pour gérer l'exigence du mot de passe après la mise en veille
  const handleRequirePasswordAfterSleepToggle = (value) => {
    updateSettings("requirePasswordAfterSleep", value)
  }

  // Fonction pour gérer le changement de source de téléchargement des applications
  const handleAppDownloadSourceChange = (e) => {
    console.log(`App download source changed to: ${e.target.value}`)
    // Logique pour changer la source de téléchargement des applications
  }

  // Fonction pour désactiver FileVault
  const handleDisableFileVault = () => {
    updateSettings("fileVaultEnabled", false)
    console.log("FileVault disabled")
    // Logique pour désactiver FileVault
  }

  // Fonction pour ouvrir les options du pare-feu
  const handleOpenFirewallOptions = () => {
    console.log("Opening firewall options...")
    // Logique pour ouvrir les options du pare-feu
  }

  // Fonction pour ouvrir les paramètres de confidentialité
  const handleOpenPrivacySettings = (section) => {
    console.log(`Opening privacy settings for: ${section}`)
    // Logique pour ouvrir les paramètres de confidentialité
  }

  return (
    <motion.div
      key="security"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <SectionTitle title={texts.security} />

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.general}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm font-medium block mb-1">{texts.requirePasswordAfterSleep}</span>
                <span className="text-xs text-gray-500">{texts.sleepInactivityNote}</span>
              </div>
              <ToggleSwitch
                isEnabled={settingsState.requirePasswordAfterSleep}
                onChange={handleRequirePasswordAfterSleepToggle}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.allowAppDownloadedFrom}</span>
              <select
                className="text-sm bg-gray-100 border-gray-200 rounded-md px-2 py-1"
                onChange={handleAppDownloadSourceChange}
                defaultValue="identified"
              >
                <option value="appstore">{texts.appStore}</option>
                <option value="identified">{texts.identifiedDevelopers}</option>
                <option value="anywhere">{texts.anywhere}</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.fileVault}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm font-medium block mb-1">{texts.fileVaultEnabled}</span>
                <span className="text-xs text-gray-500">{texts.diskEncrypted}</span>
              </div>
              <motion.button
                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-xs font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDisableFileVault}
              >
                {texts.disabled}
              </motion.button>
            </div>
            <p className="text-xs text-gray-500">{texts.fileVaultDescription}</p>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.firewall}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm font-medium block mb-1">{texts.firewallOn}</span>
                <span className="text-xs text-gray-500">{texts.firewallDescription}</span>
              </div>
              <motion.button
                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-xs font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenFirewallOptions}
              >
                {texts.options}
              </motion.button>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.privacy}</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOpenPrivacySettings("location")}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">{texts.location}</span>
              </div>
              <div
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOpenPrivacySettings("contacts")}
              >
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">{texts.contacts}</span>
              </div>
              <div
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOpenPrivacySettings("calendar")}
              >
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <CalendarIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">{texts.calendar}</span>
              </div>
              <div
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOpenPrivacySettings("notifications")}
              >
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                  <BellRing className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">{texts.notifications}</span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  )
}

export default SecuritySettings
