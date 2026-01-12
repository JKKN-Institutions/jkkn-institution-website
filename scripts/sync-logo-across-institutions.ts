#!/usr/bin/env tsx
/**
 * Sync Logo Across All Institutions
 *
 * This script automates the process of uploading the JKKN SVG logo to all
 * institution Supabase projects and updating their site_settings.
 *
 * Usage:
 *   npx tsx scripts/sync-logo-across-institutions.ts
 *
 * Requirements:
 *   - Service role keys must be in .env.[institution].servicekey files
 *   - SVG logo must be accessible at the Main institution's URL
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'

// Institution configurations
interface InstitutionConfig {
  id: string
  name: string
  altText: string
  supabaseUrl: string
  anonKey: string
  serviceKeyFile: string
  mediaBucket: string
}

const INSTITUTIONS: InstitutionConfig[] = [
  {
    id: 'dental',
    name: 'JKKN Dental College and Hospital',
    altText: 'JKKN Dental College',
    supabaseUrl: 'https://wnmyvbnqldukeknnmnpl.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndubXl2Ym5xbGR1a2Vrbm5tbnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDQxNTMsImV4cCI6MjA4MjkyMDE1M30.A5YnEqrUdtu7fOpxgHGzMghr1grIxhDqCF4Q_2BwZhQ',
    serviceKeyFile: '.env.dental.servicekey',
    mediaBucket: 'media',
  },
  {
    id: 'pharmacy',
    name: 'JKKN College of Pharmacy',
    altText: 'JKKN College of Pharmacy',
    supabaseUrl: 'https://rwskookarbolpmtolqkd.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3c2tvb2thcmJvbHBtdG9scWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjcwODQsImV4cCI6MjA4MzAwMzA4NH0.Coj77n6921HQcVVyaowug8vmf6Ju2DcM_fCnzaD1Hdc',
    serviceKeyFile: '.env.pharmacy.servicekey',
    mediaBucket: 'media',
  },
  {
    id: 'engineering',
    name: 'JKKN College of Engineering and Technology',
    altText: 'JKKN Engineering College',
    supabaseUrl: 'https://kyvfkyjmdbtyimtedkie.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dmZreWptZGJ0eWltdGVka2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NDAxMDQsImV4cCI6MjA4MzAxNjEwNH0.fByamPzYE1G5S1FAXZK1HobVM40zh9Y8N9QlCUNM-6I',
    serviceKeyFile: '.env.engineering.servicekey',
    mediaBucket: 'media',
  },
]

// Source SVG from Main institution
const SOURCE_SVG_URL = 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/fb4624f7-5250-4da1-80f6-99ab789d4199.svg'
const SVG_ORIGINAL_NAME = 'jkkn i (1).svg'

// Helper: Download file from URL
function downloadFile(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: HTTP ${res.statusCode}`))
        return
      }

      const chunks: Buffer[] = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

// Helper: Load service role key from file
function loadServiceKey(institution: InstitutionConfig): string | null {
  const projectRoot = path.resolve(__dirname, '..')
  const keyPath = path.join(projectRoot, institution.serviceKeyFile)

  if (!fs.existsSync(keyPath)) {
    console.error(`❌ Service key file not found: ${institution.serviceKeyFile}`)
    console.log(`   Create file: ${keyPath}`)
    console.log(`   Get key from: ${institution.supabaseUrl}/project/settings/api`)
    return null
  }

  return fs.readFileSync(keyPath, 'utf-8').trim()
}

// Helper: Upload SVG to institution's media library
async function uploadLogoToInstitution(
  institution: InstitutionConfig,
  svgBuffer: Buffer,
  serviceKey: string
): Promise<{ fileUrl: string; mediaId: string } | null> {
  console.log(`\n📤 Uploading logo to ${institution.name}...`)

  // Create Supabase client with service role key
  const supabase = createClient(institution.supabaseUrl, serviceKey)

  try {
    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `jkkn-logo-${timestamp}.svg`
    const filePath = `general/${fileName}`

    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === institution.mediaBucket)

    if (!bucketExists) {
      console.error(`   ❌ Storage bucket "${institution.mediaBucket}" does not exist`)
      console.log(`      Create bucket in Supabase Dashboard → Storage`)
      return null
    }

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(institution.mediaBucket)
      .upload(filePath, svgBuffer, {
        contentType: 'image/svg+xml',
        upsert: false,
      })

    if (uploadError) {
      console.error(`   ❌ Upload failed:`, uploadError.message)
      return null
    }

    // Get public URL
    const { data } = supabase.storage
      .from(institution.mediaBucket)
      .getPublicUrl(filePath)

    const publicUrl = data.publicUrl

    console.log(`   ✅ Uploaded to storage: ${publicUrl}`)

    // Check if cms_media_library table exists
    const { data: tables, error: tablesError } = await supabase
      .from('cms_media_library')
      .select('id')
      .limit(1)

    if (tablesError && tablesError.code === '42P01') {
      console.warn(`   ⚠️  cms_media_library table does not exist, skipping metadata insert`)
      return { fileUrl: publicUrl, mediaId: 'N/A' }
    }

    // Get the authenticated user (service role context)
    const { data: { user } } = await supabase.auth.getUser()
    const uploadedBy = user?.id || '00000000-0000-0000-0000-000000000000' // Fallback for service role

    // Insert into cms_media_library
    const { data: mediaRecord, error: insertError } = await supabase
      .from('cms_media_library')
      .insert({
        file_name: fileName,
        original_name: SVG_ORIGINAL_NAME,
        file_path: filePath,
        file_url: publicUrl,
        file_type: 'image',
        mime_type: 'image/svg+xml',
        file_size: svgBuffer.length,
        folder: 'general',
        alt_text: institution.altText,
        uploaded_by: uploadedBy,
      })
      .select()
      .single()

    if (insertError) {
      console.warn(`   ⚠️  Failed to insert into cms_media_library:`, insertError.message)
      console.log(`      File uploaded but metadata not recorded`)
      return { fileUrl: publicUrl, mediaId: 'N/A' }
    }

    console.log(`   ✅ Media library record created: ${mediaRecord.id}`)

    return { fileUrl: publicUrl, mediaId: mediaRecord.id }
  } catch (error) {
    console.error(`   ❌ Error:`, error)
    return null
  }
}

// Helper: Update site_settings with logo URL
async function updateSiteSettings(
  institution: InstitutionConfig,
  logoUrl: string,
  serviceKey: string
): Promise<boolean> {
  console.log(`\n⚙️  Updating site_settings for ${institution.name}...`)

  const supabase = createClient(institution.supabaseUrl, serviceKey)

  try {
    // Check if site_settings table exists
    const { error: tableCheckError } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)

    if (tableCheckError && tableCheckError.code === '42P01') {
      console.error(`   ❌ site_settings table does not exist`)
      console.log(`      Run database migration to create table first`)
      return false
    }

    // Update logo_url
    const { error: logoUrlError } = await supabase
      .from('site_settings')
      .upsert(
        {
          setting_key: 'logo_url',
          setting_value: logoUrl,
          category: 'appearance',
          description: 'Institution logo URL',
        },
        {
          onConflict: 'setting_key',
        }
      )

    if (logoUrlError) {
      console.error(`   ❌ Failed to update logo_url:`, logoUrlError.message)
      return false
    }

    console.log(`   ✅ Updated logo_url: ${logoUrl}`)

    // Update logo_alt_text
    const { error: altTextError } = await supabase
      .from('site_settings')
      .upsert(
        {
          setting_key: 'logo_alt_text',
          setting_value: institution.altText,
          category: 'appearance',
          description: 'Institution logo alt text',
        },
        {
          onConflict: 'setting_key',
        }
      )

    if (altTextError) {
      console.error(`   ❌ Failed to update logo_alt_text:`, altTextError.message)
      return false
    }

    console.log(`   ✅ Updated logo_alt_text: ${institution.altText}`)

    return true
  } catch (error) {
    console.error(`   ❌ Error:`, error)
    return false
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Logo Sync Across Institutions\n')
  console.log(`📥 Source SVG: ${SOURCE_SVG_URL}\n`)

  // Step 1: Download SVG
  console.log('📥 Downloading SVG from Main institution...')
  let svgBuffer: Buffer
  try {
    svgBuffer = await downloadFile(SOURCE_SVG_URL)
    console.log(`✅ Downloaded SVG (${svgBuffer.length} bytes)\n`)
  } catch (error) {
    console.error('❌ Failed to download SVG:', error)
    process.exit(1)
  }

  // Step 2: Process each institution
  const results: Array<{
    institution: string
    uploaded: boolean
    updated: boolean
  }> = []

  for (const inst of INSTITUTIONS) {
    console.log(`\n${'='.repeat(70)}`)
    console.log(`Processing: ${inst.name}`)
    console.log('='.repeat(70))

    // Load service key
    const serviceKey = loadServiceKey(inst)
    if (!serviceKey) {
      results.push({ institution: inst.name, uploaded: false, updated: false })
      continue
    }

    // Upload logo
    const uploadResult = await uploadLogoToInstitution(inst, svgBuffer, serviceKey)
    if (!uploadResult) {
      results.push({ institution: inst.name, uploaded: false, updated: false })
      continue
    }

    // Update site_settings
    const updateResult = await updateSiteSettings(inst, uploadResult.fileUrl, serviceKey)

    results.push({
      institution: inst.name,
      uploaded: true,
      updated: updateResult,
    })
  }

  // Step 3: Summary
  console.log(`\n${'='.repeat(70)}`)
  console.log('📊 SUMMARY')
  console.log('='.repeat(70))

  console.log('\nMain Institution (Source):')
  console.log('  ✅ JKKN Institutions - Already configured')

  console.log('\nOther Institutions:')
  results.forEach(result => {
    const uploadIcon = result.uploaded ? '✅' : '❌'
    const updateIcon = result.updated ? '✅' : '❌'
    console.log(`  ${uploadIcon} ${result.institution}`)
    console.log(`     Upload: ${result.uploaded ? 'Success' : 'Failed'}`)
    console.log(`     Settings: ${result.updated ? 'Updated' : 'Failed'}`)
  })

  const allSuccess = results.every(r => r.uploaded && r.updated)
  if (allSuccess) {
    console.log('\n🎉 All institutions updated successfully!')
    console.log('\n✅ Next steps:')
    console.log('   1. Test each institution locally:')
    console.log('      npm run dev:dental')
    console.log('      npm run dev:pharmacy')
    console.log('      npm run dev:engineering')
    console.log('   2. Verify logo displays correctly in navigation')
    console.log('   3. Check responsive behavior on mobile/tablet/desktop')
  } else {
    console.log('\n⚠️  Some institutions failed. Check errors above.')
    process.exit(1)
  }
}

// Run
main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
