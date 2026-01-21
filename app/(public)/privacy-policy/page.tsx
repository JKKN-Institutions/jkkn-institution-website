import { Metadata } from 'next'
import { PrivacyPolicyContent } from '@/components/public/privacy-policy-content'

export const metadata: Metadata = {
  title: 'Privacy Policy | JKKN College of Engineering and Technology',
  description:
    'Read our privacy policy to understand how JKKN College of Engineering and Technology protects and manages your personal information. Learn about data collection, usage, security measures, and your rights.',
  keywords: [
    'JKKN privacy policy',
    'data protection',
    'personal information',
    'privacy rights',
    'JKKN College of Engineering',
    'data security',
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'Privacy Policy | JKKN College of Engineering and Technology',
    description:
      'Learn how JKKN College of Engineering protects your personal information and respects your privacy rights.',
    type: 'website',
    url: 'https://engg.jkkn.ac.in/privacy-policy',
  },
  alternates: {
    canonical: 'https://engg.jkkn.ac.in/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />
}
