import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: '2019-2020 Feedback | JKKN Institutions',
  description:
    'Student, Alumni, Parents, and Faculty feedback reports for the academic year 2019-2020.',
  keywords: [
    'feedback',
    '2019-2020',
    'student feedback',
    'alumni feedback',
    'parent feedback',
    'faculty feedback',
    'JKKN',
    'IQAC',
  ],
}

const feedbackCategories = [
  {
    id: 'student',
    label: 'student',
    pdfPath: '/pdfs/feedback/2019-2020/student-feedback-2019-2020.pdf',
  },
  {
    id: 'alumni',
    label: 'Alumni',
    pdfPath: '/pdfs/feedback/2019-2020/alumni-feedback-2019-2020.pdf',
  },
  {
    id: 'parents',
    label: 'parents',
    pdfPath: '/pdfs/feedback/2019-2020/parents-feedback-2019-2020.pdf',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    pdfPath: '/pdfs/feedback/2019-2020/faculty-feedback-2019-2020.pdf',
  },
]

export default function Feedback20192020Page() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#004d40] mb-2">
            2019-2020
          </h1>
          <div className="w-20 h-1 bg-[#7db247]"></div>
        </div>

        {/* Feedback Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
          {feedbackCategories.map((category) => (
            <a
              key={category.id}
              href={category.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-[#E8E3F0] hover:bg-[#D4CCE4] transition-all duration-300 rounded-lg p-8 shadow-sm hover:shadow-lg flex items-center justify-center"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#5b4a7a] group-hover:text-[#4a3a62] transition-colors" />
                <span className="text-lg font-medium text-[#4a4a4a] group-hover:text-[#2a2a2a] transition-colors">
                  {category.label}
                </span>
              </div>

              {/* Hover indicator */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#7db247] rounded-lg transition-all duration-300"></div>
            </a>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 max-w-3xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#7db247]" />
            Instructions
          </h2>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>• Click on any category button to view the feedback report PDF</li>
            <li>• Reports will open in a new tab</li>
            <li>• Ensure you have a PDF reader installed to view the documents</li>
            <li>
              • For any issues, please contact the IQAC office at iqac@jkkn.ac.in
            </li>
          </ul>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <a
            href="/iqac"
            className="inline-flex items-center text-[#7db247] hover:text-[#6da138] font-medium transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to IQAC
          </a>
        </div>
      </div>
    </div>
  )
}
