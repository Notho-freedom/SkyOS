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
              className={`absolute right-0 ${top}-full mt-1 bg-gray-200 bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl w-72 p-3 z-50 text-black`}
              style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
            >
              <div className="grid grid-cols-2 gap-2">
                {/* First row */}
                <button 
                  onClick={toggleWifi}
                  className={`rounded-lg p-2 flex items-center space-x-2 ${
                    wifiEnabled ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <div className={`rounded-full p-1.5 ${
                    wifiEnabled ? "bg-blue-500" : "bg-gray-400"
                  }`}>
                    <FaWifi className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Wi-Fi</div>
                    <div className="text-xs text-gray-600">
                      {wifiEnabled ? "Active" : "Inactive"}
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={toggleBluetooth}
                  className={`rounded-lg p-2 flex items-center space-x-2 ${
                    bluetoothEnabled ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <div className={`rounded-full p-1.5 ${
                    bluetoothEnabled ? "bg-blue-500" : "bg-gray-400"
                  }`}>
                    <FaBluetooth className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Bluetooth</div>
                    <div className="text-xs text-gray-600">
                      {bluetoothEnabled ? "On" : "Off"}
                    </div>
                  </div>
                </button>
                
                {/* Second row */}
                <button 
                  onClick={cycleAirDropMode}
                  className="bg-blue-100 rounded-lg p-2 flex items-center space-x-2"
                >
                  <div className="bg-blue-500 rounded-full p-1.5">
                    <MdAirplanemodeActive className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">AirDrop</div>
                    <div className="text-xs text-gray-600">{airDropMode}</div>
                  </div>
                </button>
                
                <div className="bg-gray-100 rounded-lg p-2 flex flex-col">
                  <div className="font-medium mb-1">Keyboard Brightness</div>
                  <div className="flex items-center">
                    <MdKeyboard className="h-4 w-4 mr-2 text-gray-600" />
                    <div className="h-1.5 flex-1 bg-gray-300 rounded-full">
                      <div 
                        className="h-full bg-gray-500 rounded-full" 
                        style={{ width: `${keyboardBrightness}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 flex space-x-1">
                      <button 
                        onClick={() => setKeyboardBrightness(adjustSetting(keyboardBrightness, -10))}
                        className="text-xs px-1 rounded hover:bg-gray-200"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => setKeyboardBrightness(adjustSetting(keyboardBrightness, 10))}
                        className="text-xs px-1 rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Third row */}
                <div className="col-span-2 bg-gray-100 rounded-lg p-2 flex flex-col">
                  <div className="font-medium mb-1">Display</div>
                  <div className="flex items-center">
                    <MdBrightnessMedium className="h-4 w-4 mr-2 text-gray-600" />
                    <div className="h-1.5 flex-1 bg-gray-300 rounded-full">
                      <div 
                        className="h-full bg-gray-500 rounded-full" 
                        style={{ width: `${displayBrightness}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 flex space-x-1">
                      <button 
                        onClick={() => setDisplayBrightness(adjustSetting(displayBrightness, -10))}
                        className="text-xs px-1 rounded hover:bg-gray-200"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => setDisplayBrightness(adjustSetting(displayBrightness, 10))}
                        className="text-xs px-1 rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Fourth row */}
                <div className="col-span-2 bg-gray-100 rounded-lg p-2 flex flex-col">
                  <div className="font-medium mb-1">Sound</div>
                  <div className="flex items-center">
                    <FaVolumeUp className="h-4 w-4 mr-2 text-gray-600" />
                    <div className="h-1.5 flex-1 bg-gray-300 rounded-full">
                      <div 
                        className="h-full bg-gray-500 rounded-full" 
                        style={{ width: `${soundVolume}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 flex space-x-1">
                      <button 
                        onClick={() => setSoundVolume(adjustSetting(soundVolume, -10))}
                        className="text-xs px-1 rounded hover:bg-gray-200"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => setSoundVolume(adjustSetting(soundVolume, 10))}
                        className="text-xs px-1 rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Music player */}
                <div className="col-span-2 bg-gray-100 rounded-lg p-2 flex items-center">
                  <img 
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-89lZj7CEijR5BgS9iFFmVHJUxEcUKL.png" 
                    alt="Album cover" 
                    className="h-12 w-12 rounded object-cover mr-2" 
                  />
                  <div className="flex-1">
                    <div className="font-medium">Alicia Keys</div>
                    <div className="flex mt-1 space-x-3">
                      <button 
                        onClick={() => console.log("Previous track")}
                        className="hover:text-gray-800"
                      >
                        <FaBackward className="h-3 w-3 text-gray-600" />
                      </button>
                      <button 
                        onClick={togglePlayPause}
                        className="hover:text-gray-800"
                      >
                        {isPlaying ? (
                          <FaPause className="h-3 w-3 text-gray-600" />
                        ) : (
                          <FaPlay className="h-3 w-3 text-gray-600" />
                        )}
                      </button>
                      <button 
                        onClick={() => console.log("Next track")}
                        className="hover:text-gray-800"
                      >
                        <FaForward className="h-3 w-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* AirPlay */}
                <button 
                  onClick={toggleAirPlay}
                  className="col-span-2 bg-gray-100 rounded-lg p-2 flex items-center space-x-2"
                >
                  <div className={`rounded-full p-1.5 ${
                    airPlaySearching ? "bg-blue-500" : "bg-gray-400"
                  }`}>
                    <MdCast className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">AirPlay</div>
                    <div className="text-xs text-gray-600">
                      {airPlaySearching ? "Looking for displays" : "Connected"}
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