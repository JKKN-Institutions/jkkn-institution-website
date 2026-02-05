import type { Metadata } from 'next'
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_POLICY_PDFS } from '@/lib/data/local-policy-pdfs'

export const metadata: Metadata = {
  title: 'Institutional Policies | JKKN College of Engineering',
  description:
    'Browse institutional policies including HR, research, environmental, and student policies at JKKN College of Engineering.',
  keywords: [
    'institutional policies',
    'HR policy',
    'research policy',
    'environmental policy',
    'student handbook',
    'JKKN policies',
  ],
}

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-600 mb-4">
            Institutional Policies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive policies governing academics, research, environment, and student life
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
