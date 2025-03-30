"use client"

import type React from "react"
import { useMacOSWindow } from "./macos-window-provider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SystemPreferencesContent } from "./system-preferences-content"

export const SystemPreferencesDemo: React.FC = () => {
  const { createWindow, currentTheme, setTheme } = useMacOSWindow()

  const openSystemPreferences = () => {
    createWindow({
      title: "System Preferences",
      width: 700,
      height: 550,
      showNavigation: true,
      showSearch: true,
      content: <SystemPreferencesContent />,
      theme: currentTheme,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">macOS 2025</h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="theme-toggle">Mode sombre</Label>
          <Switch
            id="theme-toggle"
            checked={currentTheme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </div>

      <Button
        onClick={openSystemPreferences}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      >
        Ouvrir les Préférences Système
      </Button>
    </div>
  )
}

