'use client'

import { Suspense } from 'react'
import { getComponent, getComponentEntry, isFullWidthComponent } from '@/lib/cms/component-registry'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { applyBlockStyles, type BlockStyles } from '@/components/page-builder/utils/style-applicator'
import { AnimationWrapper } from '@/components/cms-blocks/animations/animation-wrapper'
import type { BlockAnimation } from '@/lib/cms/registry-types'
import { PageTypographyProvider } from '@/lib/cms/page-typography-context'
import type { PageTypographySettings } from '@/lib/cms/page-typography-types'
import { DEFAULT_FONT_FAMILY } from '@/lib/cms/page-typography-types'
import { DynamicFontLoader } from '@/components/cms-blocks/fonts/dynamic-font-loader'
import { BlockErrorBoundary } from '@/components/ui/block-error-boundary'
import { enhanceBlock, GLASS_PRESETS, type EnhancedBlock } from '@/lib/cms/design-enhancer'

/**
 * Auto-styling configuration for different block types
 * These apply professional glassmorphism styling automatically
 */
const AUTO_STYLE_CONFIG = {
  // Text content blocks get glass containers
  textBlocks: ['TextEditor', 'RichText', 'Paragraph', 'Quote', 'Blockquote'],
  // Image blocks get rounded corners and shadows
  imageBlocks: ['ImageBlock', 'Image'],
  // Profile/bio sections (image + heading + text pattern)
  profileBlocks: ['ProfileCard', 'TeamMember', 'AuthorCard'],
  // Heading blocks get proper spacing
  headingBlocks: ['Heading', 'SectionTitle', 'PageTitle'],
}

/**
 * Get auto-styling classes for a block based on its type
 */
function getAutoStyleClasses(componentName: string, isNested: boolean): string {
  // Text content blocks - clean styling without glass effects
  if (AUTO_STYLE_CONFIG.textBlocks.includes(componentName)) {
    return '' // No glass container - clean text on background
  }

  // Image blocks get professional styling (keep shadow and hover)
  if (AUTO_STYLE_CONFIG.imageBlocks.includes(componentName)) {
    return '' // Let ImageBlock handle its own styling
  }

  // Heading blocks - minimal spacing
  if (AUTO_STYLE_CONFIG.headingBlocks.includes(componentName)) {
    return '' // Let Heading component handle its own styling
  }

  return ''
}

interface BlockData {
  id: string
  component_name: string
  props: Record<string, unknown>
  sort_order: number
  parent_block_id: string | null
  is_visible: boolean
  custom_classes?: string
  custom_css?: string
  children?: BlockData[]
}

interface PageRendererProps {
  blocks: BlockData[]
  /** Page-level typography settings from cms_pages.metadata.typography */
  pageTypography?: PageTypographySettings
}

function BlockSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

function BlockError({ componentName }: { componentName: string }) {
  // Only show error in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg my-2">
      <p className="text-red-600 text-sm">
        Component "{componentName}" not found in registry
      </p>
    </div>
  )
}

/**
 * Build a tree structure from flat blocks array using parent_block_id
 */
function buildBlockTree(blocks: BlockData[]): BlockData[] {
  // Create a map for quick lookup
  const blockMap = new Map<string, BlockData>()
  blocks.forEach((block) => {
    blockMap.set(block.id, { ...block, children: [] })
  })

  const rootBlocks: BlockData[] = []

  // Build the tree
  blocks.forEach((block) => {
    const blockWithChildren = blockMap.get(block.id)!
    if (block.parent_block_id && blockMap.has(block.parent_block_id)) {
      // Add as child to parent
      const parent = blockMap.get(block.parent_block_id)!
      if (!parent.children) parent.children = []
      parent.children.push(blockWithChildren)
    } else {
      // Root level block
      rootBlocks.push(blockWithChildren)
    }
  })

  // Sort root blocks and all children by sort_order
  const sortBlocks = (blocks: BlockData[]): BlockData[] => {
    return blocks
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((block) => ({
        ...block,
        children: block.children ? sortBlocks(block.children) : [],
      }))
  }

  return sortBlocks(rootBlocks)
}

/**
 * Recursively render a block and its children
 */
