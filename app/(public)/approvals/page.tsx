import type { Metadata } from 'next'
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_APPROVALS_PDFS } from '@/lib/data/local-approvals-pdfs'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'
import { ACCREDITATION_FAQS } from '@/lib/seo/main-institution/page-content'

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
  const approvalsPdfItems = LOCAL_APPROVALS_PDFS.map((pdf) => ({
    name: pdf.title,
    url: `/pdfs/${pdf.pdfPath}`,
    description: pdf.description,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      {/* JSON-LD (main only): CollectionPage + BreadcrumbList + FAQ + ItemList */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/approvals',
          name: 'Approvals & Affiliations | JKKN Institutions',
          description:
            'Statutory approvals and affiliations held by JKKN Institutions — NAAC, AICTE, Dental Council of India, Pharmacy Council of India, Indian Nursing Council, NCTE — along with affiliating universities such as Anna University, Tamil Nadu Dr. M.G.R. Medical University, and Periyar University.',
          pageType: 'CollectionPage',
          keywords: [
            'NAAC accreditation',
            'AICTE approval',
            'DCI approval',
            'PCI approval',
            'INC approval',
            'NCTE approval',
            'Anna University affiliation',
            'JKKN approvals',
          ],
          speakableSelectors: ['h1', '[data-speakable="approvals-intro"]'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Approvals & Affiliations', url: '/approvals' },
          ],
        }}
        faqs={ACCREDITATION_FAQS}
        itemList={{
          name: 'JKKN Approval and Affiliation Documents',
          items: approvalsPdfItems,
        }}
      />
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
