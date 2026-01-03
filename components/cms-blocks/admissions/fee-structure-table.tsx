'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { IndianRupee, Info } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import type { FeeStructureTableProps } from '@/lib/cms/registry-types'
import {
  glassStyles,
  backgroundStyles,
  isDarkBackground,
  getStaggerDelay,
} from './shared/admission-glass-styles'

// Intersection Observer hook
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Format currency
function formatCurrency(amount: number, symbol: string = '₹', locale: string = 'en-IN'): string {
  return `${symbol}${amount.toLocaleString(locale)}`
}

export default function FeeStructureTable({
  badge = 'FEE STRUCTURE',
  title = 'Fee Structure Overview',
  titleAccentWord = 'Structure',
  subtitle = 'Transparent and affordable fee structure for all programs',
  fees = [],
  currencySymbol = '₹',
  currencyLocale = 'en-IN',
  showHostelFee = true,
  showOtherFees = false,
  footerNotes = [],
  backgroundColor = 'gradient-dark',
  showAnimations = true,
  titleColor,
  subtitleColor,
  accentColor = '#D4AF37',
  className,
  isEditing,
}: FeeStructureTableProps) {
  const sectionRef = useInView()
  const tableRef = useInView()

  const isDark = isDarkBackground(backgroundColor)

  // Parse title for accent word styling
  const titleParts = useMemo(() => {
    if (!titleAccentWord || !title.includes(titleAccentWord)) {
      return { before: title, accent: '', after: '' }
    }
    const parts = title.split(titleAccentWord)
    return {
      before: parts[0] || '',
      accent: titleAccentWord,
      after: parts[1] || '',
    }
  }, [title, titleAccentWord])

  // Calculate column count
  const columnCount = 2 + (showHostelFee ? 1 : 0) + (showOtherFees ? 1 : 0) + 1 // Program, Tuition, [Hostel], [Other], Total

  // Empty state for editing
  if (fees.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-white/25 rounded-lg">
            <p className="text-white/60 text-center">Click to add fee structure</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef.ref}
      className={cn('relative py-16 md:py-24 overflow-hidden', backgroundStyles[backgroundColor], className)}
    >
      {/* Decorative Patterns */}
      <DecorativePatterns variant="default" color={isDark ? 'white' : 'green'} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            'max-w-4xl mx-auto text-center mb-12 lg:mb-16',
            showAnimations && 'transition-all duration-700',
            showAnimations && (sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
          )}
        >
          {/* Badge */}
          {badge && (
            <div className="flex justify-center mb-4">
              <span className={glassStyles.sectionBadge}>
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h2
            className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ color: titleColor || (isDark ? '#ffffff' : '#1f2937') }}
          >
            {titleParts.before}
            {titleParts.accent && (
              <span style={{ color: accentColor }}>{titleParts.accent}</span>
            )}
            {titleParts.after}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="text-lg md:text-xl max-w-3xl mx-auto"
              style={{ color: subtitleColor || (isDark ? 'rgba(255,255,255,0.7)' : '#6b7280') }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Table */}
        <div
          ref={tableRef.ref}
          className={cn(
            'max-w-5xl mx-auto overflow-x-auto',
            glassStyles.tableContainer,
            showAnimations && 'transition-all duration-700',
            showAnimations && (tableRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
          )}
        >
          {/* Desktop Table Header */}
          <div
            className={cn(
              glassStyles.tableHeader,
              'hidden md:grid gap-4 px-6 py-4'
            )}
            style={{ gridTemplateColumns: `2fr repeat(${columnCount - 1}, 1fr)` }}
          >
            <div className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              Program
            </div>
            <div className={cn('font-semibold text-right', isDark ? 'text-white' : 'text-gray-900')}>
              Tuition Fee
            </div>
            {showHostelFee && (
              <div className={cn('font-semibold text-right', isDark ? 'text-white' : 'text-gray-900')}>
                Hostel Fee
              </div>
            )}
            {showOtherFees && (
              <div className={cn('font-semibold text-right', isDark ? 'text-white' : 'text-gray-900')}>
                Other Fees
              </div>
            )}
            <div className={cn('font-semibold text-right', isDark ? 'text-white' : 'text-gray-900')}>
              Total
            </div>
          </div>

          {/* Table Body */}
          <div>
            {fees.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'px-6 py-4',
                  index % 2 === 0 ? glassStyles.tableRow : glassStyles.tableRowAlt,
                  glassStyles.tableRowHover,
                  // Mobile: card layout
                  'flex flex-col gap-3 md:grid md:gap-4 md:items-center',
                  // Animation
                  showAnimations && 'transition-all duration-500',
                  showAnimations && tableRef.isInView
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-4'
                )}
                style={{
                  gridTemplateColumns: `2fr repeat(${columnCount - 1}, 1fr)`,
                  transitionDelay: showAnimations ? getStaggerDelay(index, 50) : '0ms',
                }}
              >
                {/* Program */}
                <div className="flex items-center gap-2">
                  <IndianRupee className={cn('w-4 h-4 md:hidden', isDark ? 'text-white/50' : 'text-gray-400')} />
                  <span className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                    {item.program}
                  </span>
                </div>

                {/* Mobile: Fee breakdown */}
                <div className="md:hidden grid grid-cols-2 gap-2 text-sm">
                  <div className={cn(isDark ? 'text-white/60' : 'text-gray-500')}>Tuition:</div>
                  <div className={cn('text-right', isDark ? 'text-white/80' : 'text-gray-700')}>
                    {formatCurrency(item.tuitionFee, currencySymbol, currencyLocale)}
                  </div>

                  {showHostelFee && item.hostelFee && (
                    <>
                      <div className={cn(isDark ? 'text-white/60' : 'text-gray-500')}>Hostel:</div>
                      <div className={cn('text-right', isDark ? 'text-white/80' : 'text-gray-700')}>
                        {formatCurrency(item.hostelFee, currencySymbol, currencyLocale)}
                      </div>
                    </>
                  )}

                  {showOtherFees && item.otherFees && (
                    <>
                      <div className={cn(isDark ? 'text-white/60' : 'text-gray-500')}>Other:</div>
                      <div className={cn('text-right', isDark ? 'text-white/80' : 'text-gray-700')}>
                        {formatCurrency(item.otherFees, currencySymbol, currencyLocale)}
                      </div>
                    </>
                  )}

                  <div className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Total:</div>
                  <div
                    className="text-right font-bold"
                    style={{ color: accentColor }}
                  >
                    {formatCurrency(item.total, currencySymbol, currencyLocale)}
                  </div>
                </div>

                {/* Desktop: Fee columns */}
                <div className={cn('hidden md:block text-right', isDark ? 'text-white/80' : 'text-gray-700')}>
                  {formatCurrency(item.tuitionFee, currencySymbol, currencyLocale)}
                </div>

                {showHostelFee && (
                  <div className={cn('hidden md:block text-right', isDark ? 'text-white/80' : 'text-gray-700')}>
                    {item.hostelFee ? formatCurrency(item.hostelFee, currencySymbol, currencyLocale) : '—'}
                  </div>
                )}

                {showOtherFees && (
                  <div className={cn('hidden md:block text-right', isDark ? 'text-white/80' : 'text-gray-700')}>
                    {item.otherFees ? formatCurrency(item.otherFees, currencySymbol, currencyLocale) : '—'}
                  </div>
                )}

                <div
                  className="hidden md:block text-right font-bold"
                  style={{ color: accentColor }}
                >
                  {formatCurrency(item.total, currencySymbol, currencyLocale)}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Notes */}
          {footerNotes.length > 0 && (
            <div className={cn('px-6 py-4 border-t', isDark ? 'border-white/10' : 'border-gray-200')}>
              <div className="flex items-start gap-2">
                <Info className={cn('w-4 h-4 mt-0.5 flex-shrink-0', isDark ? 'text-white/40' : 'text-gray-400')} />
                <ul className={cn('text-xs space-y-1', isDark ? 'text-white/50' : 'text-gray-500')}>
                  {footerNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