function RenderBlock({ block, isNested = false }: { block: BlockData; isNested?: boolean }) {
  const Component = getComponent(block.component_name)
  const entry = getComponentEntry(block.component_name)

  if (!Component || !entry) {
    return <BlockError componentName={block.component_name} />
  }

  // Get auto-styling classes based on block type
  const autoStyleClasses = getAutoStyleClasses(block.component_name, isNested)

  // Get enhancement from design enhancer (convert snake_case to camelCase for PageBlock interface)
  const enhancement = enhanceBlock({
    id: block.id,
    componentName: block.component_name,
    props: block.props,
    sortOrder: block.sort_order,
    parentBlockId: block.parent_block_id,
    isVisible: block.is_visible,
    customClasses: block.custom_classes,
    customCss: block.custom_css,
  })

  // Check for AI enhancement background gradient
  const backgroundGradient = block.props._backgroundGradient as string | undefined || enhancement.backgroundGradient

  // Get block styles (margin, padding, etc.) from props
  const blockStyles = block.props._styles as BlockStyles | undefined
  const appliedStyles = applyBlockStyles(blockStyles)

  // Get animation settings from props only (don't auto-apply animations to avoid visibility issues)
  const animationSettings = block.props._animation as BlockAnimation | undefined

  // Check if this component is full-width (should not be wrapped in container)
  const isFullWidth = isFullWidthComponent(block.component_name)

  // Wrapper for custom classes, CSS, animations, and auto-styling
  const BlockWrapper = ({ children }: { children: React.ReactNode }) => {
    // Combine all classes: custom classes + enhancement wrapper + auto-styling
    const combinedClasses = cn(
      'relative',
      block.custom_classes,
      enhancement.wrapperClassName,
      autoStyleClasses
    )

    const content = (
      <div
        className={combinedClasses}
        style={appliedStyles}
      >
        {/* Background gradient overlay for AI enhancements */}
        {backgroundGradient && (
          <div className={cn('absolute inset-0 pointer-events-none rounded-inherit', backgroundGradient)} />
        )}
        {block.custom_css && (
          <style dangerouslySetInnerHTML={{ __html: `[data-block-id="${block.id}"] { ${block.custom_css} }` }} />
        )}
        <div data-block-id={block.id} className={cn('relative', enhancement.innerClassName)}>
          {children}
        </div>
      </div>
    )

    // If animation settings are present, wrap with AnimationWrapper
    if (animationSettings && (animationSettings.entrance !== 'none' || animationSettings.hoverEffect !== 'none')) {
      return (
        <AnimationWrapper animation={animationSettings}>
          {content}
        </AnimationWrapper>
      )
    }

    return content
  }

  // Responsive container for non-full-width blocks at root level
  const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => {
    // Check both registry property AND block props for full-width
    const propFullWidth = block.props.fullWidth === true

    // Only apply container to root-level, non-full-width blocks
    if (isNested || isFullWidth || propFullWidth) {
      return <>{children}</>
    }
    return (
      <div className="page-content-container">
        {children}
      </div>
    )
  }

  // If component supports children and has children, render them nested
  if (entry.supportsChildren && block.children && block.children.length > 0) {
    return (
      <ResponsiveContainer>
        <BlockWrapper>
          <BlockErrorBoundary componentName={block.component_name}>
            <Suspense fallback={<BlockSkeleton />}>
              <Component {...block.props} id={typeof block.props?.id === 'string' ? block.props.id : block.id}>
                {block.children
                  .filter((child) => child.is_visible)
                  .map((child) => (
                    <RenderBlock key={child.id} block={child} isNested={true} />
                  ))}
              </Component>
            </Suspense>
          </BlockErrorBoundary>
        </BlockWrapper>
      </ResponsiveContainer>
    )
  }

  // Regular block without children
  return (
    <ResponsiveContainer>
      <BlockWrapper>
        <BlockErrorBoundary componentName={block.component_name}>
          <Suspense fallback={<BlockSkeleton />}>
            <Component {...block.props} id={typeof block.props?.id === 'string' ? block.props.id : block.id} />
          </Suspense>
        </BlockErrorBoundary>
      </BlockWrapper>
    </ResponsiveContainer>
  )
}

export function PageRenderer({ blocks, pageTypography }: PageRendererProps) {
  // Filter to only visible blocks
  const visibleBlocks = blocks.filter((block) => block.is_visible)

  // Get font family with fallback to default
  const fontFamily = pageTypography?.fontFamily || DEFAULT_FONT_FAMILY

  if (visibleBlocks.length === 0) {
    return (
      <DynamicFontLoader fontFamily={fontFamily}>
        <PageTypographyProvider typography={pageTypography}>
          <div className="min-h-[50vh] flex items-center justify-center">
            <p className="text-muted-foreground">This page has no content yet.</p>
          </div>
        </PageTypographyProvider>
      </DynamicFontLoader>
    )
  }

  // Build tree structure from flat blocks
  const blockTree = buildBlockTree(visibleBlocks)

  return (
    <DynamicFontLoader fontFamily={fontFamily}>
      <PageTypographyProvider typography={pageTypography}>
        <div className="page-content">
          {blockTree.map((block) => (
            <RenderBlock key={block.id} block={block} />
          ))}
        </div>
      </PageTypographyProvider>
    </DynamicFontLoader>
  )
}
