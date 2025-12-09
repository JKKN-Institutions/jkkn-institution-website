'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DEFAULT_COLOR_SCHEME } from '@/lib/cms/brand-colors'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Bento grid item schema
 */
export const BentoItemSchema = z.object({
  title: z.string().describe('Item title'),
  description: z.string().optional().describe('Item description'),
  image: z.string().optional().describe('Background image URL'),
  icon: z.string().optional().describe('Lucide icon name'),
  link: z.string().optional().describe('Link URL'),
  size: z.enum(['1x1', '2x1', '1x2', '2x2']).default('1x1').describe('Grid size'),
  variant: z.enum(['default', 'glass', 'gradient', 'image']).default('default').describe('Card style'),
  accentColor: z.string().optional().describe('Accent color for this item'),
})

export type BentoItem = z.infer<typeof BentoItemSchema>

/**
 * BentoGrid props schema
 */
export const BentoGridPropsSchema = z.object({
  // Content
  title: z.string().optional().describe('Section title'),
  subtitle: z.string().optional().describe('Section subtitle'),
  items: z.array(BentoItemSchema).default([]).describe('Grid items'),

  // Layout
  columns: z.number().min(2).max(6).default(4).describe('Number of columns'),
  gap: z.number().min(2).max(8).default(4).describe('Gap between items'),
  minItemHeight: z.string().default('200px').describe('Minimum item height'),

  // Styling
  variant: z.enum(['default', 'glass', 'gradient', 'mixed']).default('default').describe('Overall style'),
  backgroundColor: z.string().default('transparent').describe('Section background'),
  cardBackgroundColor: z.string().default('#ffffff').describe('Default card background'),
  titleColor: z.string().default(DEFAULT_COLOR_SCHEME.text).describe('Title color'),
  textColor: z.string().default(DEFAULT_COLOR_SCHEME.textMuted).describe('Text color'),
  accentColor: z.string().default(DEFAULT_COLOR_SCHEME.primary).describe('Accent color'),

  // Animation
  hoverEffect: z.enum(['none', 'lift', 'glow', 'scale']).default('lift').describe('Hover animation'),
  entranceAnimation: z.boolean().default(true).describe('Animate items on scroll'),
})

export type BentoGridProps = z.infer<typeof BentoGridPropsSchema> & BaseBlockProps

/**
 * Individual Bento Item Component
 */
