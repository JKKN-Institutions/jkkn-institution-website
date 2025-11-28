/**
 * Auto-Generate Component Preview Screenshots
 *
 * This script uses Playwright to automatically capture screenshots
 * of each CMS component for use in the page builder palette.
 *
 * Usage:
 *   1. Start the dev server: npm run dev
 *   2. Run this script: npx tsx scripts/generate-component-previews.ts
 *
 * The script will:
 *   1. Navigate to each component's preview page
 *   2. Wait for the component to render
 *   3. Capture a screenshot
 *   4. Save to public/cms-previews/
 */

import { chromium, type Browser, type Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const OUTPUT_DIR = './public/cms-previews'
const VIEWPORT = { width: 800, height: 600 }
const SCREENSHOT_SIZE = { width: 400, height: 300 } // Final image size

// All component names from the registry
const COMPONENTS = [
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
  success: boolean
  error?: string
  path?: string
}

async function ensureOutputDir(): Promise<void> {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    console.log(`Created output directory: ${OUTPUT_DIR}`)
  }
}

async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout })
  } catch {
    // Network idle timeout is not critical, continue anyway
  }
}

async function captureComponent(
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
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.log(`    ✗ Failed: ${errorMessage}`)

    return {
      component: componentName,
      success: false,
      error: errorMessage,
    }
  }
}

async function generatePreviews(): Promise<void> {
  console.log('🚀 Starting component preview generation...\n')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Output: ${OUTPUT_DIR}`)
  console.log(`Components: ${COMPONENTS.length}\n`)

  // Ensure output directory exists
  await ensureOutputDir()

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

  console.log('\nCapturing components:\n')

  // Capture each component
  const results: CaptureResult[] = []

  for (const component of COMPONENTS) {
    const result = await captureComponent(page, component)
    results.push(result)
  }

  // Close browser
  await browser.close()

  // Generate summary
  console.log('\n' + '='.repeat(50))
  console.log('SUMMARY')
  console.log('='.repeat(50))

  const successful = results.filter((r) => r.success)
  const failed = results.filter((r) => !r.success)

  console.log(`\n✓ Successful: ${successful.length}/${COMPONENTS.length}`)

  if (failed.length > 0) {
    console.log(`✗ Failed: ${failed.length}/${COMPONENTS.length}`)
    console.log('\nFailed components:')
    failed.forEach((r) => {
      console.log(`  - ${r.component}: ${r.error}`)
    })
  }

  // Generate manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    method: 'auto-screenshot',
    totalComponents: COMPONENTS.length,
    successful: successful.length,
    failed: failed.length,
    previews: Object.fromEntries(
      successful.map((r) => [r.component, `/cms-previews/${r.component}.png`])
    ),
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )

  console.log(`\n📄 Manifest saved: ${OUTPUT_DIR}/manifest.json`)
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
