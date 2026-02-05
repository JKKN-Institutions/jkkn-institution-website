/**
 * Create All Committee Pages Script
 *
 * This script automatically creates page.tsx files for all committees
 * that have PDFs configured in local-committee-pdfs.ts
 *
 * Usage:
 *   npx tsx scripts/create-committee-pages.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// Committee configurations
const COMMITTEES = [
  {
    slug: 'anti-ragging-committee',
    title: 'Anti Ragging Committee',
    description: 'Committed to maintaining a safe and ragging-free campus environment for all students',
  },
  {
    slug: 'anti-ragging-squad',
    title: 'Anti Ragging Squad',
    description: 'Quick response team ensuring immediate action against any form of ragging',
  },
  {
    slug: 'anti-drug-club',
    title: 'Anti Drug Club',
    description: 'Promoting drug-free campus and awareness among students',
  },
  {
    slug: 'anti-drug-committee',
    title: 'Anti Drug Committee',
    description: 'Overseeing drug prevention policies and initiatives',
  },
  {
    slug: 'internal-compliant-committee',
    title: 'Internal Complaints Committee',
    description: 'Addressing internal complaints and ensuring fair resolution',
  },
  {
    slug: 'grievance-and-redressal',
    title: 'Grievance and Redressal Committee',
    description: 'Dedicated to resolving student and staff concerns promptly',
  },
  {
    slug: 'sc-st-committee',
    title: 'SC-ST Committee',
    description: 'Ensuring welfare, support, and equal opportunities for SC/ST students',
  },
  {
    slug: 'library-committee',
    title: 'Library Committee',
    description: 'Managing library resources, services, and academic support',
  },
  {
    slug: 'library-advisory-committee',
    title: 'Library Advisory Committee',
    description: 'Guiding the strategic development of library services',
  },
  {
    slug: 'minority-committee',
    title: 'Minority Committee',
    description: 'Supporting minority community students and welfare',
  },
]

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

// Generate page content
function generatePageContent(committee: typeof COMMITTEES[0]): string {
  return `import type { Metadata } from 'next'
import { LocalCommitteePdfsPage } from '@/components/cms-blocks/content/local-committee-pdfs-page'

export const metadata: Metadata = {
  title: '${committee.title} | JKKN College of Engineering',
  description: '${committee.description}',
}

export default function ${committee.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')}Page() {
  return (
    <LocalCommitteePdfsPage
      committeeSlug="${committee.slug}"
      title="${committee.title}"
      description="${committee.description}"
      accentColor="#10b981"
    />
  )
}
`
}

async function main() {
  log('\n📝 Committee Pages Generator\n', colors.bright)
  log('Creating pages for all committees...\n', colors.cyan)

  let created = 0
  let skipped = 0

  for (const committee of COMMITTEES) {
    const dirPath = path.join(
      process.cwd(),
      'app',
      '(public)',
      'committees',
      committee.slug
    )
    const filePath = path.join(dirPath, 'page.tsx')

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // Check if page already exists
    if (fs.existsSync(filePath)) {
      log(`⏭️  Skipped: ${committee.slug} (already exists)`, colors.yellow)
      skipped++
      continue
    }

    // Generate and write page content
    const content = generatePageContent(committee)
    fs.writeFileSync(filePath, content, 'utf-8')

    log(`✅ Created: ${committee.slug}`, colors.green)
    created++
  }

  // Summary
  log('\n' + '='.repeat(50), colors.blue)
  log('📊 SUMMARY', colors.bright)
  log('='.repeat(50), colors.blue)
  log(`Total committees: ${COMMITTEES.length}`, colors.cyan)
  log(`Created: ${created}`, colors.green)
  log(`Skipped: ${skipped}`, colors.yellow)

  if (created > 0) {
    log('\n✅ Committee pages created successfully!', colors.green)
    log('\nYou can now access these pages:', colors.cyan)
    COMMITTEES.forEach((c) => {
      log(`  http://localhost:3000/committees/${c.slug}`, colors.blue)
    })
  }

  log('\n💡 Next steps:', colors.cyan)
  log('  1. Run: npm run dev')
  log('  2. Visit the committee pages in your browser')
  log('  3. Customize colors and descriptions as needed\n')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
