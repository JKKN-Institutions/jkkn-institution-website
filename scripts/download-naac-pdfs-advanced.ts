/**
 * Advanced NAAC PDF Downloader with Browser Headers
 *
 * Uses proper headers to bypass hotlink protection
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'

const BASE_DIR = path.join(process.cwd(), 'public/pdfs/naac')

// Ensure directories exist
const DIRECTORIES = [
  'iiqa', 'criterion-1', 'criterion-2', 'criterion-3', 'criterion-4',
  'criterion-5', 'criterion-6', 'criterion-7', 'best-practices',
  'distinctiveness', 'feedback', 'dvv', 'ssr',
]

DIRECTORIES.forEach(dir => {
  const dirPath = path.join(BASE_DIR, dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
})

interface DownloadTask {
  url: string
  localPath: string
  description: string
}

const DOWNLOAD_TASKS: DownloadTask[] = [
  // IIQA
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/04/IIQA-18.04.2024.pdf', localPath: 'iiqa/iiqa-april-2024.pdf', description: 'IIQA Document' },

  // Criterion 1
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria1.1.1curricularplanning-implementation.pdf', localPath: 'criterion-1/1-1-1-curricular-planning.pdf', description: 'Criterion 1.1.1' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria1.2academic-flexibility.pdf', localPath: 'criterion-1/1-2-academic-flexibility.pdf', description: 'Criterion 1.2' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria1.3.pdf', localPath: 'criterion-1/1-3-curriculum-enrichment.pdf', description: 'Criterion 1.3' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria1.4.pdf', localPath: 'criterion-1/1-4-feedback-system.pdf', description: 'Criterion 1.4' },

  // Criterion 2
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.1.pdf', localPath: 'criterion-2/2-1-student-enrollment.pdf', description: 'Criterion 2.1' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.2.pdf', localPath: 'criterion-2/2-2-catering-diversity.pdf', description: 'Criterion 2.2' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.3.pdf', localPath: 'criterion-2/2-3-teaching-learning.pdf', description: 'Criterion 2.3' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.4.pdf', localPath: 'criterion-2/2-4-teacher-profile.pdf', description: 'Criterion 2.4' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.5.pdf', localPath: 'criterion-2/2-5-evaluation-process.pdf', description: 'Criterion 2.5' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.6.pdf', localPath: 'criterion-2/2-6-student-performance.pdf', description: 'Criterion 2.6' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.7.pdf', localPath: 'criterion-2/2-7-student-satisfaction.pdf', description: 'Criterion 2.7' },

  // Criterion 3
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.1.pdf', localPath: 'criterion-3/3-1-promotion-research.pdf', description: 'Criterion 3.1' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.2.pdf', localPath: 'criterion-3/3-2-resource-mobilization.pdf', description: 'Criterion 3.2' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.3.pdf', localPath: 'criterion-3/3-3-innovation-ecosystem.pdf', description: 'Criterion 3.3' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.4.pdf', localPath: 'criterion-3/3-4-research-publications.pdf', description: 'Criterion 3.4' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.5.pdf', localPath: 'criterion-3/3-5-consultancy.pdf', description: 'Criterion 3.5' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.6.pdf', localPath: 'criterion-3/3-6-extension-activities.pdf', description: 'Criterion 3.6' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.7.pdf', localPath: 'criterion-3/3-7-collaboration.pdf', description: 'Criterion 3.7' },

  // Criterion 4
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria4.1.pdf', localPath: 'criterion-4/4-1-physical-facilities.pdf', description: 'Criterion 4.1' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria4.2.pdf', localPath: 'criterion-4/4-2-library.pdf', description: 'Criterion 4.2' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria4.3.pdf', localPath: 'criterion-4/4-3-it-infrastructure.pdf', description: 'Criterion 4.3' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria4.4.pdf', localPath: 'criterion-4/4-4-infrastructure-maintenance.pdf', description: 'Criterion 4.4' },

  // Criterion 5
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria5.1.pdf', localPath: 'criterion-5/5-1-student-support.pdf', description: 'Criterion 5.1' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria5.2.pdf', localPath: 'criterion-5/5-2-student-progression.pdf', description: 'Criterion 5.2' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria5.3.pdf', localPath: 'criterion-5/5-3-student-participation.pdf', description: 'Criterion 5.3' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria5.4.pdf', localPath: 'criterion-5/5-4-alumni-engagement.pdf', description: 'Criterion 5.4' },

  // Criterion 6
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria6.1.pdf', localPath: 'criterion-6/6-1-institutional-vision.pdf', description: 'Criterion 6.1' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria6.2.pdf', localPath: 'criterion-6/6-2-strategy-development.pdf', description: 'Criterion 6.2' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria6.3.pdf', localPath: 'criterion-6/6-3-faculty-empowerment.pdf', description: 'Criterion 6.3' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria6.4.pdf', localPath: 'criterion-6/6-4-financial-management.pdf', description: 'Criterion 6.4' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria6.5.pdf', localPath: 'criterion-6/6-5-internal-quality.pdf', description: 'Criterion 6.5' },

  // Criterion 7
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria7.1.pdf', localPath: 'criterion-7/7-1-institutional-values.pdf', description: 'Criterion 7.1' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria7.2.pdf', localPath: 'criterion-7/7-2-best-practices.pdf', description: 'Criterion 7.2' },
  { url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria7.3.pdf', localPath: 'criterion-7/7-3-institutional-distinctiveness.pdf', description: 'Criterion 7.3' },
]

/**
 * Download file with browser headers to bypass hotlink protection
 */
