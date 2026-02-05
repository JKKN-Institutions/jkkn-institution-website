/**
 * Convert NAAC External URLs to Local Paths
 *
 * This script converts all external NAAC PDF URLs to local paths
 * Example: https://engg.jkkn.ac.in/wp-content/uploads/2024/04/IIQA-18.04.2024.pdf
 * Becomes: /pdfs/naac/iiqa/iiqa-april-2024.pdf
 */

import * as fs from 'fs'
import * as path from 'path'

const filePath = path.join(process.cwd(), 'lib/cms/templates/naac/engineering-naac-overview.ts')

// Read the file
let content = fs.readFileSync(filePath, 'utf-8')

// URL conversion mapping based on pattern
const urlMappings: Array<{ pattern: RegExp; replacement: string }> = [
  // IIQA
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/04\/IIQA-18\.04\.2024\.pdf/g,
    replacement: '/pdfs/naac/iiqa/iiqa-april-2024.pdf'
  },

  // Criterion 1 - Curricular Aspects
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria1\.1\.1curricularplanning-implementation\.pdf/g,
    replacement: '/pdfs/naac/criterion-1/1-1-1-curricular-planning.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria1\.2academic-flexibility\.pdf/g,
    replacement: '/pdfs/naac/criterion-1/1-2-academic-flexibility.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria1\.3\.pdf/g,
    replacement: '/pdfs/naac/criterion-1/1-3-curriculum-enrichment.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria1\.4\.pdf/g,
    replacement: '/pdfs/naac/criterion-1/1-4-feedback-system.pdf'
  },

  // Criterion 2 - Teaching-Learning
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria-2\.1\.pdf/g,
    replacement: '/pdfs/naac/criterion-2/2-1-student-enrollment.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria-2\.2\.pdf/g,
    replacement: '/pdfs/naac/criterion-2/2-2-catering-diversity.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria2\.3\.pdf/g,
    replacement: '/pdfs/naac/criterion-2/2-3-teaching-learning.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria2\.4\.pdf/g,
    replacement: '/pdfs/naac/criterion-2/2-4-teacher-profile.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria2\.5\.pdf/g,
    replacement: '/pdfs/naac/criterion-2/2-5-evaluation-process.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria-2\.6\.pdf/g,
    replacement: '/pdfs/naac/criterion-2/2-6-student-performance.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria2\.7\.pdf/g,
    replacement: '/pdfs/naac/criterion-2/2-7-student-satisfaction.pdf'
  },

  // Criterion 3 - Research
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria3\.1\.pdf/g,
    replacement: '/pdfs/naac/criterion-3/3-1-promotion-research.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria3\.2\.pdf/g,
    replacement: '/pdfs/naac/criterion-3/3-2-resource-mobilization.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria3\.3\.pdf/g,
    replacement: '/pdfs/naac/criterion-3/3-3-innovation-ecosystem.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria3\.4\.pdf/g,
    replacement: '/pdfs/naac/criterion-3/3-4-research-publications.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria3\.5\.pdf/g,
    replacement: '/pdfs/naac/criterion-3/3-5-consultancy.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria3\.6\.pdf/g,
    replacement: '/pdfs/naac/criterion-3/3-6-extension-activities.pdf'
  },
  {
    pattern: /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/06\/criteria3\.7\.pdf/g,
    replacement: '/pdfs/naac/criterion-3/3-7-collaboration.pdf'
  },

  // Add more mappings for other criteria...
  // (This is a template - add remaining mappings as needed)
]

// Apply all URL mappings
urlMappings.forEach(({ pattern, replacement }) => {
  content = content.replace(pattern, replacement)
})

// Write back to file
fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ Successfully converted external URLs to local paths!')
console.log(`📝 Updated file: ${filePath}`)
console.log('\n⚠️  IMPORTANT: You must manually download the PDFs and place them in the correct folders!')
console.log('\nNext steps:')
console.log('1. Download each PDF from the external URLs')
console.log('2. Rename them according to the new naming convention')
console.log('3. Place them in public/pdfs/naac/{folder}/ directories')
console.log('4. Verify all links work on the website')
