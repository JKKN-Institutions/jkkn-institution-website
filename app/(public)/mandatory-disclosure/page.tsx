import type { Metadata } from 'next'
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_MANDATORY_DISCLOSURE_PDFS } from '@/lib/data/local-mandatory-disclosure-pdfs'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'

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
  const disclosureItems = LOCAL_MANDATORY_DISCLOSURE_PDFS.map((pdf) => ({
    name: pdf.title,
    url: `/pdfs/${pdf.pdfPath}`,
    description: pdf.description,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      {/* JSON-LD (main only): CollectionPage + BreadcrumbList + ItemList */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/mandatory-disclosure',
          name: 'Mandatory Disclosure | JKKN Institutions',
          description:
            'Mandatory institutional disclosure at JKKN Institutions as per AICTE, UGC, and other regulatory requirements — approvals, governing body, senior learners, fees, results, admission policy, and annual reports.',
          pageType: 'CollectionPage',
          keywords: [
            'mandatory disclosure',
            'AICTE disclosure',
            'UGC requirements',
            'JKKN disclosure',
          ],
          speakableSelectors: ['h1'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Mandatory Disclosure', url: '/mandatory-disclosure' },
          ],
        }}
        itemList={{
          name: 'JKKN Mandatory Disclosure Documents',
          items: disclosureItems,
        }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-4">
            As per AICTE/UGC Requirements
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Mandatory Disclosure
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete institutional information and regulatory compliance documents
          </p>
        </div>

        {/* PDF List */}
        <LocalPdfLinkList
          pdfs={LOCAL_MANDATORY_DISCLOSURE_PDFS}
          accentColor="#0b6d41"
          backgroundColor="#fbfbee"
          groupByCategory={true}
          showFileSize={true}
          columns={1}
        />

        {/* Note Section */}
        <div className="mt-12 bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
          <p className="text-primary">
            <strong>Note:</strong> This document contains comprehensive information as required
            by AICTE (All India Council for Technical Education) and UGC (University Grants Commission).
            For any queries, please contact the administration office.
          </p>
        </div>
      </div>
    </div>
  )
}
