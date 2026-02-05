import fs from 'fs'
import path from 'path'

// Path to the dvv-data.ts file
const dataFilePath = path.join(process.cwd(), 'lib', 'data', 'dvv-data.ts')

// Read the current file
let content = fs.readFileSync(dataFilePath, 'utf-8')

// Count replacements
let externalLinkCount = 0
let placeholderCount = 0

// Replace all external links with local paths
// Pattern: https://engg.jkkn.ac.in/wp-content/uploads/2024/07/filename.pdf -> /pdfs/naac/dvv/filename.pdf
content = content.replace(
  /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/07\/([^'"]+\.pdf)/g,
  (match, filename) => {
    externalLinkCount++
    return `/pdfs/naac/dvv/${filename}`
  }
)

// Also replace .xls file if any
content = content.replace(
  /https:\/\/engg\.jkkn\.ac\.in\/wp-content\/uploads\/2024\/07\/([^'"]+\.xls)/g,
  (match, filename) => {
    externalLinkCount++
    return `/pdfs/naac/dvv/${filename}`
  }
)

// Count placeholders (just for reporting)
const placeholders = content.match(/responseLink:\s*'#'/g)
placeholderCount = placeholders ? placeholders.length : 0

// Write the updated content back
fs.writeFileSync(dataFilePath, content, 'utf-8')

console.log('✅ DVV Links Replacement Complete!')
console.log(`📊 Statistics:`)
console.log(`   - External links replaced: ${externalLinkCount}`)
console.log(`   - Placeholder links ('#'): ${placeholderCount}`)
console.log(`\n📁 Updated file: ${dataFilePath}`)
console.log(`\n🔗 All links now point to: /pdfs/naac/dvv/`)
