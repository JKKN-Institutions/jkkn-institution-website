import { NAACPage } from '@/components/cms-blocks/content/naac-page'
import { getInstitutionId, getCurrentInstitution } from '@/lib/config/multi-tenant'
import type { Metadata } from 'next'

// Force dynamic rendering to ensure correct institution data is loaded
export const dynamic = 'force-dynamic'

/**
 * NAAC Overview Page Route
 *
 * Comprehensive NAAC accreditation documentation including:
 * - IIQA (Institutional Information for Quality Assessment)
 * - All 7 Criteria with detailed metrics and documents
 * - Best Practices
 * - Institution Distinctiveness
 * - Stakeholder Feedback (5 years)
 * - DVV Clarifications
 * - SSR Cycle-1
 *
 * Multi-institution support with dynamic data loading
 * SEO optimized with proper metadata
 */

// Dynamic metadata based on institution
const institution = getCurrentInstitution()
const institutionName = institution.name

export const metadata: Metadata = {
  title: `NAAC Accreditation - Overview | ${institution.shortName}`,
  description: `Comprehensive NAAC accreditation documentation for ${institutionName}. Access IIQA, all seven criteria, best practices, institutional distinctiveness, stakeholder feedback, DVV clarifications, and Self Study Report.`,
  keywords: [
    'NAAC',
    'NAAC accreditation',
    'IIQA',
    'seven criteria',
    'curricular aspects',
    'teaching learning',
    'research innovation',
    'infrastructure',
    'student support',
    'governance',
    'institutional values',
    'best practices',
    'DVV',
    'SSR',
    'quality assurance',
    institutionName,
    institution.shortName,
    'higher education accreditation',
  ],
  openGraph: {
    title: `NAAC Accreditation - Overview | ${institution.shortName}`,
    description: `Complete NAAC accreditation documentation for ${institutionName} covering all seven criteria, institutional excellence, quality benchmarks, and continuous improvement initiatives.`,
    type: 'website',
  },
}

/**
 * Load NAAC overview data based on current institution
 * Supports: main, engineering, dental colleges
 */
async function getNAACOverviewData() {
  const institutionId = getInstitutionId()

  switch (institutionId) {
    case 'engineering':
      return (
        await import(
          '@/lib/cms/templates/naac/engineering-naac-overview'
        )
      ).ENGINEERING_NAAC_OVERVIEW_DATA
    case 'dental':
      return (
        await import('@/lib/cms/templates/naac/dental-naac-data')
      ).DENTAL_NAAC_DATA
    default:
      return (
        await import('@/lib/cms/templates/naac/naac-data')
      ).MAIN_NAAC_DATA
  }
}

export default async function NAACOverviewPage() {
  const data = await getNAACOverviewData()

  return <NAACPage {...data} />
}
