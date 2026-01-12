'use client'

import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'

export interface ContentCardProps {
  /**
   * Card title/heading
   */
  title: string

  /**
   * Lucide icon name (e.g., 'BookOpen', 'GraduationCap')
   */
  icon?: string

  /**
   * Icon color (default: JKKN green)
   */
  iconColor?: string

  /**
   * Icon background color (default: light green)
   */
  iconBackground?: string

  /**
   * Icon size in pixels (default: 28)
   */
  iconSize?: number

  /**
   * HTML content to render in card body
   */
  htmlContent?: string

  /**
   * Card background color (default: white)
   */
  backgroundColor?: string

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Edit mode flag
   */
  isEditing?: boolean

  /**
   * Block ID for edit mode
   */
  id?: string
}

export default function ContentCard({
  title,
  icon = 'BookOpen',
  iconColor = '#0b6d41',
  iconBackground = 'rgba(234, 241, 226, 0.5)',
  iconSize = 28,
  htmlContent,
  backgroundColor = '#ffffff',
  className,
  isEditing,
  id,
}: ContentCardProps) {
  // Get icon component
  const IconComponent = icon
    ? (LucideIcons[icon as keyof typeof LucideIcons] as any)
    : null

  return (
    <div
      className={cn(
        // Base styles
        'group relative flex flex-col',
        // Spacing
        'p-0',
        // Transitions
        'transition-all duration-300',
        className
      )}
      style={{ backgroundColor: 'transparent' }}
      data-block-id={id}
    >
      {/* Icon + Title Header */}
      <div
        className="flex items-center gap-4 mb-0 p-6"
        style={{ backgroundColor: backgroundColor }}
      >
        {/* Icon Circle */}
        {IconComponent && (
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              backgroundColor: iconBackground,
              width: '64px',
              height: '64px',
            }}
          >
            <IconComponent
              size={iconSize}
              color={iconColor}
              strokeWidth={2}
            />
          </div>
        )}

        {/* Title */}
        <h3
          className="text-xl md:text-2xl font-bold m-0"
          style={{ color: iconColor }}
        >
          {title}
        </h3>
      </div>

      {/* Content Body */}
      {htmlContent && (
        <div
          className={cn(
            // Card styling
            'rounded-lg',
            // Background and border
            'border border-gray-100',
            // Shadow
            'shadow-sm',
            // Padding
            'p-6 pt-4',
            // Hover effect
            'group-hover:shadow-md',
            // Transitions
            'transition-all duration-300'
          )}
          style={{ backgroundColor: backgroundColor }}
        >
          <div
            className={cn(
              // Prose styling for content
              'prose prose-slate dark:prose-invert max-w-none',
              // Typography
              'text-gray-800 leading-relaxed'
            )}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}
    </div>
  )
}
