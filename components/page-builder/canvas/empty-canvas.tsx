'use client'

import { useDroppable } from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Layout, Image as ImageIcon, Type } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyCanvasProps {
  onAddBlock: (componentName: string) => void
}

const quickStartBlocks = [
  { name: 'HeroSection', icon: Layout, label: 'Hero Section' },
  { name: 'Heading', icon: Type, label: 'Heading' },
  { name: 'TextEditor', icon: FileText, label: 'Text Block' },
  { name: 'ImageBlock', icon: ImageIcon, label: 'Image' },
]

export function EmptyCanvas({ onAddBlock }: EmptyCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'empty-canvas-drop-zone',
  })

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
      <div className="text-center max-w-md">
        <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          Start Building Your Page
        </h3>
        <p className="text-muted-foreground mb-6">
          Drag components from the left panel or choose a starter block below
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickStartBlocks.map((block) => {
            const Icon = block.icon
            return (
              <Button
                key={block.name}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
                onClick={() => onAddBlock(block.name)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{block.label}</span>
              </Button>
            )
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Or drag any component from the palette on the left
        </p>
      </div>
    </div>
  )
}
