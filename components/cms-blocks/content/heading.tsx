'use client'

import { cn } from '@/lib/utils'
import type { HeadingProps } from '@/lib/cms/registry-types'
import { InlineEditor } from '@/components/page-builder/elementor/inline-editor'
import * as LucideIcons from 'lucide-react'

export default function Heading({
  text = 'Heading',
  level = 'h2',
  alignment = 'left',
  color,
  className,
  isEditing,
  id,
  style,
  ...restProps
}: HeadingProps) {
  // Extract custom _styles and _icon from props (comes from database)
  const customProps = restProps as any
  const _styles = customProps._styles || {}
  const _icon = customProps._icon || null

  // Determine if this is a section heading (h2, h3) that should have extra styling
  const isSectionHeading = level === 'h2' || level === 'h3'

  // Merge custom styles from database with component styles
  const mergedStyles: React.CSSProperties = {
    ...style,
    // Typography
    color: _styles.typography?.color || color || undefined,
    fontSize: _styles.typography?.fontSize || undefined,
    fontWeight: _styles.typography?.fontWeight || undefined,
    // Spacing
    ..._styles.spacing,
    // Background
    backgroundColor: _styles.background?.backgroundColor || undefined,
    backgroundImage: _styles.background?.backgroundImage || undefined,
    // Layout
    display: _styles.layout?.display || undefined,
    alignItems: _styles.layout?.alignItems || undefined,
    gap: _styles.layout?.gap || undefined,
    // Glassmorphism effects
    backdropFilter: _styles.effects?.backdropFilter || undefined,
    WebkitBackdropFilter: _styles.effects?.WebkitBackdropFilter || undefined,
    boxShadow: _styles.effects?.boxShadow || undefined,
    // Border
    border: _styles.effects?.border || _styles.spacing?.border || undefined,
    borderRadius: _styles.spacing?.borderRadius || undefined,
  } as React.CSSProperties

  const headingClasses = cn(
    // Base typography
    'font-bold tracking-tight',
    // Size classes with responsive scaling (only if no custom fontSize)
    !_styles.typography?.fontSize && level === 'h1' && 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    !_styles.typography?.fontSize && level === 'h2' && 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    !_styles.typography?.fontSize && level === 'h3' && 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
    !_styles.typography?.fontSize && level === 'h4' && 'text-base sm:text-lg md:text-xl lg:text-2xl',
    !_styles.typography?.fontSize && level === 'h5' && 'text-sm sm:text-base md:text-lg lg:text-xl',
    !_styles.typography?.fontSize && level === 'h6' && 'text-sm sm:text-base md:text-lg',
    // Default color if not specified
    !color && !_styles.typography?.color && 'text-gray-900',
    // Alignment
    `text-${alignment}`,
    // Section headings get extra spacing (unless custom spacing is provided)
    isSectionHeading && !_styles.spacing && 'mb-4 md:mb-6',
    className
  )

  // Get icon component if specified
  let IconComponent = null
  if (_icon && _icon.name) {
    const iconName = _icon.name as keyof typeof LucideIcons
    IconComponent = LucideIcons[iconName] as any
  }

  const headingContent = (
    <>
      {IconComponent && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: _icon.background || undefined,
            borderRadius: _icon.borderRadius || undefined,
            padding: _icon.padding || undefined,
          }}
        >
          <IconComponent
            size={_icon.size || 24}
            color={_icon.color || 'currentColor'}
            strokeWidth={_icon.strokeWidth || 2}
          />
        </span>
      )}
      <span>{text || 'Heading'}</span>
    </>
  )

  if (isEditing && id) {
    // Use InlineEditor in edit mode for click-to-edit functionality
    // Note: Inline editor doesn't support style prop, styles are applied via className
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
      style={mergedStyles}
    >
      {headingContent}
    </Tag>
  )
}
