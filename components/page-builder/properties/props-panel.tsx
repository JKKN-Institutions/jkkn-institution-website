'use client'

import { usePageBuilder } from '../page-builder-provider'
import { DynamicForm } from './dynamic-form'
import { getComponentEntry } from '@/lib/cms/component-registry'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Settings, Info } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function PropsPanel() {
  const { selectedBlock, updateBlock } = usePageBuilder()

  if (!selectedBlock) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Properties</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Select a block to edit its properties
            </p>
          </div>
        </div>
      </div>
    )
  }

  const entry = getComponentEntry(selectedBlock.component_name)

  if (!entry) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Properties</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-sm text-red-600">
              Unknown component: {selectedBlock.component_name}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Get icon component safely
  const iconName = entry.icon as keyof typeof LucideIcons
  const IconComponent = (LucideIcons[iconName] as LucideIcon) || Settings

  const handlePropsChange = (newProps: Record<string, unknown>) => {
    updateBlock(selectedBlock.id, newProps)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
            <IconComponent className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{entry.displayName}</h2>
            {entry.description && (
              <p className="text-xs text-muted-foreground">{entry.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <DynamicForm
            componentEntry={entry}
            values={selectedBlock.props}
            onChange={handlePropsChange}
          />
        </div>
      </ScrollArea>

      {/* Info Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            Changes are saved automatically. Press Ctrl+S to save immediately.
          </p>
        </div>
      </div>
    </div>
  )
}
