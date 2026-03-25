// components/city-pages/city-programmes-grid.tsx
// Server Component — props: cityConfig

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityProgrammesGridProps {
  cityConfig: CityPageConfig
}

const COURSES = [
  { icon: '💻', name: 'B.E. Computer Science and Engineering', intake: 120 },
  { icon: '📡', name: 'B.E. Electronics and Communication Engineering', intake: 60 },
  { icon: '🔧', name: 'B.E. Mechanical Engineering', intake: 60 },
  { icon: '⚡', name: 'B.E. Electrical and Electronics Engineering', intake: 60 },
  { icon: '🏗️', name: 'B.E. Civil Engineering', intake: 60 },
] as const

export default function CityProgrammesGrid({ cityConfig }: CityProgrammesGridProps) {
  const whatsappUrl = `https://wa.me/919345855001?text=${cityConfig.whatsappMessage}`

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-poppins text-3xl font-bold text-gray-900 text-center mb-2">
          Engineering Programmes at JKKNCET
        </h2>
        <p className="text-center text-gray-500 text-base mb-3 max-w-2xl mx-auto">
          All programmes are AICTE approved and affiliated to Anna University, Chennai.
          Admissions via TNEA counselling.
        </p>
        <span className="block w-12 h-1 bg-secondary rounded mx-auto mt-3 mb-6" aria-hidden="true" />

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COURSES.map((course) => (
            <div
              key={course.name}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-200 flex flex-col transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/70"
            >
              <div className="text-3xl mb-3" aria-hidden="true">
                {course.icon}
              </div>
              <h3 className="font-poppins text-base font-bold text-gray-900 mb-4">
                {course.name}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="font-semibold text-gray-900">4 Years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Level</span>
                  <span className="font-semibold text-gray-900">UG</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Intake</span>
                  <span className="font-semibold text-gray-900">{course.intake} seats</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 border-t border-gray-100 pt-3 mt-auto mb-4">
                Eligibility: 10+2 with Maths, Physics; TNEA counselling
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-primary/10 text-primary font-semibold text-sm py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all"
                aria-label={`Enquire about ${course.name} via WhatsApp`}
              >
                Enquire About This Course
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
