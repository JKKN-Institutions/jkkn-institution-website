import fs from 'fs'
import path from 'path'
import { dvvData } from '../lib/data/dvv-data'

// Get all PDF links from the data
function extractLinks(obj: any): string[] {
  const links: string[] = []

  if (typeof obj === 'object' && obj !== null) {
    if ('responseLink' in obj && typeof obj.responseLink === 'string') {
      links.push(obj.responseLink)
    }

    for (const key in obj) {
      links.push(...extractLinks(obj[key]))
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => links.push(...extractLinks(item)))
  }

  return links
}

const allLinks = extractLinks(dvvData)
const pdfLinks = allLinks.filter(link => link !== '#' && link.startsWith('/pdfs/naac/dvv/'))
const uniquePdfLinks = [...new Set(pdfLinks)]

console.log(`📊 Total PDF links found: ${uniquePdfLinks.length}`)
console.log(`📌 Placeholder links ('#'): ${allLinks.filter(l => l === '#').length}\n`)

// Check if PDFs exist
const publicDir = path.join(process.cwd(), 'public')
const missing: string[] = []
const found: string[] = []

uniquePdfLinks.forEach(link => {
  const filePath = path.join(publicDir, link)
  if (fs.existsSync(filePath)) {
    found.push(link)
  } else {
    missing.push(link)
  }
})

console.log(`✅ PDFs found: ${found.length}`)
console.log(`❌ PDFs missing: ${missing.length}\n`)

if (missing.length > 0) {
  console.log('Missing PDFs:')
  missing.forEach(link => console.log(`   - ${link}`))
} else {
  console.log('🎉 All PDFs exist in the public folder!')
}

// Check for PDFs in public folder that are not referenced
const dvvPdfDir = path.join(publicDir, 'pdfs', 'naac', 'dvv')
const filesInFolder = fs.readdirSync(dvvPdfDir)
const referencedFilenames = uniquePdfLinks.map(link => path.basename(link))
const unreferenced = filesInFolder.filter(file => !referencedFilenames.includes(file))

if (unreferenced.length > 0) {
  console.log(`\n📁 Unreferenced PDFs in folder (${unreferenced.length}):`)
  unreferenced.slice(0, 10).forEach(file => console.log(`   - ${file}`))
  if (unreferenced.length > 10) {
    console.log(`   ... and ${unreferenced.length - 10} more`)
  }
}
