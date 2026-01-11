'use client'

import { cn } from '@/lib/utils'
import type { SplitLayoutProps } from '@/lib/cms/registry-types'
import { useDroppable } from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import { Type, AlignLeft, Image as ImageIcon, Plus } from 'lucide-react'

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

// Quick-add buttons for adding common blocks to columns
interface QuickAddButtonsProps {
  onAdd: (componentName: string) => void
}

function QuickAddButtons({ onAdd }: QuickAddButtonsProps) {
  return (
    <div className="flex gap-2 mt-3 flex-wrap justify-center">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onAdd('Heading')}
        className="h-8 text-xs"
      >
        <Type className="h-3 w-3 mr-1.5" />
        Heading
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onAdd('Paragraph')}
        className="h-8 text-xs"
      >
        <AlignLeft className="h-3 w-3 mr-1.5" />
        Text
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onAdd('Image')}
        className="h-8 text-xs"
      >
        <ImageIcon className="h-3 w-3 mr-1.5" />
        Image
      </Button>
    </div>
  )
}

// Column-specific drop zone for Split Layout
interface SplitLayoutDropZoneProps {
  parentId: string
  columnIndex: number
  columnLabel: string
  columnDescription: string
  onQuickAdd: (componentName: string) => void
}

function SplitLayoutDropZone({
  parentId,
  columnIndex,
  columnLabel,
  columnDescription,
  onQuickAdd,
}: SplitLayoutDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `split-${parentId}-col-${columnIndex}`,
    data: {
      type: 'split-column',
      parentId,
      columnIndex,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[240px] p-6 border-2 border-dashed rounded-lg transition-all duration-200",
        isOver
          ? "border-primary bg-primary/10 shadow-md scale-[1.02]"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/30"
      )}
    >
      <div className="flex flex-col items-center justify-center h-full text-center">
        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
          isOver ? "bg-primary/20" : "bg-muted"
        )}>
          <Plus className={cn(
            "h-6 w-6 transition-colors",
            isOver ? "text-primary" : "text-muted-foreground"
          )} />
        </div>

        {/* Label */}
        <p className="font-medium text-sm mb-1 text-foreground">
          {columnLabel}
        </p>

        {/* Description */}
        <p className="text-xs text-muted-foreground mb-4">
          {isOver ? 'Drop here to add' : columnDescription}
        </p>

        {/* Quick-add buttons */}
        {!isOver && <QuickAddButtons onAdd={onQuickAdd} />}
      </div>
    </div>
  )
}

// Extended props for Split Layout with handlers
export interface SplitLayoutPropsExtended extends SplitLayoutProps {
  onAddBlock?: (componentName: string, columnIndex: number) => void
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
  id,
  onAddBlock,
}: SplitLayoutPropsExtended) {
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
          {/* Column 1 Drop Zone */}
          <SplitLayoutDropZone
            parentId={id || 'unknown'}
            columnIndex={0}
            columnLabel="Column 1: Content"
            columnDescription="Drop heading, text, buttons here"
            onQuickAdd={(componentName) => onAddBlock?.(componentName, 0)}
          />

          {/* Column 2 Drop Zone */}
          <SplitLayoutDropZone
            parentId={id || 'unknown'}
            columnIndex={1}
            columnLabel="Column 2: Media"
            columnDescription="Drop image, video here"
            onQuickAdd={(componentName) => onAddBlock?.(componentName, 1)}
          />

          {/* Validation warning if incorrect child count */}
          {!validChildCount && childArray.length > 0 && (
            <div className="col-span-full mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Warning:</strong> SplitLayout expects exactly 2 child blocks.
                Currently has {childArray.length}. {childArray.length < 2 ? 'Add more blocks' : 'Remove extra blocks'} to fix.
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
