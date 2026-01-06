'use client'

import { type ReactNode, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  GripVertical,
  MoreVertical,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BlockData } from '@/lib/cms/registry-types'
import type { GlassSettings } from '@/lib/cms/styling-types'
import { BLUR_VALUES, TINT_COLORS, GLOW_BLUR_VALUES } from '@/lib/cms/styling-types'

interface BlockWrapperProps {
  block: BlockData
  displayName: string
  isSelected: boolean
  isPreviewMode: boolean
  isDragging: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onToggleVisibility: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  dragHandleProps: Record<string, unknown>
  children: ReactNode
  isContainer?: boolean
  depth?: number
}

export function BlockWrapper({
  block,
  displayName,
  isSelected,
  isPreviewMode,
  isDragging,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  canMoveUp,
  canMoveDown,
  dragHandleProps,
  children,
  isContainer = false,
  depth = 0,
}: BlockWrapperProps) {
  const isHidden = !block.is_visible

  // Compute glass effect styles based on block settings
  const glassStyles = useMemo(() => {
    const blockStylesData = (block.props as Record<string, unknown>)?._styles as { glass?: GlassSettings } | undefined
    const glassSettings = blockStylesData?.glass

    if (!glassSettings?.enabled) return {}

    const baseRgba = glassSettings.variant === 'dark'
      ? '0, 0, 0'
      : '255, 255, 255'

    // Get tint color for background overlay
    const tintColor = glassSettings.colorTint !== 'none'
      ? TINT_COLORS[glassSettings.colorTint]
      : null

    // Build background with optional tint
    let background: string
    if (tintColor) {
      // Convert hex to RGB for tint
      const hex = tintColor.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      background = `linear-gradient(135deg, rgba(${baseRgba}, ${glassSettings.backgroundOpacity / 100}), rgba(${r}, ${g}, ${b}, ${glassSettings.tintOpacity / 100}))`
    } else {
      background = `rgba(${baseRgba}, ${glassSettings.backgroundOpacity / 100})`
    }

    const styles: React.CSSProperties = {
      backdropFilter: `blur(${BLUR_VALUES[glassSettings.blurLevel]}px)`,
      WebkitBackdropFilter: `blur(${BLUR_VALUES[glassSettings.blurLevel]}px)`,
      background,
    }

    // Add border if enabled
    if (glassSettings.borderEnabled) {
      const borderRgba = glassSettings.variant === 'dark' ? '0, 0, 0' : '255, 255, 255'
      styles.border = `1px solid rgba(${borderRgba}, ${glassSettings.borderOpacity / 100})`
    }

    // Add glow if enabled
    if (glassSettings.glowEnabled && glassSettings.glowColor) {
      const glowColor = glassSettings.glowColor
      const glowBlur = GLOW_BLUR_VALUES[glassSettings.glowIntensity]
      styles.boxShadow = `0 0 ${glowBlur}px ${glowColor}66`
    }

    return styles
  }, [block.props])

  if (isPreviewMode) {
    // In preview mode, just render the component without wrapper UI
    if (isHidden) return null
    return <>{children}</>
  }

  // Container indicator colors based on depth
  const containerColors = [
    'border-blue-300 bg-blue-50/30',
    'border-green-300 bg-green-50/30',
    'border-purple-300 bg-purple-50/30',
    'border-orange-300 bg-orange-50/30',
  ]

  return (
    <div
      className={cn(
        'group relative',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isHidden && 'opacity-50',
        isDragging && 'cursor-grabbing',
        isContainer && 'border-2 border-dashed rounded-lg p-2',
        isContainer && containerColors[depth % containerColors.length]
      )}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {/* Block Label & Controls - shown on hover or when selected */}
      <div
        className={cn(
          'absolute -top-8 left-0 right-0 flex items-center justify-between',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          isSelected && 'opacity-100'
        )}
      >
        {/* Left side: Drag handle and label */}
        <div className="flex items-center gap-2">
          <button
            {...dragHandleProps}
            className="p-1 rounded bg-primary text-primary-foreground cursor-grab hover:bg-primary/90"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded">
            {displayName}
            {isHidden && ' (Hidden)'}
          </span>
        </div>

        {/* Right side: Quick actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              onMoveUp()
            }}
            disabled={!canMoveUp}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              onMoveDown()
            }}
            disabled={!canMoveDown}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate()
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleVisibility()
                }}
              >
                {isHidden ? (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show
                  </>
                ) : (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Block Content */}
      <div
        className={cn(
          'relative transition-all',
          !isSelected && 'hover:outline hover:outline-2 hover:outline-dashed hover:outline-border',
          Object.keys(glassStyles).length > 0 && 'rounded-lg overflow-hidden'
        )}
        style={glassStyles}
      >
        {children}
      </div>
    </div>
  )
}
