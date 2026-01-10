'use client'

import { cn } from '@/lib/utils'
import type { SplitLayoutProps } from '@/lib/cms/registry-types'

// Proportion mapping to CSS Grid template columns
const proportionClasses: Record<string, string> = {
  '50-50': 'md:grid-cols-2',
  '40-60': 'md:grid-cols-[2fr_3fr]',
  '60-40': 'md:grid-cols-[3fr_2fr]',
  '33-67': 'md:grid-cols-[1fr_2fr]',
}

// Vertical alignment mapping
const alignClasses: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

// Gap mapping to Tailwind classes
const gapClassMap: Record<number, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
}

export default function SplitLayout({
  proportion = '50-50',
  reverse = false,
  verticalAlign = 'center',
  gap = 8,
  stackOnMobile = true,
  mobileBreakpoint = 'md',
  background,
  padding = 0,
  children,
  className,
  isEditing,
}: SplitLayoutProps) {
  const hasChildren = children && (Array.isArray(children) ? children.length > 0 : true)
  const childArray = Array.isArray(children) ? children : children ? [children] : []

  // Validate children count
  const validChildCount = childArray.length === 2

  // Get gap class or fallback to style
  const gapClass = gapClassMap[gap] || undefined
  const gapStyle = gapClass ? undefined : { gap: `${gap * 0.25}rem` }

  // Get proportion class based on breakpoint
  const breakpointPrefix = mobileBreakpoint === 'sm' ? 'sm:' : mobileBreakpoint === 'lg' ? 'lg:' : 'md:'
  const proportionClass = proportionClasses[proportion]?.replace('md:', breakpointPrefix) || proportionClasses['50-50']

  return (
    <div
      className={cn(
        'grid w-full',
        // Mobile: single column (if stackOnMobile)
        stackOnMobile ? 'grid-cols-1' : proportionClass,
        // Desktop: specified proportions
        stackOnMobile && proportionClass,
        // Vertical alignment
        alignClasses[verticalAlign] || 'items-center',
        // Gap
        gapClass,
        // Reverse on desktop only
        reverse && stackOnMobile && `${mobileBreakpoint}:flex ${mobileBreakpoint}:flex-row-reverse`,
        className
      )}
      style={{
        padding: padding ? `${padding * 0.25}rem` : undefined,
        background: background || undefined,
        ...gapStyle,
      }}
    >
      {hasChildren && validChildCount ? (
        <>
          {/* Column 1: Content or Media (based on reverse) */}
          <div className="min-w-0">
            {childArray[0]}
          </div>

          {/* Column 2: Media or Content (based on reverse) */}
          <div className="min-w-0">
            {childArray[1]}
          </div>
        </>
      ) : isEditing ? (
        <>
          {/* Placeholder columns in editing mode */}
          <div className="min-h-[200px] p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="font-medium mb-1">Column 1: Content</p>
              <p className="text-sm">Drop heading, text, buttons here</p>
            </div>
          </div>
          <div className="min-h-[200px] p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="font-medium mb-1">Column 2: Media</p>
              <p className="text-sm">Drop image, video here</p>
            </div>
          </div>
          {!validChildCount && childArray.length > 0 && (
            <div className="col-span-full mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Warning:</strong> SplitLayout expects exactly 2 child blocks.
                Currently has {childArray.length}. Add or remove blocks to fix.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="min-h-[20px]" />
      )}
    </div>
  )
}
