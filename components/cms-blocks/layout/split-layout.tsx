'use client'

import { Children as ReactChildren } from 'react'
import { cn } from '@/lib/utils'
import type { SplitLayoutProps } from '@/lib/cms/registry-types'
import { useDroppable } from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Type, AlignLeft, Image as ImageIcon, Plus, Video, List, Square, Minus } from 'lucide-react'

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

// Component menu for adding blocks to columns
interface ComponentMenuProps {
  onAdd: (componentName: string) => void
}

function ComponentMenu({ onAdd }: ComponentMenuProps) {
  const components = [
    // Content components
    { name: 'Heading', icon: Type, category: 'Content' },
    { name: 'Paragraph', icon: AlignLeft, category: 'Content' },
    { name: 'Button', icon: Square, category: 'Content' },
    { name: 'List', icon: List, category: 'Content' },
    // Media components
    { name: 'Image', icon: ImageIcon, category: 'Media' },
    { name: 'Video', icon: Video, category: 'Media' },
    // Layout components
    { name: 'Container', icon: Square, category: 'Layout' },
    { name: 'Divider', icon: Minus, category: 'Layout' },
  ]

  const contentComponents = components.filter(c => c.category === 'Content')
  const mediaComponents = components.filter(c => c.category === 'Media')
  const layoutComponents = components.filter(c => c.category === 'Layout')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-9 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Component
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="center">
        <div className="space-y-3">
          {/* Content Components */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Content</p>
            <div className="grid grid-cols-2 gap-2">
              {contentComponents.map(({ name, icon: Icon }) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-auto py-2 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => onAdd(name)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="text-xs">{name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Media Components */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Media</p>
            <div className="grid grid-cols-2 gap-2">
              {mediaComponents.map(({ name, icon: Icon }) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-auto py-2 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => onAdd(name)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="text-xs">{name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Layout Components */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Layout</p>
            <div className="grid grid-cols-2 gap-2">
              {layoutComponents.map(({ name, icon: Icon }) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-auto py-2 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => onAdd(name)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="text-xs">{name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
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
    <div className="relative">
      {/* Column Label Badge */}
      <div className="absolute -top-2 left-2 z-10 px-2 py-0.5 bg-primary/10 backdrop-blur-sm rounded text-xs font-medium text-primary border border-primary/20">
        Column {columnIndex + 1}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[280px] p-8 border-2 border-dashed rounded-lg transition-all duration-300 relative overflow-hidden",
          isOver
            ? "border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/20 scale-[1.02] ring-2 ring-primary/30"
            : "border-muted-foreground/20 hover:border-primary/40 hover:bg-accent/20 hover:shadow-md"
        )}
      >
        {/* Animated gradient background on hover */}
        {isOver && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse" />
        )}

        <div className="relative flex flex-col items-center justify-center h-full text-center space-y-4">
          {/* Large Icon with glow effect */}
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300 relative",
            isOver
              ? "bg-primary/20 shadow-lg shadow-primary/30 scale-110"
              : "bg-gradient-to-br from-muted to-muted/50 hover:scale-105"
          )}>
            {/* Glow ring on drag-over */}
            {isOver && (
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            )}
            <Plus className={cn(
              "h-8 w-8 transition-all duration-300 relative z-10",
              isOver ? "text-primary rotate-90" : "text-muted-foreground"
            )} />
          </div>

          {/* Label with better typography */}
          <div className="space-y-1">
            <p className={cn(
              "font-semibold text-base transition-colors",
              isOver ? "text-primary" : "text-foreground"
            )}>
              {isOver ? '✨ Drop Here' : columnLabel}
            </p>

            {/* Description */}
            <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
              {isOver ? 'Release to add component' : columnDescription}
            </p>
          </div>

          {/* Component menu - only show when not dragging */}
          {!isOver && (
            <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ComponentMenu onAdd={onQuickAdd} />
            </div>
          )}

          {/* Helper text */}
          {!isOver && (
            <p className="text-xs text-muted-foreground/70 pt-2 animate-in fade-in delay-150">
              or drag from the component palette
            </p>
          )}
        </div>
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
  // Convert children to array using React.Children.toArray for better handling
  // This properly handles fragments, nested children, and other React element types
  const childArray = children ? ReactChildren.toArray(children) : []
  const hasChildren = childArray.length > 0

  // Get individual column children (first child = column 0, second child = column 1)
  const column0Children = childArray[0] || null
  const column1Children = childArray[1] || null

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
      {/* Render columns - show children if they exist, otherwise show drop zones */}
      {[0, 1].map((columnIndex) => {
        const columnChild = columnIndex === 0 ? column0Children : column1Children
        const hasContent = columnChild !== null

        return (
          <div key={columnIndex} className="min-w-0">
            {hasContent ? (
              // Render actual child block
              columnChild
            ) : isEditing ? (
              // Show drop zone only if column is empty
              <SplitLayoutDropZone
                parentId={id || 'unknown'}
                columnIndex={columnIndex}
                columnLabel={`Column ${columnIndex + 1}: ${columnIndex === 0 ? 'Content' : 'Media'}`}
                columnDescription={columnIndex === 0 ? 'Drop heading, text, buttons here' : 'Drop image, video here'}
                onQuickAdd={(componentName) => onAddBlock?.(componentName, columnIndex)}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
