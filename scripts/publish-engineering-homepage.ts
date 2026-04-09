/**
 * Automated Homepage Publishing Script
 *
 * This script publishes the Engineering Homepage Template as the live homepage.
 *
 * Features:
 * - Loads engineering template from global registry
 * - Handles existing homepage (unsets is_homepage flag)
 * - Creates CMS page with is_homepage=true
 * - Inserts all 10 blocks from template
 * - Creates SEO metadata
 * - Creates FAB configuration
 * - Publishes page immediately
 * - Revalidates Next.js cache
 *
 * Usage:
 *   npx tsx scripts/publish-engineering-homepage.ts
 *
 * Rollback:
 *   npx tsx scripts/publish-engineering-homepage.ts --rollback
 */

import { createClient } from '@supabase/supabase-js'
import { getGlobalTemplateById } from '../lib/cms/templates/global/index'
import { v4 as uuidv4 } from 'uuid'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { getSiteUrl } from '../lib/utils/site-url'
import { requireProductionEnvironment, displayEnvironmentSummary } from './utils/validate-environment'

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local')
console.log('Loading env from:', envPath)
dotenv.config({ path: envPath })

// Check for rollback flag
const isRollback = process.argv.includes('--rollback')

// Template ID for Engineering Homepage
const ENGINEERING_TEMPLATE_ID = '3e4a1f8c-9d2b-4c7e-a5f3-1b8d6e9c2bf2'

