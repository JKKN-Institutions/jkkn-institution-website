// components/city-pages/city-testimonials.tsx
// Server Component — props: cityConfig

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CityTestimonialsProps {
  cityConfig: CityPageConfig
}

export default function CityTestimonials({ cityConfig }: CityTestimonialsProps) {
  return (
    <section className="section">
      <div className="section-inner">
        <h2 className="section-title">What Our Students Say</h2>
        <p className="section-subtitle">
          Real experiences from students who made the choice to study at JKKNCET.
        </p>
        <span className="section-accent" aria-hidden="true" />
        <div className="section-spacer" />

        <div className="testimonial-grid">
          {cityConfig.testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-text">{testimonial.quote}</p>
              <p className="testimonial-author">{testimonial.author}</p>
              <p className="testimonial-role">{testimonial.role}</p>
            </div>
          ))}

          {/* Deployment reminder note */}
          <div className="testimonial-note">
            Add 2-3 real student testimonials from {cityConfig.displayName} or nearby areas before
            deployment.
          </div>
        </div>
      </div>
    </section>
  )
}
