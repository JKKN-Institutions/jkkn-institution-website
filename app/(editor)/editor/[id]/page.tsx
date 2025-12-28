import { redirect, notFound } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getPageById, getPageSeo, getPageFab } from '@/app/actions/cms/pages'
import { getFooterSettings } from '@/app/actions/cms/footer'
import { PageBuilder } from '@/components/page-builder'
import type { PageTypographySettings } from '@/lib/cms/page-typography-types'

interface EditorPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: EditorPageProps) {
  const { id } = await params
  const page = await getPageById(id)

  return {
    title: page ? `Editing: ${page.title} | JKKN CMS` : 'Page Editor | JKKN CMS',
  }
}

async function checkAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/editor')
  }

  // Check if user has permission to edit pages
  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    redirect('/admin/unauthorized')
  }

  return user
}

export default async function StandaloneEditorPage({ params }: EditorPageProps) {
  await checkAccess()

  const { id } = await params
  const [page, seoData, fabData, footerSettings] = await Promise.all([
    getPageById(id),
    getPageSeo(id),
    getPageFab(id),
    getFooterSettings(),
  ])

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

  // Transform SEO data
  const initialSeoData = seoData
    ? {
        id: seoData.id,
        meta_title: seoData.meta_title,
        meta_description: seoData.meta_description,
        meta_keywords: seoData.meta_keywords as string[] | null,
        canonical_url: seoData.canonical_url,
        og_title: seoData.og_title,
        og_description: seoData.og_description,
        og_image: seoData.og_image,
        twitter_title: seoData.twitter_title,
        twitter_description: seoData.twitter_description,
        twitter_image: seoData.twitter_image,
        structured_data: seoData.structured_data as Record<string, unknown>[] | null,
      }
    : null

  // Transform FAB data
  const initialFabConfig = fabData
    ? {
        id: fabData.id,
        is_enabled: fabData.is_enabled ?? false,
        position: (fabData.position as 'bottom-right' | 'bottom-left' | 'bottom-center') ?? 'bottom-right',
        theme: (fabData.theme as 'auto' | 'light' | 'dark' | 'brand') ?? 'auto',
        primary_action: (fabData.primary_action as 'contact' | 'whatsapp' | 'phone' | 'email' | 'custom') ?? 'contact',
        custom_action_label: fabData.custom_action_label,
        custom_action_url: fabData.custom_action_url,
        custom_action_icon: fabData.custom_action_icon,
        show_whatsapp: fabData.show_whatsapp ?? true,
        show_phone: fabData.show_phone ?? true,
        show_email: fabData.show_email ?? true,
        show_directions: fabData.show_directions ?? false,
        whatsapp_number: fabData.whatsapp_number,
        phone_number: fabData.phone_number,
        email_address: fabData.email_address,
        directions_url: fabData.directions_url,
        animation: (fabData.animation as 'none' | 'bounce' | 'pulse' | 'shake') ?? 'bounce',
        delay_ms: fabData.delay_ms ?? 0,
        hide_on_scroll: fabData.hide_on_scroll ?? false,
        custom_css: fabData.custom_css,
      }
    : null

  // Extract typography from page metadata
  const initialTypography = (page.metadata as Record<string, unknown> | null)?.typography as Partial<PageTypographySettings> | undefined

  return (
    <PageBuilder
      pageId={page.id}
      pageTitle={page.title}
      pageSlug={page.slug}
      pageStatus={page.status}
      initialBlocks={blocks}
      initialSeoData={initialSeoData}
      initialFabConfig={initialFabConfig}
      initialFooterSettings={footerSettings}
      initialTypography={initialTypography}
    />
  )
}
