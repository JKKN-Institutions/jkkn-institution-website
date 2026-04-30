import type { Metadata } from 'next'
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_ALUMNI_PDFS } from '@/lib/data/local-alumni-pdfs'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'
import { ALUMNI_FAQS } from '@/lib/seo/main-institution/page-content'

export const metadata: Metadata = {
  title: 'Alumni Resources | JKKN College of Engineering',
  description:
    'Connect with JKKN Engineering College alumni. Access alumni association documents, newsletters, and directories.',
  keywords: [
    'JKKN alumni',
    'alumni association',
    'alumni network',
    'engineering alumni',
    'JKKN alumni meet',
  ],
}

export default function AlumniPage() {
  const alumniPdfItems = LOCAL_ALUMNI_PDFS.map((pdf) => ({
    name: pdf.title,
    url: `/pdfs/${pdf.pdfPath}`,
    description: pdf.description,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4">
      {/* JSON-LD: @graph — CollectionPage + BreadcrumbList + FAQ + ItemList (main only) */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/alumni',
          name: 'Alumni Resources | JKKN Institutions',
          description:
            'Access JKKN Institutions alumni association documents, newsletters, and directories — connecting 50,000+ JKKN graduates across dental, pharmacy, engineering, nursing, and arts & science.',
          pageType: 'CollectionPage',
          keywords: ['JKKN alumni', 'alumni association', 'alumni network', 'JKKN alumni meet'],
          speakableSelectors: ['h1', 'h2'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Alumni', url: '/alumni' },
          ],
        }}
        faqs={ALUMNI_FAQS}
        itemList={{
          name: 'JKKN Alumni Resources',
          items: alumniPdfItems,
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-600 mb-4">
            Alumni Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay connected with your alma mater and fellow alumni
          </p>
        </div>

        {/* PDF List */}
        <LocalPdfLinkList
          pdfs={LOCAL_ALUMNI_PDFS}
          accentColor="#9333ea"
          backgroundColor="white"
          groupByCategory={true}
          showFileSize={true}
          columns={3}
        />

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">
            Stay Connected
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Want to contribute to the alumni network or update your details?
          </p>
          <a
            href="mailto:alumni@jkkn.ac.in"
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Contact Alumni Cell
          </a>
        </div>
      </div>
    </div>
  )
}
