"use client"

import type React from "react"
import { useMacOSWindow } from "./macos-window-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PreferenceIcon, getPreferenceIcons } from "./preference-icon"

export const SystemPreferencesContent: React.FC = () => {
  const { createWindow } = useMacOSWindow()

  const openSubPreference = (title: string) => {
    createWindow({
      title: title,
      width: 600,
      height: 450,
      content: (
        <div className="p-4">
          <h2 className="text-lg font-medium mb-4">{title} Settings</h2>
          <p>This is a demo of the {title} preferences panel.</p>
        </div>
      ),
    })
  }

  const preferenceIcons = getPreferenceIcons(openSubPreference)

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b">
          <Avatar className="w-16 h-16 border">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>ID</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">Sign in to your Apple ID</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Set up iCloud, the App Store and more.</p>
          </div>
          <Button variant="outline" className="ml-auto whitespace-nowrap">
            Sign In
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {preferenceIcons.map((item, index) => (
          <PreferenceIcon key={index} icon={item.icon} label={item.label} onClick={item.onClick} />
        ))}
      </div>
    </div>
  )
}

