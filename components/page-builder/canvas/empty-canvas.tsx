'use client'

import { useDroppable } from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Layout,
  Image as ImageIcon,
  Type,
  Lightbulb,
  LayoutTemplate,
  Layers,
  CreditCard,
  LayoutGrid,
  MessageSquare,
  ChevronDown,
  GalleryHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyCanvasProps {
  onAddBlock: (componentName: string) => void
  onBrowseTemplates?: () => void
  onBrowseBlocks?: () => void
}

// Quick start options with gradients
const quickStartOptions = [
  {
    id: 'blank',
    icon: FileText,
    label: 'Blank Page',
    description: 'Start from scratch',
    gradient: 'from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/30',
    borderColor: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    id: 'template',
    icon: LayoutTemplate,
    label: 'Use Template',
    description: 'Choose pre-built layout',
    gradient: 'from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-900/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'blocks',
    icon: Layers,
    label: 'Browse Blocks',
    description: 'Explore components',
    gradient: 'from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-900/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
]

// Expanded starter blocks (8 total)
const starterBlocks = [
  { name: 'HeroSection', icon: Layout, label: 'Hero Section', description: 'Full-width banner' },
  { name: 'Heading', icon: Type, label: 'Heading', description: 'Title text' },
  { name: 'TextEditor', icon: FileText, label: 'Text Block', description: 'Rich text content' },
  { name: 'ImageBlock', icon: ImageIcon, label: 'Image', description: 'Single image' },
  { name: 'CardSection', icon: CreditCard, label: 'Feature Cards', description: 'Card grid layout' },
  { name: 'BentoGrid', icon: LayoutGrid, label: 'Bento Grid', description: 'Modern grid' },
  { name: 'ContactForm', icon: MessageSquare, label: 'Contact Form', description: 'Form fields' },
  { name: 'Accordion', icon: ChevronDown, label: 'FAQ Section', description: 'Collapsible items' },
]

export function EmptyCanvas({ onAddBlock, onBrowseTemplates, onBrowseBlocks }: EmptyCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'empty-canvas-drop-zone',
  })

  const handleQuickStart = (optionId: string) => {
    switch (optionId) {
      case 'blank':
        // Start with a heading block
        onAddBlock('Heading')
        break
      case 'template':
        onBrowseTemplates?.()
        break
      case 'blocks':
        onBrowseBlocks?.()
        break
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[calc(100vh-200px)] flex items-center justify-center p-8',
        'border-2 border-dashed rounded-lg m-4 transition-colors',
        isOver
          ? 'border-primary bg-primary/5'
          : 'border-border/50 bg-muted/20'
      )}
    >
      <div className="text-center max-w-2xl w-full">
        {/* Header with gradient icon */}
        <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 shadow-sm">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <FileText className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-2">
          Start Building Your Page
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Choose how you want to begin - start fresh, use a template, or browse our component library
        </p>

        {/* Quick Start Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {quickStartOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.id}
                onClick={() => handleQuickStart(option.id)}
                className={cn(
                  'group relative p-6 rounded-xl border-2 transition-all duration-200',
                  'hover:shadow-md hover:scale-[1.02] hover:border-primary/50',
                  'bg-gradient-to-br',
                  option.gradient,
                  option.borderColor
                )}
              >
                <div className={cn(
                  'mx-auto h-12 w-12 rounded-xl flex items-center justify-center mb-3',
                  'bg-white/80 dark:bg-background/80 shadow-sm',
                  'group-hover:shadow-md transition-shadow'
                )}>
                  <Icon className={cn('h-6 w-6', option.iconColor)} />
                </div>
                <h4 className="font-medium text-foreground mb-1">{option.label}</h4>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground">Or add a block</span>
          </div>
        </div>

        {/* Starter Blocks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {starterBlocks.map((block) => {
            const Icon = block.icon
            return (
              <Button
                key={block.name}
                variant="outline"
                className="h-auto py-4 px-3 flex flex-col gap-2 hover:border-primary hover:bg-primary/5 group"
                onClick={() => onAddBlock(block.name)}
              >
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">{block.label}</span>
                <span className="text-[10px] text-muted-foreground leading-tight hidden sm:block">
                  {block.description}
                </span>
              </Button>
            )
          })}
        </div>

        {/* Help Tip */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg py-2 px-4">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
          <span>
            <strong className="font-medium">Tip:</strong> Drag components from the left panel or use keyboard shortcut <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px] font-mono">Ctrl+K</kbd> to search
          </span>
        </div>
      </div>
    </div>
  )
}
