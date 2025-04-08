"use client"

import { createContext, useState, useCallback, useContext } from "react"
import ContextMenuWidget from "./ContextMenuWidget"

export const ContextMenuContext = createContext({
  showContextMenu: () => {},
  hideContextMenu: () => {},
})

export const ContextMenuProvider = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [items, setItems] = useState([])
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const showContextMenu = useCallback((menuItems, pos) => {
    setItems(menuItems)
    setPosition(pos)
    setVisible(true)
  }, [])

  const hideContextMenu = useCallback(() => {
    setVisible(false)
  }, [])

  return (
    <ContextMenuContext.Provider value={{ showContextMenu, hideContextMenu }}>
      {children}
      {visible && (
        <ContextMenuWidget 
          items={items} 
          position={position} 
          onClose={hideContextMenu} 
        />
      )}
    </ContextMenuContext.Provider>
  )
}

export const useContextMenu = () => useContext(ContextMenuContext)