import type { Metadata } from 'next'
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_MANDATORY_DISCLOSURE_PDFS } from '@/lib/data/local-mandatory-disclosure-pdfs'

export const metadata: Metadata = {
  title: 'Mandatory Disclosure | JKKN College of Engineering',
  description:
    'Mandatory disclosure as per AICTE and UGC requirements. Access complete institutional information, approvals, and reports.',
  keywords: [
    'mandatory disclosure',
    'AICTE disclosure',
    'UGC requirements',
    'institutional information',
    'JKKN disclosure',
  ],
}

export default function MandatoryDisclosurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-blue-100 rounded-full text-sm font-semibold text-blue-600 mb-4">
            As per AICTE/UGC Requirements
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Mandatory Disclosure
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete institutional information and regulatory compliance documents
          </p>
        </div>

        {/* PDF List */}
        <LocalPdfLinkList
          pdfs={LOCAL_MANDATORY_DISCLOSURE_PDFS}
          accentColor="#1f2937"
          backgroundColor="white"
          groupByCategory={true}
          showFileSize={true}
          columns={1}
        />

        {/* Note Section */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <p className="text-blue-800">
            <strong>Note:</strong> This document contains comprehensive information as required
            by AICTE (All India Council for Technical Education) and UGC (University Grants Commission).
            For any queries, please contact the administration office.
          </p>
        </div>
      </div>
    </div>
  )
}
