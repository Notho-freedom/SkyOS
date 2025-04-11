"use client"

import React from "react"
import { motion } from "framer-motion"
import { User, Users, UserPlus, Settings, Key, Lock, Shield } from "lucide-react"
import { SectionTitle, SectionCard, ToggleSwitch } from "../components/UIComponents"
import { useTranslation } from "react-i18next"


// Icônes utilisées dans ce composant
const icons = {
  user: <User />,
  users: <Users />,
  userPlus: <UserPlus />,
  settings: <Settings />,
  key: <Key />,
  lock: <Lock />,
  shield: <Shield />,
}

const UserSettings = ({ settingsState, updateSettings, contentVariants }) => {
  
  const { t } = useTranslation()

  const texts = {
    users: t("parametre.users"),
    currentUser: t("parametre.currentUser"),
    admin: t("parametre.admin"),
    loginItems: t("parametre.loginItems"),
    loginItemsDescription: t("parametre.loginItemsDescription"),
    passwordSettings: t("parametre.passwordSettings"),
    changePassword: t("parametre.changePassword"),
    requirePasswordAfterSleep: t("parametre.requirePasswordAfterSleep"),
    automaticLogin: t("parametre.automaticLogin"),
    guestUser: t("parametre.guestUser"),
    guestUserDescription: t("parametre.guestUserDescription"),
    otherUsers: t("parametre.otherUsers"),
    addUser: t("parametre.addUser"),
    loginOptions: t("parametre.loginOptions"),
    showUserList: t("parametre.showUserList"),
    showHints: t("parametre.showHints"),
    showRestartButtons: t("parametre.showRestartButtons"),
    fastUserSwitching: t("parametre.fastUserSwitching"),
    fastUserSwitchingDescription: t("parametre.fastUserSwitchingDescription"),
  }

  // État local pour les paramètres utilisateur
  const [userSettings, setUserSettings] = React.useState({
    requirePasswordAfterSleep: true,
    automaticLogin: false,
    guestUser: false,
    showUserList: true,
    showHints: false,
    showRestartButtons: true,
    fastUserSwitching: true,
  })

  // Fonction pour mettre à jour les paramètres utilisateur
  const updateUserSetting = (key, value) => {
    setUserSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Fonction pour changer le mot de passe
  const handleChangePassword = () => {
    console.log("Changing password...")
    // Logique pour changer le mot de passe
  }

  // Fonction pour ajouter un utilisateur
  const handleAddUser = () => {
    console.log("Adding user...")
    // Logique pour ajouter un utilisateur
  }

  return (
    <motion.div
      key="users"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <SectionTitle title={texts.users} />

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.currentUser}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-medium">John Doe</h4>
                <p className="text-xs text-gray-500">{texts.admin}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-3">{texts.loginItems}</h4>
              <p className="text-xs text-gray-500 mb-3">{texts.loginItemsDescription}</p>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                      <Settings className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm">System Preferences</span>
                  </div>
                  <button className="text-xs text-red-500">Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.passwordSettings}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.changePassword}</span>
              <motion.button
                className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-xs font-medium text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleChangePassword}
              >
                Modifier
              </motion.button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.requirePasswordAfterSleep}</span>
              <ToggleSwitch
                isEnabled={userSettings.requirePasswordAfterSleep}
                onChange={(value) => updateUserSetting("requirePasswordAfterSleep", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{texts.automaticLogin}</span>
              <ToggleSwitch
                isEnabled={userSettings.automaticLogin}
                onChange={(value) => updateUserSetting("automaticLogin", value)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{texts.guestUser}</h3>
              <ToggleSwitch
                isEnabled={userSettings.guestUser}
                onChange={(value) => updateUserSetting("guestUser", value)}
              />
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-500">{texts.guestUserDescription}</p>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{texts.otherUsers}</h3>
              <motion.button
                className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-xs font-medium text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddUser}
              >
                {texts.addUser}
              </motion.button>
            </div>
          </div>
          <div className="p-4">
            <div className="text-center text-sm text-gray-500 py-4">Aucun autre utilisateur</div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.loginOptions}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.showUserList}</span>
              <ToggleSwitch
                isEnabled={userSettings.showUserList}
                onChange={(value) => updateUserSetting("showUserList", value)}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.showHints}</span>
              <ToggleSwitch
                isEnabled={userSettings.showHints}
                onChange={(value) => updateUserSetting("showHints", value)}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.showRestartButtons}</span>
              <ToggleSwitch
                isEnabled={userSettings.showRestartButtons}
                onChange={(value) => updateUserSetting("showRestartButtons", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium block">{texts.fastUserSwitching}</span>
                <span className="text-xs text-gray-500">{texts.fastUserSwitchingDescription}</span>
              </div>
              <ToggleSwitch
                isEnabled={userSettings.fastUserSwitching}
                onChange={(value) => updateUserSetting("fastUserSwitching", value)}
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  )
}

export default UserSettings
