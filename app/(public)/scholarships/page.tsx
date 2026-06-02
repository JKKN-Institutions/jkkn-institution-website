import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { CmsRedirect } from '@/components/public/cms-redirect'

import { getActiveCustomComponents } from '@/app/actions/cms/get-custom-components'
import { getPageBySlug, getPageWithVisibility } from '@/app/actions/cms/pages'
import { PageRenderer } from '@/components/cms-blocks/page-renderer'
import { CustomComponentRegistrar } from '@/components/cms-blocks/custom-component-registrar'
import { PasswordProtectedPage, PrivatePageGate } from '@/components/public/password-protected-page'
import { CourseCatalogSchema } from '@/components/seo/course-catalog-schema'
import { EventsCalendarSchema } from '@/components/seo/events-calendar-schema'
import { FAQSchema } from '@/components/seo/faq-schema'
import {
  FAQSchemaAbout,
  FAQSchemaAdmissions,
  FAQSchemaPlacements,
  HowToSchemaAdmissions,
} from '@/components/seo/faq-schema-admissions'
import { WebsiteSchema } from '@/components/seo/website-schema'
import { Skeleton } from '@/components/ui/skeleton'
import { getInstitutionId } from '@/lib/config/multi-tenant'
import type { PageTypographySettings } from '@/lib/cms/page-typography-types'
import {
  generateBreadcrumbSchema,
  getBreadcrumbsForPath,
  serializeSchema,
} from '@/lib/seo'
import { resolvePageSchemas } from '@/lib/seo/schema-resolver'

import EngineeringScholarshipPage from './_engineering-scholarship'

const CMS_SLUG = 'scholarships'

// ─── Static Generation ───────────────────────────────────────────────────────
// Scholarship amounts update on government-norm cycles (typically annual).
// Daily revalidation is safe.
export const revalidate = 86400

// ─── Metadata (institution-aware) ────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const id = getInstitutionId()

  if (id === 'engineering') {
    return {
      title:
        'Scholarship Details 2026-27 | JKKN College of Engineering and Technology',
      description:
        'Government, Trust, and Naan Mudhalvan scholarship details for B.E / B.Tech, M.B.A, and M.E programmes at JKKN Engineering College. Covers PMSS (SC/SCA/ST/BC-CC), First Graduate (BC/MBC/DNC/BCM), Maintenance, and Merit-based Trust Scholarship.',
      keywords: [
        'JKKN engineering scholarships',
        'engineering college scholarships Tamil Nadu',
        'PMSS scholarship engineering',
        'First Graduate scholarship engineering',
        'Naan Mudhalvan scholarship',
        'Trust scholarship JKKN',
        'BC MBC DNC BCM scholarship',
        'SC ST scholarship engineering',
        'merit scholarship engineering 2026',
        'JKKN BE BTech scholarship',
        'MBA scholarship Namakkal',
        'engineering scholarship eligibility',
      ],
      alternates: { canonical: 'https://engg.jkkn.ac.in/scholarships' },
      openGraph: {
        title:
          'Scholarship Details 2026-27 — JKKN College of Engineering and Technology',
        description:
          'Complete scholarship details for engineering programmes — Government schemes, Trust Merit Scholarship, and Naan Mudhalvan benefits.',
        url: 'https://engg.jkkn.ac.in/scholarships',
        siteName: 'JKKN College of Engineering and Technology',
        type: 'website',
        locale: 'en_IN',
        images: [
          {
            url: '/og/engineering-admissions.jpg',
            width: 1200,
            height: 630,
            alt: 'JKKN Engineering — Scholarship Details 2026-27',
          },
        ],
      },
    }
  }

  // Non-engineering institutions: pull metadata from the CMS `scholarships`
  // row — same fallback chain as the [...slug] catch-all, so SEO fidelity is
  // preserved for main / dental / pharmacy / arts-science / nursing.
  const page = await getPageBySlug(CMS_SLUG)
  if (!page) {
    return { title: 'Page Not Found' }
  }

  const seo = Array.isArray(page.cms_seo_metadata)
    ? page.cms_seo_metadata[0]
    : page.cms_seo_metadata
  const path = `/${CMS_SLUG}`
  const breadcrumbs = getBreadcrumbsForPath(path)
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)

  return {
    title: { absolute: seo?.meta_title || page.title },
    description: seo?.meta_description || page.description || undefined,
    keywords: seo?.meta_keywords || undefined,
    openGraph: {
      title: seo?.og_title || seo?.meta_title || page.title,
      description:
        seo?.og_description || seo?.meta_description || page.description || undefined,
      images: seo?.og_image
        ? [{ url: seo.og_image, width: 1200, height: 630 }]
        : [
            {
              url: '/og-image.png',
              width: 1200,
              height: 630,
              alt: seo?.meta_title || page.title,
            },
          ],
      type: (seo?.og_type as any) || 'website',
    },
    twitter: {
      card: (seo?.twitter_card as 'summary' | 'summary_large_image') ||
        'summary_large_image',
      title:
        seo?.twitter_title || seo?.og_title || seo?.meta_title || page.title,
      description:
        seo?.twitter_description ||
        seo?.og_description ||
        seo?.meta_description ||
        page.description ||
        undefined,
      images: seo?.twitter_image
        ? [seo.twitter_image]
        : seo?.og_image
          ? [seo.og_image]
          : ['/og-image.png'],
    },
    alternates: {
      ...(seo?.canonical_url ? { canonical: seo.canonical_url } : {}),
      languages: {
        'en-IN': path,
        'x-default': path,
      },
    },
    robots: seo?.robots_directive || undefined,
    other: {
      'script:ld+json:breadcrumb': serializeSchema(breadcrumbSchema),
    },
  }
}

// Loading skeleton mirrors the [...slug] catch-all so UX is identical.
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

function PageSchemas({ slug }: { slug: string }) {
  const schemas = resolvePageSchemas(slug, false)
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

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function ScholarshipsRoutePage() {
  const id = getInstitutionId()

  if (id === 'engineering') {
    return <EngineeringScholarshipPage />
  }

  // For every other institution (main, dental, pharmacy, arts-science, nursing)
  // render the CMS `scholarships` hub page. This static segment would otherwise
  // shadow the [...slug] catch-all and 404 the cms_pages row that lives here.
  const customComponents = await getActiveCustomComponents()
  const result = await getPageWithVisibility(CMS_SLUG)

  if (result.status === 'not_found' || result.status === 'not_published') {
    notFound()
  }
  if (result.status === 'requires_auth') {
    return <PrivatePageGate />
  }
  if (result.status === 'requires_password') {
    return <PasswordProtectedPage slug={CMS_SLUG} />
  }

  const page = result.page
  if (!page) {
    notFound()
  }

  const pageMetadata = page.metadata as Record<string, unknown> | null
  const redirectUrl = pageMetadata?.redirect_url as string | undefined
  if (redirectUrl) {
    return <CmsRedirect url={redirectUrl} />
  }

  const blocks = page.cms_page_blocks.map((block) => ({
    id: block.id,
    component_name: block.component_name,
    props: block.props,
    sort_order: block.sort_order,
    parent_block_id: block.parent_block_id,
    is_visible: block.is_visible ?? true,
  }))

  const pageTypography = (page.metadata as Record<string, unknown> | null)
    ?.typography as PageTypographySettings | undefined

  return (
    <>
      <PageSchemas slug={CMS_SLUG} />
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
