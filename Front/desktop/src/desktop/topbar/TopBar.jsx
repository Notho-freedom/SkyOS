"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { 
  FaApple, FaWifi, FaBluetooth, FaVolumeUp, FaBatteryFull, 
  FaSearch, FaPlay, FaForward, FaBackward, FaPause,
  FaMoon, FaSun
} from "react-icons/fa"
import { 
  MdAirplanemodeActive, MdBrightnessMedium, 
  MdKeyboard, MdCast
} from "react-icons/md"
import { useTheme } from "./../../theme/ThemeContext"
import { useApp } from "../AppContext"
import { useContextMenu } from "../contextual_menu/ContextMenuContext"

const TopBar = () => {
  const { t } = useTranslation()
  const { theme, toggleDarkMode } = useTheme()
  const [activeMenu, setActiveMenu] = useState(null)
  const [controlCenterOpen, setControlCenterOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const dropdownRefs = useRef({})
  const controlCenterRef = useRef(null)
  const {top, setTop, setShowDock} = useApp();
  const { showContextMenu } = useContextMenu();

  // Control Center states
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [airDropMode, setAirDropMode] = useState("Contacts Only")
  const [keyboardBrightness, setKeyboardBrightness] = useState(75)
  const [displayBrightness, setDisplayBrightness] = useState(80)
  const [soundVolume, setSoundVolume] = useState(50)
  const [isPlaying, setIsPlaying] = useState(false)
  const [airPlaySearching, setAirPlaySearching] = useState(true)

  // Update time and date every minute
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !dropdownRefs.current[activeMenu]?.contains(event.target)) {
        setActiveMenu(null)
      }
      
      if (controlCenterOpen && controlCenterRef.current && !controlCenterRef.current.contains(event.target)) {
        setControlCenterOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [activeMenu, controlCenterOpen])

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName)
    setControlCenterOpen(false)
  }

  const toggleControlCenter = () => {
    setControlCenterOpen(!controlCenterOpen)
    setActiveMenu(null)
  }

  // Control Center functions
  const toggleWifi = () => setWifiEnabled(!wifiEnabled)
  const toggleBluetooth = () => setBluetoothEnabled(!bluetoothEnabled)
  const cycleAirDropMode = () => {
    const modes = ["Off", "Contacts Only", "Everyone"]
    setAirDropMode(modes[(modes.indexOf(airDropMode) + 1) % modes.length])
  }
  const adjustSetting = (setting, value) => Math.min(100, Math.max(0, setting + value))
  const togglePlayPause = () => setIsPlaying(!isPlaying)
  const toggleAirPlay = () => setAirPlaySearching(!airPlaySearching)

  const menuItems = useMemo(() => [
    {
      name: "",
      icon: <FaApple className="text-white" />,
      items: [
        { label: t("menu.About This Mac") },
        { separator: true },
        { label: t("menu.System Settings...") },
        { label: t("menu.App Store...") },
        { separator: true },
        { label: t("menu.Recent Items") },
        { separator: true },
        { label: t("menu.Force Quit...") },
        { separator: true },
        { label: t("menu.Sleep") },
        { label: t("menu.Restart...") },
        { label: t("menu.Shut Down...") },
        { separator: true },
        { label: t("menu.Lock Screen") },
        { label: t("menu.Log Out...") },
      ],
    },
    /*{
      name: t("menu.Finder"),
      items: [
        { label: t("menu.New Finder Window") },
        { label: t("menu.New Folder") },
        { separator: true },
        { label: t("menu.Find") },
        { separator: true },
        { label: t("menu.Empty Trash") },
      ],
    },
    {
      name: t("menu.File"),
      items: [
        { label: t("menu.New Window") },
        { label: t("menu.New Folder") },
        { separator: true },
        { label: t("menu.Open") },
        { label: t("menu.Close Window") },
      ],
    },
    {
      name: t("menu.Edit"),
      items: [
        { label: t("menu.Undo") },
        { label: t("menu.Redo") },
        { separator: true },
        { label: t("menu.Cut") },
        { label: t("menu.Copy") },
        { label: t("menu.Paste") },
      ],
    },
    {
      name: t("menu.View"),
      items: [
        { label: t("menu.as Icons") },
        { label: t("menu.as List") },
        { label: t("menu.as Columns") },
        { label: t("menu.as Gallery") },
      ],
    },
    {
      name: t("menu.Go"),
      items: [
        { label: t("menu.Back") },
        { label: t("menu.Forward") },
        { separator: true },
        { label: t("menu.Computer") },
        { label: t("menu.Home") },
      ],
    },
    {
      name: t("menu.Window"),
      items: [
        { label: t("menu.Minimize") },
        { label: t("menu.Zoom") },
        { separator: true },
        { label: t("menu.Bring All to Front") },
      ],
    },
    {
      name: t("menu.Help"),
      items: [
        { label: t("menu.macOS Help") }
      ],
    },*/
  ], [t])

  const handleTopBarContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    let state = top=='top'? 'bottom':'top';
  
    const menuItems = [
      {
        label: `Move to ${state}`,
        action: () => {
          setTop(state);
        },
      },
      { separator: true },
      {
        label: "Show Dock",
        action: () => {
          setShowDock(true);
        },
      }
    ];

    showContextMenu(menuItems, { x: e.clientX, y: e.clientY });
  }, [showContextMenu, top]);


  return (
    <div
      onContextMenu={(e)=>handleTopBarContextMenu(e)}
      className={`fixed ${top}-0 left-0 right-0 h-7 flex items-center px-2 justify-between text-xs font-medium z-50 text-white`}
      style={{
        background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`
      }}
    >
      {/* Left side - Menu items */}
      <div className="flex items-center space-x-4">
        {menuItems.map((menu) => (
          <div key={menu.name || "apple"} className="relative" ref={(el) => (dropdownRefs.current[menu.name] = el)}>
            <button
              className={`px-1.5 py-0.5 rounded hover:bg-white hover:bg-opacity-20 ${
                activeMenu === menu.name ? "bg-white bg-opacity-30" : ""
              }`}
              onClick={() => toggleMenu(menu.name)}
            >
              {menu.icon || menu.name}
            </button>

            {activeMenu === menu.name && (
              <div className={`absolute left-0 ${top}-full mt-1 bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-md shadow-lg min-w-40 py-1 border border-gray-700 z-50 text-white`}>
                {menu.items.map((item, idx) =>
                  item.separator ? (
                    <div key={`sep-${idx}`} className="my-1 h-px bg-gray-600" />
                  ) : (
                    <div
                      key={item.label}
                      className="px-3 py-1 text-sm cursor-default hover:bg-blue-500"
                    >
                      {item.label}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right side - Status icons and Control Center */}
      <div className="flex items-center space-x-3 right-0">
        {/* Theme toggle button */}
        <button 
          onClick={toggleDarkMode}
          className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
          aria-label="Toggle dark mode"
        >
          {theme.name === "dark" ? (
            <FaSun className="h-3 w-3" />
          ) : (
            <FaMoon className="h-3 w-3" />
          )}
        </button>

        <div className="relative" ref={controlCenterRef}>
          <button 
            onClick={toggleControlCenter}
            className={`flex items-center space-x-2 px-1.5 py-0.5 rounded ${
              controlCenterOpen ? "bg-white bg-opacity-30" : "hover:bg-white hover:bg-opacity-20"
            }`}
          >
            <FaWifi className={`h-3 w-3 ${!wifiEnabled && "opacity-50"}`} />
            <FaBluetooth className={`h-3 w-3 ${!bluetoothEnabled && "opacity-50"}`} />
            <FaVolumeUp className="h-3 w-3" />
            <div className="flex items-center">
              <FaBatteryFull className="h-3.5 w-3.5 mr-0.5" />
              <span>78%</span>
            </div>
          </button>
          
          {/* Control Center Dropdown */}
          {controlCenterOpen && (
  <div 
    className="absolute right-0 ${top}-full mt-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl w-80 p-4 z-50 text-black dark:text-white border border-gray-200/30 dark:border-gray-700/30 overflow-hidden"
    style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
  >
    {/* Subtle background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 pointer-events-none" />
    
    <div className="relative grid grid-cols-2 gap-3">
      {/* First row - Connectivity */}
      <button 
        onClick={toggleWifi}
        className={`rounded-xl p-3 flex items-center space-x-3 transition-all duration-300 ${
          wifiEnabled 
            ? "bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30" 
            : "bg-gray-100/80 dark:bg-gray-700/30 border border-gray-200/50 dark:border-gray-600/30"
        }`}
      >
        <div className={`rounded-full p-2 transition-colors ${
          wifiEnabled ? "bg-blue-500 dark:bg-blue-600" : "bg-gray-400 dark:bg-gray-500"
        }`}>
          <FaWifi className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="font-medium text-sm">Wi-Fi</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {wifiEnabled ? "Connected" : "Off"}
          </div>
        </div>
      </button>
      
      <button 
        onClick={toggleBluetooth}
        className={`rounded-xl p-3 flex items-center space-x-3 transition-all duration-300 ${
          bluetoothEnabled 
            ? "bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30" 
            : "bg-gray-100/80 dark:bg-gray-700/30 border border-gray-200/50 dark:border-gray-600/30"
        }`}
      >
        <div className={`rounded-full p-2 transition-colors ${
          bluetoothEnabled ? "bg-blue-500 dark:bg-blue-600" : "bg-gray-400 dark:bg-gray-500"
        }`}>
          <FaBluetooth className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="font-medium text-sm">Bluetooth</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {bluetoothEnabled ? "On" : "Off"}
          </div>
        </div>
      </button>
      
      {/* Second row */}
      <button 
        onClick={cycleAirDropMode}
        className="bg-blue-50/80 dark:bg-blue-900/20 rounded-xl p-3 flex items-center space-x-3 border border-blue-200/50 dark:border-blue-700/30 transition-all duration-300"
      >
        <div className="bg-blue-500 dark:bg-blue-600 rounded-full p-2">
          <MdAirplanemodeActive className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="font-medium text-sm">AirDrop</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{airDropMode}</div>
        </div>
      </button>
      
      <div className="bg-gray-100/80 dark:bg-gray-700/30 rounded-xl p-3 flex flex-col border border-gray-200/50 dark:border-gray-600/30">
        <div className="font-medium text-sm mb-2">Keyboard</div>
        <div className="flex items-center">
          <MdKeyboard className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
          <div className="relative flex-1 h-2 bg-gray-200/70 dark:bg-gray-600/40 backdrop-blur-sm rounded-full overflow-hidden border border-gray-300/20 dark:border-gray-500/20 shadow-inner">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-400/90 to-gray-500/90 dark:from-gray-400/80 dark:to-gray-500/80 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${keyboardBrightness}%` }}
            ></div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white dark:bg-gray-200 rounded-full shadow-md border border-gray-200/50 transition-all duration-300 ease-out"
              style={{ left: `calc(${keyboardBrightness}% - 6px)` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Third row - Display */}
      <div className="col-span-2 bg-gray-100/80 dark:bg-gray-700/30 rounded-xl p-3 flex flex-col border border-gray-200/50 dark:border-gray-600/30">
        <div className="font-medium text-sm mb-2">Display</div>
        <div className="flex items-center space-x-3">
          <MdBrightnessMedium className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          
          <div className="relative flex-1 h-6 bg-gray-200/70 dark:bg-gray-600/40 backdrop-blur-sm rounded-full overflow-hidden border border-gray-300/20 dark:border-gray-500/20 shadow-inner">
            {/* Track fill with gradient */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400/90 to-blue-500/90 dark:from-blue-500/80 dark:to-blue-600/80 rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${displayBrightness}%` }}
            ></div>
            
            {/* Slider knob */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white dark:bg-gray-200 rounded-full shadow-md border border-gray-200/50 transition-all duration-300 ease-out"
              style={{ left: `calc(${displayBrightness}% - 10px)` }}
            ></div>
            
            {/* Subtle tick marks for visual reference */}
            <div className="absolute inset-0 flex justify-between px-2 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-full w-px bg-gray-400/20 dark:bg-gray-500/20"></div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setDisplayBrightness(adjustSetting(displayBrightness, -10))}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Decrease brightness"
            >
              <span className="text-gray-600 dark:text-gray-300">–</span>
            </button>
            <button 
              onClick={() => setDisplayBrightness(adjustSetting(displayBrightness, 10))}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Increase brightness"
            >
              <span className="text-gray-600 dark:text-gray-300">+</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Fourth row - Sound */}
      <div className="col-span-2 bg-gray-100/80 dark:bg-gray-700/30 rounded-xl p-3 flex flex-col border border-gray-200/50 dark:border-gray-600/30">
        <div className="font-medium text-sm mb-2">Sound</div>
        <div className="flex items-center space-x-3">
          <FaVolumeUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          
          <div className="relative flex-1 h-6 bg-gray-200/70 dark:bg-gray-600/40 backdrop-blur-sm rounded-full overflow-hidden border border-gray-300/20 dark:border-gray-500/20 shadow-inner">
            {/* Track fill with gradient */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400/90 to-green-500/90 dark:from-green-500/80 dark:to-green-600/80 rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${soundVolume}%` }}
            ></div>
            
            {/* Slider knob */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white dark:bg-gray-200 rounded-full shadow-md border border-gray-200/50 transition-all duration-300 ease-out"
              style={{ left: `calc(${soundVolume}% - 10px)` }}
            ></div>
            
            {/* Subtle tick marks for visual reference */}
            <div className="absolute inset-0 flex justify-between px-2 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-full w-px bg-gray-400/20 dark:bg-gray-500/20"></div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setSoundVolume(adjustSetting(soundVolume, -10))}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Decrease volume"
            >
              <span className="text-gray-600 dark:text-gray-300">–</span>
            </button>
            <button 
              onClick={() => setSoundVolume(adjustSetting(soundVolume, 10))}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Increase volume"
            >
              <span className="text-gray-600 dark:text-gray-300">+</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Music player */}
      <div className="col-span-2 bg-gray-100/80 dark:bg-gray-700/30 rounded-xl p-3 flex items-center border border-gray-200/50 dark:border-gray-600/30 overflow-hidden relative group">
        {/* Background hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-89lZj7CEijR5BgS9iFFmVHJUxEcUKL.png" 
          alt="Album cover" 
          className="h-14 w-14 rounded-lg object-cover mr-3 shadow-md transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="flex-1">
          <div className="font-medium text-sm">Alicia Keys</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">No One</div>
          <div className="mt-2 flex items-center space-x-4">
            <button 
              onClick={() => console.log("Previous track")}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <FaBackward className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={togglePlayPause}
              className="w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isPlaying ? (
                <FaPause className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
              ) : (
                <FaPlay className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300 ml-0.5" />
              )}
            </button>
            <button 
              onClick={() => console.log("Next track")}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <FaForward className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* AirPlay */}
      <button 
        onClick={toggleAirPlay}
        className="col-span-2 bg-gray-100/80 dark:bg-gray-700/30 rounded-xl p-3 flex items-center space-x-3 border border-gray-200/50 dark:border-gray-600/30 transition-all duration-300 hover:bg-gray-200/50 dark:hover:bg-gray-600/30"
      >
        <div className={`rounded-full p-2 transition-colors ${
          airPlaySearching ? "bg-blue-500 dark:bg-blue-600" : "bg-gray-400 dark:bg-gray-500"
        }`}>
          <MdCast className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="font-medium text-sm">AirPlay</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {airPlaySearching ? "Looking for displays..." : "Ready to connect"}
          </div>
        </div>
      </button>
    </div>
  </div>
)}
        </div>

        {/* Date and time */}
        <div className="flex items-center space-x-2">
          <span>{currentDate}</span>
          <span>{currentTime}</span>
          <button className="hover:bg-white hover:bg-opacity-20 rounded p-1">
            <FaSearch className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopBar