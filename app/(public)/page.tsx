import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getPageBySlug, getPageWithVisibility } from '@/app/actions/cms/pages'
import { getActiveCustomComponents } from '@/app/actions/cms/get-custom-components'
import { PageRenderer } from '@/components/cms-blocks/page-renderer'
import { CustomComponentRegistrar } from '@/components/cms-blocks/custom-component-registrar'
import { Skeleton } from '@/components/ui/skeleton'
import { LandingPage } from '@/components/public/landing-page'
import { PasswordProtectedPage, PrivatePageGate } from '@/components/public/password-protected-page'
import { WebsiteSchema } from '@/components/seo/website-schema'
import { CourseCatalogSchema } from '@/components/seo/course-catalog-schema'
import { EventsCalendarSchema } from '@/components/seo/events-calendar-schema'
import { FAQSchema } from '@/components/seo/faq-schema'
import { FAQSchemaAdmissions, FAQSchemaPlacements, FAQSchemaAbout, HowToSchemaAdmissions } from '@/components/seo/faq-schema-admissions'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'
import { HomepageInstitutionsItemListSchema } from '@/components/seo/main-institution/homepage-institutions-itemlist-schema'
import { HOME_SPEAKABLE_SELECTORS } from '@/lib/seo/main-institution/page-content'
import type { PageTypographySettings } from '@/lib/cms/page-typography-types'
import { getBreadcrumbsForPath, generateBreadcrumbSchema, serializeSchema } from '@/lib/seo'
import { resolvePageSchemas } from '@/lib/seo/schema-resolver'

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const breadcrumbs = getBreadcrumbsForPath('/')
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)

  const page = await getPageBySlug('')

  if (!page) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'
    return {
      title: 'JKKN Institution | Excellence in Education',
      description: 'JKKN Group of Institutions - Shaping the future through quality education in Engineering, Medical Sciences, Arts & Science, Pharmacy, Management, and Allied Health.',
      keywords: ['JKKN', 'JKKN Institution', 'Engineering College Tamil Nadu', 'Dental College Tamil Nadu', 'Pharmacy College', 'Arts Science College', 'Komarapalayam'],
      openGraph: {
        title: 'JKKN Institution | Excellence in Education',
        description: 'Discover world-class education at JKKN Institution. Where tradition meets innovation.',
        type: 'website',
        url: siteUrl,
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'JKKN Institution' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'JKKN Institution | Excellence in Education',
        description: 'Discover world-class education at JKKN Institution. Where tradition meets innovation.',
        images: ['/og-image.png'],
      },
      other: {
        'script:ld+json:breadcrumb': serializeSchema(breadcrumbSchema),
      },
    }
  }

  const seo = Array.isArray(page.cms_seo_metadata)
    ? page.cms_seo_metadata[0]
    : page.cms_seo_metadata

  return {
    title: {
      absolute: seo?.meta_title || page.title
    },
    description: seo?.meta_description || page.description || undefined,
    keywords: seo?.meta_keywords || undefined,
    openGraph: {
      title: seo?.og_title || seo?.meta_title || page.title,
      description: seo?.og_description || seo?.meta_description || page.description || undefined,
      images: seo?.og_image
        ? [{ url: seo.og_image, width: 1200, height: 630 }]
        : [{ url: '/og-image.png', width: 1200, height: 630, alt: seo?.meta_title || page.title }],
      type: (seo?.og_type as any) || 'website',
    },
    twitter: {
      card: (seo?.twitter_card as any) || 'summary_large_image',
      title: seo?.twitter_title || seo?.og_title || seo?.meta_title || page.title,
      description: seo?.twitter_description || seo?.og_description || seo?.meta_description || page.description || undefined,
      images: seo?.twitter_image ? [seo.twitter_image] : (seo?.og_image ? [seo.og_image] : ['/og-image.png']),
    },
    alternates: {
      ...(seo?.canonical_url ? { canonical: seo.canonical_url } : {}),
      languages: {
        'en-IN': '/',
        'x-default': '/',
      },
    },
    robots: seo?.robots_directive || undefined,
    other: {
      'script:ld+json:breadcrumb': serializeSchema(breadcrumbSchema),
    },
  }
}

// Loading skeleton for blocks
function BlocksSkeleton() {
  return (
    <div className="space-y-8 p-4">
      <Skeleton className="h-[400px] w-full rounded-lg" />
      <div className="space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

// Landing page skeleton
function LandingPageSkeleton() {
  return (
    <div className="min-h-screen">
      <Skeleton className="h-screen w-full" />
    </div>
  )
}

/**
 * Render the appropriate schemas for the homepage.
 */
function HomepageSchemas() {
  const schemas = resolvePageSchemas('', true)

  return (
    <>
      {schemas.website && <WebsiteSchema />}
      {schemas.courseCatalog && <CourseCatalogSchema />}
      {schemas.eventsCalendar && <EventsCalendarSchema />}
      {schemas.faqGeneral && <FAQSchema />}
      {schemas.faqAdmissions && <FAQSchemaAdmissions />}
      {schemas.howToAdmissions && <HowToSchemaAdmissions />}
      {schemas.faqPlacements && <FAQSchemaPlacements />}
      {schemas.faqAbout && <FAQSchemaAbout />}
      {/* GEO/AEO augmentation (main only): homepage WebPage + speakable selectors */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/',
          name: 'JKKN Institutions | 74+ Years of Educational Excellence',
          description:
            'JKKN Institutions — 7 colleges and 2 schools on one 70-acre campus in Komarapalayam, Tamil Nadu. 50+ programmes, 92%+ placements, 50,000+ alumni. NAAC accredited; established 1952 by the J.K.K. Rangammal Charitable Trust.',
          keywords: [
            'JKKN Institutions',
            'JKKN',
            '9 JKKN institutions',
            'JKKN colleges list',
            'Komarapalayam college',
            'Namakkal college',
            'best college near Erode',
            'NAAC accredited college Tamil Nadu',
          ],
          speakableSelectors: HOME_SPEAKABLE_SELECTORS,
          breadcrumbs: [{ name: 'Home', url: '/' }],
        }}
      />
      {/* ItemList of 9 institutions (main only) — entity-level enumeration */}
      <HomepageInstitutionsItemListSchema />
    </>
  )
}

export default async function HomePage() {
  // Fetch custom components server-side
  const customComponents = await getActiveCustomComponents()

  const result = await getPageWithVisibility('')

  // If no CMS homepage exists, show the landing page
  if (result.status === 'not_found') {
    return (
      <>
        <HomepageSchemas />
        <Suspense fallback={<LandingPageSkeleton />}>
          <LandingPage />
        </Suspense>
      </>
    )
  }

  // Handle visibility for homepage
  if (result.status === 'requires_auth') {
    return <PrivatePageGate />
  }

  if (result.status === 'requires_password') {
    return <PasswordProtectedPage slug="" pageTitle="Homepage" />
  }

  if (!result.page) {
    return (
      <>
        <HomepageSchemas />
        <Suspense fallback={<LandingPageSkeleton />}>
          <LandingPage />
        </Suspense>
      </>
    )
  }

  // If CMS homepage exists and is accessible, render it
  const page = result.page

  // Check for redirect URL in metadata
  const homepageMetadata = page.metadata as Record<string, unknown> | null
  const homepageRedirectUrl = homepageMetadata?.redirect_url as string | undefined
  if (homepageRedirectUrl) {
    redirect(homepageRedirectUrl)
  }

  const blocks = page.cms_page_blocks.map((block) => ({
    id: block.id,
    component_name: block.component_name,
    props: block.props,
    sort_order: block.sort_order,
    parent_block_id: block.parent_block_id,
    is_visible: block.is_visible ?? true,
  }))

  // Extract typography settings from page metadata
  const pageTypography = (page.metadata as Record<string, unknown> | null)?.typography as PageTypographySettings | undefined

  return (
    <>
      <HomepageSchemas />
      <article>
        <Suspense fallback={<BlocksSkeleton />}>
          <CustomComponentRegistrar components={customComponents}>
            <PageRenderer blocks={blocks} pageTypography={pageTypography} />
          </CustomComponentRegistrar>
        </Suspense>
      </article>
    </>
  )
}
