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
import {
  HeroSkeleton,
  AboutSkeleton,
  WhyChooseSkeleton,
  ProgramsSkeleton,
  StatsSkeleton,
  TestimonialsSkeleton
} from '@/components/ui/skeletons'

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

      <Suspense fallback={<ProgramsSkeleton />}>
        <ProgramsSection />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      <FAQSection />
      <CTASection />
    </div>
  )
}
