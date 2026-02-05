'use client'

import { Download, Eye, FileText } from 'lucide-react'
import { processLocalPdfLink, LocalPdfLinkConfig } from '@/lib/utils/local-pdf'

export interface LocalPdfLinkListProps {
  title?: string
  description?: string
  pdfs: LocalPdfLinkConfig[]
  accentColor?: string
  backgroundColor?: string
  groupByCategory?: boolean
  showFileSize?: boolean
  columns?: 1 | 2 | 3
}

export function LocalPdfLinkList({
  title,
  description,
  pdfs,
  accentColor = '#10b981',
  backgroundColor = '#ffffff',
  groupByCategory = false,
  showFileSize = true,
  columns = 1,
}: LocalPdfLinkListProps) {
  // Process all PDF links
  const processedPdfs = pdfs.map(processLocalPdfLink)

  // Group by category if needed
  const groupedPdfs = groupByCategory
    ? processedPdfs.reduce((acc, pdf) => {
        const category = pdf.category || 'Uncategorized'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(pdf)
        return acc
      }, {} as Record<string, typeof processedPdfs>)
    : { All: processedPdfs }

  return (
    <div className="w-full" style={{ backgroundColor }}>
      {/* Header */}
      {title && (
        <div className="mb-8">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: accentColor }}
          >
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {description}
            </p>
          )}
        </div>
      )}

      {/* PDF Groups */}
      {Object.entries(groupedPdfs).map(([category, categoryPdfs]) => (
        <div key={category} className="mb-12 last:mb-0">
          {groupByCategory && category !== 'All' && (
            <h3
              className="text-2xl font-bold mb-6"
              style={{ color: accentColor }}
            >
              {category}
            </h3>
          )}

          <div
            className={`grid gap-6 ${
              columns === 1
                ? 'grid-cols-1'
                : columns === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {categoryPdfs.map((pdf, index) => (
              <LocalPdfCard
                key={index}
                pdf={pdf}
                accentColor={accentColor}
                showFileSize={showFileSize}
              />
            ))}
          </div>
        </div>
      ))}

      {processedPdfs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg">No PDFs available</p>
        </div>
      )}
    </div>
  )
}

interface LocalPdfCardProps {
  pdf: ReturnType<typeof processLocalPdfLink>
  accentColor: string
  showFileSize: boolean
}

function LocalPdfCard({ pdf, accentColor, showFileSize }: LocalPdfCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <div className="flex items-start gap-3 mb-3">
          <FileText
            className="w-6 h-6 flex-shrink-0 mt-1"
            style={{ color: accentColor }}
          />
          <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-opacity-80 transition-colors">
            {pdf.title}
          </h4>
        </div>

        {/* Description */}
        {pdf.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {pdf.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pdf.year && (
            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
              {pdf.year}
            </span>
          )}
          {showFileSize && pdf.fileSize && (
            <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-xs font-medium text-blue-700 dark:text-blue-300">
              {pdf.fileSize}
            </span>
          )}
          {pdf.lastUpdated && (
            <span className="inline-block px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full text-xs font-medium text-green-700 dark:text-green-300">
              Updated: {pdf.lastUpdated}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {/* View Button */}
          <a
            href={pdf.viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: accentColor,
              color: '#ffffff',
            }}
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </a>

          {/* Download Button */}
          <a
            href={pdf.downloadUrl}
            download
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition-all duration-300 hover:scale-105"
            style={{
              borderColor: accentColor,
              color: accentColor,
            }}
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  )
}
