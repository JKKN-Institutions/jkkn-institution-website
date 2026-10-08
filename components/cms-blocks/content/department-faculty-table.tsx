'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'

export const FacultyTableRowSchema = z.object({
  sno: z.string().default('').describe('Serial number exactly as printed in the department list, e.g. 1 or 1.'),
  auFin: z.string().default('').describe('Anna University FIN'),
  aicteId: z.string().default('').describe('AICTE faculty ID'),
  name: z.string().default('').describe('Name exactly as printed in the department list'),
  designation: z.string().default('').describe('Designation exactly as printed in the department list'),
  photo: z.string().default('').describe('Photo URL'),
  photoWidth: z.number().default(0).describe('Photo width in px (sets the shape the photo is shown in)'),
  photoHeight: z.number().default(0).describe('Photo height in px (sets the shape the photo is shown in)'),
})

export type FacultyTableRow = z.infer<typeof FacultyTableRowSchema>

/**
 * DepartmentFacultyTable props schema
 *
 * Shows a department's faculty as the official list prints it: one table,
 * same columns in the same order, text unchanged.
 */
export const DepartmentFacultyTablePropsSchema = z.object({
  departmentName: z
    .string()
    .default('DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING')
    .describe('Heading shown at the top of the page'),
  listTitle: z.string().default('FACULTY LIST').describe('Line under the heading'),
  snoLabel: z.string().default('S.No.').describe('Column 1 heading'),
  auFinLabel: z.string().default('AU FIN').describe('Column 2 heading'),
  aicteIdLabel: z.string().default('AICTE ID').describe('Column 3 heading'),
  nameLabel: z.string().default('Name & Designation').describe('Column 4 heading'),
  photoLabel: z.string().default('Photo').describe('Column 5 heading'),
  faculty: z.array(FacultyTableRowSchema).default([]).describe('Faculty members, in display order'),
  backgroundColor: z.string().default('#fbfbee').describe('Section background color'),
  accentColor: z.string().default('#0b6d41').describe('Primary brand color'),
})

export type DepartmentFacultyTableProps = z.infer<typeof DepartmentFacultyTablePropsSchema> & BaseBlockProps

const CELL = 'border px-3 py-3 text-center align-middle'

export default function DepartmentFacultyTable({
  departmentName = 'DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING',
  listTitle = 'FACULTY LIST',
  snoLabel = 'S.No.',
  auFinLabel = 'AU FIN',
  aicteIdLabel = 'AICTE ID',
  nameLabel = 'Name & Designation',
  photoLabel = 'Photo',
  faculty = [],
  backgroundColor = '#fbfbee',
  accentColor = '#0b6d41',
  className,
  style,
}: DepartmentFacultyTableProps) {
  const borderColor = 'rgba(11,109,65,0.22)'

  return (
    <section
      className={cn('w-full py-10 sm:py-14', className)}
      style={{ background: backgroundColor, ...style }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-6 text-center sm:mb-8">
          <h1
            className="whitespace-pre-wrap text-2xl font-bold text-[#1a2a1e] sm:text-3xl"
            style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
          >
            {departmentName}
          </h1>
          {listTitle && (
            <p
              className="mt-2 whitespace-pre-wrap text-base font-bold tracking-wide sm:text-lg"
              style={{ color: accentColor }}
            >
              {listTitle}
            </p>
          )}
        </div>

        {faculty.length > 0 ? (
          <div
            role="region"
            aria-label={`${departmentName} ${listTitle}`.trim()}
            tabIndex={0}
            className="overflow-x-auto rounded-xl bg-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6d41]"
            style={{ border: `1px solid ${borderColor}` }}
          >
            <table className="w-full min-w-[600px] border-collapse text-sm text-[#1a2a1e] sm:text-base">
              <thead>
                <tr style={{ background: accentColor }} className="text-white">
                  <th scope="col" className={cn(CELL, 'w-16 whitespace-pre-wrap font-semibold')} style={{ borderColor }}>
                    {snoLabel}
                  </th>
                  <th scope="col" className={cn(CELL, 'whitespace-pre-wrap font-semibold')} style={{ borderColor }}>
                    {auFinLabel}
                  </th>
                  <th scope="col" className={cn(CELL, 'whitespace-pre-wrap font-semibold')} style={{ borderColor }}>
                    {aicteIdLabel}
                  </th>
                  <th scope="col" className={cn(CELL, 'whitespace-pre-wrap font-semibold')} style={{ borderColor }}>
                    {nameLabel}
                  </th>
                  <th scope="col" className={cn(CELL, 'w-36 whitespace-pre-wrap font-semibold sm:w-40')} style={{ borderColor }}>
                    {photoLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((m, i) => (
                  <tr key={`${i}-${m.auFin || m.name}`} className="odd:bg-white even:bg-[#f7faf3]">
                    <td className={cn(CELL, 'whitespace-pre-wrap')} style={{ borderColor }}>
                      {m.sno}
                    </td>
                    <td className={cn(CELL, 'whitespace-pre-wrap tabular-nums')} style={{ borderColor }}>
                      {m.auFin}
                    </td>
                    <td className={cn(CELL, 'whitespace-pre-wrap tabular-nums')} style={{ borderColor }}>
                      {m.aicteId}
                    </td>
                    <td className={CELL} style={{ borderColor }}>
                      <p className="whitespace-pre-wrap font-semibold">{m.name}</p>
                      {m.designation && (
                        <p className="mt-0.5 whitespace-pre-wrap" style={{ color: accentColor }}>
                          {m.designation}
                        </p>
                      )}
                    </td>
                    <td className={CELL} style={{ borderColor }}>
                      {m.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.photo}
                          alt={m.name.trim()}
                          loading="lazy"
                          width={m.photoWidth || undefined}
                          height={m.photoHeight || undefined}
                          className="mx-auto h-auto w-24 bg-[#f3f6ef] sm:w-28"
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-[#3d5443]">The faculty list will be published shortly.</p>
        )}
      </div>
    </section>
  )
}
