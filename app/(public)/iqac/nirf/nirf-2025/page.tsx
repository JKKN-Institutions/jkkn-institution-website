'use client'

import { Download } from 'lucide-react'
import { useEffect } from 'react'

interface NIRFCategory {
  title: string
  downloadUrl: string
}

const categories: NIRFCategory[] = [
  {
    title: 'Engineering',
    downloadUrl: '/documents/nirf/2025/engineering.pdf',
  },
  {
    title: 'Management',
    downloadUrl: '/documents/nirf/2025/management.pdf',
  },
  {
    title: 'Innovation',
    downloadUrl: '/documents/nirf/2025/innovation.pdf',
  },
  {
    title: 'Overall',
    downloadUrl: '/documents/nirf/2025/overall.pdf',
  },
  {
    title: 'SDG',
    downloadUrl: '/documents/nirf/2025/sdg.pdf',
  },
]

export default function NIRF2025Page() {
  useEffect(() => {
    document.title = 'NIRF 2025 | IQAC | JKKN'
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E7] via-[#F5E6D3] to-[#FFF8E7]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            NIRF – 2025
          </h1>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {categories.map((category) => (
              <div key={category.title} className="space-y-3">
                {/* Category Title */}
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  {category.title}
                </h2>

                {/* Download Button */}
                <a
                  href={category.downloadUrl}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-green-600 text-green-600 hover:text-white border-2 border-green-600 font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200"
                  style={{
                    borderColor: '#6BAF6C',
                    color: '#6BAF6C',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#6BAF6C'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                    e.currentTarget.style.color = '#6BAF6C'
                  }}
                >
                  <Download className="w-5 h-5" />
                  Download
                </a>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-600">
              National Institutional Ranking Framework (NIRF) 2025 Reports
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
