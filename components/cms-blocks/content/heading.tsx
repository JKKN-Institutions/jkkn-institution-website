'use client'

import { cn } from '@/lib/utils'
import type { HeadingProps } from '@/lib/cms/registry-types'
import type { JSX } from 'react'

export default function Heading({
  text = 'Heading',
  level = 'h2',
  alignment = 'left',
  color,
  className,
  isEditing,
}: HeadingProps) {
  const Tag = level as keyof JSX.IntrinsicElements

  return (
    <Tag
      className={cn(
        'font-bold tracking-tight',
        level === 'h1' && 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
        level === 'h2' && 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
        level === 'h3' && 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
        level === 'h4' && 'text-base sm:text-lg md:text-xl lg:text-2xl',
        level === 'h5' && 'text-sm sm:text-base md:text-lg lg:text-xl',
        level === 'h6' && 'text-sm sm:text-base md:text-lg',
        `text-${alignment}`,
        className
      )}
      style={{ color: color || undefined }}
    >
      {text || (isEditing ? 'Click to add heading' : null)}
    </Tag>
  )
}
