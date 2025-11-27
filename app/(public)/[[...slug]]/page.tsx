import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getPageBySlug } from '@/app/actions/cms/pages'
import { PageRenderer } from '@/components/cms-blocks/page-renderer'
import { PageFab } from '@/components/public/page-fab'
import { Skeleton } from '@/components/ui/skeleton'
import { LandingPage } from '@/components/public/landing-page'

// Force dynamic rendering since we fetch from database
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const slugPath = slug?.join('/') ?? ''

  // Homepage metadata
  if (!slugPath) {
    return {
      title: 'JKKN Institution | Excellence in Education',
      description: 'JKKN Group of Institutions - Shaping the future through quality education in Engineering, Medical Sciences, Arts & Science, Pharmacy, Management, and Allied Health.',
      openGraph: {
        title: 'JKKN Institution | Excellence in Education',
        description: 'Discover world-class education at JKKN Institution. Where tradition meets innovation.',
        type: 'website',
      },
    }
  }

  const page = await getPageBySlug(slugPath)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  const seo = page.cms_seo_metadata

  return {
    title: seo?.meta_title || page.title,
    description: seo?.meta_description || page.description || undefined,
    openGraph: {
      title: seo?.meta_title || page.title,
      description: seo?.meta_description || page.description || undefined,
      images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
      type: 'website',
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

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const slugPath = slug?.join('/') ?? ''

  // Don't handle admin routes - they should be handled by the (admin) route group
  if (slugPath.startsWith('admin')) {
    notFound()
  }

  // For homepage (empty slug), first try to get CMS content, otherwise show landing page
  if (!slugPath) {
    const page = await getPageBySlug('')

    // If no CMS homepage exists, show the beautiful landing page
    if (!page) {
      return (
        <Suspense fallback={<LandingPageSkeleton />}>
          <LandingPage />
        </Suspense>
      )
    }

    // If CMS homepage exists, render it
    const blocks = page.cms_page_blocks.map((block) => ({
      id: block.id,
      component_name: block.component_name,
      props: block.props,
      sort_order: block.sort_order,
      parent_block_id: block.parent_block_id,
      is_visible: block.is_visible ?? true,
    }))

    const fabConfig = page.cms_page_fab_config

    return (
      <article>
        <Suspense fallback={<BlocksSkeleton />}>
          <PageRenderer blocks={blocks} />
        </Suspense>
        {fabConfig && fabConfig.is_enabled && (
          <PageFab config={fabConfig} />
        )}
      </article>
    )
  }

  // Fetch the page for other routes
  const page = await getPageBySlug(slugPath)

  if (!page) {
    notFound()
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

  // Get FAB config for this page
  const fabConfig = page.cms_page_fab_config

  return (
    <article>
      <Suspense fallback={<BlocksSkeleton />}>
        <PageRenderer blocks={blocks} />
      </Suspense>

      {/* Page-specific FAB (overrides layout FAB if configured) */}
      {fabConfig && fabConfig.is_enabled && (
        <PageFab config={fabConfig} />
      )}
    </article>
  )
}
