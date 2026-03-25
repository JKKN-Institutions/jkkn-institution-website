import { notFound, redirect, RedirectType } from 'next/navigation'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getPageBySlug, getPageWithVisibility } from '@/app/actions/cms/pages'
import { getActiveCustomComponents } from '@/app/actions/cms/get-custom-components'
import { PageRenderer } from '@/components/cms-blocks/page-renderer'
import { CustomComponentRegistrar } from '@/components/cms-blocks/custom-component-registrar'
import { Skeleton } from '@/components/ui/skeleton'
import { LandingPage } from '@/components/public/landing-page'
import { PasswordProtectedPage, PrivatePageGate } from '@/components/public/password-protected-page'
import { CourseCatalogSchema } from '@/components/seo/course-catalog-schema'
import { EventsCalendarSchema } from '@/components/seo/events-calendar-schema'
import { WebsiteSchema } from '@/components/seo/website-schema'
import { FAQSchema } from '@/components/seo/faq-schema'
import { FAQSchemaAdmissions, FAQSchemaPlacements, FAQSchemaAbout, HowToSchemaAdmissions } from '@/components/seo/faq-schema-admissions'
import type { PageTypographySettings } from '@/lib/cms/page-typography-types'
import { getBreadcrumbsForPath, generateBreadcrumbSchema, serializeSchema } from '@/lib/seo'
import { resolvePageSchemas } from '@/lib/seo/schema-resolver'

// Dynamic rendering for 404 handling - automatically handled with cacheComponents
// Cache Components ensures proper 404 status codes without force-dynamic

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const slugPath = slug?.join('/') ?? ''
  const path = slugPath ? `/${slugPath}` : '/'

  // Generate breadcrumb schema for this page
  const breadcrumbs = getBreadcrumbsForPath(path)
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)

  // Fetch page for both homepage and other pages
  const page = await getPageBySlug(slugPath)

  // If no CMS page exists, return default metadata
  if (!page) {
    // Default fallback metadata for homepage
    if (!slugPath) {
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
    return { title: 'Page Not Found' }
  }

  const seo = Array.isArray(page.cms_seo_metadata)
    ? page.cms_seo_metadata[0]
    : page.cms_seo_metadata

  // Build comprehensive metadata from SEO fields with proper fallback chain
  return {
    // Basic meta tags - use absolute to bypass the template suffix
    title: {
      absolute: seo?.meta_title || page.title
    },
    description: seo?.meta_description || page.description || undefined,
    keywords: seo?.meta_keywords || undefined,

    // Open Graph (with fallback to meta fields)
    openGraph: {
      title: seo?.og_title || seo?.meta_title || page.title,
      description: seo?.og_description || seo?.meta_description || page.description || undefined,
      images: seo?.og_image
        ? [{ url: seo.og_image, width: 1200, height: 630 }]
        : [{ url: '/og-image.png', width: 1200, height: 630, alt: seo?.meta_title || page.title }],
      type: (seo?.og_type as any) || 'website',
    },

    // Twitter Card (with OG fallback)
    twitter: {
      card: (seo?.twitter_card as any) || 'summary_large_image',
      title: seo?.twitter_title || seo?.og_title || seo?.meta_title || page.title,
      description: seo?.twitter_description || seo?.og_description || seo?.meta_description || page.description || undefined,
      images: seo?.twitter_image ? [seo.twitter_image] : (seo?.og_image ? [seo.og_image] : ['/og-image.png']),
    },

    // Canonical URL + hreflang alternates
    alternates: {
      ...(seo?.canonical_url ? { canonical: seo.canonical_url } : {}),
      languages: {
        'en-IN': path,
        'x-default': path,
      },
    },

    // Robots directive
    robots: seo?.robots_directive || undefined,

    // Structured data (BreadcrumbList JSON-LD)
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
 * Render the appropriate schemas for a given slug using the schema resolver.
 * Organization schema is already in the root layout — NOT duplicated here.
 */
function PageSchemas({ slug, isHomepage }: { slug: string; isHomepage: boolean }) {
  const schemas = resolvePageSchemas(slug, isHomepage)

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
    </>
  )
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const slugPath = slug?.join('/') ?? ''

  // Fetch custom components server-side (before any rendering)
  const customComponents = await getActiveCustomComponents()

  // Don't handle admin routes - they should be handled by the (admin) route group
  if (slugPath.startsWith('admin')) {
    notFound()
  }

  // For homepage (empty slug), first try to get CMS content, otherwise show landing page
  if (!slugPath) {
    const result = await getPageWithVisibility('')

    // If no CMS homepage exists, show the beautiful landing page
    if (result.status === 'not_found') {
      return (
        <>
          <PageSchemas slug="" isHomepage />
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
          <PageSchemas slug="" isHomepage />
          <Suspense fallback={<LandingPageSkeleton />}>
            <LandingPage />
          </Suspense>
        </>
      )
    }

    // If CMS homepage exists and is accessible, render it
    const page = result.page

    // Check for redirect URL in metadata - redirect to external URL if set
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
        <PageSchemas slug="" isHomepage />
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

  // Fetch the page with visibility check for other routes
  const result = await getPageWithVisibility(slugPath)

  // Handle different visibility statuses
  if (result.status === 'not_found' || result.status === 'not_published') {
    notFound()
  }

  if (result.status === 'requires_auth') {
    return <PrivatePageGate />
  }

  if (result.status === 'requires_password') {
    return <PasswordProtectedPage slug={slugPath} />
  }

  // Page is accessible
  const page = result.page

  if (!page) {
    notFound()
  }

  // Check for redirect URL in metadata - redirect to external URL if set
  const pageMetadata = page.metadata as Record<string, unknown> | null
  const redirectUrl = pageMetadata?.redirect_url as string | undefined
  if (redirectUrl) {
    redirect(redirectUrl)
  }

  // Transform blocks to the format expected by PageRenderer
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
      <PageSchemas slug={slugPath} isHomepage={false} />
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
