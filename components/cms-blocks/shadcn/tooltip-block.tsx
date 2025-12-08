'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

export interface ShadcnTooltipBlockProps {
  triggerText?: string
  content?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function ShadcnTooltipBlock({
  triggerText = 'Hover me',
  content = 'Tooltip content',
  side = 'top',
}: ShadcnTooltipBlockProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">{triggerText}</Button>
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ShadcnTooltipBlock
