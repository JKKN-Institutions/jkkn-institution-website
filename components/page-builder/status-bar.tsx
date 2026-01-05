'use client'

import { formatDistanceToNow } from 'date-fns'
import { Loader2, HelpCircle, Monitor, Tablet, Smartphone, ZoomIn } from 'lucide-react'
import { usePageBuilder } from './page-builder-provider'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const deviceIcons = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
}

const deviceLabels = {
  desktop: 'Desktop',
  tablet: 'Tablet (768px)',
  mobile: 'Mobile (375px)',
}

export function StatusBar() {
  const { state, zoom } = usePageBuilder()
  const { blocks, device, isSaving, lastSavedAt } = state

  const componentCount = blocks.length

  return (
    <footer className="h-8 bg-card border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground flex-shrink-0">
      {/* Left side: Save status and stats */}
      <div className="flex items-center gap-3">
        {/* Auto-save indicator */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1.5 cursor-default">
              {isSaving ? (
                <>
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-500" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    lastSavedAt
                      ? "bg-green-500 animate-pulse"
                      : "bg-muted-foreground/50"
                  )} />
                  <span>
                    {lastSavedAt
                      ? `Saved ${formatDistanceToNow(lastSavedAt, { addSuffix: true })}`
                      : 'Not saved yet'
                    }
                  </span>
                </>
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            {isSaving
              ? 'Saving changes...'
              : lastSavedAt
                ? `Last saved: ${lastSavedAt.toLocaleTimeString()}`
                : 'No changes saved yet'
            }
          </TooltipContent>
        </Tooltip>

        <span className="text-border">•</span>

        {/* Component count */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default">
              Components: <strong className="font-medium text-foreground">{componentCount}</strong>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            Total blocks on this page
          </TooltipContent>
        </Tooltip>

        <span className="text-border hidden sm:inline">•</span>

        {/* Device */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="hidden sm:flex items-center gap-1.5 cursor-default">
              {(() => {
                const DeviceIcon = deviceIcons[device]
                return <DeviceIcon className="w-3.5 h-3.5" />
              })()}
              <span className="hidden md:inline">{deviceLabels[device]}</span>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            Preview device: {deviceLabels[device]}
          </TooltipContent>
        </Tooltip>

        <span className="text-border hidden md:inline">•</span>

        {/* Zoom */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="hidden md:flex items-center gap-1.5 cursor-default">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{zoom}%</span>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            Canvas zoom level
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Right side: Help and version */}
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              onClick={() => {
                // Could open a help modal or documentation
                window.open('/docs/page-builder', '_blank')
              }}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Help</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            Open documentation
          </TooltipContent>
        </Tooltip>

        <span className="text-border hidden sm:inline">•</span>

        <span className="hidden sm:inline text-muted-foreground/70">
          JKKN CMS v2.0
        </span>
      </div>
    </footer>
  )
}
