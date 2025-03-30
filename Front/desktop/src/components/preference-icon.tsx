"use client"

import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  SettingsIcon as LuSettings,
  MonitorIcon as LuMonitor,
  AnchorIcon as LuAnchor,
  LayoutListIcon as LuLayout,
  MicIcon as LuMic,
  SearchIcon as LuSearch,
  GlobeIcon as LuGlobe,
  BellIcon as LuBell,
  AtSignIcon as LuAtSign,
  WalletIcon as LuWallet,
  FingerprintIcon as LuFingerprint,
  UsersIcon as LuUsers,
  AccessibilityIcon as LuAccessibility,
  ClockIcon as LuClock,
  PuzzleIcon as LuPuzzle,
  ShieldIcon as LuShield,
  RefreshCwIcon as LuRefreshCw,
  WifiIcon as LuWifi,
  BluetoothIcon as LuBluetooth,
  Volume2Icon as LuVolume2,
  PrinterIcon as LuPrinter,
  KeyboardIcon as LuKeyboard,
  MouseIcon as LuMouse,
  LightbulbIcon as LuLightbulb,
  CalendarClockIcon as LuCalendarClock,
  Share2Icon as LuShare2,
  LayersIcon as LuLayers,
} from "lucide-react"

interface PreferenceIconProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

export const PreferenceIcon: React.FC<PreferenceIconProps> = ({ icon, label, onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex flex-col items-center justify-center gap-2 p-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            onClick={onClick}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-500 text-white shadow-sm">
              {icon}
            </div>
            <div className="text-xs text-center max-w-[70px] line-clamp-2">{label}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const getPreferenceIcons = (openSubPreference: (title: string) => void) => [
  {
    icon: <LuSettings size={24} />,
    label: "General",
    onClick: () => openSubPreference("General"),
  },
  {
    icon: <LuMonitor size={24} />,
    label: "Desktop & Screen Saver",
    onClick: () => openSubPreference("Desktop & Screen Saver"),
  },
  {
    icon: <LuAnchor size={24} />,
    label: "Dock",
    onClick: () => openSubPreference("Dock"),
  },
  {
    icon: <LuLayout size={24} />,
    label: "Mission Control",
    onClick: () => openSubPreference("Mission Control"),
  },
  {
    icon: <LuMic size={24} />,
    label: "Siri",
    onClick: () => openSubPreference("Siri"),
  },
  {
    icon: <LuSearch size={24} />,
    label: "Spotlight",
    onClick: () => openSubPreference("Spotlight"),
  },
  {
    icon: <LuGlobe size={24} />,
    label: "Language & Region",
    onClick: () => openSubPreference("Language & Region"),
  },
  {
    icon: <LuBell size={24} />,
    label: "Notifications",
    onClick: () => openSubPreference("Notifications"),
  },
  {
    icon: <LuAtSign size={24} />,
    label: "Internet Accounts",
    onClick: () => openSubPreference("Internet Accounts"),
  },
  {
    icon: <LuWallet size={24} />,
    label: "Wallet & Apple Pay",
    onClick: () => openSubPreference("Wallet & Apple Pay"),
  },
  {
    icon: <LuFingerprint size={24} />,
    label: "Touch ID",
    onClick: () => openSubPreference("Touch ID"),
  },
  {
    icon: <LuUsers size={24} />,
    label: "Users & Groups",
    onClick: () => openSubPreference("Users & Groups"),
  },
  {
    icon: <LuAccessibility size={24} />,
    label: "Accessibility",
    onClick: () => openSubPreference("Accessibility"),
  },
  {
    icon: <LuClock size={24} />,
    label: "Screen Time",
    onClick: () => openSubPreference("Screen Time"),
  },
  {
    icon: <LuPuzzle size={24} />,
    label: "Extensions",
    onClick: () => openSubPreference("Extensions"),
  },
  {
    icon: <LuShield size={24} />,
    label: "Security & Privacy",
    onClick: () => openSubPreference("Security & Privacy"),
  },
  {
    icon: <LuRefreshCw size={24} />,
    label: "Software Update",
    onClick: () => openSubPreference("Software Update"),
  },
  {
    icon: <LuWifi size={24} />,
    label: "Network",
    onClick: () => openSubPreference("Network"),
  },
  {
    icon: <LuBluetooth size={24} />,
    label: "Bluetooth",
    onClick: () => openSubPreference("Bluetooth"),
  },
  {
    icon: <LuVolume2 size={24} />,
    label: "Sound",
    onClick: () => openSubPreference("Sound"),
  },
  {
    icon: <LuPrinter size={24} />,
    label: "Printers & Scanners",
    onClick: () => openSubPreference("Printers & Scanners"),
  },
  {
    icon: <LuKeyboard size={24} />,
    label: "Keyboard",
    onClick: () => openSubPreference("Keyboard"),
  },
  {
    icon: <LuMouse size={24} />,
    label: "Mouse",
    onClick: () => openSubPreference("Mouse"),
  },
  {
    icon: <LuMonitor size={24} />,
    label: "Displays",
    onClick: () => openSubPreference("Displays"),
  },
  {
    icon: <LuLayers size={24} />,
    label: "Sidecar",
    onClick: () => openSubPreference("Sidecar"),
  },
  {
    icon: <LuLightbulb size={24} />,
    label: "Energy Saver",
    onClick: () => openSubPreference("Energy Saver"),
  },
  {
    icon: <LuCalendarClock size={24} />,
    label: "Date & Time",
    onClick: () => openSubPreference("Date & Time"),
  },
  {
    icon: <LuShare2 size={24} />,
    label: "Sharing",
    onClick: () => openSubPreference("Sharing"),
  },
]

