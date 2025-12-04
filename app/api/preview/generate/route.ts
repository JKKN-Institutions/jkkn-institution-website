/**
 * API Route: Generate Component Preview
 *
 * This endpoint processes preview generation jobs for custom components.
 * It can be called manually or via a cron job to process the queue.
 *
 * POST /api/preview/generate
 * - componentId: string (optional) - Generate preview for specific component
 * - processQueue: boolean (optional) - Process all pending preview jobs
 *
 * GET /api/preview/generate?componentId=xxx
 * - Check status of a specific component's preview
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Configuration
const PREVIEW_BASE_PATH = '/cms-previews/custom'
const MAX_RETRIES = 3

interface PreviewJob {
  id: string
  component_id: string
  status: string
  attempts: number
  error_message: string | null
}

interface CustomComponent {
  id: string
  name: string
  display_name: string
  code: string
  default_props: Record<string, unknown>
  preview_status: string
}

/**
 * GET - Check preview status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const componentId = searchParams.get('componentId')

  if (!componentId) {
    return NextResponse.json({ error: 'componentId is required' }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()

  const { data: component, error } = await supabase
    .from('cms_custom_components')
    .select('id, name, preview_status, preview_image')
    .eq('id', componentId)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Component not found' }, { status: 404 })
  }

  // Get latest job status
  const { data: job } = await supabase
    .from('cms_preview_jobs')
    .select('*')
    .eq('component_id', componentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({
    component: {
      id: component.id,
      name: component.name,
      preview_status: component.preview_status,
      preview_image: component.preview_image,
    },
    job: job || null,
  })
}

/**
 * POST - Trigger preview generation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { componentId, processQueue } = body

    const supabase = await createServerSupabaseClient()

    // Process queue mode
    if (processQueue) {
      return await processPreviewQueue(supabase)
    }

    // Single component mode
    if (componentId) {
      return await generateSinglePreview(supabase, componentId)
    }

    return NextResponse.json(
      { error: 'Either componentId or processQueue is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Preview generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Process the preview job queue
 */
async function processPreviewQueue(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>) {
  // Get pending jobs
  const { data: jobs, error } = await supabase
    .from('cms_preview_jobs')
    .select('*, cms_custom_components(*)')
    .eq('status', 'pending')
    .lt('attempts', MAX_RETRIES)
    .order('scheduled_at', { ascending: true })
    .limit(10)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }

  if (!jobs || jobs.length === 0) {
    return NextResponse.json({ message: 'No pending jobs', processed: 0 })
  }

  const results: Array<{ componentId: string; success: boolean; error?: string }> = []

  for (const job of jobs) {
    const component = job.cms_custom_components as unknown as CustomComponent
    if (!component) continue

    // Update job status to processing
    await supabase
      .from('cms_preview_jobs')
      .update({
        status: 'processing',
        started_at: new Date().toISOString(),
        attempts: job.attempts + 1,
      })
      .eq('id', job.id)

    // Update component status
    await supabase
      .from('cms_custom_components')
      .update({ preview_status: 'generating' })
      .eq('id', component.id)

    try {
      // Generate preview (placeholder - actual implementation depends on Playwright setup)
      const previewPath = await generatePreviewImage(component)

      // Update success
      await supabase
        .from('cms_preview_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', job.id)

      await supabase
        .from('cms_custom_components')
        .update({
          preview_status: 'completed',
          preview_image: previewPath,
          updated_at: new Date().toISOString(),
        })
        .eq('id', component.id)

      results.push({ componentId: component.id, success: true })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'

      // Update failure
      await supabase
        .from('cms_preview_jobs')
        .update({
          status: job.attempts + 1 >= MAX_RETRIES ? 'failed' : 'pending',
          error_message: errorMessage,
        })
        .eq('id', job.id)

      await supabase
        .from('cms_custom_components')
        .update({
          preview_status: job.attempts + 1 >= MAX_RETRIES ? 'failed' : 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', component.id)

      results.push({ componentId: component.id, success: false, error: errorMessage })
    }
  }

  return NextResponse.json({
    message: 'Queue processed',
    processed: results.length,
    results,
  })
}

/**
 * Generate preview for a single component
 */
async function generateSinglePreview(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  componentId: string
) {
  // Get component
  const { data: component, error } = await supabase
    .from('cms_custom_components')
    .select('*')
    .eq('id', componentId)
    .single()

  if (error || !component) {
    return NextResponse.json({ error: 'Component not found' }, { status: 404 })
  }

  // Update status
  await supabase
    .from('cms_custom_components')
    .update({ preview_status: 'generating' })
    .eq('id', componentId)

  try {
    // Generate preview
    const previewPath = await generatePreviewImage(component as CustomComponent)

    // Update success
    await supabase
      .from('cms_custom_components')
      .update({
        preview_status: 'completed',
        preview_image: previewPath,
        updated_at: new Date().toISOString(),
      })
      .eq('id', componentId)

    return NextResponse.json({
      success: true,
      preview_image: previewPath,
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'

    await supabase
      .from('cms_custom_components')
      .update({
        preview_status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', componentId)

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * Generate preview image for a component
 *
 * This is a placeholder implementation. In production, you would:
 * 1. Start Playwright
 * 2. Navigate to a preview page that renders the component
 * 3. Capture a screenshot
 * 4. Save to public folder or upload to storage
 *
 * For now, we generate a placeholder path based on the component name.
 */
async function generatePreviewImage(component: CustomComponent): Promise<string> {
  // Convert component name to kebab-case for filename
  const fileName = component.name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()

  // In a real implementation, this would:
  // 1. Use Playwright to screenshot the component
  // 2. Save to file system or cloud storage
  // 3. Return the public URL

  // For now, return a placeholder path
  // The actual screenshot capture would be done by a separate process
  const previewPath = `${PREVIEW_BASE_PATH}/${fileName}.png`

  // Note: In production, you would use Playwright here:
  // const browser = await chromium.launch()
  // const page = await browser.newPage()
  // await page.goto(`${BASE_URL}/admin/preview-capture/custom?id=${component.id}`)
  // await page.screenshot({ path: `./public${previewPath}` })
  // await browser.close()

  return previewPath
}
