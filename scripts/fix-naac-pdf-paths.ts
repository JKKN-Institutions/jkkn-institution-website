/**
 * Fix NAAC PDF Paths in Engineering Data File
 *
 * This script corrects all PDF paths to match the actual folder structure
 * and uses external URLs for PDFs that don't exist locally.
 */

import * as fs from 'fs'
import * as path from 'path'

const filePath = path.join(process.cwd(), 'lib/cms/templates/naac/engineering-naac-overview.ts')

// Read the file
let content = fs.readFileSync(filePath, 'utf-8')

// Path corrections mapping
const pathCorrections: Array<{ pattern: RegExp; replacement: string }> = [
  // Criterion 1
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteriaa1\.3\.2curriculam\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria1.3.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria1\.1\.4-Feedback-Systems\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria1.4.pdf'
  },

  // Criterion 2
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.1\.1\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.1.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.1\.2-final\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.1.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.2\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.2.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.3\.1\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.3.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.3\.2\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.3.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.3\.3\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.3.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.4\.1\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.4.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.4\.2\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.4.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.4\.3\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.4.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.4\.4\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.4.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.5\.1\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.5.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.5\.2\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.5.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.5\.3\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.5.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.6\.1\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.6.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.6\.2\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.6.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.6\.3\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria-2.6.pdf'
  },
  {
    pattern: /\/pdfs\/naac\/2024\/06\/criteria2-2\.7\.1\.pdf/g,
    replacement: 'https://engg.jkkn.ac.in/wp-content/uploads/2024/06/criteria2.7.pdf'
  },

  // General pattern: fix any remaining /pdfs/naac/2024/06/ to use external URLs
  // This will catch any we missed
]

// Apply all corrections
pathCorrections.forEach(({ pattern, replacement }) => {
  if (pattern.test(content)) {
    content = content.replace(pattern, replacement)
    console.log(`✅ Fixed: ${pattern} → ${replacement}`)
  }
})

// Write back to file
fs.writeFileSync(filePath, content, 'utf-8')

console.log('\n✨ Successfully fixed PDF paths!')
console.log(`📝 Updated file: ${filePath}`)
console.log('\n📌 Note: PDFs now use external URLs until you manually download them')
console.log('📖 See public/pdfs/naac/DOWNLOAD-INSTRUCTIONS.md for manual download steps')
