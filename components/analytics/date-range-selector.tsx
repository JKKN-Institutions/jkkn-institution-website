'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  getAllPresets,
  getDateRangeFromPreset,
  getPresetFromParams,
  getPresetLabel,
  formatDateRange
} from '@/lib/analytics/date-presets'
import type { DatePreset, DateRange } from '@/lib/analytics/types'

interface DateRangeSelectorProps {
  className?: string
  onRangeChange?: (range: DateRange) => void
}

export function DateRangeSelector({
  className,
  onRangeChange
}: DateRangeSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current preset from URL
  const currentPreset = getPresetFromParams(searchParams)
  const currentRange = getDateRangeFromPreset(currentPreset)

  const handlePresetChange = useCallback(
    (preset: DatePreset) => {
      // Update URL with new preset
      const params = new URLSearchParams(searchParams.toString())
      params.set('preset', preset)
      router.push(`${pathname}?${params.toString()}`)

      // Notify parent of change
      if (onRangeChange) {
        const newRange = getDateRangeFromPreset(preset)
        onRangeChange(newRange)
      }
    },
    [pathname, router, searchParams, onRangeChange]
  )

  const presets = getAllPresets()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`justify-between min-w-[180px] ${className}`}
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>{getPresetLabel(currentPreset)}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {presets.map((preset) => (
          <DropdownMenuItem
            key={preset.value}
            onClick={() => handlePresetChange(preset.value)}
            className={currentPreset === preset.value ? 'bg-accent' : ''}
          >
            <div className="flex flex-col">
              <span>{preset.label}</span>
              {currentPreset === preset.value && (
                <span className="text-xs text-muted-foreground">
                  {formatDateRange(currentRange)}
                </span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Hook to get current date range from URL
export function useDateRange(): DateRange {
  const searchParams = useSearchParams()
  const preset = getPresetFromParams(searchParams)
  return getDateRangeFromPreset(preset)
}
