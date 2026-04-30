import type { Metadata } from 'next'
import { AmbulanceServicePage } from '@/components/cms-blocks/content/ambulance-service-page'
import { AMBULANCE_SERVICE_DATA } from '@/lib/cms/templates/engineering/ambulance-service-data'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'

export const metadata: Metadata = {
  title: 'Ambulance Services | JKKN College of Engineering',
  description:
    '24/7 ambulance services at JKKN College of Engineering. Emergency contact: Mr. Atchuthan +91 9360987848. Fully equipped with state-of-the-art medical equipment and trained medical personnel.',
  keywords: [
    'ambulance',
    'emergency services',
    'medical emergency',
    'JKKN ambulance',
    'emergency medical services',
    'campus ambulance',
    'emergency contact',
    '24/7 medical services',
  ],
  openGraph: {
    title: 'Ambulance Services | JKKN College of Engineering',
    description:
      '24/7 ambulance services with trained medical personnel and state-of-the-art equipment. Emergency contact: Mr. Atchuthan +91 9360987848',
    type: 'website',
    siteName: 'JKKN College of Engineering',
    images: [
      {
        url: '/images/facilities/ambulance-1.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN Ambulance Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ambulance Services | JKKN College of Engineering',
    description:
      '24/7 ambulance services at JKKN. Emergency contact: Mr. Atchuthan +91 9360987848',
    images: ['/images/facilities/ambulance-1.jpg'],
  },
}

export default function AmbulanceServicesPage() {
  return (
    <main>
      {/* JSON-LD (main only): WebPage + BreadcrumbList */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/ambulance-services',
          name: 'Ambulance & Emergency Medical Services | JKKN Institutions',
          description:
            'JKKN Institutions runs 24/7 campus ambulance services with trained medical personnel and equipped vehicles, supporting students, staff, and visitors across the Komarapalayam campus.',
          keywords: [
            'JKKN ambulance',
            'emergency services',
            'medical emergency',
            '24/7 ambulance',
            'campus medical support',
          ],
          speakableSelectors: ['h1', '[data-speakable="ambulance-contact"]'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Ambulance Services', url: '/ambulance-services' },
          ],
        }}
        places={[
          {
            name: 'JKKN Campus Medical & Ambulance Facility',
            description:
              '24/7 on-campus ambulance service and medical first-response unit serving JKKN Institutions, Komarapalayam, Namakkal District, Tamil Nadu.',
            amenityFeature: ['Ambulance Services', 'Emergency Care', 'Trained Medical Staff'],
          },
        ]}
      />
      <AmbulanceServicePage {...AMBULANCE_SERVICE_DATA} />
    </main>
  )
}
