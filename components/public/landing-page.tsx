'use client'

import {
  HeroSection,
  AboutSection,
  WhyChooseSection,
  ProgramsSection,
  StatsSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
} from './landing'

export function LandingPage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <AboutSection />
      <WhyChooseSection />
      <ProgramsSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}
