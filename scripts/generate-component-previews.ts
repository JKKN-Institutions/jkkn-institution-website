/**
 * Auto-Generate Component Preview Screenshots
 *
 * This script uses Playwright to automatically capture screenshots
 * of CMS components for use in the page builder palette.
 *
 * Supports both built-in components and custom components from the database.
 *
 * Usage:
 *   1. Start the dev server: npm run dev
 *   2. Run this script: npx tsx scripts/generate-component-previews.ts [options]
 *
 * Options:
 *   --builtin    Generate previews for built-in components only
 *   --custom     Generate previews for custom components only
 *   --all        Generate previews for all components (default)
 *   --id=xxx     Generate preview for a specific custom component by ID
 *   --queue      Process pending preview jobs from the database queue
 *
 * The script will:
 *   1. Navigate to each component's preview page
 *   2. Wait for the component to render
 *   3. Capture a screenshot
 *   4. Save to public/cms-previews/ (or public/cms-previews/custom/ for custom)
 *   5. Update database for custom components
 */

import { chromium, type Browser, type Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../lib/supabase/database.types'

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const OUTPUT_DIR = './public/cms-previews'
const CUSTOM_OUTPUT_DIR = './public/cms-previews/custom'
const VIEWPORT = { width: 800, height: 600 }
const MAX_RETRIES = 3

// Supabase client for database operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// All built-in component names from the registry
const BUILTIN_COMPONENTS = [
  // Content blocks
  'HeroSection',
  'TextEditor',
  'Heading',
  'CallToAction',
  'Testimonials',
  'FAQAccordion',
  'TabsBlock',
  'Timeline',
  'PricingTables',
  // Media blocks
  'ImageBlock',
  'ImageGallery',
  'VideoPlayer',
  'ImageCarousel',
  'BeforeAfterSlider',
  'LogoCloud',
  // Layout blocks
  'Container',
  'GridLayout',
  'FlexboxLayout',
  'Spacer',
  'Divider',
  'SectionWrapper',
  // Data blocks
  'StatsCounter',
  'EventsList',
  'FacultyDirectory',
  'AnnouncementsFeed',
  'BlogPostsGrid',
]

interface CaptureResult {
  component: string
  componentId?: string
  success: boolean
  error?: string
  path?: string
  isCustom?: boolean
}

interface CustomComponent {
  id: string
  name: string
  display_name: string
  preview_status: string
}

interface PreviewJob {
  id: string
  component_id: string
  status: string
  attempts: number
  cms_custom_components: CustomComponent
}

async function ensureOutputDir(dir: string): Promise<void> {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`Created output directory: ${dir}`)
  }
}

async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout })
  } catch {
    // Network idle timeout is not critical, continue anyway
  }
}

async function captureBuiltinComponent(
  page: Page,
  componentName: string
): Promise<CaptureResult> {
  const url = `${BASE_URL}/admin/preview-capture?component=${componentName}`
  const outputPath = path.join(OUTPUT_DIR, `${componentName}.png`)

  try {
    console.log(`  Capturing ${componentName}...`)

    // Navigate to component preview page
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })

    // Wait for the preview container
    await page.waitForSelector('#preview-container', { timeout: 10000 })

    // Wait for images and network to settle
    await waitForNetworkIdle(page)

    // Additional wait for animations/transitions
    await page.waitForTimeout(500)

    // Get the preview container element
    const container = await page.$('#preview-container')

    if (!container) {
      throw new Error('Preview container not found')
    }

    // Capture screenshot of the container
    await container.screenshot({
      path: outputPath,
      type: 'png',
    })

    console.log(`    ✓ Saved: ${outputPath}`)

    return {
      component: componentName,
      success: true,
      path: outputPath,
      isCustom: false,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.log(`    ✗ Failed: ${errorMessage}`)

    return {
      component: componentName,
      success: false,
      error: errorMessage,
      isCustom: false,
    }
  }
}

