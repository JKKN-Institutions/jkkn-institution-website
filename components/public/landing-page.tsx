'use client'

import { Suspense } from 'react'
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
import { HeroSkeleton, AboutSkeleton, WhyChooseSkeleton } from '@/components/ui/skeletons'

export function LandingPage() {
  return (
    <div className="overflow-hidden">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<AboutSkeleton />}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<WhyChooseSkeleton />}>
        <WhyChooseSection />
      </Suspense>

      <ProgramsSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}
