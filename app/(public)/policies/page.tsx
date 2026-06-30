import type { Metadata } from 'next'
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_POLICY_PDFS } from '@/lib/data/local-policy-pdfs'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'

export const metadata: Metadata = {
  title: 'Institutional Policies | JKKN College of Engineering',
  description:
    'Browse institutional policies including HR, research, environmental, and learner policies at JKKN College of Engineering.',
  keywords: [
    'institutional policies',
    'HR policy',
    'research policy',
    'environmental policy',
    'learner handbook',
    'JKKN policies',
  ],
}

export default function PoliciesPage() {
  const policyItems = LOCAL_POLICY_PDFS.map((pdf) => ({
    name: pdf.title,
    url: `/pdfs/${pdf.pdfPath}`,
    description: pdf.description,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16 px-4">
      {/* JSON-LD (main only): CollectionPage + BreadcrumbList + ItemList */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/policies',
          name: 'Institutional Policies | JKKN Institutions',
          description:
            'Comprehensive institutional policies at JKKN Institutions governing academics, research, human resources, environment, grievance redressal, and learner life.',
          pageType: 'CollectionPage',
          keywords: [
            'JKKN policies',
            'institutional policies',
            'HR policy',
            'research policy',
            'environmental policy',
          ],
          speakableSelectors: ['h1'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Policies', url: '/policies' },
          ],
        }}
        itemList={{
          name: 'JKKN Institutional Policies',
          items: policyItems,
        }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-600 mb-4">
            Institutional Policies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive policies governing academics, research, environment, and learner life
          </p>
        </div>

        {/* PDF List */}
        <LocalPdfLinkList
          pdfs={LOCAL_POLICY_PDFS}
          accentColor="#10b981"
          backgroundColor="white"
          groupByCategory={true}
          showFileSize={true}
          columns={2}
        />
      </div>
    </div>
  )
}
