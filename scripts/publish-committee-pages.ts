/**
 * Automated Committee Pages Publishing Script
 *
 * This script creates 9 committee submenu pages for the Engineering College CMS.
 *
 * Features:
 * - Creates 9 committee pages with placeholder content
 * - Inserts content blocks with PlaceholderContent component
 * - Creates SEO metadata for each page
 * - Publishes all pages immediately
 * - Provides rollback capability
 *
 * Usage:
 *   npx tsx scripts/publish-committee-pages.ts
 *
 * Rollback:
 *   npx tsx scripts/publish-committee-pages.ts --rollback
 *
 * Requirements:
 * - Engineering College Supabase credentials in .env.local
 * - Run: npm run dev:engineering first
 */

import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Check for rollback flag
const isRollback = process.argv.includes('--rollback')

// Committee page interface
interface CommitteePage {
  title: string
  slug: string
  sortOrder: number
  description: string
  seo: {
    meta_title: string
    meta_description: string
    og_title: string
    og_description: string
  }
}

// Committee pages data
const COMMITTEE_PAGES: CommitteePage[] = [
  {
    title: 'Anti Ragging Committee',
    slug: 'committees/anti-ragging-committee',
    sortOrder: 1,
    description: 'Anti Ragging Committee at JKKN College of Engineering ensuring a ragging-free campus environment.',
    seo: {
      meta_title: 'Anti Ragging Committee - JKKN College of Engineering',
      meta_description: 'Anti Ragging Committee at JKKN Engineering College. Committed to maintaining a safe and ragging-free campus environment for all students.',
      og_title: 'Anti Ragging Committee - JKKN Engineering College',
      og_description: 'Learn about our Anti Ragging Committee and its role in ensuring student safety and welfare.'
    }
  },
  {
    title: 'Anti Ragging Squad',
    slug: 'committees/anti-ragging-squad',
    sortOrder: 2,
    description: 'Anti Ragging Squad at JKKN College of Engineering for immediate action against ragging incidents.',
    seo: {
      meta_title: 'Anti Ragging Squad - JKKN College of Engineering',
      meta_description: 'Anti Ragging Squad at JKKN Engineering College. Quick response team for preventing and addressing ragging incidents on campus.',
      og_title: 'Anti Ragging Squad - JKKN Engineering College',
      og_description: 'Our dedicated Anti Ragging Squad ensures immediate action against any form of ragging.'
    }
  },
  {
    title: 'Anti Drug Club',
    slug: 'committees/anti-drug-club',
    sortOrder: 3,
    description: 'Anti Drug Club promoting drug-free campus and awareness among students.',
    seo: {
      meta_title: 'Anti Drug Club - JKKN College of Engineering',
      meta_description: 'Anti Drug Club at JKKN Engineering College. Promoting awareness and maintaining a drug-free campus environment.',
      og_title: 'Anti Drug Club - JKKN Engineering College',
      og_description: 'Join our Anti Drug Club in promoting a healthy, drug-free campus lifestyle.'
    }
  },
  {
    title: 'Anti Drug Committee',
    slug: 'committees/anti-drug-committee',
    sortOrder: 4,
    description: 'Anti Drug Committee overseeing drug prevention policies and initiatives at JKKN Engineering College.',
    seo: {
      meta_title: 'Anti Drug Committee - JKKN College of Engineering',
      meta_description: 'Anti Drug Committee at JKKN Engineering College. Implementing drug prevention policies and awareness programs.',
      og_title: 'Anti Drug Committee - JKKN Engineering College',
      og_description: 'Our Anti Drug Committee works to ensure a substance-free educational environment.'
    }
  },
  {
    title: 'Internal Compliant Committee',
    slug: 'committees/internal-compliant-committee',
    sortOrder: 5,
    description: 'Internal Compliant Committee for addressing grievances and complaints at JKKN Engineering College.',
    seo: {
      meta_title: 'Internal Compliant Committee - JKKN College of Engineering',
      meta_description: 'Internal Compliant Committee at JKKN Engineering College. Addressing internal complaints and ensuring fair resolution.',
      og_title: 'Internal Compliant Committee - JKKN Engineering College',
      og_description: 'Our Internal Compliant Committee ensures transparent and fair handling of all complaints.'
    }
  },
  {
    title: 'Grievance and Redressal',
    slug: 'committees/grievance-and-redressal',
    sortOrder: 6,
    description: 'Grievance and Redressal Cell for student and staff concerns at JKKN Engineering College.',
    seo: {
      meta_title: 'Grievance and Redressal - JKKN College of Engineering',
      meta_description: 'Grievance and Redressal Cell at JKKN Engineering College. Dedicated to resolving student and staff concerns promptly.',
      og_title: 'Grievance and Redressal - JKKN Engineering College',
      og_description: 'Our Grievance and Redressal Cell provides a platform for voicing and resolving concerns.'
    }
  },
  {
    title: 'SC-ST Committee',
    slug: 'committees/sc-st-committee',
    sortOrder: 7,
    description: 'SC-ST Committee ensuring welfare and equal opportunities for SC/ST students.',
    seo: {
      meta_title: 'SC-ST Committee - JKKN College of Engineering',
      meta_description: 'SC-ST Committee at JKKN Engineering College. Ensuring welfare, support, and equal opportunities for SC/ST students.',
      og_title: 'SC-ST Committee - JKKN Engineering College',
      og_description: 'Our SC-ST Committee is dedicated to supporting and empowering SC/ST community students.'
    }
  },
  {
    title: 'Library Committee',
    slug: 'committees/library-committee',
    sortOrder: 8,
    description: 'Library Committee overseeing library services and resources at JKKN Engineering College.',
    seo: {
      meta_title: 'Library Committee - JKKN College of Engineering',
      meta_description: 'Library Committee at JKKN Engineering College. Managing library resources, services, and academic support.',
      og_title: 'Library Committee - JKKN Engineering College',
      og_description: 'Our Library Committee ensures access to quality academic resources and research materials.'
    }
  },
  {
    title: 'Library Advisory Committee',
    slug: 'committees/library-advisory-committee',
    sortOrder: 9,
    description: 'Library Advisory Committee providing guidance on library policies and development.',
    seo: {
      meta_title: 'Library Advisory Committee - JKKN College of Engineering',
      meta_description: 'Library Advisory Committee at JKKN Engineering College. Advising on library development, policies, and resource acquisition.',
      og_title: 'Library Advisory Committee - JKKN Engineering College',
      og_description: 'Our Library Advisory Committee guides the strategic development of library services.'
    }
  }
]

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

