'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { ArrowRight, Users } from 'lucide-react'

export const FacultyDepartmentItemSchema = z.object({
  name: z.string().default('Department').describe('Full department name'),
  shortName: z.string().default('DEPT').describe('Short code shown on the card badge'),
  href: z.string().default('/faculty').describe('Link to the department faculty page'),
  description: z.string().default('').describe('One-line summary shown on the card'),
})

export type FacultyDepartmentItem = z.infer<typeof FacultyDepartmentItemSchema>

export const DEFAULT_DEPARTMENTS: FacultyDepartmentItem[] = [
  { name: 'Computer Science and Engineering', shortName: 'CSE', href: '/faculty/cse.pdf', description: 'Faculty list for B.E CSE and M.E CSE' },
  { name: 'Electronics and Communication Engineering', shortName: 'ECE', href: '/faculty/ece.pdf', description: 'Faculty list for B.E ECE' },
  { name: 'Electrical and Electronics Engineering', shortName: 'EEE', href: '/faculty/eee.pdf', description: 'Faculty list for B.E EEE' },
  { name: 'Information Technology', shortName: 'IT', href: '/faculty/it.pdf', description: 'Faculty list for B.Tech IT' },
  { name: 'Mechanical Engineering', shortName: 'MECH', href: '/faculty/mech.pdf', description: 'Faculty list for B.E Mechanical' },
  { name: 'Management Studies', shortName: 'MBA', href: '/faculty/mba.pdf', description: 'Faculty list for MBA' },
  { name: 'Science and Humanities', shortName: 'S&H', href: '/faculty/sh.pdf', description: 'Faculty list for first-year Science and Humanities' },
]

/**
 * FacultyDepartmentsIndex props schema
 */
export const FacultyDepartmentsIndexPropsSchema = z.object({
  eyebrow: z.string().default('Faculty').describe('Small label above the heading'),
  title: z.string().default('Our Faculty by Department').describe('Section heading'),
  subtitle: z
    .string()
    .default('Choose a department to view its official faculty list.')
    .describe('Short line under the heading'),
  departments: z
    .array(FacultyDepartmentItemSchema)
    .default(DEFAULT_DEPARTMENTS)
    .describe('Department cards'),
  backgroundColor: z.string().default('#fbfbee').describe('Section background color'),
  accentColor: z.string().default('#0b6d41').describe('Primary brand color'),
  highlightColor: z.string().default('#ffde59').describe('Accent highlight color'),
})

export type FacultyDepartmentsIndexProps = z.infer<typeof FacultyDepartmentsIndexPropsSchema> & BaseBlockProps

/** PDFs and absolute URLs open in a new tab; site routes use client-side <Link>. */
function DepartmentCardLink({
  href,
  className,
  style,
  children,
}: {
  href: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const opensInNewTab = /^https?:\/\//i.test(href) || /\.pdf($|[?#])/i.test(href)
  if (opensInNewTab) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  )
}

export default function FacultyDepartmentsIndex({
  eyebrow = 'Faculty',
  title = 'Our Faculty by Department',
  subtitle = 'Choose a department to view its official faculty list.',
  departments = DEFAULT_DEPARTMENTS,
  backgroundColor = '#fbfbee',
  accentColor = '#0b6d41',
  highlightColor = '#ffde59',
  className,
  style,
}: FacultyDepartmentsIndexProps) {
  return (
    <section
      className={cn('w-full py-10 sm:py-14', className)}
      style={{ background: backgroundColor, ...style }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
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
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[#3d5443]">{subtitle}</p>
        </div>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <li key={dept.href}>
              <DepartmentCardLink
                href={dept.href}
                className="group flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ borderColor: 'rgba(11,109,65,0.12)' }}
              >
                <span
                  className="inline-flex h-12 w-fit min-w-12 items-center justify-center rounded-xl px-3 text-sm font-bold"
                  style={{ background: highlightColor, color: '#1a2a1e' }}
                >
                  {dept.shortName}
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold leading-snug text-[#1a2a1e]">{dept.name}</h2>
                  {dept.description && (
                    <p className="mt-1.5 text-sm text-[#3d5443]">{dept.description}</p>
                  )}
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5"
                  style={{ color: accentColor }}
                >
                  Open faculty list (PDF)
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </DepartmentCardLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
