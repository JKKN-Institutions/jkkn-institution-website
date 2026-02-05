import type { Metadata } from 'next'
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_ALUMNI_PDFS } from '@/lib/data/local-alumni-pdfs'

export const metadata: Metadata = {
  title: 'Alumni Resources | JKKN College of Engineering',
  description:
    'Connect with JKKN Engineering College alumni. Access alumni association documents, newsletters, and directories.',
  keywords: [
    'JKKN alumni',
    'alumni association',
    'alumni network',
    'engineering alumni',
    'JKKN alumni meet',
  ],
}

export default function AlumniPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-600 mb-4">
            Alumni Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay connected with your alma mater and fellow alumni
          </p>
        </div>

        {/* PDF List */}
        <LocalPdfLinkList
          pdfs={LOCAL_ALUMNI_PDFS}
          accentColor="#9333ea"
          backgroundColor="white"
          groupByCategory={true}
          showFileSize={true}
          columns={3}
        />

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">
            Stay Connected
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Want to contribute to the alumni network or update your details?
          </p>
          <a
            href="mailto:alumni@jkkn.ac.in"
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Contact Alumni Cell
          </a>
        </div>
      </div>
    </div>
  )
}