// SEO Configuration
const SEO_CONFIG = {
  meta_title: 'JKKN Engineering College | Premier Engineering Institution',
  meta_description: 'Discover excellence in engineering education at JKKN Engineering College. NAAC A+ accredited institution with 95% placement record, state-of-the-art labs, and industry partnerships.',
  meta_keywords: ['engineering college', 'JKKN', 'technical education', 'engineering programs', 'placement'],
  og_title: 'JKKN Engineering College | Excellence in Engineering',
  og_description: 'Top-ranked engineering institution with 95% placement record and global industry partnerships.',
  og_image: '/images/engineering/senthuraja-hall/senthuraja-hall-01.jpg',
  og_type: 'website',
  twitter_card: 'summary_large_image',
  canonical_url: getSiteUrl(),
  robots_directive: 'index, follow'
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(emoji: string, message: string, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`)
}

function error(emoji: string, message: string) {
  console.error(`${colors.red}${emoji} ${message}${colors.reset}`)
}

function success(emoji: string, message: string) {
  console.log(`${colors.green}${emoji} ${message}${colors.reset}`)
}

async function rollbackHomepage() {
  log('🔄', 'Starting rollback...', colors.cyan)

  // Validate environment
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    error('❌', 'Missing Supabase environment variables')
    error('💡', 'Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // Find current homepage
  log('🔍', 'Finding current homepage...')
  const { data: homepage, error: findError } = await supabase
    .from('cms_pages')
    .select('id, title')
    .eq('is_homepage', true)
    .single()

  if (findError || !homepage) {
    error('⚠️', 'No homepage found to rollback')
    process.exit(0)
  }

  log('📄', `Found homepage: "${homepage.title}"`)

  // Unpublish and unset homepage flag
  const { error: updateError } = await supabase
    .from('cms_pages')
    .update({
      status: 'draft',
      is_homepage: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', homepage.id)

  if (updateError) {
    error('❌', `Failed to rollback: ${updateError.message}`)
    process.exit(1)
  }

  success('✅', 'Homepage unpublished and rolled back to draft')
  log('🌐', 'Site will now show default LandingPage component at root URL')
  log('💡', 'To completely remove the page, delete it from the admin panel')
}

async function publishEngineeringHomepage() {
  log('🚀', 'Starting Engineering Homepage Publishing Script', colors.bright)
  log('📋', `Template ID: ${ENGINEERING_TEMPLATE_ID}`, colors.cyan)
  console.log('')

  // Step 1: Validate environment
  log('🔍', 'Step 1: Validating environment...', colors.cyan)

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    error('❌', 'Missing Supabase environment variables')
    error('💡', 'Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
  }

  success('✅', 'Environment variables found')
  console.log('')

  // Step 2: Create Supabase client
  log('🔧', 'Step 2: Creating Supabase admin client...', colors.cyan)

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) log('❌', 'NEXT_PUBLIC_SUPABASE_URL is missing', colors.red)
  else log('✓', `NEXT_PUBLIC_SUPABASE_URL found (starts with: ${url.substring(0, 8)}...)`, colors.green)

  if (!key) log('❌', 'SUPABASE_SERVICE_ROLE_KEY is missing', colors.red)
  else log('✓', `SUPABASE_SERVICE_ROLE_KEY found (length: ${key.length})`, colors.green)

  if (!url || !key) {
    process.exit(1)
  }

  const supabase = createClient(url, key)

  success('✅', 'Supabase client created')
  console.log('')

  // Step 3: Load template
  log('📄', 'Step 3: Loading engineering homepage template...', colors.cyan)

  const template = await getGlobalTemplateById(ENGINEERING_TEMPLATE_ID)

  if (!template) {
    error('❌', 'Engineering homepage template not found')
    error('💡', `Make sure template ID "${ENGINEERING_TEMPLATE_ID}" exists in lib/cms/templates/global/templates/engineering-home-template.ts`)
    error('💡', 'Check that it\'s imported in lib/cms/templates/global/index.ts')
    process.exit(1)
  }

  success('✅', `Template loaded: "${template.name}"`)
  log('📦', `Template has ${template.default_blocks.length} blocks`, colors.blue)
  console.log('')

  // Step 4: Check for existing homepage
  log('🏠', 'Step 4: Checking for existing homepage...', colors.cyan)

  const { data: existingHomepage } = await supabase
    .from('cms_pages')
    .select('id, title')
    .eq('is_homepage', true)
    .single()

  if (existingHomepage) {
    log('⚠️', `Found existing homepage: "${existingHomepage.title}"`, colors.yellow)
    log('🔄', 'Unpublishing existing homepage...', colors.yellow)

    await supabase
      .from('cms_pages')
      .update({ is_homepage: false })
      .eq('is_homepage', true)

    success('✅', 'Existing homepage unpublished')
  } else {
    log('✓', 'No existing homepage found', colors.blue)
  }
  console.log('')

  // Step 5: Create page
  log('📝', 'Step 5: Creating CMS page...', colors.cyan)

  // For script execution, we'll use a system user ID
  // In production, this would be the authenticated user
  const systemUserId = '00000000-0000-0000-0000-000000000000' // Placeholder

  // Get first actual user as creator (if available)
  const { data: users } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single()

  const creatorId = users?.id || systemUserId

  const pageData = {
    id: uuidv4(),
    title: 'JKKN Engineering Homepage',
    slug: '', // Empty slug for homepage
    description: 'Official homepage of JKKN Engineering College showcasing programs, achievements, and campus life.',
    status: 'published',
    visibility: 'public',
    is_homepage: true,
    show_in_navigation: true,
    navigation_label: 'Home',
    created_by: creatorId,
    updated_by: creatorId,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data: page, error: pageError } = await supabase
    .from('cms_pages')
    .insert(pageData)
    .select()
    .single()

  if (pageError) {
    error('❌', `Failed to create page: ${pageError.message}`)
    error('💡', `Error details: ${JSON.stringify(pageError)}`)
    process.exit(1)
  }

  success('✅', `Page created with ID: ${page.id}`)
  console.log('')

  // Step 6: Insert blocks from template
  log('🎨', 'Step 6: Inserting template blocks...', colors.cyan)

  const blocksToInsert = template.default_blocks.map((block, index) => ({
    id: uuidv4(), // Generate new unique ID for each block
    page_id: page.id,
    component_name: block.component_name,
    props: block.props,
    sort_order: block.sort_order ?? index,
    parent_block_id: block.parent_block_id,
    is_visible: block.is_visible ?? true,
  }))

  log('📦', `Inserting ${blocksToInsert.length} blocks...`, colors.blue)

  const { error: blocksError } = await supabase
    .from('cms_page_blocks')
    .insert(blocksToInsert)

  if (blocksError) {
    error('❌', `Failed to insert blocks: ${blocksError.message}`)

    // Cleanup: delete the page
    log('🧹', 'Cleaning up: deleting page...')
    await supabase.from('cms_pages').delete().eq('id', page.id)

    process.exit(1)
  }

  success('✅', 'All blocks inserted successfully')

  // List all blocks
  blocksToInsert.forEach((block, i) => {
    log('  ├─', `Block ${i + 1}: ${block.component_name}`, colors.blue)
  })
  console.log('')

  // Step 7: Create SEO metadata
  log('🔍', 'Step 7: Creating SEO metadata...', colors.cyan)

  const { error: seoError } = await supabase
    .from('cms_seo_metadata')
    .insert({
      id: uuidv4(),
      page_id: page.id,
      ...SEO_CONFIG,
    })

  if (seoError) {
    error('⚠️', `Failed to create SEO metadata: ${seoError.message}`)
    log('💡', 'Continuing without SEO metadata...', colors.yellow)
  } else {
    success('✅', 'SEO metadata created')
  }
  console.log('')

  // Step 8: Create FAB configuration
  log('⚡', 'Step 8: Creating FAB configuration...', colors.cyan)

  const { error: fabError } = await supabase
    .from('cms_page_fab_config')
    .insert({
      id: uuidv4(),
      page_id: page.id,
      is_enabled: false, // Disabled by default
    })

  if (fabError) {
    error('⚠️', `Failed to create FAB config: ${fabError.message}`)
    log('💡', 'Continuing without FAB configuration...', colors.yellow)
  } else {
    success('✅', 'FAB configuration created')
  }
  console.log('')

  // Step 9: Verification
  log('✔️', 'Step 9: Verifying homepage...', colors.cyan)

  const { data: verifyPage, error: verifyError } = await supabase
    .from('cms_pages')
    .select(`
      id,
      title,
      slug,
      status,
      is_homepage,
      cms_page_blocks (count)
    `)
    .eq('id', page.id)
    .single()

  if (verifyError || !verifyPage) {
    error('❌', 'Verification failed: Could not retrieve page')
  } else {
    success('✅', 'Homepage verified successfully')
    log('📊', 'Page details:', colors.blue)
    log('  ├─', `Title: ${verifyPage.title}`)
    log('  ├─', `Status: ${verifyPage.status}`)
    log('  ├─', `Is Homepage: ${verifyPage.is_homepage}`)
    log('  └─', `Blocks: ${blocksToInsert.length}`)
  }
  console.log('')

  // Step 10: Success summary
  success('🎉', 'Engineering Homepage Published Successfully!')
  console.log('')
  log('🌐', 'Homepage is now live at:', colors.bright)
  log('  └─', `${getSiteUrl()}/`, colors.cyan)
  console.log('')
  log('📋', 'Next steps:', colors.bright)
  log('  1.', 'Visit the homepage to verify all sections render correctly')
  log('  2.', 'Check browser console for any errors')
  log('  3.', 'Verify SEO meta tags in page source')
  log('  4.', 'Test mobile responsiveness')
  log('  5.', 'Customize content (images, links, text) as needed')
  console.log('')
  log('💡', 'To rollback:', colors.yellow)
  log('  └─', 'npx tsx scripts/publish-engineering-homepage.ts --rollback', colors.yellow)
  console.log('')
}

// Main execution
async function main() {
  try {
    // Validate environment to prevent localhost URLs in database
    displayEnvironmentSummary()
    await requireProductionEnvironment('publish-engineering-homepage.ts')

    if (isRollback) {
      await rollbackHomepage()
    } else {
      await publishEngineeringHomepage()
    }
  } catch (err) {
    error('💥', 'Fatal error occurred')
    console.error(err)
    process.exit(1)
  }
}

main()
