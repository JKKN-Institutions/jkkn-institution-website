'use client'

import { cn } from '@/lib/utils'
import type { HeadingProps } from '@/lib/cms/registry-types'
import { InlineEditor } from '@/components/page-builder/elementor/inline-editor'

export default function Heading({
  text = 'Heading',
  level = 'h2',
  alignment = 'left',
  color,
  className,
  isEditing,
  id,
}: HeadingProps) {
  // Determine if this is a section heading (h2, h3) that should have extra styling
  const isSectionHeading = level === 'h2' || level === 'h3'

  const headingClasses = cn(
    // Base typography
    'font-bold tracking-tight',
    // Size classes with responsive scaling
    level === 'h1' && 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    level === 'h2' && 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    level === 'h3' && 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
    level === 'h4' && 'text-base sm:text-lg md:text-xl lg:text-2xl',
    level === 'h5' && 'text-sm sm:text-base md:text-lg lg:text-xl',
    level === 'h6' && 'text-sm sm:text-base md:text-lg',
    // Default color if not specified
    !color && 'text-gray-900',
    // Alignment
    `text-${alignment}`,
    // Section headings get extra spacing
    isSectionHeading && 'mb-4 md:mb-6',
    className
  )

  if (isEditing && id) {
    // Use InlineEditor in edit mode for click-to-edit functionality
    return (
      <InlineEditor
        blockId={id}
        propName="text"
        value={text}
        className={headingClasses}
        tag={level}
        placeholder="Click to add heading"
        multiline={false}
      />
    )
  }

  // Preview mode or when no ID - render as static heading
  const Tag = level
  return (
    <Tag
      className={headingClasses}
      style={{ color: color || undefined }}
    >
      {text || 'Heading'}
    </Tag>
  )
}
