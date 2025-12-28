'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

interface ResizablePanelProps {
  children: React.ReactNode
  side: 'left' | 'right'
  defaultWidth: number
  minWidth: number
  maxWidth: number
  storageKey: string
  className?: string
  collapsed?: boolean
  onToggle?: () => void
  collapsedWidth?: number
}

export function ResizablePanel({
  children,
  side,
  defaultWidth,
  minWidth,
  maxWidth,
  storageKey,
  className,
  collapsed = false,
  onToggle,
  collapsedWidth = 44
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Mark as mounted after first render to avoid hydration mismatch
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Load saved width from localStorage on mount
  useEffect(() => {
    const savedWidth = localStorage.getItem(storageKey)
    if (savedWidth) {
      const parsed = parseInt(savedWidth, 10)
      if (!isNaN(parsed) && parsed >= minWidth && parsed <= maxWidth) {
        setWidth(parsed)
      }
    }
  }, [storageKey, minWidth, maxWidth])

  // Save width to localStorage when it changes
  useEffect(() => {
    if (!isResizing && !collapsed) {
      localStorage.setItem(storageKey, width.toString())
    }
  }, [width, isResizing, storageKey, collapsed])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (collapsed) return
    e.preventDefault()
    setIsResizing(true)
  }, [collapsed])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !panelRef.current || collapsed) return

    const rect = panelRef.current.getBoundingClientRect()
    let newWidth: number

    if (side === 'left') {
      // For left panel, resize from right edge
      newWidth = e.clientX - rect.left
    } else {
      // For right panel, resize from left edge
      newWidth = rect.right - e.clientX
    }

    // Clamp to min/max
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
    setWidth(newWidth)
  }, [isResizing, side, minWidth, maxWidth, collapsed])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Add/remove global mouse listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  // Use non-collapsed state on server to avoid hydration mismatch
  // The collapsed state from localStorage will be applied after mount
  const isCollapsed = hasMounted ? collapsed : false

  // Get toggle button icon based on side and collapsed state
  // When collapsed: show "close" icon (panel with arrow pointing inward = click to expand)
  // When expanded: show "open" icon (panel with arrow pointing outward = click to collapse)
  const getToggleIcon = () => {
    if (side === 'left') {
      return isCollapsed ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />
    }
    return isCollapsed ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />
  }

  // Get tooltip text
  const getTooltipText = () => {
    return isCollapsed ? 'Expand panel' : 'Collapse panel'
  }

  // Actual width to use
  const actualWidth = isCollapsed ? collapsedWidth : width

  return (
    <TooltipProvider>
      <div
        ref={panelRef}
        className={cn(
          'relative flex flex-col transition-[width,min-width,max-width] duration-200 ease-in-out',
          isCollapsed && 'overflow-hidden',
          className
        )}
        style={{
          width: `${actualWidth}px`,
          minWidth: `${actualWidth}px`,
          maxWidth: `${actualWidth}px`
        }}
      >
        {/* Collapsed state - show only toggle button */}
        {isCollapsed ? (
          <div className="flex flex-col h-full items-center justify-start pt-3 bg-card">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-primary/10"
                  onClick={onToggle}
                >
                  {getToggleIcon()}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={side === 'left' ? 'right' : 'left'}>
                {getTooltipText()}
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <>
            {children}

            {/* Toggle button in expanded state - only show for left panel to avoid tab overlap */}
            {onToggle && side === 'left' && (
              <div className="absolute top-2 right-2 z-40">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-primary/10"
                      onClick={onToggle}
                    >
                      {getToggleIcon()}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {getTooltipText()}
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Resize Handle */}
            <div
              className={cn(
                'absolute top-0 bottom-0 w-1 z-50 group cursor-col-resize',
                'hover:bg-primary/20 transition-colors',
                isResizing && 'bg-primary/30',
                side === 'left' ? 'right-0' : 'left-0'
              )}
              onMouseDown={handleMouseDown}
            >
              {/* Visual indicator on hover */}
              <div
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 w-1 h-8 rounded-full',
                  'bg-border group-hover:bg-primary/50 transition-colors',
                  isResizing && 'bg-primary',
                  side === 'left' ? 'right-0' : 'left-0'
                )}
              />
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
