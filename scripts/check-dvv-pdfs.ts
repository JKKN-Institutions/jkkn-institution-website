import { dvvData } from '../lib/data/dvv-data'
import * as fs from 'fs'
import * as path from 'path'

const publicDir = path.join(process.cwd(), 'public')

interface Issue {
  location: string
  finding: string
  link: string
  status: 'missing' | 'placeholder' | 'exists'
}

function checkPdfLinks() {
  const issues: Issue[] = []

  function processMetrics(data: any, criterionName: string) {
    for (const [indicatorKey, indicatorValue] of Object.entries(data)) {
      if (typeof indicatorValue === 'object' && indicatorValue !== null) {
        for (const [metricKey, metricValue] of Object.entries(indicatorValue)) {
          if (Array.isArray(metricValue)) {
            metricValue.forEach((item: any, index: number) => {
              const location = `${criterionName}.${indicatorKey}.${metricKey}[${index}]`
              const link = item.responseLink

              if (link === '#') {
                issues.push({
                  location,
                  finding: item.finding,
                  link,
                  status: 'placeholder'
                })
              } else if (link) {
                const filePath = path.join(publicDir, link)
                const exists = fs.existsSync(filePath)

                if (!exists) {
                  issues.push({
                    location,
                    finding: item.finding,
                    link,
                    status: 'missing'
                  })
                } else {
                  issues.push({
                    location,
                    finding: item.finding,
                    link,
                    status: 'exists'
                  })
                }
              }
            })
          }
        }
      }
    }
  }

  // Check all criteria
  for (const [criterionKey, criterionValue] of Object.entries(dvvData)) {
    processMetrics(criterionValue, criterionKey)
  }

  return issues
}

// Run the check
const issues = checkPdfLinks()

console.log('\n=== DVV PDF Link Analysis ===\n')

const placeholder = issues.filter(i => i.status === 'placeholder')
const missing = issues.filter(i => i.status === 'missing')
const exists = issues.filter(i => i.status === 'exists')

console.log(`✅ Existing PDFs: ${exists.length}`)
console.log(`❌ Missing PDFs: ${missing.length}`)
console.log(`⚠️  Placeholder links (#): ${placeholder.length}\n`)

if (placeholder.length > 0) {
  console.log('=== PLACEHOLDER LINKS (#) ===\n')
  placeholder.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue.location}`)
    console.log(`   Finding: ${issue.finding.substring(0, 80)}...`)
    console.log('')
  })
}

if (missing.length > 0) {
  console.log('=== MISSING PDF FILES ===\n')
  missing.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue.location}`)
    console.log(`   Link: ${issue.link}`)
    console.log(`   Finding: ${issue.finding.substring(0, 80)}...`)
    console.log('')
  })
}

// List all PDF files in the directory
console.log('\n=== Available PDF files in public/pdfs/naac/dvv ===\n')
const dvvDir = path.join(publicDir, 'pdfs', 'naac', 'dvv')
const files = fs.readdirSync(dvvDir).filter(f => f.endsWith('.pdf')).sort()
console.log(`Total: ${files.length} files\n`)

// Show files that aren't referenced in the data
const referencedFiles = new Set(
  issues
    .filter(i => i.status === 'exists')
    .map(i => path.basename(i.link))
)

const unreferencedFiles = files.filter(f => !referencedFiles.has(f))
if (unreferencedFiles.length > 0) {
  console.log('\n=== UNREFERENCED PDF FILES (not linked in dvv-data.ts) ===\n')
  unreferencedFiles.forEach((file, i) => {
    console.log(`${i + 1}. ${file}`)
  })
}