async function rollbackCommitteePages() {
  log('', 'Starting rollback of committee pages...', colors.cyan)

  // Validate environment
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    error('', 'Missing Supabase environment variables')
    error('', 'Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // Find committee pages by slug pattern
  log('', 'Finding committee pages...')
  const slugs = COMMITTEE_PAGES.map(p => p.slug)

  const { data: pages, error: findError } = await supabase
    .from('cms_pages')
    .select('id, title')
    .in('slug', slugs)

  if (findError) {
    error('', `Failed to find pages: ${findError.message}`)
    process.exit(1)
  }

  if (!pages || pages.length === 0) {
    error('', 'No committee pages found to rollback')
    process.exit(0)
  }

  log('', `Found ${pages.length} committee pages to delete`)
  pages.forEach(page => log('  |-', page.title, colors.blue))
  console.log('')

  // Delete all committee pages (cascading deletes will handle blocks, SEO)
  const { error: deleteError } = await supabase
    .from('cms_pages')
    .delete()
    .in('slug', slugs)

  if (deleteError) {
    error('', `Failed to rollback: ${deleteError.message}`)
    process.exit(1)
  }

  success('', 'All committee pages deleted successfully')
  log('', 'Related blocks and SEO metadata also removed (cascading delete)')
  console.log('')
}

async function publishCommitteePages() {
  log('', 'Starting Committee Pages Publishing Script', colors.bright)
  log('', `Creating ${COMMITTEE_PAGES.length} committee pages`, colors.cyan)
  console.log('')

  // Step 1: Validate environment
  log('', 'Step 1: Validating environment...', colors.cyan)

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    error('', 'Missing Supabase environment variables')
    error('', 'Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    error('', 'Run: npm run dev:engineering')
    process.exit(1)
  }

  success('', 'Environment variables found')
  console.log('')

  // Step 2: Create Supabase client
  log('', 'Step 2: Creating Supabase admin client...', colors.cyan)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  success('', 'Supabase client created')
  console.log('')

  // Step 3: Get creator user
  log('', 'Step 3: Getting creator user...', colors.cyan)

  const { data: users } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single()

  const creatorId = users?.id || '00000000-0000-0000-0000-000000000000'

  log('', `Using creator ID: ${creatorId}`, colors.blue)
  console.log('')

  // Step 4: Create pages with blocks and SEO
  log('', `Step 4: Creating ${COMMITTEE_PAGES.length} committee pages...`, colors.cyan)
  console.log('')

  let successCount = 0
  let failureCount = 0

  for (const committee of COMMITTEE_PAGES) {
    try {
      log('', `Creating: ${committee.title}`, colors.bright)

      // Create page
      const pageId = uuidv4()
      const { error: pageError } = await supabase
        .from('cms_pages')
        .insert({
          id: pageId,
          title: committee.title,
          slug: committee.slug,
          description: committee.description,
          parent_id: null, // Top-level page (under Committee menu in navigation)
          status: 'published',
          visibility: 'public',
          show_in_navigation: true,
          sort_order: committee.sortOrder,
          created_by: creatorId,
          updated_by: creatorId,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (pageError) {
        throw new Error(`Page creation failed: ${pageError.message}`)
      }

      // Create placeholder content block
      const { error: blockError } = await supabase
        .from('cms_page_blocks')
        .insert({
          id: uuidv4(),
          page_id: pageId,
          component_name: 'TextBlock',
          props: {
            title: committee.title,
            content: `<div class="py-12 px-4 max-w-4xl mx-auto">
              <h1 class="text-3xl font-bold text-gray-900 mb-6">${committee.title}</h1>
              <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p class="text-yellow-700">
                  This page content is under development. Please check back soon for detailed information about the ${committee.title}.
                </p>
              </div>
              <p class="text-gray-600">
                ${committee.description}
              </p>
            </div>`,
            backgroundColor: '#ffffff'
          },
          sort_order: 1,
          is_visible: true,
        })

      if (blockError) {
        throw new Error(`Block creation failed: ${blockError.message}`)
      }

      // Create SEO metadata
      const { error: seoError } = await supabase
        .from('cms_seo_metadata')
        .insert({
          id: uuidv4(),
          page_id: pageId,
          meta_title: committee.seo.meta_title,
          meta_description: committee.seo.meta_description,
          og_title: committee.seo.og_title,
          og_description: committee.seo.og_description,
          twitter_card: 'summary_large_image',
          canonical_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${committee.slug}`,
        })

      if (seoError) {
        log('  ', `SEO metadata warning: ${seoError.message}`, colors.yellow)
      }

      success('  ', `${committee.title} created successfully`)
      log('  |-', `Slug: ${committee.slug}`, colors.blue)
      log('  |-', `Sort Order: ${committee.sortOrder}`, colors.blue)
      console.log('')

      successCount++
    } catch (err: any) {
      error('  ', `Failed to create ${committee.title}`)
      error('  |-', err.message)
      console.log('')
      failureCount++
    }
  }

  // Step 5: Summary
  console.log('')
  log('', 'Step 5: Publishing Summary', colors.cyan)
  log('  |-', `Total committees: ${COMMITTEE_PAGES.length}`)
  log('  |-', `Successful: ${successCount}`, colors.green)
  log('  |-', `Failed: ${failureCount}`, failureCount > 0 ? colors.red : colors.blue)
  console.log('')

  if (successCount === COMMITTEE_PAGES.length) {
    success('', 'All committee pages published successfully!')
  } else {
    log('', 'Some pages failed to publish', colors.yellow)
  }

  // Step 6: Verification
  log('', 'Step 6: Verification...', colors.cyan)

  const slugs = COMMITTEE_PAGES.map(p => p.slug)
  const { data: verifyPages, error: verifyError } = await supabase
    .from('cms_pages')
    .select('id, title, slug, status')
    .in('slug', slugs)
    .order('sort_order', { ascending: true })

  if (verifyError || !verifyPages) {
    error('', 'Verification failed')
  } else {
    success('', `Verified ${verifyPages.length} pages in database`)
    console.log('')
    verifyPages.forEach((page, i) => {
      log(`  ${i + 1}.`, `${page.title} (${page.status})`, colors.blue)
    })
  }

  console.log('')
  console.log('')
  log('', 'Pages are now live at:', colors.bright)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  COMMITTEE_PAGES.forEach(c => {
    log('  |-', `${baseUrl}/${c.slug}`, colors.cyan)
  })
  console.log('')
  log('', 'Next steps:', colors.bright)
  log('  1.', 'Visit each page to verify rendering')
  log('  2.', 'Check Committee dropdown menu shows all 9 items')
  log('  3.', 'Update content via admin panel as needed')
  log('  4.', 'Add committee member details and contact information')
  console.log('')
  log('', 'To rollback:', colors.yellow)
  log('  |-', 'npx tsx scripts/publish-committee-pages.ts --rollback', colors.yellow)
  console.log('')
}

// Main execution
async function main() {
  try {
    if (isRollback) {
      await rollbackCommitteePages()
    } else {
      await publishCommitteePages()
    }
  } catch (err) {
    error('', 'Fatal error occurred')
    console.error(err)
    process.exit(1)
  }
}

main()
