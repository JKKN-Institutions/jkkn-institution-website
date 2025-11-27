'use client'

import {
  HeroSection,
  AboutSection,
  ProgramsSection,
  StatsSection,
  TestimonialsSection,
  CTASection,
} from './landing'

export function LandingPage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
