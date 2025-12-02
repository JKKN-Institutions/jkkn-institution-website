import { notFound } from 'next/navigation'
import { getTemplateById } from '@/app/actions/cms/templates'
import { TemplateBuilder } from '@/components/page-builder/template-builder'
import type { BlockData } from '@/lib/cms/registry-types'
import { v4 as uuidv4 } from 'uuid'

export const metadata = {
  title: 'Edit Template Blocks | JKKN Admin',
  description: 'Visual editor for template blocks',
}

interface EditTemplateBlocksPageProps {
  params: Promise<{ id: string }>
}

// Convert template blocks (stored format) to BlockData (runtime format)
function templateBlocksToBlockData(
  templateBlocks: Array<{
    component_name: string
    props: Record<string, unknown>
    sort_order?: number
    order_index?: number
    parent_block_id?: string | null
    is_visible?: boolean
    custom_classes?: string
  }>
): BlockData[] {
  // Create a map of old IDs to new IDs for parent references
  const idMap = new Map<string, string>()

  // First pass: assign new IDs
  const blocksWithIds = templateBlocks.map((block, index) => {
    const newId = uuidv4()
    // Use the original ID if available for mapping
    const originalId = (block as { id?: string }).id
    if (originalId) {
      idMap.set(originalId, newId)
    }
    return {
      ...block,
      id: newId,
      sort_order: block.sort_order ?? block.order_index ?? index,
    }
  })

  // Second pass: update parent references
  return blocksWithIds.map((block) => ({
    id: block.id,
    component_name: block.component_name,
    props: block.props || {},
    sort_order: block.sort_order,
    parent_block_id: block.parent_block_id
      ? (idMap.get(block.parent_block_id) || block.parent_block_id)
      : null,
    is_visible: block.is_visible ?? true,
    custom_classes: block.custom_classes,
  }))
}

export default async function EditTemplateBlocksPage({ params }: EditTemplateBlocksPageProps) {
  const { id } = await params
  const template = await getTemplateById(id)

  if (!template) {
    notFound()
  }

  // Convert stored template blocks to runtime BlockData format
  const initialBlocks = templateBlocksToBlockData(
    (template.default_blocks || []) as Array<{
      component_name: string
      props: Record<string, unknown>
      sort_order?: number
      order_index?: number
      parent_block_id?: string | null
      is_visible?: boolean
      custom_classes?: string
    }>
  )

  return (
    <TemplateBuilder
      templateId={template.id}
      templateName={template.name}
      templateSlug={template.slug}
      isSystem={template.is_system}
      initialBlocks={initialBlocks}
    />
  )
}
