'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { Megaphone, Newspaper, Bell, AlertCircle, Sparkles } from 'lucide-react'
import { DEFAULT_COLOR_SCHEME } from '@/lib/cms/brand-colors'
import Link from 'next/link'

/**
 * News item schema
 */
export const NewsItemSchema = z.object({
  text: z.string().describe('News text'),
  link: z.string().optional().describe('Optional link URL'),
  isHighlight: z.boolean().default(false).describe('Highlight this item'),
})

export type NewsItem = z.infer<typeof NewsItemSchema>

/**
 * NewsTicker props schema
 */
export const NewsTickerPropsSchema = z.object({
  // Content
  label: z.string().default('NEWS').describe('Label text (e.g., NEWS, UPDATES)'),
  items: z.array(NewsItemSchema).default([]).describe('News items to display'),
  separator: z.string().default('|').describe('Separator between items'),

  // Styling
  backgroundColor: z.string().default('#171717').describe('Background color (Brand Dark)'),
  labelBackgroundColor: z.string().default('#085032').describe('Label background color (Green Dark)'),
  textColor: z.string().default('#ffffff').describe('Text color'),
  highlightColor: z.string().default(DEFAULT_COLOR_SCHEME.secondary).describe('Highlight text color'),
  separatorColor: z.string().default('rgba(255,255,255,0.5)').describe('Separator color'),

  // Icon
  icon: z.enum(['megaphone', 'newspaper', 'bell', 'alert', 'sparkles', 'none']).default('megaphone').describe('Label icon'),

  // Animation
  speed: z.enum(['slow', 'normal', 'fast']).default('normal').describe('Scroll speed'),
  pauseOnHover: z.boolean().default(true).describe('Pause animation on hover'),
  direction: z.enum(['left', 'right']).default('left').describe('Scroll direction'),

  // Layout
  height: z.enum(['sm', 'md', 'lg']).default('md').describe('Ticker height'),
  showLabel: z.boolean().default(true).describe('Show the label section'),
})

export type NewsTickerProps = z.infer<typeof NewsTickerPropsSchema> & BaseBlockProps

/**
 * NewsTicker Component
 *
 * A scrolling news ticker/marquee for announcements and updates.
 * Features:
 * - Infinite smooth scrolling animation
 * - Customizable speed and direction
 * - Pause on hover
 * - Highlighted items
 * - Brand color integration
 * - Multiple icon options
 */
export function NewsTicker({
  label = 'NEWS',
  items = [],
  separator = '|',
  backgroundColor = '#171717',
  labelBackgroundColor = '#085032',
  textColor = '#ffffff',
  highlightColor = DEFAULT_COLOR_SCHEME.secondary,
  separatorColor = 'rgba(255,255,255,0.5)',
  icon = 'megaphone',
  speed = 'normal',
  pauseOnHover = true,
  direction = 'left',
  height = 'md',
  showLabel = true,
  className,
  isEditing,
}: NewsTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)

  // Measure content width for animation
  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth / 2)
    }
  }, [items])

  // Icon mapping
  const IconComponent = {
    megaphone: Megaphone,
    newspaper: Newspaper,
    bell: Bell,
    alert: AlertCircle,
    sparkles: Sparkles,
    none: null,
  }[icon]

  // Speed mapping (duration in seconds)
  const speedDuration = {
    slow: 40,
    normal: 25,
    fast: 15,
  }[speed]

  // Height mapping
  const heightClasses = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-14',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  // Build the news items content (duplicated for seamless loop)
  const renderNewsItems = () => {
    if (items.length === 0) {
      return (
        <span className="px-4" style={{ color: textColor }}>
          Add news items to display...
        </span>
      )
    }

    return items.map((item, index) => (
      <span key={index} className="inline-flex items-center">
        {item.link ? (
          <Link
            href={item.link}
            className={cn(
              'hover:underline transition-colors',
              item.isHighlight && 'font-semibold'
            )}
            style={{ color: item.isHighlight ? highlightColor : textColor }}
          >
            {item.text}
          </Link>
        ) : (
          <span
            className={cn(item.isHighlight && 'font-semibold')}
            style={{ color: item.isHighlight ? highlightColor : textColor }}
          >
            {item.text}
          </span>
        )}
        {index < items.length - 1 && (
          <span
            className="mx-4 font-light"
            style={{ color: separatorColor }}
          >
            {separator}
          </span>
        )}
      </span>
    ))
  }

  // Animation keyframes style
  const animationStyle = {
    '--ticker-duration': `${speedDuration}s`,
    '--ticker-direction': direction === 'left' ? 'normal' : 'reverse',
  } as React.CSSProperties

  return (
    <div
      className={cn(
        'relative overflow-hidden w-full shadow-lg border-t border-b border-black/10',
        heightClasses[height],
        className
      )}
      style={{ backgroundColor }}
    >
      <div className="flex items-center h-full">
        {/* Label Section */}
        {showLabel && (
          <div
            className={cn(
              'flex items-center gap-2 px-4 h-full shrink-0 z-10',
              textSizeClasses[height]
            )}
            style={{ backgroundColor: labelBackgroundColor }}
          >
            {IconComponent && (
              <IconComponent
                className={cn(
                  height === 'sm' ? 'h-4 w-4' : height === 'md' ? 'h-5 w-5' : 'h-6 w-6'
                )}
                style={{ color: textColor }}
              />
            )}
            <span
              className="font-bold uppercase tracking-wider"
              style={{ color: textColor }}
            >
              {label}
            </span>
          </div>
        )}

        {/* Marquee Container */}
        <div
          ref={containerRef}
          className={cn(
            'flex-1 overflow-hidden relative',
            pauseOnHover && 'group'
          )}
        >
          {/* Gradient fade on edges */}
          <div
            className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${backgroundColor}, transparent)`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${backgroundColor}, transparent)`,
            }}
          />

          {/* Scrolling Content */}
          <div
            ref={contentRef}
            className={cn(
              'inline-flex items-center whitespace-nowrap animate-ticker',
              textSizeClasses[height],
              pauseOnHover && 'group-hover:[animation-play-state:paused]',
              isEditing && '[animation-play-state:paused]'
            )}
            style={animationStyle}
          >
            {/* First copy */}
            <div className="inline-flex items-center px-4">
              {renderNewsItems()}
            </div>
            {/* Separator */}
            {items.length > 0 && (
              <span
                className="mx-4 font-light"
                style={{ color: separatorColor }}
              >
                {separator}
              </span>
            )}
            {/* Second copy for seamless loop */}
            <div className="inline-flex items-center px-4">
              {renderNewsItems()}
            </div>
            {items.length > 0 && (
              <span
                className="mx-4 font-light"
                style={{ color: separatorColor }}
              >
                {separator}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker var(--ticker-duration, 25s) linear infinite;
          animation-direction: var(--ticker-direction, normal);
        }
      `}</style>
    </div>
  )
}

export default NewsTicker
