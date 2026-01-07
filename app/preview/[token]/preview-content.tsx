'use client'

import { cn } from '@/lib/utils'
import { Eye } from 'lucide-react'
import { PageRenderer } from '@/components/cms-blocks/page-renderer'
import type { PageTypographySettings } from '@/lib/cms/page-typography-types'

interface PageBlock {
  id: string
  component_name: string
  props: Record<string, unknown>
  sort_order: number
  is_visible: boolean
  custom_css?: string | null
  custom_classes?: string | null
  parent_block_id?: string | null  // Added for tree building support
}

interface PreviewContentProps {
  page: {
    id: string
    title: string
    slug: string
    description: string | null
    status: string
    featured_image: string | null
    metadata: Record<string, unknown> | null
  }
  blocks: PageBlock[]
  seo: Record<string, unknown> | null
  fab: Record<string, unknown> | null
  isPreview: boolean
}

export function PreviewContent({ page, blocks, isPreview }: PreviewContentProps) {
  // Extract page typography from metadata (same as published pages)
  const pageTypography = page.metadata?.typography as PageTypographySettings | undefined

  return (
    <div className="min-h-screen">
      {/* Preview Banner - ONLY difference from published */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 py-2 px-4">
          <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium">
            <Eye className="h-4 w-4" />
            <span>Preview Mode - This page is not published yet</span>
          </div>
        </div>
      )}

      {/* Page Content - Use PageRenderer for IDENTICAL rendering */}
      <main className={cn(isPreview && 'pt-10')}>
        {blocks.length === 0 ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <h2 className="text-xl font-medium mb-2">{page.title}</h2>
              <p>This page has no content yet.</p>
            </div>
          </div>
        ) : (
          <PageRenderer
            blocks={blocks as any}
            pageTypography={pageTypography}
          />
        )}
      </main>
    </div>
  )
}
