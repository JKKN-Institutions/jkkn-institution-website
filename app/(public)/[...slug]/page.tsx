import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getPageBySlug } from '@/app/actions/cms/pages'
import { PageRenderer } from '@/components/cms-blocks/page-renderer'
import { Skeleton } from '@/components/ui/skeleton'

// Force dynamic rendering since we fetch from database
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const slugPath = slug.join('/')
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

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const slugPath = slug.join('/')

  // Don't handle admin routes - they should be handled by the (admin) route group
  if (slugPath.startsWith('admin')) {
    notFound()
  }

  // Fetch the page
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

  return (
    <article>
      <Suspense fallback={<BlocksSkeleton />}>
        <PageRenderer blocks={blocks} />
      </Suspense>
    </article>
  )
}
