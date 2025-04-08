// src/desktop/contextmenu/ContextMenuWidget.js

"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "../../theme/ThemeContext"

const ContextMenuWidget = ({ items, position, onClose }) => {
  const { theme } = useTheme()
  const menuRef = useRef(null)
  const [subMenu, setSubMenu] = useState(null)
  const [subMenuPosition, setSubMenuPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const handleItemMouseEnter = (item, index, event) => {
    if (item.submenu) {
      const rect = event.currentTarget.getBoundingClientRect()
      setSubMenu(item.submenu)
      setSubMenuPosition({
        x: rect.right + 5,
        y: rect.top
      })
    } else {
      setSubMenu(null)
    }
  }

  const handleItemClick = (item) => {
    if (item.action && !item.submenu) {
      item.action()
      onClose()
    }
    // Si un sous-menu est visible, il reste ouvert jusqu'à ce que l'utilisateur clique sur un élément
    if (!item.submenu) {
      setSubMenu(null)  // Ferme le sous-menu seulement si l'utilisateur clique sur un élément sans sous-menu
    }
  }

  const adjustedPosition = () => {
    if (!menuRef.current) return position
    
    const menuWidth = 220
    const menuHeight = menuRef.current.offsetHeight
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    return {
      x: position.x + menuWidth > windowWidth ? windowWidth - menuWidth - 10 : position.x,
      y: position.y + menuHeight > windowHeight ? windowHeight - menuHeight - 10 : position.y,
    }
  }

  const renderItems = (itemsToRender) => {
    return itemsToRender.map((item, index) => {
      if (item.separator) {
        return (
          <div 
            key={`separator-${index}`} 
            className={`my-1 h-px ${theme.name === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}
          />
        )
      }

      return (
        <div
          key={`${item.label}-${index}`}
          onClick={() => handleItemClick(item)}
          onMouseEnter={(e) => handleItemMouseEnter(item, index, e)}
          className={`px-4 py-2 text-sm ${item.disabled ? 'text-gray-400' : 'hover:bg-blue-500 hover:text-white'} ${
            theme.name === 'dark' ? 'text-gray-200' : 'text-gray-800'
          } cursor-default flex justify-between items-center relative`}
        >
          <span>{item.label}</span>
          {item.submenu && <span>▸</span>}
        </div>
      )
    })
  }

  const pos = adjustedPosition()

  return (
    <>
      <div
        ref={menuRef}
        className={`fixed z-50 rounded-md shadow-xl min-w-[200px] py-1 ${
          theme.name === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      >
        {renderItems(items)}
      </div>

      {subMenu && (
        <div
          className={`fixed z-50 rounded-md shadow-xl min-w-[200px] py-1 ${
            theme.name === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}
          style={{
            left: `${subMenuPosition.x}px`,
            top: `${subMenuPosition.y}px`,
          }}
          onMouseLeave={() => setSubMenu(null)}
        >
          {renderItems(subMenu)}
        </div>
      )}
    </>
  )
}
export default ContextMenuWidget
