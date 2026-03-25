import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityConfig, getAllCitySlugs } from '@/lib/config/city-pages'

// City-pages components (named exports)
import { CityStickyTopbar } from '@/components/city-pages/city-sticky-topbar'
import { CityHeroSection } from '@/components/city-pages/city-hero-section'
import { CityFAQAccordion } from '@/components/city-pages/city-faq-accordion'
import { CityEnquiryForm } from '@/components/city-pages/city-enquiry-form'
import { CityFloatingWhatsapp } from '@/components/city-pages/city-floating-whatsapp'
// City-pages components (default exports)
import CitySchema from '@/components/city-pages/city-schema'
import CityTrustBar from '@/components/city-pages/city-trust-bar'
import CityDistanceBanner from '@/components/city-pages/city-distance-banner'
import CityWhyChooseGrid from '@/components/city-pages/city-why-choose-grid'
import CityProgrammesGrid from '@/components/city-pages/city-programmes-grid'
import CityPlacementStats from '@/components/city-pages/city-placement-stats'
import CityHowToReach from '@/components/city-pages/city-how-to-reach'
import CityCampusFacilities from '@/components/city-pages/city-campus-facilities'
import CityTestimonials from '@/components/city-pages/city-testimonials'
import CityCrossLinks from '@/components/city-pages/city-cross-links'
import CityFooter from '@/components/city-pages/city-footer'

// ISR: revalidate every hour
export const revalidate = 3600

// ─────────────────────────────────────────────────────────────────────────────
// Static params
// ─────────────────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllCitySlugs()
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic metadata
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city } = await params
  const cityConfig = getCityConfig(city)

  if (!cityConfig) return {}

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://engg.jkkn.ac.in'

  return {
    title: cityConfig.seo.title,
    description: cityConfig.seo.description,
    alternates: {
      canonical: `${siteUrl}${cityConfig.seo.canonicalPath}`,
    },
    openGraph: {
      title: cityConfig.seo.title,
      description: cityConfig.seo.description,
      url: `${siteUrl}${cityConfig.seo.canonicalPath}`,
      siteName: 'JKKN College of Engineering and Technology',
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: `${siteUrl}${cityConfig.seo.ogImage}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: cityConfig.seo.title,
      description: cityConfig.seo.twitterDescription,
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

export default async function CityLandingPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params

  // Multi-tenant guard: only render for Engineering institution
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID
  if (institutionId && institutionId !== 'engineering') {
    notFound()
  }

  const cityConfig = getCityConfig(city)
  if (!cityConfig) notFound()

  return (
    <main className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <CitySchema cityConfig={cityConfig} />

      {/* 1. Sticky Top Bar */}
      <CityStickyTopbar cityConfig={cityConfig} />

      {/* 2. Hero */}
      <CityHeroSection cityConfig={cityConfig} />

      {/* 3. Trust Bar */}
      <CityTrustBar />

      {/* 4. Distance Banner */}
      <CityDistanceBanner cityConfig={cityConfig} />

      {/* 5. Why Choose */}
      <CityWhyChooseGrid cityConfig={cityConfig} />

      {/* 6. Programmes */}
      <CityProgrammesGrid cityConfig={cityConfig} />

      {/* 7. Placements */}
      <CityPlacementStats />

      {/* 8. How to Reach */}
      <CityHowToReach cityConfig={cityConfig} />

      {/* 9. Campus Facilities */}
      <CityCampusFacilities />

      {/* 10. Testimonials */}
      <CityTestimonials cityConfig={cityConfig} />

      {/* 11. FAQ Accordion */}
      <CityFAQAccordion cityConfig={cityConfig} />

      {/* 12. Enquiry Form */}
      <CityEnquiryForm cityConfig={cityConfig} />

      {/* 13. Cross-City Links */}
      <CityCrossLinks cityConfig={cityConfig} />

      {/* 14. Footer */}
      <CityFooter />

      {/* 15. Floating WhatsApp */}
      <CityFloatingWhatsapp cityConfig={cityConfig} />
    </main>
  )
}
