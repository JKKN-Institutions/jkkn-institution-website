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
        level === 'h1' && 'text-4xl md:text-5xl lg:text-6xl',
        level === 'h2' && 'text-3xl md:text-4xl',
        level === 'h3' && 'text-2xl md:text-3xl',
        level === 'h4' && 'text-xl md:text-2xl',
        level === 'h5' && 'text-lg md:text-xl',
        level === 'h6' && 'text-base md:text-lg',
        `text-${alignment}`,
        className
      )}
      style={{ color: color || undefined }}
    >
      {text || (isEditing ? 'Click to add heading' : null)}
    </Tag>
  )
}
