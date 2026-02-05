/**
 * Download NAAC PDFs from External URLs
 *
 * This script downloads all NAAC-related PDFs from external URLs
 * and saves them to the appropriate local directories.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'

// Directory structure
const BASE_DIR = path.join(process.cwd(), 'public/pdfs/naac')

// Ensure directories exist
const DIRECTORIES = [
  'iiqa',
  'criterion-1',
  'criterion-2',
  'criterion-3',
  'criterion-4',
  'criterion-5',
  'criterion-6',
  'criterion-7',
  'best-practices',
  'distinctiveness',
  'feedback',
  'dvv',
  'ssr',
]

// Create all directories
DIRECTORIES.forEach(dir => {
  const dirPath = path.join(BASE_DIR, dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
})

// URL to local path mapping
interface DownloadTask {
  url: string
  localPath: string
  description: string
}

const DOWNLOAD_TASKS: DownloadTask[] = [
  // IIQA
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/04/IIQA-18.04.2024.pdf',
    localPath: 'iiqa/iiqa-april-2024.pdf',
    description: 'IIQA Document - April 2024'
  },

  // Criterion 1
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria1.1.1curricularplanning-implementation.pdf',
    localPath: 'criterion-1/1-1-1-curricular-planning.pdf',
    description: 'Criterion 1.1.1 - Curricular Planning'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria1.2academic-flexibility.pdf',
    localPath: 'criterion-1/1-2-academic-flexibility.pdf',
    description: 'Criterion 1.2 - Academic Flexibility'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria1.3.pdf',
    localPath: 'criterion-1/1-3-curriculum-enrichment.pdf',
    description: 'Criterion 1.3 - Curriculum Enrichment'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria1.4.pdf',
    localPath: 'criterion-1/1-4-feedback-system.pdf',
    description: 'Criterion 1.4 - Feedback System'
  },

  // Criterion 2
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.1.pdf',
    localPath: 'criterion-2/2-1-student-enrollment.pdf',
    description: 'Criterion 2.1 - Student Enrollment'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.2.pdf',
    localPath: 'criterion-2/2-2-catering-diversity.pdf',
    description: 'Criterion 2.2 - Catering Diversity'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.3.pdf',
    localPath: 'criterion-2/2-3-teaching-learning.pdf',
    description: 'Criterion 2.3 - Teaching Learning'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.4.pdf',
    localPath: 'criterion-2/2-4-teacher-profile.pdf',
    description: 'Criterion 2.4 - Teacher Profile'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.5.pdf',
    localPath: 'criterion-2/2-5-evaluation-process.pdf',
    description: 'Criterion 2.5 - Evaluation Process'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.6.pdf',
    localPath: 'criterion-2/2-6-student-performance.pdf',
    description: 'Criterion 2.6 - Student Performance'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.7.pdf',
    localPath: 'criterion-2/2-7-student-satisfaction.pdf',
    description: 'Criterion 2.7 - Student Satisfaction'
  },

  // Criterion 3
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.1.pdf',
    localPath: 'criterion-3/3-1-promotion-research.pdf',
    description: 'Criterion 3.1 - Promotion Research'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.2.pdf',
    localPath: 'criterion-3/3-2-resource-mobilization.pdf',
    description: 'Criterion 3.2 - Resource Mobilization'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.3.pdf',
    localPath: 'criterion-3/3-3-innovation-ecosystem.pdf',
    description: 'Criterion 3.3 - Innovation Ecosystem'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.4.pdf',
    localPath: 'criterion-3/3-4-research-publications.pdf',
    description: 'Criterion 3.4 - Research Publications'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.5.pdf',
    localPath: 'criterion-3/3-5-consultancy.pdf',
    description: 'Criterion 3.5 - Consultancy'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.6.pdf',
    localPath: 'criterion-3/3-6-extension-activities.pdf',
    description: 'Criterion 3.6 - Extension Activities'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria3.7.pdf',
    localPath: 'criterion-3/3-7-collaboration.pdf',
    description: 'Criterion 3.7 - Collaboration'
  },

  // Criterion 4
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria4.1.pdf',
    localPath: 'criterion-4/4-1-physical-facilities.pdf',
    description: 'Criterion 4.1 - Physical Facilities'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria4.2.pdf',
    localPath: 'criterion-4/4-2-library.pdf',
    description: 'Criterion 4.2 - Library'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria4.3.pdf',
    localPath: 'criterion-4/4-3-it-infrastructure.pdf',
    description: 'Criterion 4.3 - IT Infrastructure'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria4.4.pdf',
    localPath: 'criterion-4/4-4-infrastructure-maintenance.pdf',
    description: 'Criterion 4.4 - Infrastructure Maintenance'
  },

  // Criterion 5
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria5.1.pdf',
    localPath: 'criterion-5/5-1-student-support.pdf',
    description: 'Criterion 5.1 - Student Support'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria5.2.pdf',
    localPath: 'criterion-5/5-2-student-progression.pdf',
    description: 'Criterion 5.2 - Student Progression'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria5.3.pdf',
    localPath: 'criterion-5/5-3-student-participation.pdf',
    description: 'Criterion 5.3 - Student Participation'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria5.4.pdf',
    localPath: 'criterion-5/5-4-alumni-engagement.pdf',
    description: 'Criterion 5.4 - Alumni Engagement'
  },

  // Criterion 6
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria6.1.pdf',
    localPath: 'criterion-6/6-1-institutional-vision.pdf',
    description: 'Criterion 6.1 - Institutional Vision'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria6.2.pdf',
    localPath: 'criterion-6/6-2-strategy-development.pdf',
    description: 'Criterion 6.2 - Strategy Development'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria6.3.pdf',
    localPath: 'criterion-6/6-3-faculty-empowerment.pdf',
    description: 'Criterion 6.3 - Faculty Empowerment'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria6.4.pdf',
    localPath: 'criterion-6/6-4-financial-management.pdf',
    description: 'Criterion 6.4 - Financial Management'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria6.5.pdf',
    localPath: 'criterion-6/6-5-internal-quality.pdf',
    description: 'Criterion 6.5 - Internal Quality'
  },

  // Criterion 7
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria7.1.pdf',
    localPath: 'criterion-7/7-1-institutional-values.pdf',
    description: 'Criterion 7.1 - Institutional Values'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria7.2.pdf',
    localPath: 'criterion-7/7-2-best-practices.pdf',
    description: 'Criterion 7.2 - Best Practices'
  },
  {
    url: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria7.3.pdf',
    localPath: 'criterion-7/7-3-institutional-distinctiveness.pdf',
    description: 'Criterion 7.3 - Institutional Distinctiveness'
  },
]

/**
 * Download a file from URL
 */
