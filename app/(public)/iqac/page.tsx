import type { Metadata } from 'next'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'
import { ACCREDITATION_FAQS } from '@/lib/seo/main-institution/page-content'

export const metadata: Metadata = {
  title: 'IQAC | JKKN',
  description: 'Internal Quality Assurance Cell at JKKN Institutions',
}

export default function IQACPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* JSON-LD (main only): WebPage + BreadcrumbList + FAQ */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/iqac',
          name: 'IQAC — Internal Quality Assurance Cell | JKKN Institutions',
          description:
            'The Internal Quality Assurance Cell (IQAC) of JKKN Institutions drives continuous improvement in teaching, learning, research, and infrastructure in line with NAAC accreditation standards.',
          keywords: ['IQAC', 'internal quality assurance cell', 'NAAC', 'quality assurance', 'JKKN IQAC'],
          speakableSelectors: ['h1'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'IQAC', url: '/iqac' },
          ],
        }}
        faqs={ACCREDITATION_FAQS}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          IQAC - Internal Quality Assurance Cell
        </h1>
        <p className="text-gray-600 text-lg">
          Content coming soon...
        </p>
      </div>
    </div>
  )
}
