import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getInstitutionId } from '@/lib/config/multi-tenant'
import MainOurInstitutionsPage from './_main-page'

export const revalidate = 86400

export function generateMetadata(): Metadata {
  const id = getInstitutionId()

  if (id === 'main') {
    return {
      title: 'Our Institutions — 9 Pillars of JKKN Excellence',
      description:
        'JKKN Institutions comprises 7 colleges and 2 schools on one integrated 70-acre campus in Komarapalayam, Tamil Nadu. Established 1952. NAAC A accredited. 92%+ placements.',
      keywords: [
        'JKKN institutions list',
        'JKKN colleges',
        'JKKN schools',
        '9 JKKN institutions',
        'JKKN Dental College',
        'JKKN Pharmacy College',
        'JKKN Engineering College',
        'JKKN Allied Health Sciences',
        'JKKN Arts and Science',
        'Sresakthimayeil Nursing',
        'JKKN College of Education',
        'JKKN Matriculation School',
        'Nattraja Vidhyalya',
        'Komarapalayam colleges',
        'Namakkal colleges',
        'NAAC A accredited Tamil Nadu',
      ],
      alternates: {
        canonical: 'https://www.jkkn.ac.in/our-institutions',
        languages: {
          'en-IN': 'https://www.jkkn.ac.in/our-institutions',
          'ta-IN': 'https://www.jkkn.ac.in/ta/our-institutions',
          'x-default': 'https://www.jkkn.ac.in/our-institutions',
        },
      },
      openGraph: {
        title: 'Our Institutions — 9 Pillars of JKKN Excellence',
        description:
          'JKKN comprises 7 colleges and 2 schools on one integrated 70-acre campus. 50+ programs. NAAC A. 92%+ placements.',
        url: 'https://www.jkkn.ac.in/our-institutions',
        siteName: 'JKKN Institutions',
        type: 'website',
        locale: 'en_IN',
        images: [
          {
            url: 'https://www.jkkn.ac.in/og-image.png',
            width: 1200,
            height: 630,
            alt: 'JKKN Institutions — 9 educational pillars on one 70-acre campus in Komarapalayam, Tamil Nadu',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@jkkninstitution',
        creator: '@jkkninstitution',
        title: 'Our Institutions — 9 Pillars of JKKN Excellence',
        description:
          'JKKN comprises 7 colleges and 2 schools on one integrated 70-acre campus. 50+ programs. NAAC A. 92%+ placements.',
        images: ['https://www.jkkn.ac.in/og-image.png'],
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large',
          'max-video-preview': -1,
        },
      },
      authors: [{ name: 'JKKN Institutions', url: 'https://www.jkkn.ac.in/' }],
      publisher: 'JKKN Institutions',
      category: 'Education',
    }
  }

  return {}
}

export default function OurInstitutionsPage() {
  const institutionId = getInstitutionId()

  if (institutionId === 'main') {
    return <MainOurInstitutionsPage />
  }

  notFound()
}
