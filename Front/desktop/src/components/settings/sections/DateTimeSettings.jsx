"use client"

import React from "react"
import { motion } from "framer-motion"
import { Clock, Calendar, Globe, Sun, Moon } from "lucide-react"
import { SectionTitle, SectionCard, ToggleSwitch } from "../components/UIComponents"
import { useTranslation } from "react-i18next"

// Icônes utilisées dans ce composant
const icons = {
  clock: <Clock />,
  calendar: <Calendar />,
  globe: <Globe />,
  sun: <Sun />,
  moon: <Moon />,
}

const DateTimeSettings = ({ settingsState, updateSettings, contentVariants }) => {
  // État local pour les paramètres de date et d'heure
  const [dateTimeSettings, setDateTimeSettings] = React.useState({
    setAutomatically: true,
    timeZone: "Europe/Paris",
    use24Hour: true,
    showDayOfWeek: true,
    showDate: true,
    showAmPm: false,
    showSeconds: false,
    announceTime: false,
    announceInterval: "never",
  })

  // Fonction pour mettre à jour les paramètres de date et d'heure
  const updateDateTimeSetting = (key, value) => {
    setDateTimeSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Fonction pour gérer le changement de fuseau horaire
  const handleTimeZoneChange = (e) => {
    updateDateTimeSetting("timeZone", e.target.value)
  }

  // Fonction pour gérer le changement d'intervalle d'annonce
  const handleAnnounceIntervalChange = (e) => {
    updateDateTimeSetting("announceInterval", e.target.value)
  }

  const { t } = useTranslation()

const texts = {
  dateTime: t("parametre.dateTime"),
  setAutomatically: t("parametre.setAutomatically"),
  timeZone: t("parametre.timeZone"),
  currentTimeZone: t("parametre.currentTimeZone"),
  closestCity: t("parametre.closestCity"),
  dateFormat: t("parametre.dateFormat"),
  timeFormat: t("parametre.timeFormat"),
  use24Hour: t("parametre.use24Hour"),
  showDayOfWeek: t("parametre.showDayOfWeek"),
  showDate: t("parametre.showDate"),
  showAmPm: t("parametre.showAmPm"),
  showSeconds: t("parametre.showSeconds"),
  menuBarClock: t("parametre.menuBarClock"),
  announce: t("parametre.announce"),
  announceInterval: t("parametre.announceInterval"),
  never: t("parametre.never"),
  hourly: t("parametre.hourly"),
  halfHourly: t("parametre.halfHourly"),
  quarterly: t("parametre.quarterly"),
}

  return (
    <motion.div
      key="dateTime"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <SectionTitle title={texts.dateTime} />

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{texts.setAutomatically}</h3>
              <ToggleSwitch
                isEnabled={dateTimeSettings.setAutomatically}
                onChange={(value) => updateDateTimeSetting("setAutomatically", value)}
              />
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.timeZone}</span>
              <select
                className="text-sm bg-gray-100 border-gray-200 rounded-md px-2 py-1"
                value={dateTimeSettings.timeZone}
                onChange={handleTimeZoneChange}
                disabled={dateTimeSettings.setAutomatically}
              >
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Australia/Sydney">Australia/Sydney</option>
              </select>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Globe className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium">{texts.currentTimeZone}</span>
              </div>
              <p className="text-sm ml-7">
                {dateTimeSettings.timeZone === "Europe/Paris"
                  ? "Paris, France (GMT+1)"
                  : dateTimeSettings.timeZone === "America/New_York"
                    ? "New York, USA (GMT-5)"
                    : dateTimeSettings.timeZone === "Asia/Tokyo"
                      ? "Tokyo, Japon (GMT+9)"
                      : "Sydney, Australie (GMT+10)"}
              </p>
              <p className="text-xs text-gray-500 ml-7 mt-1">{texts.closestCity}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.dateFormat}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm">
                  {new Date().toLocaleDateString(dateTimeSettings.use24Hour ? "fr-FR" : "en-US")}
                </span>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.timeFormat}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.use24Hour}</span>
              <ToggleSwitch
                isEnabled={dateTimeSettings.use24Hour}
                onChange={(value) => updateDateTimeSetting("use24Hour", value)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.menuBarClock}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.showDayOfWeek}</span>
              <ToggleSwitch
                isEnabled={dateTimeSettings.showDayOfWeek}
                onChange={(value) => updateDateTimeSetting("showDayOfWeek", value)}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.showDate}</span>
              <ToggleSwitch
                isEnabled={dateTimeSettings.showDate}
                onChange={(value) => updateDateTimeSetting("showDate", value)}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.showAmPm}</span>
              <ToggleSwitch
                isEnabled={dateTimeSettings.showAmPm}
                onChange={(value) => updateDateTimeSetting("showAmPm", value)}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.showSeconds}</span>
              <ToggleSwitch
                isEnabled={dateTimeSettings.showSeconds}
                onChange={(value) => updateDateTimeSetting("showSeconds", value)}
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">{texts.announce}</span>
                <ToggleSwitch
                  isEnabled={dateTimeSettings.announceTime}
                  onChange={(value) => updateDateTimeSetting("announceTime", value)}
                />
              </div>
              {dateTimeSettings.announceTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">{texts.announceInterval}</span>
                  <select
                    className="text-sm bg-gray-100 border-gray-200 rounded-md px-2 py-1"
                    value={dateTimeSettings.announceInterval}
                    onChange={handleAnnounceIntervalChange}
                  >
                    <option value="never">{texts.never}</option>
                    <option value="hourly">{texts.hourly}</option>
                    <option value="halfHourly">{texts.halfHourly}</option>
                    <option value="quarterly">{texts.quarterly}</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  )
}

export default DateTimeSettings
