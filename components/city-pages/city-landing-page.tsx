import type { CityPageConfig } from '@/lib/config/city-pages'
import '@/styles/city-pages.css'

// City-pages components (named exports)
import { CityHeroSection } from '@/components/city-pages/city-hero-section'
import { CityFAQAccordion } from '@/components/city-pages/city-faq-accordion'
// City-pages components (default exports)
import CitySchema from '@/components/city-pages/city-schema'
import CityDistanceBanner from '@/components/city-pages/city-distance-banner'
import CityWhyChooseGrid from '@/components/city-pages/city-why-choose-grid'
import CityProgrammesGrid from '@/components/city-pages/city-programmes-grid'
import CityPlacementStats from '@/components/city-pages/city-placement-stats'
import CityHowToReach from '@/components/city-pages/city-how-to-reach'
import CityCampusFacilities from '@/components/city-pages/city-campus-facilities'
import CityCrossLinks from '@/components/city-pages/city-cross-links'

interface CityLandingPageProps {
  cityConfig: CityPageConfig
}

export function CityLandingPage({ cityConfig }: CityLandingPageProps) {
  return (
    <div className="city-page">
      {/* JSON-LD Structured Data */}
      <CitySchema cityConfig={cityConfig} />

      {/* 1. Hero */}
      <CityHeroSection cityConfig={cityConfig} />

      {/* 2. Distance Banner */}
      <CityDistanceBanner cityConfig={cityConfig} />

      {/* 4. Why Choose */}
      <CityWhyChooseGrid cityConfig={cityConfig} />

      {/* 5. Programmes */}
      <CityProgrammesGrid cityConfig={cityConfig} />

      {/* 6. Placements */}
      <CityPlacementStats />

      {/* 7. How to Reach */}
      <CityHowToReach cityConfig={cityConfig} />

      {/* 8. Campus Facilities */}
      <CityCampusFacilities />


      {/* 10. FAQ Accordion */}
      <CityFAQAccordion cityConfig={cityConfig} />

      {/* 11. Cross-City Links */}
      <CityCrossLinks cityConfig={cityConfig} />
    </div>
  )
}
