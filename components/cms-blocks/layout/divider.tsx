'use client'

import { cn } from '@/lib/utils'
import type { DividerProps } from '@/lib/cms/registry-types'

export default function Divider({
  style: dividerStyle = 'solid',
  color,
  thickness = 1,
  width = 'full',
  className,
}: DividerProps) {
  const styleClasses: Record<string, string> = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  }

  const widthClasses: Record<string, string> = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/4': 'w-1/4',
  }

  return (
    <hr
      className={cn(
        'mx-auto my-8',
        styleClasses[dividerStyle],
        widthClasses[width],
        !color && 'border-border',
        className
      )}
      style={{
        borderTopWidth: thickness,
        borderColor: color || undefined,
      }}
    />
  )
}