function BentoGridItem({
  item,
  index,
  variant,
  cardBackgroundColor,
  titleColor,
  textColor,
  accentColor,
  hoverEffect,
  entranceAnimation,
  minItemHeight,
}: {
  item: BentoItem
  index: number
  variant: BentoGridProps['variant']
  cardBackgroundColor: string
  titleColor: string
  textColor: string
  accentColor: string
  hoverEffect: BentoGridProps['hoverEffect']
  entranceAnimation: boolean
  minItemHeight: string
}) {
  // Get Lucide icon component
  const IconComponent = item.icon
    ? (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon]
    : null

  // Determine grid span based on size
  const sizeClasses = {
    '1x1': 'col-span-1 row-span-1',
    '2x1': 'col-span-2 row-span-1',
    '1x2': 'col-span-1 row-span-2',
    '2x2': 'col-span-2 row-span-2',
  }

  // Determine variant styling
  const itemVariant = variant === 'mixed' ? item.variant : variant
  const effectiveAccentColor = item.accentColor || accentColor

  const variantClasses = cn(
    'relative overflow-hidden rounded-2xl transition-all duration-300',
    itemVariant === 'default' && 'bg-white border border-gray-100',
    itemVariant === 'glass' && 'bg-white/10 backdrop-blur-md border border-white/20',
    itemVariant === 'gradient' && 'bg-gradient-to-br',
    itemVariant === 'image' && 'bg-cover bg-center'
  )

  // Hover effect classes
  const hoverClasses = cn(
    hoverEffect === 'lift' && 'hover:-translate-y-2 hover:shadow-xl',
    hoverEffect === 'glow' && 'hover:shadow-[0_0_30px_rgba(11,109,65,0.3)]',
    hoverEffect === 'scale' && 'hover:scale-[1.02]'
  )

  // Animation classes
  const animationClasses = cn(
    entranceAnimation && 'animate-on-scroll fade-in-up'
  )

  // Stagger animation delay
  const animationDelay = entranceAnimation ? `${index * 100}ms` : undefined

  const content = (
    <div
      className={cn(
        sizeClasses[item.size],
        variantClasses,
        hoverClasses,
        animationClasses,
        'group cursor-pointer'
      )}
      style={{
        minHeight: item.size.includes('2') ? `calc(${minItemHeight} * 2 + 1rem)` : minItemHeight,
        backgroundColor: itemVariant === 'default' ? cardBackgroundColor : undefined,
        backgroundImage:
          itemVariant === 'image' && item.image
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${item.image})`
            : itemVariant === 'gradient'
            ? `linear-gradient(135deg, ${effectiveAccentColor}, ${effectiveAccentColor}dd)`
            : undefined,
        animationDelay,
      }}
    >
      {/* Image background for default variant */}
      {item.image && itemVariant !== 'image' && (
        <div className="absolute inset-0 z-0">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover opacity-20 group-hover:opacity-30 transition-opacity"
          />
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-10 h-full p-6 flex flex-col',
          item.size === '2x2' ? 'justify-between' : 'justify-end'
        )}
      >
        {/* Icon */}
        {IconComponent && (
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center mb-auto',
              itemVariant === 'image' || itemVariant === 'gradient'
                ? 'bg-white/20'
                : 'bg-opacity-10'
            )}
            style={{
              backgroundColor:
                itemVariant === 'image' || itemVariant === 'gradient'
                  ? 'rgba(255,255,255,0.2)'
                  : `${effectiveAccentColor}15`,
            }}
          >
            <IconComponent
              className="h-6 w-6"
              style={{
                color:
                  itemVariant === 'image' || itemVariant === 'gradient'
                    ? '#ffffff'
                    : effectiveAccentColor,
              }}
            />
          </div>
        )}

        {/* Text content */}
        <div className={cn(item.size === '2x2' && 'mt-auto')}>
          <h3
            className={cn(
              'font-semibold mb-2 group-hover:translate-x-1 transition-transform',
              item.size === '2x2' ? 'text-2xl' : 'text-lg'
            )}
            style={{
              color:
                itemVariant === 'image' || itemVariant === 'gradient'
                  ? '#ffffff'
                  : titleColor,
            }}
          >
            {item.title}
          </h3>

          {item.description && (
            <p
              className={cn(
                'line-clamp-3',
                item.size === '2x2' ? 'text-base' : 'text-sm'
              )}
              style={{
                color:
                  itemVariant === 'image' || itemVariant === 'gradient'
                    ? 'rgba(255,255,255,0.8)'
                    : textColor,
              }}
            >
              {item.description}
            </p>
          )}
        </div>

        {/* Arrow indicator for linked items */}
        {item.link && (
          <div
            className={cn(
              'absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center',
              'opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all'
            )}
            style={{
              backgroundColor:
                itemVariant === 'image' || itemVariant === 'gradient'
                  ? 'rgba(255,255,255,0.2)'
                  : `${effectiveAccentColor}15`,
            }}
          >
            <LucideIcons.ArrowRight
              className="h-4 w-4"
              style={{
                color:
                  itemVariant === 'image' || itemVariant === 'gradient'
                    ? '#ffffff'
                    : effectiveAccentColor,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )

  // Wrap with Link if link is provided
  if (item.link) {
    return (
      <Link
        href={item.link}
        className={cn(sizeClasses[item.size], 'block')}
      >
        {content}
      </Link>
    )
  }

  return content
}

/**
 * BentoGrid Component
 *
 * A modern asymmetric grid layout for showcasing content.
 * Features:
 * - Variable cell sizes (1x1, 2x1, 1x2, 2x2)
 * - Glassmorphism and gradient variants
 * - Image backgrounds
 * - Hover animations
 * - Scroll-triggered entrance animations
 */
export function BentoGrid({
  title,
  subtitle,
  items = [],
  columns = 4,
  gap = 4,
  minItemHeight = '200px',
  variant = 'default',
  backgroundColor = 'transparent',
  cardBackgroundColor = '#ffffff',
  titleColor = DEFAULT_COLOR_SCHEME.text,
  textColor = DEFAULT_COLOR_SCHEME.textMuted,
  accentColor = DEFAULT_COLOR_SCHEME.primary,
  hoverEffect = 'lift',
  entranceAnimation = true,
  className,
  isEditing,
}: BentoGridProps) {
  // Column classes
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-2 lg:grid-cols-6',
  }

  // Gap classes
  const gapClasses = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    7: 'gap-7',
    8: 'gap-8',
  }

  return (
    <section
      className={cn('py-16 px-4', className)}
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: titleColor }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: textColor }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Bento Grid */}
        <div
          className={cn(
            'grid auto-rows-min',
            columnClasses[columns as keyof typeof columnClasses],
            gapClasses[gap as keyof typeof gapClasses]
          )}
        >
          {items.map((item, index) => (
            <BentoGridItem
              key={index}
              item={item}
              index={index}
              variant={variant}
              cardBackgroundColor={cardBackgroundColor}
              titleColor={titleColor}
              textColor={textColor}
              accentColor={accentColor}
              hoverEffect={hoverEffect}
              entranceAnimation={entranceAnimation}
              minItemHeight={minItemHeight}
            />
          ))}
        </div>

        {/* Empty state for editor */}
        {items.length === 0 && isEditing && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
            <p>Add items to display in the Bento grid</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default BentoGrid
