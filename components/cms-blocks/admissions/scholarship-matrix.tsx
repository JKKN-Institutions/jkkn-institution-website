'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import type { ScholarshipMatrixProps, ScholarshipMatrixRow } from '@/lib/cms/registry-types'
import {
  glassStyles,
  backgroundStyles,
  isDarkBackground,
  getStaggerDelay,
} from './shared/admission-glass-styles'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Group consecutive rows by college so the renderer can rowspan the label.
function groupByCollege(rows: ScholarshipMatrixRow[]) {
  const groups: { college: string; rows: ScholarshipMatrixRow[] }[] = []
  for (const row of rows) {
    const last = groups[groups.length - 1]
    if (last && last.college === row.college) last.rows.push(row)
    else groups.push({ college: row.college, rows: [row] })
  }
  return groups
}

function formatAmount(value: string, isDark: boolean) {
  const empty = !value || value === '-' || value === '—'
  return {
    label: empty ? '—' : value,
    className: cn(
      'whitespace-nowrap text-center text-xs md:text-sm',
      empty
        ? isDark
          ? 'text-white/35'
          : 'text-gray-400'
        : isDark
          ? 'text-white font-medium'
          : 'text-gray-800 font-medium',
    ),
  }
}

export default function ScholarshipMatrix({
  badge = 'SCHOLARSHIP MATRIX',
  title = 'Scholarship Amounts by Course',
  titleAccentWord = 'by Course',
  subtitle = 'Annual scholarship entitlements across all JKKN colleges — at a glance.',
  groupLabelSC = 'SC / SCA / ST / BC-CC',
  groupLabelBC = 'BC / MBC / DNC / BCM',
  groupLabelAllCommunity = 'All Community',
  groupLabelAllCommunityNote = '(Govt / Govt Aided School 6–12, Tamil Medium)',
  pmssLabel = 'PMSS',
  pmssSubLabel = 'Community Scholarship',
  maintenanceLabel = 'Maintenance Scholarship',
  firstGraduateLabel = 'First Graduate',
  communityLabel = 'Community Scholarship',
  trustLabel = 'Trust Scholarship',
  trustSubLabel = '(Merit Based)',
  naanMudhalvanLabel = 'Naan Mudhalvan',
  naanMudhalvanSubLabel = 'Boys / Girls',
  rows = [],
  footerNotes = [],
  backgroundColor = 'gradient-dark',
  showAnimations = true,
  titleColor,
  subtitleColor,
  accentColor = 'var(--gold-on-light)',
  className,
  isEditing,
}: ScholarshipMatrixProps) {
  const sectionRef = useInView()
  const tableRef = useInView()
  const isDark = isDarkBackground(backgroundColor)
  const grouped = useMemo(() => groupByCollege(rows), [rows])

  const titleParts = useMemo(() => {
    if (!titleAccentWord || !title.includes(titleAccentWord)) {
      return { before: title, accent: '', after: '' }
    }
    const parts = title.split(titleAccentWord)
    return { before: parts[0] || '', accent: titleAccentWord, after: parts[1] || '' }
  }, [title, titleAccentWord])

  if (rows.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-white/25 rounded-lg">
            <p className="text-white/60 text-center">
              Click to add scholarship matrix rows
            </p>
          </div>
        </div>
      </section>
    )
  }

  const headCell = cn(
    'px-3 py-3 text-[11px] md:text-xs font-semibold uppercase tracking-wider text-center',
    isDark ? 'text-white/80' : 'text-white',
  )
  const subHeadCell = cn(
    'px-3 py-2 text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-center',
    isDark ? 'text-white/70' : 'text-white/90',
  )
  const bodyCell = cn(
    'px-3 py-3 align-middle',
    isDark ? 'text-white/80' : 'text-gray-700',
  )
  const collegeCell = cn(
    'px-3 py-3 align-middle text-xs md:text-sm font-bold whitespace-nowrap',
    isDark ? 'text-white' : 'text-brand-primary',
  )
  const borderX = isDark ? 'border-white/15' : 'border-[#0b6d41]/20'

  return (
    <section
      ref={sectionRef.ref}
      className={cn(
        'relative py-16 md:py-24 overflow-hidden',
        backgroundStyles[backgroundColor],
        className,
      )}
    >
      <DecorativePatterns variant="default" color={isDark ? 'white' : 'green'} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            'max-w-4xl mx-auto text-center mb-10 lg:mb-14',
            showAnimations && 'transition-all duration-700',
            showAnimations && (sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'),
          )}
        >
          {badge && (
            <div className="flex justify-center mb-4">
              <span className={isDark ? glassStyles.sectionBadge : glassStyles.sectionBadgeLight}>
                {badge}
              </span>
            </div>
          )}

          <h2
            className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ color: titleColor || (isDark ? '#ffffff' : '#0b6d41') }}
          >
            {titleParts.before}
            {titleParts.accent && (
              <span style={{ color: accentColor }}>{titleParts.accent}</span>
            )}
            {titleParts.after}
          </h2>

          {subtitle && (
            <p
              className="text-base md:text-lg max-w-3xl mx-auto"
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
            'max-w-7xl mx-auto',
            showAnimations && 'transition-all duration-700 delay-200',
            showAnimations && (tableRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'),
          )}
        >
          <div
            className={cn(
              'overflow-x-auto',
              isDark ? glassStyles.tableContainer : glassStyles.tableContainerLight,
            )}
          >
            <table className="w-full min-w-[960px] border-collapse text-sm">
              <thead>
                {/* Group header row */}
                <tr className={isDark ? glassStyles.tableHeader : glassStyles.tableHeaderLight}>
                  <th
                    rowSpan={2}
                    className={cn(headCell, 'text-left', 'border-r', borderX, 'min-w-[110px]')}
                  >
                    College
                  </th>
                  <th
                    rowSpan={2}
                    className={cn(headCell, 'text-left', 'border-r', borderX, 'min-w-[140px]')}
                  >
                    Course
                  </th>
                  <th
                    colSpan={3}
                    className={cn(headCell, 'border-r', borderX)}
                  >
                    {groupLabelSC}
                  </th>
                  <th
                    colSpan={3}
                    className={cn(headCell, 'border-r', borderX)}
                  >
                    {groupLabelBC}
                  </th>
                  <th colSpan={1} className={headCell}>
                    <div className="font-semibold">{groupLabelAllCommunity}</div>
                    <div
                      className={cn(
                        'mt-1 text-[9px] md:text-[10px] font-normal normal-case tracking-normal',
                        isDark ? 'text-white/55' : 'text-white/80',
                      )}
                    >
                      {groupLabelAllCommunityNote}
                    </div>
                  </th>
                </tr>

                {/* Sub header row */}
                <tr className={isDark ? 'bg-white/[0.06]' : 'bg-[#085032]'}>
                  <th className={cn(subHeadCell, 'border-r', borderX)}>
                    <div className="font-semibold">{pmssLabel} · GQ</div>
                    <div className={cn('mt-0.5 text-[9px] normal-case tracking-normal', isDark ? 'text-white/50' : 'text-white/75')}>
                      {pmssSubLabel}
                    </div>
                  </th>
                  <th className={cn(subHeadCell, 'border-r', borderX)}>
                    <div className="font-semibold">{pmssLabel} · MQ</div>
                    <div className={cn('mt-0.5 text-[9px] normal-case tracking-normal', isDark ? 'text-white/50' : 'text-white/75')}>
                      {pmssSubLabel}
                    </div>
                  </th>
                  <th className={cn(subHeadCell, 'border-r', borderX)}>
                    <div className="font-semibold">{maintenanceLabel}</div>
                    <div className={cn('mt-0.5 text-[9px] normal-case tracking-normal', isDark ? 'text-white/50' : 'text-white/75')}>
                      GQ
                    </div>
                  </th>
                  <th className={cn(subHeadCell, 'border-r', borderX)}>
                    <div className="font-semibold">{firstGraduateLabel}</div>
                    <div className={cn('mt-0.5 text-[9px] normal-case tracking-normal', isDark ? 'text-white/50' : 'text-white/75')}>
                      GQ
                    </div>
                  </th>
                  <th className={cn(subHeadCell, 'border-r', borderX)}>
                    <div className="font-semibold">{communityLabel}</div>
                    <div className={cn('mt-0.5 text-[9px] normal-case tracking-normal', isDark ? 'text-white/50' : 'text-white/75')}>
                      GQ
                    </div>
                  </th>
                  <th className={cn(subHeadCell, 'border-r', borderX)}>
                    <div className="font-semibold">{trustLabel}</div>
                    <div className={cn('mt-0.5 text-[9px] normal-case tracking-normal', isDark ? 'text-white/50' : 'text-white/75')}>
                      {trustSubLabel} · MQ/GQ
                    </div>
                  </th>
                  <th className={subHeadCell}>
                    <div className="font-semibold">{naanMudhalvanLabel}</div>
                    <div className={cn('mt-0.5 text-[9px] normal-case tracking-normal', isDark ? 'text-white/50' : 'text-white/75')}>
                      {naanMudhalvanSubLabel}
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {grouped.flatMap((group, gi) =>
                  group.rows.map((row, ri) => {
                    const zebra = (gi + ri) % 2 === 0
                    const rowClass = isDark
                      ? zebra
                        ? glassStyles.tableRow
                        : glassStyles.tableRowAlt
                      : zebra
                        ? glassStyles.tableRowLight
                        : glassStyles.tableRowAltLight

                    const hoverClass = isDark
                      ? glassStyles.tableRowHover
                      : glassStyles.tableRowHoverLight

                    const pmssGQ = formatAmount(row.pmssGQ, isDark)
                    const pmssMQ = formatAmount(row.pmssMQ, isDark)
                    const maintenance = formatAmount(row.maintenance, isDark)
                    const firstGraduate = formatAmount(row.firstGraduate, isDark)
                    const community = formatAmount(row.community, isDark)
                    const trust = formatAmount(row.trust, isDark)
                    const naan = formatAmount(row.naanMudhalvan, isDark)

                    return (
                      <tr
                        key={`${group.college}-${row.course}`}
                        className={cn(rowClass, hoverClass)}
                        style={{
                          transitionDelay: showAnimations
                            ? getStaggerDelay(gi + ri, 40)
                            : '0ms',
                        }}
                      >
                        {ri === 0 && (
                          <td
                            rowSpan={group.rows.length}
                            className={cn(collegeCell, 'border-r', borderX)}
                          >
                            {group.college}
                          </td>
                        )}
                        <td
                          className={cn(
                            bodyCell,
                            'text-xs md:text-sm font-semibold whitespace-nowrap border-r',
                            borderX,
                            isDark ? 'text-white' : 'text-gray-900',
                          )}
                        >
                          {row.course}
                        </td>

                        {row.pmssMerged ? (
                          <td
                            colSpan={2}
                            className={cn(bodyCell, 'border-r', borderX, pmssGQ.className)}
                          >
                            {pmssGQ.label}
                          </td>
                        ) : (
                          <>
                            <td className={cn(bodyCell, 'border-r', borderX, pmssGQ.className)}>
                              {pmssGQ.label}
                            </td>
                            <td className={cn(bodyCell, 'border-r', borderX, pmssMQ.className)}>
                              {pmssMQ.label}
                            </td>
                          </>
                        )}

                        <td className={cn(bodyCell, 'border-r', borderX, maintenance.className)}>
                          {maintenance.label}
                        </td>
                        <td className={cn(bodyCell, 'border-r', borderX, firstGraduate.className)}>
                          {firstGraduate.label}
                        </td>
                        <td className={cn(bodyCell, 'border-r', borderX, community.className)}>
                          {community.label}
                        </td>
                        <td className={cn(bodyCell, 'border-r', borderX, trust.className)}>
                          {trust.label}
                        </td>
                        <td className={cn(bodyCell, naan.className)}>{naan.label}</td>
                      </tr>
                    )
                  }),
                )}
              </tbody>
            </table>
          </div>

          {/* Footer notes */}
          {footerNotes.length > 0 && (
            <div
              className={cn(
                'mt-6 rounded-xl p-5 flex gap-3',
                isDark
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-brand-primary/5 border border-brand-primary/15',
              )}
            >
              <Info
                className={cn('w-5 h-5 mt-0.5 flex-shrink-0', isDark ? 'text-white/70' : 'text-brand-primary')}
              />
              <ul className="space-y-1.5">
                {footerNotes.map((note, i) => (
                  <li
                    key={i}
                    className={cn(
                      'text-xs md:text-sm leading-relaxed',
                      isDark ? 'text-white/70' : 'text-gray-600',
                    )}
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
