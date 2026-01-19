'use client'

import { Suspense } from 'react'
import { PageRenderer } from '@/components/cms-blocks/page-renderer'
import engineeringHomeTemplate from '@/lib/cms/templates/global/templates/engineering-home-template'

// Define the Skeleton component locally if not exported
function LandingPageSkeleton() {
  return <div className="min-h-screen bg-white animate-pulse" />
}

export function LandingPage() {
  // Use the blocks from our engineering template
  // We need to map them to the structure PageRenderer expects
  const blocks = engineeringHomeTemplate.default_blocks.map(block => ({
    id: block.id,
    component_name: block.component_name,
    props: block.props,
    sort_order: block.sort_order,
    parent_block_id: block.parent_block_id,
    is_visible: block.is_visible,
    custom_classes: block.custom_classes,
    custom_css: block.custom_css
  }))

  return (
    <div className="overflow-hidden">
      <Suspense fallback={<LandingPageSkeleton />}>
        {/* We use a self-contained registrar here for the default landing page */}
        {/* In a real app, you might want to fetch custom components, but for the default static view, we can render directly */}
        <PageRenderer blocks={blocks} />
      </Suspense>
    </div>
  )
}
