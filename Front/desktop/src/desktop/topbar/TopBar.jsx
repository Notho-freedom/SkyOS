"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { 
  FaApple, FaWifi, FaBluetooth, FaVolumeUp, FaBatteryFull, 
  FaSearch, FaRegBell, FaRegClock, FaMusic, FaPlay, FaForward, 
  FaBackward, FaRegCalendarAlt
} from "react-icons/fa"
import { 
  MdAirplanemodeActive, MdScreenShare, MdBrightnessMedium, 
  MdKeyboard, MdCast
} from "react-icons/md"

const TopBar = () => {
  const { t } = useTranslation()
  const [activeMenu, setActiveMenu] = useState(null)
  const [controlCenterOpen, setControlCenterOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const dropdownRefs = useRef({})
  const controlCenterRef = useRef(null)

  // Update time and date
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

  // Close dropdowns when clicking outside
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
    if (controlCenterOpen) setControlCenterOpen(false)
  }

  const toggleControlCenter = () => {
    setControlCenterOpen(!controlCenterOpen)
    if (activeMenu) setActiveMenu(null)
  }

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
    {
      name: t("menu.Messages"),
      items: [
        { label: t("menu.Preferences...") },
        { separator: true },
        { label: t("menu.Services") },
        { separator: true },
        { label: t("menu.Hide Messages") },
        { label: t("menu.Hide Others") },
        { label: t("menu.Show All") },
      ],
    },
    {
      name: t("menu.File"),
      items: [
        { label: t("menu.New Message") },
        { label: t("menu.New Conversation") },
        { separator: true },
        { label: t("menu.Close") },
        { label: t("menu.Save") },
        { label: t("menu.Save As...") },
        { separator: true },
        { label: t("menu.Print...") },
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
        { label: t("menu.Select All") },
        { separator: true },
        { label: t("menu.Emoji & Symbols") },
      ],
    },
    {
      name: t("menu.View"),
      items: [
        { label: t("menu.Show Sidebar") },
        { label: t("menu.Hide Sidebar") },
        { separator: true },
        { label: t("menu.Show Favorites") },
        { label: t("menu.Show Shared with You") },
        { separator: true },
        { label: t("menu.Enter Full Screen") },
      ],
    },
    {
      name: t("menu.Buddies"),
      items: [
        { label: t("menu.Add Buddy") },
        { label: t("menu.Add Group") },
        { separator: true },
        { label: t("menu.Go Offline") },
        { label: t("menu.Set Status") },
      ],
    },
    {
      name: t("menu.Window"),
      items: [
        { label: t("menu.Minimize") },
        { label: t("menu.Zoom") },
        { separator: true },
        { label: t("menu.Bring All to Front") },
        { separator: true },
        { label: t("menu.Messages") },
      ],
    },
    {
      name: t("menu.Help"),
      items: [
        { label: t("menu.Search") },
        { separator: true },
        { label: t("menu.Messages Help") },
      ],
    },
  ], [t])

  const batteryLevel = 78

  return (
    <div className="fixed top-0 left-0 right-0 h-7 bg-gradient-to-r from-blue-600 to-purple-600 flex justify-between items-center px-2 text-xs font-medium z-50 text-white">
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
              <div className="absolute left-0 top-full mt-1 bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-md shadow-lg min-w-40 py-1 border border-gray-700 z-50 text-white">
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

      <div className="flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-2">
          <div 
            className="relative" 
            ref={controlCenterRef}
          >
            <button 
              onClick={toggleControlCenter}
              className={`flex items-center space-x-1 px-1 py-0.5 rounded ${
                controlCenterOpen ? "bg-white bg-opacity-30" : "hover:bg-white hover:bg-opacity-20"
              }`}
            >
              <FaWifi className="h-3.5 w-3.5" />
              <FaBluetooth className="h-3.5 w-3.5" />
              <FaBatteryFull className="h-3.5 w-3.5" />
            </button>
            
            {controlCenterOpen && (
              <div className="absolute right-0 top-full mt-1 bg-gray-200 bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl w-72 p-3 z-50 text-black">
                <div className="grid grid-cols-2 gap-2">
                  {/* Top row - main controls */}
                  <div className="bg-blue-100 rounded-lg p-2 flex items-center space-x-2">
                    <div className="bg-blue-500 rounded-full p-1.5">
                      <FaWifi className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Wi-Fi</div>
                      <div className="text-xs text-gray-600">Active</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-100 rounded-lg p-2 flex items-center space-x-2">
                    <div className="bg-blue-500 rounded-full p-1.5">
                      <FaBluetooth className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Bluetooth</div>
                      <div className="text-xs text-gray-600">On</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-100 rounded-lg p-2 flex items-center space-x-2">
                    <div className="bg-blue-500 rounded-full p-1.5">
                      <MdAirplanemodeActive className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">AirDrop</div>
                      <div className="text-xs text-gray-600">Contacts Only</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-2 flex flex-col">
                    <div className="font-medium mb-1">Keyboard Brightness</div>
                    <div className="flex items-center">
                      <MdKeyboard className="h-4 w-4 mr-2 text-gray-600" />
                      <div className="h-1.5 flex-1 bg-gray-300 rounded-full">
                        <div className="h-full w-3/4 bg-gray-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Second row */}
                  <div className="col-span-2 bg-gray-100 rounded-lg p-2 flex flex-col">
                    <div className="font-medium mb-1">Display</div>
                    <div className="flex items-center">
                      <MdBrightnessMedium className="h-4 w-4 mr-2 text-gray-600" />
                      <div className="h-1.5 flex-1 bg-gray-300 rounded-full">
                        <div className="h-full w-4/5 bg-gray-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Third row */}
                  <div className="col-span-2 bg-gray-100 rounded-lg p-2 flex flex-col">
                    <div className="font-medium mb-1">Sound</div>
                    <div className="flex items-center">
                      <FaVolumeUp className="h-4 w-4 mr-2 text-gray-600" />
                      <div className="h-1.5 flex-1 bg-gray-300 rounded-full">
                        <div className="h-full w-1/2 bg-gray-500 rounded-full"></div>
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
                        <FaBackward className="h-3 w-3 text-gray-600" />
                        <FaPlay className="h-3 w-3 text-gray-600" />
                        <FaForward className="h-3 w-3 text-gray-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom row - AirPlay */}
                  <div className="col-span-2 bg-gray-100 rounded-lg p-2 flex items-center space-x-2">
                    <div className="bg-blue-500 rounded-full p-1.5">
                      <MdCast className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">AirPlay</div>
                      <div className="text-xs text-gray-600">Looking for displays</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span>{currentDate}</span>
          <span>{currentTime}</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar
