import { InstitutionDistinctivenessPage } from '@/components/cms-blocks/content/institution-distinctiveness-page'
import { getInstitutionId } from '@/lib/config/multi-tenant'
import type { Metadata } from 'next'

/**
 * Institution Distinctiveness Page Route
 *
 * Showcases unique features and distinctive qualities of the institution
 * Multi-institution support with dynamic data loading
 * SEO optimized with proper metadata
 */

export const metadata: Metadata = {
  title: 'Institution Distinctiveness | JKKN College of Engineering',
  description:
    'Discover the unique features and distinctive qualities of JKKN College of Engineering including programme efficiency, entrepreneurship initiatives, social responsibility, and civic engagement.',
  keywords: [
    'institution distinctiveness',
    'unique features',
    'NAAC',
    'quality education',
    'entrepreneurship',
    'IIC',
    'social responsibility',
    'civic engagement',
    'JKKN',
    'engineering college',
    'innovation',
    'holistic education',
  ],
  openGraph: {
    title: 'Institution Distinctiveness | JKKN College of Engineering',
    description:
      'Comprehensive overview of institutional unique strengths including innovative programmes, entrepreneurship ecosystem, and social responsibility initiatives.',
    type: 'website',
  },
}

/**
 * Load Institution Distinctiveness data based on current institution
 * Currently only engineering data is available
 * Falls back to component's default props for other institutions
 */
async function getInstitutionDistinctivenessData() {
  const institutionId = getInstitutionId()

  // Only engineering data is currently available
  if (institutionId === 'engineering') {
    const engineeringData = await import(
      '@/lib/cms/templates/engineering/institution-distinctiveness-data'
    )
    return engineeringData.ENGINEERING_INSTITUTION_DISTINCTIVENESS_DATA
  }

  // For other institutions, return undefined to use component's default props
  // TODO: Add data files for dental, main, and other institutions
  return undefined
}

export default async function InstitutionDistinctivenessPageRoute() {
  const data = await getInstitutionDistinctivenessData()

  // If data exists, use it; otherwise render component with defaults
  if (data) {
    return <InstitutionDistinctivenessPage {...data} />
  }

  // For institutions without data, render the component which will use its default props
  return <InstitutionDistinctivenessPage />
