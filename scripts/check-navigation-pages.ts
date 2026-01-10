/**
 * Diagnostic Script: Check Navigation Pages
 *
 * This script checks pages under "Approvals and Affiliation" to diagnose
 * why they're not appearing in the navigation menu.
 *
 * Run with: npx tsx scripts/check-navigation-pages.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface Page {
  id: string
  title: string
  slug: string
  parent_id: string | null
  status: string
  visibility: string
  show_in_navigation: boolean
  sort_order: number | null
  navigation_label: string | null
}

async function main() {
  console.log('\n🔍 Checking Navigation Pages...\n')

  // Find the "Approvals and Affiliation" page first
  const { data: parentPage, error: parentError } = await supabase
    .from('cms_pages')
    .select('id, title, slug, status, visibility, show_in_navigation')
    .or('slug.ilike.%approvals%,slug.ilike.%affiliation%,title.ilike.%Approvals%')
    .single()

  if (parentError || !parentPage) {
    console.log('❌ Could not find "Approvals and Affiliation" parent page')
    console.log('   This page needs to exist first')

    // Show all pages with "approvals" or "affiliation" in slug
    const { data: allPages } = await supabase
      .from('cms_pages')
      .select('id, title, slug')
      .or('slug.ilike.%approvals%,slug.ilike.%affiliation%')

    if (allPages && allPages.length > 0) {
      console.log('\n📄 Found related pages:')
      allPages.forEach((p: any) => {
        console.log(`   - ${p.title} (/${p.slug})`)
      })
    }

    return
  }

  console.log('✅ Found parent page:')
  console.log(`   Title: ${parentPage.title}`)
  console.log(`   Slug: ${parentPage.slug}`)
  console.log(`   Status: ${parentPage.status}`)
  console.log(`   Visibility: ${parentPage.visibility}`)
  console.log(`   Show in Navigation: ${parentPage.show_in_navigation}`)

  // Check if parent page meets navigation requirements
  const parentIssues: string[] = []
  if (parentPage.status !== 'published') parentIssues.push('Not published')
  if (parentPage.visibility !== 'public') parentIssues.push('Not public')
  if (!parentPage.show_in_navigation) parentIssues.push('Show in navigation is OFF')

  if (parentIssues.length > 0) {
    console.log('\n⚠️  Parent page issues:')
    parentIssues.forEach(issue => console.log(`   - ${issue}`))
  } else {
    console.log('\n✅ Parent page is correctly configured for navigation')
  }

  // Find all child pages
  const { data: childPages, error: childError } = await supabase
    .from('cms_pages')
    .select('id, title, slug, parent_id, status, visibility, show_in_navigation, sort_order, navigation_label')
    .eq('parent_id', parentPage.id)
    .order('sort_order', { ascending: true, nullsFirst: false })

  if (childError) {
    console.error('\n❌ Error fetching child pages:', childError)
    return
  }

  if (!childPages || childPages.length === 0) {
    console.log('\n📭 No child pages found under "Approvals and Affiliation"')
    console.log('   Pages need to have their parent_id set to:', parentPage.id)
    return
  }

  console.log(`\n📋 Found ${childPages.length} child page(s):\n`)

  childPages.forEach((page: Page, index: number) => {
    console.log(`${index + 1}. ${page.title}`)
    console.log(`   Slug: /${page.slug}`)
    console.log(`   Status: ${page.status}`)
    console.log(`   Visibility: ${page.visibility}`)
    console.log(`   Show in Navigation: ${page.show_in_navigation}`)
    console.log(`   Sort Order: ${page.sort_order ?? 'Not set'}`)
    console.log(`   Navigation Label: ${page.navigation_label || 'Using page title'}`)

    // Check for issues
    const issues: string[] = []
    if (page.status !== 'published') issues.push('❌ Not published')
    if (page.visibility !== 'public') issues.push('❌ Not public')
    if (!page.show_in_navigation) issues.push('❌ Show in navigation is OFF')

    if (issues.length > 0) {
      console.log('   Issues:')
      issues.forEach(issue => console.log(`      ${issue}`))
    } else {
      console.log('   ✅ Correctly configured')
    }
    console.log('')
  })

  // Summary
  const correctPages = childPages.filter((p: Page) =>
    p.status === 'published' &&
    p.visibility === 'public' &&
    p.show_in_navigation
  )

  console.log('\n📊 Summary:')
  console.log(`   Total child pages: ${childPages.length}`)
  console.log(`   Correctly configured: ${correctPages.length}`)
  console.log(`   Need fixes: ${childPages.length - correctPages.length}`)

  if (correctPages.length < childPages.length) {
    console.log('\n💡 How to fix:')
    console.log('   1. Go to Admin Panel → Content → Pages')
    console.log('   2. Find the pages that need fixes')
    console.log('   3. Edit each page and ensure:')
    console.log('      - Status: Published')
    console.log('      - Visibility: Public')
    console.log('      - Show in Navigation: Enabled')
    console.log('   4. Save changes')
    console.log('   5. Refresh the public website')
  } else {
    console.log('\n✅ All pages are correctly configured!')
    console.log('   If pages still not showing, try:')
    console.log('   1. Hard refresh the browser (Ctrl+Shift+R)')
    console.log('   2. Restart the Next.js dev server')
  }
}

main().catch(console.error)
