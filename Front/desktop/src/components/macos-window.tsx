"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, Grid } from "lucide-react"

interface MacOSWindowProps {
  title: string
  children: React.ReactNode
  width?: number | string
  height?: number | string
  showNavigation?: boolean
  showSearch?: boolean
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  className?: string
  initialPosition?: { x: number; y: number }
  resizable?: boolean
  theme?: "light" | "dark"
}

export const MacOSWindow: React.FC<MacOSWindowProps> = ({
  title = "Window",
  children,
  width = 700,
  height = 500,
  showNavigation = true,
  showSearch = true,
  onClose = () => {},
  onMinimize = () => {},
  onMaximize = () => {},
  className = "",
  initialPosition = { x: 50, y: 50 },
  resizable = true,
  theme = "light",
}) => {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [windowSize, setWindowSize] = useState({ width, height })
  const windowRef = useRef<HTMLDivElement>(null)

  // Handle window dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement) {
      // Only allow dragging from the title bar, not from buttons or other controls
      if (
        e.target.classList.contains("title-bar") ||
        e.target.classList.contains("window-title") ||
        e.target.parentElement?.classList.contains("title-bar")
      ) {
        setIsDragging(true)
        const rect = windowRef.current?.getBoundingClientRect()
        if (rect) {
          setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          })
        }
      }
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    } else if (isResizing) {
      const newWidth = Math.max(300, e.clientX - position.x)
      const newHeight = Math.max(200, e.clientY - position.y)
      setWindowSize({ width: newWidth, height: newHeight })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  const startResizing = () => {
    setIsResizing(true)
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing])

  return (
    <div
      ref={windowRef}
      className={`macos-window ${theme === "dark" ? "dark" : ""} ${className}`}
      style={{
        width: typeof windowSize.width === "number" ? `${windowSize.width}px` : windowSize.width,
        height: typeof windowSize.height === "number" ? `${windowSize.height}px` : windowSize.height,
        left: position.x,
        top: position.y,
      }}
    >
      <div className="title-bar" onMouseDown={handleMouseDown}>
        <div className="window-controls">
          <button className="control close" onClick={onClose} aria-label="Close">
            <span></span>
          </button>
          <button className="control minimize" onClick={onMinimize} aria-label="Minimize">
            <span></span>
          </button>
          <button className="control maximize" onClick={onMaximize} aria-label="Maximize">
            <span></span>
          </button>
        </div>

        {showNavigation && (
          <div className="window-navigation">
            <button className="nav-button" aria-label="Back">
              <ChevronLeft size={14} />
            </button>
            <button className="nav-button" aria-label="Forward">
              <ChevronRight size={14} />
            </button>
            <button className="nav-button grid-button" aria-label="Grid View">
              <Grid size={14} />
            </button>
          </div>
        )}

        <div className="window-title">{title}</div>

        {showSearch && (
          <div className="window-search">
            <Search size={12} className="search-icon" />
            <input type="text" placeholder="Search" />
          </div>
        )}
      </div>

      <div className="window-content">{children}</div>

      {resizable && <div className="resize-handle" onMouseDown={startResizing}></div>}

      <style jsx>{`
        .macos-window {
          position: absolute;
          display: flex;
          flex-direction: column;
          background-color: #f5f5f7;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        .macos-window.dark {
          background-color: #1e1e1e;
          color: #ffffff;
        }
        
        .title-bar {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background-color: #f0f0f0;
          border-bottom: 1px solid #e0e0e0;
          user-select: none;
          height: 38px;
        }
        
        .dark .title-bar {
          background-color: #2d2d2d;
          border-bottom: 1px solid #3a3a3a;
        }
        
        .window-controls {
          display: flex;
          gap: 8px;
          margin-right: 12px;
        }
        
        .control {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .close {
          background-color: #ff5f57;
        }
        
        .minimize {
          background-color: #febc2e;
        }
        
        .maximize {
          background-color: #28c840;
        }
        
        .window-navigation {
          display: flex;
          gap: 4px;
          margin-right: 12px;
        }
        
        .nav-button {
          background-color: #ffffff;
          border: 1px solid #d1d1d1;
          border-radius: 4px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .dark .nav-button {
          background-color: #3a3a3a;
          border: 1px solid #4a4a4a;
          color: #ffffff;
        }
        
        .grid-button {
          width: 28px;
        }
        
        .window-title {
          flex: 1;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
        
        .dark .window-title {
          color: #e0e0e0;
        }
        
        .window-search {
          position: relative;
          display: flex;
          align-items: center;
          margin-left: 12px;
        }
        
        .search-icon {
          position: absolute;
          left: 8px;
          color: #888;
          z-index: 1;
        }
        
        .window-search input {
          background-color: rgba(142, 142, 147, 0.12);
          border: none;
          border-radius: 6px;
          padding: 5px 10px 5px 30px;
          font-size: 13px;
          width: 180px;
          color: #333;
        }
        
        .dark .window-search input {
          background-color: rgba(80, 80, 85, 0.3);
          color: #e0e0e0;
        }
        
        .window-content {
          flex: 1;
          overflow: auto;
          padding: 16px;
        }
        
        .resize-handle {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 16px;
          height: 16px;
          cursor: nwse-resize;
        }
        
        .resize-handle::after {
          content: "";
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 8px;
          height: 8px;
          border-right: 2px solid #888;
          border-bottom: 2px solid #888;
        }
      `}</style>
    </div>
  )
}

