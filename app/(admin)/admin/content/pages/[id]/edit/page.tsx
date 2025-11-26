import { redirect, notFound } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getPageById } from '@/app/actions/cms/pages'
import { PageBuilder } from '@/components/page-builder'

interface EditPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: EditPageProps) {
  const { id } = await params
  const page = await getPageById(id)

  return {
    title: page ? `Edit: ${page.title} | JKKN Admin` : 'Edit Page | JKKN Admin',
  }
}

async function checkAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    redirect('/admin/unauthorized')
  }

  return user
}

export default async function EditPagePage({ params }: EditPageProps) {
  await checkAccess()

  const { id } = await params
  const page = await getPageById(id)

  if (!page) {
    notFound()
  }

  // Transform blocks to match BlockData interface
  const blocks = (page.cms_page_blocks || []).map((block) => ({
    id: block.id,
    component_name: block.component_name,
    props: block.props as Record<string, unknown>,
    sort_order: block.sort_order,
    parent_block_id: block.parent_block_id,
    is_visible: block.is_visible ?? true,
    responsive_settings: (block.responsive_settings as Record<string, unknown>) || undefined,
    custom_css: block.custom_css || undefined,
    custom_classes: block.custom_classes || undefined,
  }))

  return (
    <PageBuilder
      pageId={page.id}
      pageTitle={page.title}
      pageSlug={page.slug}
      pageStatus={page.status}
      initialBlocks={blocks}
    />
  )
}
