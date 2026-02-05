'use client'

import { z } from 'zod'
import { PdfLinkList } from '@/components/cms-blocks/shared/pdf-link-list'
import { COMMITTEE_PDFS } from '@/lib/data/committee-pdfs'

export const CommitteePdfsPageSchema = z.object({
  committeeSlug: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  accentColor: z.string().default('#10b981'),
  backgroundColor: z.string().default('#f9fafb'),
  showThumbnails: z.boolean().default(false),
})

export type CommitteePdfsPageProps = z.infer<typeof CommitteePdfsPageSchema>

export function CommitteePdfsPage({
  committeeSlug,
  title,
  description,
  accentColor = '#10b981',
  backgroundColor = '#f9fafb',
  showThumbnails = false,
}: CommitteePdfsPageProps) {
  // Get PDFs for this committee
  const pdfs = COMMITTEE_PDFS[committeeSlug] || []

  // Auto-generate title if not provided
  const pageTitle =
    title ||
    committeeSlug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  return (
    <div
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: accentColor }}
          >
            {pageTitle}
          </h1>
          {description && (
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* PDF List */}
        <PdfLinkList
          pdfs={pdfs}
          accentColor={accentColor}
          backgroundColor="transparent"
          groupByCategory={true}
          showThumbnails={showThumbnails}
          columns={2}
        />

        {pdfs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No documents available for this committee yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Please check back later or contact the administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
