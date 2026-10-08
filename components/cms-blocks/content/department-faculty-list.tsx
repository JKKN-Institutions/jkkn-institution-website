'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { Users } from 'lucide-react'

export const FacultyMemberSchema = z.object({
  name: z.string().default('').describe('Name with title, e.g. Dr. NARMADHA S J'),
  designation: z.string().default('').describe('Designation, e.g. Assistant Professor'),
  photo: z.string().default('').describe('Photo URL (square-ish portrait works best)'),
  auFin: z.string().default('').describe('Anna University FIN'),
  aicteId: z.string().default('').describe('AICTE faculty ID'),
  isHead: z.boolean().default(false).describe('Head of the department (shown first, highlighted)'),
})

export type FacultyMember = z.infer<typeof FacultyMemberSchema>

/**
 * DepartmentFacultyList props schema
 */
export const DepartmentFacultyListPropsSchema = z.object({
  departmentName: z
    .string()
    .default('Department of Computer Science and Engineering')
    .describe('Heading shown at the top of the page'),
  eyebrow: z.string().default('Faculty').describe('Small label above the heading'),
  description: z
    .string()
    .default('Meet the faculty of the department.')
    .describe('Short line under the heading'),
  faculty: z.array(FacultyMemberSchema).default([]).describe('Faculty members, in display order'),
  showIds: z.boolean().default(true).describe('Show AICTE ID and AU-FIN on each card'),
  backgroundColor: z.string().default('#fbfbee').describe('Section background color'),
  accentColor: z.string().default('#0b6d41').describe('Primary brand color'),
  highlightColor: z.string().default('#ffde59').describe('Accent highlight color'),
})

export type DepartmentFacultyListProps = z.infer<typeof DepartmentFacultyListPropsSchema> & BaseBlockProps

function initials(name: string): string {
  const cleaned = name.replace(/^(Dr|Mr|Mrs|Ms)\.?\s*/i, '').trim()
  const parts = cleaned.split(/[\s.]+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

function FacultyCard({
  member,
  showIds,
  accentColor,
  highlightColor,
  featured,
}: {
  member: FacultyMember
  showIds: boolean
  accentColor: string
  highlightColor: string
  featured?: boolean
}) {
  return (
    <article
      className={cn(
        'flex h-full items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5',
        featured && 'sm:gap-6 sm:p-6'
      )}
      style={{
        borderColor: featured ? highlightColor : 'rgba(11,109,65,0.12)',
        borderWidth: featured ? 2 : 1,
      }}
    >
      {member.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.photo}
          alt={member.name}
          loading="lazy"
          width={featured ? 128 : 88}
          height={featured ? 128 : 88}
          className={cn(
            'shrink-0 rounded-xl bg-[#f3f6ef] object-cover object-top',
            featured ? 'h-24 w-24 sm:h-32 sm:w-32' : 'h-20 w-20 sm:h-[88px] sm:w-[88px]'
          )}
        />
      ) : (
        <div
          aria-hidden="true"
          className={cn(
            'flex shrink-0 items-center justify-center rounded-xl text-xl font-bold',
            featured ? 'h-24 w-24 sm:h-32 sm:w-32' : 'h-20 w-20 sm:h-[88px] sm:w-[88px]'
          )}
          style={{ background: highlightColor, color: '#1a2a1e' }}
        >
          {initials(member.name)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        {featured && (
          <span
            className="mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
            style={{ background: highlightColor, color: '#1a2a1e' }}
          >
            Head of the Department
          </span>
        )}
        <h2
          className={cn('font-semibold leading-snug text-[#1a2a1e]', featured ? 'text-lg sm:text-xl' : 'text-base')}
          style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
        >
          {member.name}
        </h2>
        <p className="mt-0.5 text-sm font-medium" style={{ color: accentColor }}>
          {member.designation}
        </p>
        {showIds && (member.aicteId || member.auFin) && (
          <p className="mt-1.5 text-xs text-[#5a6f5f]">
            {member.aicteId && <span>AICTE ID: {member.aicteId}</span>}
            {member.aicteId && member.auFin && <span aria-hidden="true"> · </span>}
            {member.auFin && <span>AU-FIN: {member.auFin}</span>}
          </p>
        )}
      </div>
    </article>
  )
}

export default function DepartmentFacultyList({
  departmentName = 'Department of Computer Science and Engineering',
  eyebrow = 'Faculty',
  description = 'Meet the faculty of the department.',
  faculty = [],
  showIds = true,
  backgroundColor = '#fbfbee',
  accentColor = '#0b6d41',
  highlightColor = '#ffde59',
  className,
  style,
}: DepartmentFacultyListProps) {
  const heads = faculty.filter((m) => m.isHead)
  const others = faculty.filter((m) => !m.isHead)

  return (
    <section
      className={cn('w-full py-10 sm:py-14', className)}
      style={{ background: backgroundColor, ...style }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center sm:mb-10">
          <p
            className="mb-2 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[2.5px]"
            style={{ color: accentColor }}
          >
            <span className="inline-block h-0.5 w-6" style={{ background: accentColor }} />
            <Users className="h-4 w-4" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1
            className="text-3xl font-bold text-[#1a2a1e] sm:text-4xl"
            style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
          >
            {departmentName}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[#3d5443]">{description}</p>
          {faculty.length > 0 && (
            <p className="mt-2 text-sm font-semibold" style={{ color: accentColor }}>
              {faculty.length} faculty {faculty.length === 1 ? 'member' : 'members'}
            </p>
          )}
        </div>

        {heads.length > 0 && (
          <div className="mx-auto mb-5 max-w-3xl space-y-5">
            {heads.map((m) => (
              <FacultyCard
                key={m.aicteId || m.name}
                member={m}
                showIds={showIds}
                accentColor={accentColor}
                highlightColor={highlightColor}
                featured
              />
            ))}
          </div>
        )}

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((m) => (
            <li key={m.aicteId || m.name}>
              <FacultyCard
                member={m}
                showIds={showIds}
                accentColor={accentColor}
                highlightColor={highlightColor}
              />
            </li>
          ))}
        </ul>

        {faculty.length === 0 && (
          <p className="text-center text-[#3d5443]">The faculty list will be published shortly.</p>
        )}
      </div>
    </section>
  )
}
