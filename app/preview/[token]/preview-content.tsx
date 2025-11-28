'use client'

import { cn } from '@/lib/utils'
import { COMPONENT_REGISTRY } from '@/lib/cms/component-registry'
import { Eye, AlertTriangle } from 'lucide-react'

interface PageBlock {
  id: string
  component_name: string
  props: Record<string, unknown>
  sort_order: number
  is_visible: boolean
  custom_css?: string | null
  custom_classes?: string | null
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
  // Render a single block
  const renderBlock = (block: PageBlock) => {
    if (!block.is_visible) return null

    const componentDef = COMPONENT_REGISTRY[block.component_name]
    if (!componentDef) {
      // Component not found
      return (
        <div
          key={block.id}
          className="p-4 border border-amber-200 bg-amber-50 rounded-lg"
        >
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            <span>Component not found: {block.component_name}</span>
          </div>
        </div>
      )
    }

    const Component = componentDef.component

    // Check for AI enhancement background gradient
    const backgroundGradient = block.props._backgroundGradient as string | undefined

    return (
      <div
        key={block.id}
        className={cn('relative', block.custom_classes)}
      >
        {/* Background gradient overlay for AI enhancements */}
        {backgroundGradient && (
          <div className={cn('absolute inset-0 pointer-events-none rounded-inherit', backgroundGradient)} />
        )}
        {block.custom_css && (
          <style dangerouslySetInnerHTML={{ __html: `[data-block-id="${block.id}"] { ${block.custom_css} }` }} />
        )}
        <div data-block-id={block.id} className="relative">
          <Component {...block.props} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Preview Banner */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 py-2 px-4">
          <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium">
            <Eye className="h-4 w-4" />
            <span>Preview Mode - This page is not published yet</span>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className={cn(isPreview && 'pt-10')}>
        {blocks.length === 0 ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <h2 className="text-xl font-medium mb-2">{page.title}</h2>
              <p>This page has no content yet.</p>
            </div>
          </div>
        ) : (
          blocks.map((block) => renderBlock(block))
        )}
      </main>
    </div>
  )
}