async function captureCustomComponent(
  page: Page,
  component: CustomComponent,
  supabase: SupabaseClient<Database>
): Promise<CaptureResult> {
  const url = `${BASE_URL}/admin/preview-capture/custom?id=${component.id}`
  const fileName = component.name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
  const outputPath = path.join(CUSTOM_OUTPUT_DIR, `${fileName}.png`)
  const publicPath = `/cms-previews/custom/${fileName}.png`

  try {
    console.log(`  Capturing custom: ${component.display_name} (${component.name})...`)

    // Update status to generating
    await supabase
      .from('cms_custom_components')
      .update({ preview_status: 'generating' })
      .eq('id', component.id)

    // Navigate to custom component preview page
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })

    // Wait for preview status to be ready
    await page.waitForSelector('[data-preview-status="ready"]', { timeout: 15000 })

    // Wait for images and network to settle
    await waitForNetworkIdle(page)

    // Additional wait for animations/transitions
    await page.waitForTimeout(500)

    // Get the preview content element
    const container = await page.$('[data-preview-content="true"]')

    if (!container) {
      throw new Error('Preview content container not found')
    }

    // Capture screenshot of the container
    await container.screenshot({
      path: outputPath,
      type: 'png',
    })

    // Update database with success
    await supabase
      .from('cms_custom_components')
      .update({
        preview_status: 'completed',
        preview_image: publicPath,
        updated_at: new Date().toISOString(),
      })
      .eq('id', component.id)

    console.log(`    ✓ Saved: ${outputPath}`)

    return {
      component: component.name,
      componentId: component.id,
      success: true,
      path: outputPath,
      isCustom: true,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.log(`    ✗ Failed: ${errorMessage}`)

    // Update database with failure
    await supabase
      .from('cms_custom_components')
      .update({
        preview_status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', component.id)

    return {
      component: component.name,
      componentId: component.id,
      success: false,
      error: errorMessage,
      isCustom: true,
    }
  }
}

async function processPreviewQueue(
  page: Page,
  supabase: SupabaseClient<Database>
): Promise<CaptureResult[]> {
  console.log('\n📋 Processing preview job queue...\n')

  // Fetch pending jobs
  const { data: jobs, error } = await supabase
    .from('cms_preview_jobs')
    .select('*, cms_custom_components(*)')
    .eq('status', 'pending')
    .lt('attempts', MAX_RETRIES)
    .order('scheduled_at', { ascending: true })
    .limit(20)

  if (error) {
    console.error('Failed to fetch preview jobs:', error)
    return []
  }

  if (!jobs || jobs.length === 0) {
    console.log('No pending preview jobs found.')
    return []
  }

  console.log(`Found ${jobs.length} pending jobs\n`)

  const results: CaptureResult[] = []

  for (const job of jobs as PreviewJob[]) {
    const component = job.cms_custom_components
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

    // Capture the component
    const result = await captureCustomComponent(page, component, supabase)
    results.push(result)

    // Update job status based on result
    await supabase
      .from('cms_preview_jobs')
      .update({
        status: result.success ? 'completed' : (job.attempts + 1 >= MAX_RETRIES ? 'failed' : 'pending'),
        completed_at: result.success ? new Date().toISOString() : null,
        error_message: result.error || null,
      })
      .eq('id', job.id)
  }

  return results
}

async function generatePreviews(): Promise<void> {
  // Parse command line arguments
  const args = process.argv.slice(2)
  const generateBuiltin = args.includes('--builtin') || args.includes('--all') || !args.some(a => a.startsWith('--'))
  const generateCustom = args.includes('--custom') || args.includes('--all') || !args.some(a => a.startsWith('--'))
  const processQueue = args.includes('--queue')
  const specificId = args.find(a => a.startsWith('--id='))?.split('=')[1]

  console.log('🚀 Starting component preview generation...\n')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Output: ${OUTPUT_DIR}`)
  console.log(`Mode: ${processQueue ? 'Queue Processing' : (specificId ? `Single Component (${specificId})` : (generateBuiltin && generateCustom ? 'All' : (generateBuiltin ? 'Built-in Only' : 'Custom Only')))}`)
  console.log('')

  // Ensure output directories exist
  await ensureOutputDir(OUTPUT_DIR)
  await ensureOutputDir(CUSTOM_OUTPUT_DIR)

  // Initialize Supabase client for custom components
  let supabase: SupabaseClient<Database> | null = null
  if (generateCustom || processQueue || specificId) {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('\n❌ Error: Supabase credentials not configured!')
      console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.\n')
      process.exit(1)
    }
    supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)
  }

  // Launch browser
  console.log('Launching browser...')
  const browser: Browser = await chromium.launch({
    headless: true,
  })

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // For retina quality
  })

  const page = await context.newPage()

  // Check if dev server is running
  try {
    await page.goto(BASE_URL, { timeout: 5000 })
  } catch {
    console.error('\n❌ Error: Dev server is not running!')
    console.error('Please start the dev server first: npm run dev\n')
    await browser.close()
    process.exit(1)
  }

  const allResults: CaptureResult[] = []

  // Process queue mode
  if (processQueue && supabase) {
    const queueResults = await processPreviewQueue(page, supabase)
    allResults.push(...queueResults)
  }
  // Single component mode
  else if (specificId && supabase) {
    console.log('\n🎯 Generating preview for specific component...\n')

    const { data: component, error } = await supabase
      .from('cms_custom_components')
      .select('id, name, display_name, preview_status')
      .eq('id', specificId)
      .single()

    if (error || !component) {
      console.error(`Component not found: ${specificId}`)
      await browser.close()
      process.exit(1)
    }

    const result = await captureCustomComponent(page, component as CustomComponent, supabase)
    allResults.push(result)
  }
  // Normal mode
  else {
    // Capture built-in components
    if (generateBuiltin) {
      console.log(`\n📦 Capturing ${BUILTIN_COMPONENTS.length} built-in components:\n`)

      for (const component of BUILTIN_COMPONENTS) {
        const result = await captureBuiltinComponent(page, component)
        allResults.push(result)
      }
    }

    // Capture custom components
    if (generateCustom && supabase) {
      console.log('\n🧩 Fetching custom components from database...')

      const { data: customComponents, error } = await supabase
        .from('cms_custom_components')
        .select('id, name, display_name, preview_status')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch custom components:', error)
      } else if (customComponents && customComponents.length > 0) {
        console.log(`\n📦 Capturing ${customComponents.length} custom components:\n`)

        for (const component of customComponents as CustomComponent[]) {
          const result = await captureCustomComponent(page, component, supabase)
          allResults.push(result)
        }
      } else {
        console.log('No custom components found.')
      }
    }
  }

  // Close browser
  await browser.close()

  // Generate summary
  console.log('\n' + '='.repeat(50))
  console.log('SUMMARY')
  console.log('='.repeat(50))

  const successful = allResults.filter((r) => r.success)
  const failed = allResults.filter((r) => !r.success)
  const builtinResults = allResults.filter((r) => !r.isCustom)
  const customResults = allResults.filter((r) => r.isCustom)

  console.log(`\n✓ Successful: ${successful.length}/${allResults.length}`)

  if (builtinResults.length > 0) {
    const builtinSuccess = builtinResults.filter(r => r.success).length
    console.log(`  Built-in: ${builtinSuccess}/${builtinResults.length}`)
  }

  if (customResults.length > 0) {
    const customSuccess = customResults.filter(r => r.success).length
    console.log(`  Custom: ${customSuccess}/${customResults.length}`)
  }

  if (failed.length > 0) {
    console.log(`\n✗ Failed: ${failed.length}/${allResults.length}`)
    console.log('\nFailed components:')
    failed.forEach((r) => {
      console.log(`  - ${r.component}${r.isCustom ? ' (custom)' : ''}: ${r.error}`)
    })
  }

  // Generate manifest for built-in components
  if (generateBuiltin && builtinResults.length > 0) {
    const builtinSuccessful = builtinResults.filter(r => r.success)
    const manifest = {
      generatedAt: new Date().toISOString(),
      method: 'auto-screenshot',
      totalComponents: BUILTIN_COMPONENTS.length,
      successful: builtinSuccessful.length,
      failed: builtinResults.length - builtinSuccessful.length,
      previews: Object.fromEntries(
        builtinSuccessful.map((r) => [r.component, `/cms-previews/${r.component}.png`])
      ),
    }

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    )

    console.log(`\n📄 Built-in manifest saved: ${OUTPUT_DIR}/manifest.json`)
  }

  // Generate manifest for custom components
  if ((generateCustom || specificId || processQueue) && customResults.length > 0) {
    const customSuccessful = customResults.filter(r => r.success)
    const customManifest = {
      generatedAt: new Date().toISOString(),
      method: 'auto-screenshot',
      totalComponents: customResults.length,
      successful: customSuccessful.length,
      failed: customResults.length - customSuccessful.length,
      previews: Object.fromEntries(
        customSuccessful.map((r) => [
          r.component,
          {
            id: r.componentId,
            path: `/cms-previews/custom/${r.component.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}.png`,
          },
        ])
      ),
    }

    fs.writeFileSync(
      path.join(CUSTOM_OUTPUT_DIR, 'manifest.json'),
      JSON.stringify(customManifest, null, 2)
    )

    console.log(`📄 Custom manifest saved: ${CUSTOM_OUTPUT_DIR}/manifest.json`)
  }

  console.log('\n✨ Preview generation complete!\n')

  // Exit with error code if any failed
  if (failed.length > 0) {
    process.exit(1)
  }
}

// Run the script
generatePreviews().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
