import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NIRF | IQAC | JKKN',
  description: 'National Institutional Ranking Framework rankings for JKKN Institutions',
}

export default function NIRFPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          NIRF - National Institutional Ranking Framework
        </h1>
        <p className="text-gray-600 text-lg">
          Content coming soon...
        </p>
      </div>
    </div>
  )
}
