import type { Metadata } from 'next'
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_APPROVALS_PDFS } from '@/lib/data/local-approvals-pdfs'

export const metadata: Metadata = {
  title: 'Approvals & Affiliations | JKKN College of Engineering',
  description:
    'AICTE approvals, Anna University affiliations, and institutional approvals for JKKN College of Engineering.',
  keywords: [
    'AICTE approval',
    'Anna University affiliation',
    'EOA report',
    'institutional approvals',
    'JKKN approvals',
  ],
}

export default function ApprovalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Approvals & Affiliations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AICTE approvals, Anna University affiliations, and regulatory documents
          </p>
        </div>

        {/* PDF List */}
        <LocalPdfLinkList
          pdfs={LOCAL_APPROVALS_PDFS}
          accentColor="#2563eb"
          backgroundColor="white"
          groupByCategory={true}
          showFileSize={true}
          columns={2}
        />
      </div>
    </div>
  )
}
