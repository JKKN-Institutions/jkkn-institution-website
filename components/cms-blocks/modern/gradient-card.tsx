'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DEFAULT_COLOR_SCHEME, BRAND_GRADIENTS } from '@/lib/cms/brand-colors'
import Image from 'next/image'
import Link from 'next/link'

/**
 * GradientCard props schema
 */
export const GradientCardPropsSchema = z.object({
  // Content
  title: z.string().default('Card Title').describe('Card title'),
  description: z.string().optional().describe('Card description'),
  image: z.string().optional().describe('Header image URL'),
  imageAlt: z.string().default('').describe('Image alt text for accessibility'),
  icon: z.string().optional().describe('Lucide icon name'),
  badge: z.string().optional().describe('Badge text'),
  link: z.string().optional().describe('Card link URL'),
  ctaText: z.string().optional().describe('CTA button text'),

  // Layout
  variant: z.enum(['default', 'glass', 'gradient-border', 'gradient-bg', 'glow']).default('default').describe('Card style'),
  size: z.enum(['sm', 'md', 'lg']).default('md').describe('Card size'),
  alignment: z.enum(['left', 'center']).default('left').describe('Content alignment'),
  imagePosition: z.enum(['top', 'left', 'background']).default('top').describe('Image position'),

  // Styling
  gradient: z.string().default(BRAND_GRADIENTS[0].value).describe('Gradient for border or background'),
  backgroundColor: z.string().default('#ffffff').describe('Card background color'),
  titleColor: z.string().default(DEFAULT_COLOR_SCHEME.text).describe('Title color'),
  textColor: z.string().default(DEFAULT_COLOR_SCHEME.textMuted).describe('Text color'),
  accentColor: z.string().default(DEFAULT_COLOR_SCHEME.primary).describe('Accent color'),
  borderRadius: z.enum(['sm', 'md', 'lg', 'xl', '2xl', 'full']).default('xl').describe('Border radius'),

  // Effects
  glassBlur: z.number().min(0).max(20).default(10).describe('Glass blur amount'),
  glowIntensity: z.enum(['subtle', 'medium', 'strong']).default('medium').describe('Glow intensity'),
  hoverEffect: z.enum(['none', 'lift', 'glow', 'scale', 'border-glow']).default('lift').describe('Hover animation'),
  shadowSize: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('md').describe('Shadow size'),
})

export type GradientCardProps = z.infer<typeof GradientCardPropsSchema> & BaseBlockProps

/**
 * GradientCard Component
 *
 * A modern card with gradient effects and glassmorphism.
 * Features:
 * - Gradient border or background
 * - Glassmorphism effect
 * - Glow effects
 * - Multiple layout options
 * - Hover animations
 */
