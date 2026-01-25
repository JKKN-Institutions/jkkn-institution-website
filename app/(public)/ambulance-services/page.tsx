import type { Metadata } from 'next'
import { AmbulanceServicePage } from '@/components/cms-blocks/content/ambulance-service-page'
import { AMBULANCE_SERVICE_DATA } from '@/lib/cms/templates/engineering/ambulance-service-data'

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
      <AmbulanceServicePage {...AMBULANCE_SERVICE_DATA} />
    </main>
  )
}
