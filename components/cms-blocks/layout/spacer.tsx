'use client'

import { cn } from '@/lib/utils'
import type { SpacerProps } from '@/lib/cms/registry-types'

export default function Spacer({
  height = '8',
  responsive = { sm: '4', md: '6', lg: '8' },
  className,
  isEditing,
}: SpacerProps) {
  return (
    <div
      className={cn(
        isEditing && 'bg-muted/50 border-y border-dashed border-muted-foreground/25 relative',
        className
      )}
      style={{
        height: `${Number(height) * 0.25}rem`,
      }}
    >
      {isEditing && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-background px-2">
          Spacer ({height})
        </span>
      )}
    </div>
  )
}
