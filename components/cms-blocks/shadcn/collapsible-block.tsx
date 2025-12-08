'use client'

import { useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'

export interface ShadcnCollapsibleBlockProps {
  triggerText?: string
  content?: string
  defaultOpen?: boolean
}

export function ShadcnCollapsibleBlock({
  triggerText = 'Toggle',
  content = 'Collapsible content goes here.',
  defaultOpen = false,
}: ShadcnCollapsibleBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">{triggerText}</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 text-sm">
          {content}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default ShadcnCollapsibleBlock
