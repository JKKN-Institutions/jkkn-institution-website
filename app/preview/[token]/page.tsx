import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getPreviewLinkByToken, recordPreviewView, verifyPreviewPassword } from '@/app/actions/cms/preview'
import { PreviewContent } from './preview-content'
import { PreviewPasswordForm } from './preview-password-form'

export const metadata = {
  title: 'Preview | JKKN',
  robots: 'noindex, nofollow', // Prevent indexing of preview pages
}

interface PreviewPageProps {
  params: Promise<{
    token: string
  }>
  searchParams: Promise<{
    password?: string
  }>
}

async function getPageData(pageId: string) {
  const supabase = await createServerSupabaseClient()

  // Get page with blocks
  const { data: page, error } = await supabase
    .from('cms_pages')
    .select(`
      id,
      title,
      slug,
      description,
      status,
      featured_image,
      metadata
    `)
    .eq('id', pageId)
    .single()

  if (error || !page) {
    return null
  }

  // Get blocks
  const { data: blocks } = await supabase
    .from('cms_page_blocks')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true })

  // Get SEO metadata
  const { data: seo } = await supabase
    .from('cms_seo_metadata')
    .select('*')
    .eq('page_id', pageId)
    .single()

  // Get FAB config
  const { data: fab } = await supabase
    .from('cms_page_fab_config')
    .select('*')
    .eq('page_id', pageId)
    .single()

  return {
    page,
    blocks: blocks || [],
    seo,
    fab,
  }
}

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { token } = await params
  const { password } = await searchParams

  // Get preview link
  const { link, error, requiresPassword } = await getPreviewLinkByToken(token)

  // Handle errors
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Preview Unavailable</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!link) {
    notFound()
  }

  // Handle password protection
  if (requiresPassword) {
    // Check if password was provided
    if (password) {
      const { valid, error: passwordError } = await verifyPreviewPassword(token, password)
      if (!valid) {
        return <PreviewPasswordForm token={token} error={passwordError || 'Incorrect password'} />
      }
    } else {
      return <PreviewPasswordForm token={token} />
    }
  }

  // Get page data
  const pageId = (link.page as unknown as { id: string })?.id
  if (!pageId) {
    notFound()
  }

  const pageData = await getPageData(pageId)
  if (!pageData) {
    notFound()
  }

  // Record view (fire and forget)
  recordPreviewView(token)

  return (
    <PreviewContent
      page={pageData.page}
      blocks={pageData.blocks}
      seo={pageData.seo}
      fab={pageData.fab}
      isPreview={true}
    />
  )
}