function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const protocol = url.startsWith('https') ? https : http

    const request = protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          console.log(`  → Redirecting to: ${redirectUrl}`)
          file.close()
          fs.unlinkSync(dest)
          downloadFile(redirectUrl, dest).then(resolve).catch(reject)
          return
        }
      }

      if (response.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`))
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
      fs.unlinkSync(dest)
      reject(err)
    })

    file.on('error', (err) => {
      file.close()
      fs.unlinkSync(dest)
      reject(err)
    })
  })
}

/**
 * Main download function
 */
async function downloadAllPDFs() {
  console.log('🚀 Starting NAAC PDF downloads...\n')
  console.log(`📁 Base directory: ${BASE_DIR}\n`)

  let successCount = 0
  let failCount = 0
  const failedDownloads: { task: DownloadTask; error: string }[] = []

  for (const task of DOWNLOAD_TASKS) {
    const destPath = path.join(BASE_DIR, task.localPath)

    console.log(`📥 Downloading: ${task.description}`)
    console.log(`   URL: ${task.url}`)
    console.log(`   Dest: ${task.localPath}`)

    try {
      await downloadFile(task.url, destPath)
      const stats = fs.statSync(destPath)
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
      console.log(`   ✅ Success! (${sizeMB} MB)\n`)
      successCount++
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.log(`   ❌ Failed: ${errorMsg}\n`)
      failCount++
      failedDownloads.push({ task, error: errorMsg })
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Download Summary')
  console.log('='.repeat(60))
  console.log(`✅ Successful: ${successCount}/${DOWNLOAD_TASKS.length}`)
  console.log(`❌ Failed: ${failCount}/${DOWNLOAD_TASKS.length}`)

  if (failedDownloads.length > 0) {
    console.log('\n⚠️  Failed Downloads:')
    failedDownloads.forEach(({ task, error }) => {
      console.log(`   • ${task.description}`)
      console.log(`     URL: ${task.url}`)
      console.log(`     Error: ${error}`)
    })
  }

  console.log('\n✨ Download process complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Verify the downloaded PDFs in public/pdfs/naac/')
  console.log('2. Check that all files are valid PDFs')
  console.log('3. Test the links on the NAAC page')
  console.log('4. If any downloads failed, manually download those PDFs')
}

// Run the download
downloadAllPDFs().catch(console.error)
