import type { Metadata } from 'next'
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_OTHERS_PDFS } from '@/lib/data/local-others-pdfs'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'

export const metadata: Metadata = {
  title: 'Other Documents | JKKN College of Engineering',
  description:
    'Browse additional institutional documents including NSS activities, R&D cell information, and examination manuals.',
  keywords: [
    'JKKN documents',
    'NSS activities',
    'R&D cell',
    'examination manual',
    'institutional documents',
  ],
}

export default function OtherDocumentsPage() {
  const docItems = LOCAL_OTHERS_PDFS.map((pdf) => ({
    name: pdf.title,
    url: `/pdfs/${pdf.pdfPath}`,
    description: pdf.description,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      {/* JSON-LD (main only): CollectionPage + BreadcrumbList + ItemList */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/others/documents',
          name: 'Other Documents | JKKN Institutions',
          description:
            'Additional institutional documents published by JKKN Institutions — NSS activities, R&D cell reports, examination manuals, and student handbooks.',
          pageType: 'CollectionPage',
          keywords: [
            'JKKN documents',
            'NSS activities',
            'R&D cell',
            'examination manual',
            'institutional documents',
          ],
          speakableSelectors: ['h1'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Others', url: '/others' },
            { name: 'Documents', url: '/others/documents' },
          ],
        }}
        itemList={{
          name: 'Additional JKKN Institutional Documents',
          items: docItems,
        }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Other Documents
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Additional institutional documents and resources
          </p>
        </div>

        {/* PDF List */}
        <LocalPdfLinkList
          pdfs={LOCAL_OTHERS_PDFS}
          accentColor="#4b5563"
          backgroundColor="white"
          groupByCategory={true}
          showFileSize={true}
          columns={2}
        />
      </div>
    </div>
  )
}
