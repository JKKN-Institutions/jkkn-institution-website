'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { Download, ExternalLink, FileText, Users } from 'lucide-react'

/**
 * DepartmentFacultyPdf props schema
 */
export const DepartmentFacultyPdfPropsSchema = z.object({
  departmentName: z
    .string()
    .default('Computer Science and Engineering')
    .describe('Full department name shown as the page heading'),
  eyebrow: z.string().default('Faculty').describe('Small label above the heading'),
  description: z
    .string()
    .default('Official faculty list with AU-FIN and AICTE IDs, names and designations.')
    .describe('Short line under the heading'),
  pdfUrl: z
    .string()
    .default('/pdfs/faculty/cse.pdf')
    .describe('Path or URL of the faculty list PDF (same-origin paths embed best)'),
  downloadFileName: z
    .string()
    .default('faculty-list.pdf')
    .describe('File name used when the PDF is downloaded'),
  viewerHeight: z
    .number()
    .default(900)
    .describe('Height of the embedded PDF viewer in pixels (desktop)'),
  backgroundColor: z.string().default('#fbfbee').describe('Section background color'),
  accentColor: z.string().default('#0b6d41').describe('Primary brand color'),
  highlightColor: z.string().default('#ffde59').describe('Accent highlight color'),
})

export type DepartmentFacultyPdfProps = z.infer<typeof DepartmentFacultyPdfPropsSchema> & BaseBlockProps

export default function DepartmentFacultyPdf({
  departmentName = 'Computer Science and Engineering',
  eyebrow = 'Faculty',
  description = 'Official faculty list with AU-FIN and AICTE IDs, names and designations.',
  pdfUrl = '/pdfs/faculty/cse.pdf',
  downloadFileName = 'faculty-list.pdf',
  viewerHeight = 900,
  backgroundColor = '#fbfbee',
  accentColor = '#0b6d41',
  highlightColor = '#ffde59',
  className,
  style,
}: DepartmentFacultyPdfProps) {
  return (
    <section
      className={cn('w-full py-10 sm:py-14', className)}
      style={{ background: backgroundColor, ...style }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-8 text-center">
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

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: accentColor }}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open in new tab
            </a>
            <a
              href={pdfUrl}
              download={downloadFileName}
              className="inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ borderColor: highlightColor, color: accentColor, background: '#fff' }}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download PDF
            </a>
          </div>
        </div>

        {/* Viewer */}
        <div
          className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: 'rgba(11,109,65,0.15)' }}
        >
          <iframe
            src={`${pdfUrl}#navpanes=0&view=FitH`}
            title={`${departmentName} faculty list (PDF)`}
            loading="lazy"
            className="block h-[70vh] w-full sm:h-[var(--pdf-h)]"
            style={{ ['--pdf-h' as string]: `${viewerHeight}px` }}
          />
          {/* Fallback for browsers that cannot render PDFs inline (mostly mobile) */}
          <div className="flex flex-col items-center gap-2 border-t border-[rgba(11,109,65,0.1)] bg-[#f7faf5] px-4 py-4 text-center text-sm text-[#3d5443]">
            <FileText className="h-5 w-5" style={{ color: accentColor }} aria-hidden="true" />
            <p>
              Can&apos;t see the list above?{' '}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2"
                style={{ color: accentColor }}
              >
                Open the PDF directly
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
