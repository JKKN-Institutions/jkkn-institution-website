/**
 * Script to add BE CSE Course Block to existing page
 * Run with: npx tsx scripts/add-be-cse-course-block.ts
 */

import { createClient } from '@supabase/supabase-js'
import { BE_CSE_SAMPLE_DATA } from '../lib/cms/templates/engineering/be-cse-data'

// Engineering College Supabase credentials
const supabaseUrl = 'https://kyvfkyjmdbtyimtedkie.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dmZreWptZGJ0eWltdGVka2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjQwMTcsImV4cCI6MjA1MTk5NzYxN30.UzXFxPhScxgLrB3PCNM-ZMhHVvqnzFAh0fRZXMHmpqQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function addBECSECourseBlock() {
  try {
    console.log('🚀 Adding BE CSE course block...')

    const pageId = '02ab2a36-c210-484f-8057-2a66c0b49f47' // BE CSE page ID

    // Insert the course block
    const { data, error } = await supabase
      .from('cms_page_blocks')
      .insert({
        page_id: pageId,
        component_name: 'BECSECoursePage',
        props: BE_CSE_SAMPLE_DATA,
        sort_order: 1,
        is_visible: true,
      })
      .select()

    if (error) {
      console.error('❌ Error inserting block:', error)
      process.exit(1)
    }

    console.log('✅ Successfully added BE CSE course block!')
    console.log('📦 Block ID:', data[0].id)
    console.log('\n✨ Next steps:')
    console.log('1. Go to: http://localhost:3000/admin/content/courses')
    console.log('2. You should now see "B.E. Computer Science & Engineering"')
    console.log('3. Click "Edit" to manage the course content')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

addBECSECourseBlock()