export function GradientCard({
  title = 'Card Title',
  description,
  image,
  imageAlt = '',
  icon,
  badge,
  link,
  ctaText,
  variant = 'default',
  size = 'md',
  alignment = 'left',
  imagePosition = 'top',
  gradient = BRAND_GRADIENTS[0].value,
  backgroundColor = '#ffffff',
  titleColor = DEFAULT_COLOR_SCHEME.text,
  textColor = DEFAULT_COLOR_SCHEME.textMuted,
  accentColor = DEFAULT_COLOR_SCHEME.primary,
  borderRadius = 'xl',
  glassBlur = 10,
  glowIntensity = 'medium',
  hoverEffect = 'lift',
  shadowSize = 'md',
  className,
  isEditing,
}: GradientCardProps) {
  // Get Lucide icon component
  const IconComponent = icon
    ? (LucideIcons as unknown as Record<string, LucideIcon>)[icon]
    : null

  // Size classes
  const sizeClasses = {
    sm: 'max-w-[280px]',
    md: 'max-w-[360px]',
    lg: 'max-w-[480px]',
  }

  // Border radius classes
  const radiusClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-3xl',
  }

  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  }

  // Hover effect classes
  const hoverClasses = {
    none: '',
    lift: 'hover:-translate-y-2 hover:shadow-xl',
    glow: '',
    scale: 'hover:scale-[1.02]',
    'border-glow': '',
  }

  // Glow intensity styles
  const glowStyles = {
    subtle: '0 0 20px',
    medium: '0 0 40px',
    strong: '0 0 60px',
  }

  // Build wrapper styles based on variant
  const getWrapperStyles = () => {
    switch (variant) {
      case 'gradient-border':
        return {
          background: gradient,
          padding: '2px',
        }
      case 'glow':
        return {
          boxShadow: `${glowStyles[glowIntensity]} ${accentColor}40`,
        }
      default:
        return {}
    }
  }

  // Build inner card styles based on variant
  const getInnerStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: `${backgroundColor}80`,
          backdropFilter: `blur(${glassBlur}px)`,
          WebkitBackdropFilter: `blur(${glassBlur}px)`,
        }
      case 'gradient-bg':
        return {
          background: gradient,
        }
      case 'gradient-border':
      case 'default':
      case 'glow':
      default:
        return {
          backgroundColor,
        }
    }
  }

  // Determine text colors based on variant
  const effectiveTitleColor = variant === 'gradient-bg' ? '#ffffff' : titleColor
  const effectiveTextColor = variant === 'gradient-bg' ? 'rgba(255,255,255,0.8)' : textColor

  const cardContent = (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        sizeClasses[size],
        radiusClasses[borderRadius],
        shadowClasses[shadowSize],
        hoverClasses[hoverEffect],
        variant === 'glass' && 'border border-white/20',
        'group',
        className
      )}
      style={getWrapperStyles()}
    >
      {/* Inner content */}
      <div
        className={cn(
          'relative h-full',
          radiusClasses[borderRadius],
          variant === 'gradient-border' && 'bg-white'
        )}
        style={getInnerStyles()}
      >
        {/* Background image */}
        {image && imagePosition === 'background' && (
          <div className="absolute inset-0 z-0">
            <Image
              src={image}
              alt={imageAlt || title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}

        {/* Header image */}
        {image && imagePosition === 'top' && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={image}
              alt={imageAlt || title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(to top, ${accentColor}20, transparent)` }}
            />
          </div>
        )}

        {/* Content area */}
        <div
          className={cn(
            'relative z-10 p-6',
            alignment === 'center' && 'text-center',
            imagePosition === 'background' && 'h-full flex flex-col justify-end min-h-[280px]'
          )}
        >
          {/* Badge */}
          {badge && (
            <div
              className={cn(
                'inline-block px-3 py-1 text-xs font-medium rounded-full mb-4',
                variant === 'gradient-bg' || imagePosition === 'background'
                  ? 'bg-white/20 text-white'
                  : ''
              )}
              style={{
                backgroundColor:
                  variant !== 'gradient-bg' && imagePosition !== 'background'
                    ? `${accentColor}15`
                    : undefined,
                color:
                  variant !== 'gradient-bg' && imagePosition !== 'background'
                    ? accentColor
                    : undefined,
              }}
            >
              {badge}
            </div>
          )}

          {/* Icon */}
          {IconComponent && !image && (
            <div
              className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
                alignment === 'center' && 'mx-auto',
                variant === 'gradient-bg' ? 'bg-white/20' : ''
              )}
              style={{
                backgroundColor: variant !== 'gradient-bg' ? `${accentColor}15` : undefined,
              }}
            >
              <IconComponent
                className="h-7 w-7"
                style={{
                  color: variant === 'gradient-bg' ? '#ffffff' : accentColor,
                }}
              />
            </div>
          )}

          {/* Title */}
          <h3
            className="text-xl font-semibold mb-2 group-hover:translate-x-1 transition-transform"
            style={{ color: effectiveTitleColor }}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: effectiveTextColor }}
            >
              {description}
            </p>
          )}

          {/* CTA Button */}
          {ctaText && (
            <div
              className={cn(
                'mt-auto pt-4',
                alignment === 'center' && 'flex justify-center'
              )}
            >
              <span
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-medium',
                  'group-hover:gap-3 transition-all'
                )}
                style={{ color: variant === 'gradient-bg' ? '#ffffff' : accentColor }}
              >
                {ctaText}
                <LucideIcons.ArrowRight className="h-4 w-4" />
              </span>
            </div>
          )}
        </div>

        {/* Hover glow effect */}
        {hoverEffect === 'glow' && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              boxShadow: `inset 0 0 30px ${accentColor}30`,
            }}
          />
        )}

        {/* Border glow effect */}
        {hoverEffect === 'border-glow' && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              boxShadow: `0 0 20px ${accentColor}40, inset 0 0 20px ${accentColor}10`,
            }}
          />
        )}
      </div>
    </div>
  )

  // Wrap with Link if provided
  if (link) {
    return (
      <Link href={link} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

export default GradientCard
