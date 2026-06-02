import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CmsRedirect } from '@/components/public/cms-redirect'
import { Suspense } from 'react'
import { getInstitutionId } from '@/lib/config/multi-tenant'
import { getPageBySlug, getPageWithVisibility } from '@/app/actions/cms/pages'
import { getActiveCustomComponents } from '@/app/actions/cms/get-custom-components'
import { PageRenderer } from '@/components/cms-blocks/page-renderer'
import { CustomComponentRegistrar } from '@/components/cms-blocks/custom-component-registrar'
import { Skeleton } from '@/components/ui/skeleton'
import { PasswordProtectedPage, PrivatePageGate } from '@/components/public/password-protected-page'
import type { PageTypographySettings } from '@/lib/cms/page-typography-types'
import MainOurInstitutionsPage from './_main-page'

const CMS_SLUG = 'our-institutions'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const id = getInstitutionId()

  if (id === 'main') {
    return {
      title: 'Our Institutions — 9 Pillars of JKKN Excellence',
      description:
        'JKKN Institutions comprises 7 colleges and 2 schools on one integrated 70-acre campus in Komarapalayam, Tamil Nadu. Established 1952. NAAC A accredited. 92%+ placements.',
      keywords: [
        'JKKN institutions list',
        'JKKN colleges',
        'JKKN schools',
        '9 JKKN institutions',
        'JKKN Dental College',
        'JKKN Pharmacy College',
        'JKKN Engineering College',
        'JKKN Allied Health Sciences',
        'JKKN Arts and Science',
        'Sresakthimayeil Nursing',
        'JKKN College of Education',
        'JKKN Matriculation School',
        'Nattraja Vidhyalya',
        'Komarapalayam colleges',
        'Namakkal colleges',
        'NAAC A accredited Tamil Nadu',
      ],
      alternates: {
        canonical: 'https://www.jkkn.ac.in/our-institutions',
        languages: {
          'en-IN': 'https://www.jkkn.ac.in/our-institutions',
          'ta-IN': 'https://www.jkkn.ac.in/ta/our-institutions',
          'x-default': 'https://www.jkkn.ac.in/our-institutions',
        },
      },
      openGraph: {
        title: 'Our Institutions — 9 Pillars of JKKN Excellence',
        description:
          'JKKN comprises 7 colleges and 2 schools on one integrated 70-acre campus. 50+ programs. NAAC A. 92%+ placements.',
        url: 'https://www.jkkn.ac.in/our-institutions',
        siteName: 'JKKN Institutions',
        type: 'website',
        locale: 'en_IN',
        images: [
          {
            url: 'https://www.jkkn.ac.in/og-image.png',
            width: 1200,
            height: 630,
            alt: 'JKKN Institutions — 9 educational pillars on one 70-acre campus in Komarapalayam, Tamil Nadu',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@jkkninstitution',
        creator: '@jkkninstitution',
        title: 'Our Institutions — 9 Pillars of JKKN Excellence',
        description:
          'JKKN comprises 7 colleges and 2 schools on one integrated 70-acre campus. 50+ programs. NAAC A. 92%+ placements.',
        images: ['https://www.jkkn.ac.in/og-image.png'],
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large',
          'max-video-preview': -1,
        },
      },
      authors: [{ name: 'JKKN Institutions', url: 'https://www.jkkn.ac.in/' }],
      publisher: 'JKKN Institutions',
      category: 'Education',
    }
  }

  // Non-main: fall back to CMS-driven metadata for this slug
  const page = await getPageBySlug(CMS_SLUG)
  if (!page) return { title: 'Our Institutions' }

  const seo = Array.isArray(page.cms_seo_metadata)
    ? page.cms_seo_metadata[0]
    : page.cms_seo_metadata

  return {
    title: { absolute: seo?.meta_title || page.title },
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
    alternates: seo?.canonical_url ? { canonical: seo.canonical_url } : undefined,
    robots: seo?.robots_directive || undefined,
  }
}

function BlocksSkeleton() {
  return (
    <div className="space-y-8 p-4">
      <Skeleton className="h-[400px] w-full rounded-lg" />
      <div className="space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export default async function OurInstitutionsPage() {
  const institutionId = getInstitutionId()

  if (institutionId === 'main') {
    return <MainOurInstitutionsPage />
  }

  // For non-main institutions, delegate to the same CMS pipeline used by [...slug].
  // The static segment otherwise shadows the catch-all and forces a 404.
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
  if (!page) notFound()

  const pageMetadata = page.metadata as Record<string, unknown> | null
  const redirectUrl = pageMetadata?.redirect_url as string | undefined
  if (redirectUrl) return <CmsRedirect url={redirectUrl} />

  const blocks = page.cms_page_blocks.map((block) => ({
    id: block.id,
    component_name: block.component_name,
    props: block.props,
    sort_order: block.sort_order,
    parent_block_id: block.parent_block_id,
    is_visible: block.is_visible ?? true,
  }))

  const pageTypography = (page.metadata as Record<string, unknown> | null)?.typography as PageTypographySettings | undefined

  const customComponents = await getActiveCustomComponents()

  return (
    <article>
      <Suspense fallback={<BlocksSkeleton />}>
        <CustomComponentRegistrar components={customComponents}>
          <PageRenderer blocks={blocks} pageTypography={pageTypography} />
        </CustomComponentRegistrar>
      </Suspense>
    </article>
  )
}
