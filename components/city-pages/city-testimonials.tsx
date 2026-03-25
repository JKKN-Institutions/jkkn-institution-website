// components/city-pages/city-testimonials.tsx
// Server Component — props: cityConfig

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityTestimonialsProps {
  cityConfig: CityPageConfig
}

export default function CityTestimonials({ cityConfig }: CityTestimonialsProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-poppins text-3xl font-bold text-gray-900 text-center mb-2">
          What Our Students Say
        </h2>
        <p className="text-center text-gray-500 text-base mb-3 max-w-2xl mx-auto">
          Real experiences from students who made the choice to study at JKKNCET.
        </p>
        <span className="block w-12 h-1 bg-secondary rounded mx-auto mt-3 mb-8" aria-hidden="true" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cityConfig.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-200 relative"
            >
              <span
                className="absolute top-2 left-5 text-6xl font-serif text-primary/10 leading-none select-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="italic text-gray-500 text-base mb-4 pt-5">
                {testimonial.quote}
              </p>
              <div>
                <div className="font-bold text-sm text-gray-900">{testimonial.author}</div>
                <div className="text-xs text-gray-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Deployment reminder note */}
        <div className="bg-secondary/20 border border-dashed border-secondary rounded-xl p-4 text-center text-sm text-amber-700 font-medium mt-6">
          Add 2-3 real student testimonials from {cityConfig.displayName} or nearby areas before
          deployment.
        </div>
      </div>
    </section>
  )
}