function downloadFileWithHeaders(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const protocol = url.startsWith('https') ? https : http

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://engg.jkkn.ac.in/',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
      }
    }

    const request = protocol.get(url, options, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          file.close()
          fs.unlinkSync(dest)
          downloadFileWithHeaders(redirectUrl, dest).then(resolve).catch(reject)
          return
        }
      }

      if (response.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        reject(new Error(`Failed: ${response.statusCode} ${response.statusMessage}`))
        return
      }

      response.pipe(file)

      file.on('finish', () => {
        file.close()
        resolve()
      })
    })

    request.on('error', (err) => {
      file.close()
      if (fs.existsSync(dest)) fs.unlinkSync(dest)
      reject(err)
    })

    file.on('error', (err) => {
      file.close()
      if (fs.existsSync(dest)) fs.unlinkSync(dest)
      reject(err)
    })
  })
}

/**
 * Download with retry logic
 */
async function downloadWithRetry(task: DownloadTask, maxRetries = 3): Promise<boolean> {
  const destPath = path.join(BASE_DIR, task.localPath)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📥 [${attempt}/${maxRetries}] ${task.description}`)
      console.log(`   URL: ${task.url}`)

      await downloadFileWithHeaders(task.url, destPath)

      const stats = fs.statSync(destPath)
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
      console.log(`   ✅ Success! (${sizeMB} MB)\n`)
      return true
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)

      if (attempt === maxRetries) {
        console.log(`   ❌ Failed after ${maxRetries} attempts: ${errorMsg}\n`)
        return false
      } else {
        console.log(`   ⚠️  Attempt ${attempt} failed, retrying... (${errorMsg})`)
        await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before retry
      }
    }
  }

  return false
}

/**
 * Main download function
 */
async function downloadAllPDFs() {
  console.log('🚀 Starting Advanced NAAC PDF Downloads...\n')
  console.log('📁 Base directory:', BASE_DIR)
  console.log('🔐 Using browser headers to bypass hotlink protection\n')

  let successCount = 0
  let failCount = 0
  const failedDownloads: DownloadTask[] = []

  for (const task of DOWNLOAD_TASKS) {
    const success = await downloadWithRetry(task)
    if (success) {
      successCount++
    } else {
      failCount++
      failedDownloads.push(task)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70))
  console.log('📊 Download Summary')
  console.log('='.repeat(70))
  console.log(`✅ Successful: ${successCount}/${DOWNLOAD_TASKS.length}`)
  console.log(`❌ Failed: ${failCount}/${DOWNLOAD_TASKS.length}`)

  if (failedDownloads.length > 0) {
    console.log('\n⚠️  Failed Downloads (may need manual download):')
    failedDownloads.forEach(task => {
      console.log(`   • ${task.description}`)
      console.log(`     URL: ${task.url}`)
    })
  }

  console.log('\n✨ Download process complete!')

  if (successCount === DOWNLOAD_TASKS.length) {
    console.log('\n🎉 All PDFs downloaded successfully!')
    console.log('\n📝 Next step: Update paths in engineering-naac-overview.ts')
    console.log('   Run: npm run update-naac-paths')
  }
}

downloadAllPDFs().catch(console.error)
