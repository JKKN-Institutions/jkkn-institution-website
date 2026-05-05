import { NAACPage } from '@/components/cms-blocks/content/naac-page'
import { getInstitutionId } from '@/lib/config/multi-tenant'
import type { Metadata } from 'next'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'
import { ACCREDITATION_FAQS } from '@/lib/seo/main-institution/page-content'

/**
 * NAAC Accreditation Page Route
 *
 * Multi-institution support with dynamic data loading
 * SEO optimized with proper metadata
 * Static rendering with institution-specific content
 */

export const metadata: Metadata = {
  title: 'NAAC Accreditation | JKKN Institutions',
  description:
    'NAAC accreditation details, quality assessment criteria, institutional information, self-study reports, and data validation documentation for JKKN Institutions.',
  keywords: [
    'NAAC',
    'accreditation',
    'quality assessment',
    'IIQA',
    'SSR',
    'DVV',
    'institutional quality',
    'JKKN',
    'higher education',
    'NAAC criteria',
  ],
  openGraph: {
    title: 'NAAC Accreditation | JKKN Institutions',
    description:
      'Comprehensive NAAC accreditation information including all seven criteria, best practices, and quality assessment reports.',
    type: 'website',
  },
}

/**
 * Load NAAC data based on current institution
 * Supports: main, engineering, dental colleges
 */
async function getNAACData() {
  const institutionId = getInstitutionId()

  switch (institutionId) {
    case 'engineering':
      return (await import('@/lib/cms/templates/naac/engineering-naac-data'))
        .ENGINEERING_NAAC_DATA
    case 'dental':
      return (await import('@/lib/cms/templates/naac/dental-naac-data'))
        .DENTAL_NAAC_DATA
    default:
      return (await import('@/lib/cms/templates/naac/naac-data'))
        .MAIN_NAAC_DATA
  }
}

export default async function NAACPageRoute() {
  const data = await getNAACData()

  return (
    <>
      {/* JSON-LD (main only): WebPage + BreadcrumbList + FAQ */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/naac',
          name: 'NAAC Accreditation | JKKN Institutions',
          description:
            'Comprehensive NAAC accreditation information for JKKN Institutions including all seven criteria, best practices, self-study reports, and data validation documentation.',
          keywords: [
            'NAAC',
            'accreditation',
            'IIQA',
            'SSR',
            'DVV',
            'quality assessment',
            'JKKN NAAC',
          ],
          speakableSelectors: ['h1', '[data-speakable="naac-intro"]'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'NAAC', url: '/naac' },
          ],
        }}
        faqs={ACCREDITATION_FAQS}
      />
      <NAACPage {...data} />
    </>
  )
}
