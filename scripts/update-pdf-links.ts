/**
 * Batch Update PDF Links Script
 *
 * This script helps you quickly update all Google Drive PDF links.
 * Instead of manually editing each configuration file, you can use this script
 * to update links in bulk.
 *
 * Usage:
 *   npx tsx scripts/update-pdf-links.ts
 *
 * Steps:
 * 1. Upload all PDFs to Google Drive
 * 2. Create a CSV file with: title, file_id, category
 * 3. Run this script to auto-update configuration files
 */

import * as fs from 'fs'
import * as path from 'path'

// Color utilities for console output
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

/**
 * CSV Format Example:
 *
 * title,file_id,category,year,description
 * "Anti Ragging Committee Members",1ABC123xyz,Committee Information,2024-2025,"List of members"
 * "Alumni Bylaws",2DEF456uvw,Association Documents,2024,"Official bylaws"
 */
function parseCsv(csvContent: string) {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''))

  const data = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''))
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    data.push(row)
  }

  return data
}

/**
 * Convert CSV data to PdfLinkConfig format
 */
function csvToPdfConfig(csvData: any[]) {
  return csvData.map((row) => ({
    title: row.title,
    driveUrl: row.file_id.includes('drive.google.com')
      ? row.file_id
      : `https://drive.google.com/file/d/${row.file_id}/view`,
    description: row.description || '',
    category: row.category || '',
    year: row.year || '',
  }))
}

/**
 * Generate TypeScript configuration code
 */
function generateConfigCode(
  configName: string,
  pdfs: any[],
  isRecord = false
) {
  const imports = `import { PdfLinkConfig } from '@/lib/utils/google-drive-pdf'\n\n`

  if (isRecord) {
    // For committee-pdfs.ts (Record format)
    let code = imports
    code += `export const ${configName}: Record<string, PdfLinkConfig[]> = {\n`

    // Group by first word of category (e.g., "anti-ragging-committee")
    const groups = pdfs.reduce((acc, pdf) => {
      const slug = pdf.category
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      if (!acc[slug]) acc[slug] = []
      acc[slug].push(pdf)
      return acc
    }, {} as Record<string, any[]>)

    Object.entries(groups).forEach(([slug, groupPdfs], index) => {
      code += `  '${slug}': [\n`
      ;(groupPdfs as any[]).forEach((pdf) => {
        code += `    {\n`
        code += `      title: '${pdf.title}',\n`
        code += `      driveUrl: '${pdf.driveUrl}',\n`
        if (pdf.description)
          code += `      description: '${pdf.description}',\n`
        if (pdf.category) code += `      category: '${pdf.category}',\n`
        if (pdf.year) code += `      year: '${pdf.year}',\n`
        code += `    },\n`
      })
      code += `  ],\n`
    })

    code += `}\n`
    return code
  } else {
    // For alumni-pdfs.ts and mandatory-disclosure-pdfs.ts (array format)
    let code = imports
    code += `export const ${configName}: PdfLinkConfig[] = [\n`

    pdfs.forEach((pdf) => {
      code += `  {\n`
      code += `    title: '${pdf.title}',\n`
      code += `    driveUrl: '${pdf.driveUrl}',\n`
      if (pdf.description) code += `    description: '${pdf.description}',\n`
      if (pdf.category) code += `    category: '${pdf.category}',\n`
      if (pdf.year) code += `    year: '${pdf.year}',\n`
      code += `  },\n`
    })

    code += `]\n`
    return code
  }
}

/**
 * Main script
 */
async function main() {
  log('\n📄 PDF Links Batch Update Script\n', colors.bright)

  // Example usage instructions
  log('This script helps you batch-update PDF links.', colors.cyan)
  log('\nTo use this script:', colors.yellow)
  log('1. Create a CSV file with your PDF data')
  log('2. CSV format: title,file_id,category,year,description')
  log('3. Update the paths below to point to your CSV files')
  log('4. Run: npx tsx scripts/update-pdf-links.ts\n')

  // Example CSV paths (update these)
  const csvFiles = {
    committee: './data/committee-pdfs.csv',
    alumni: './data/alumni-pdfs.csv',
    mandatoryDisclosure: './data/mandatory-disclosure-pdfs.csv',
  }

  // Check which CSV files exist
  const existingFiles: string[] = []
  Object.entries(csvFiles).forEach(([name, filePath]) => {
    if (fs.existsSync(filePath)) {
      existingFiles.push(name)
      log(`✓ Found: ${filePath}`, colors.green)
    } else {
      log(`✗ Not found: ${filePath}`, colors.yellow)
    }
  })

  if (existingFiles.length === 0) {
    log('\n⚠️  No CSV files found.', colors.yellow)
    log('\nCreate CSV files with this format:', colors.cyan)
    log(
      'title,file_id,category,year,description\n"Document Title","1ABC123xyz","Category Name","2024-2025","Description"\n'
    )
    return
  }

  log(`\n📊 Processing ${existingFiles.length} file(s)...\n`, colors.cyan)

  // Process each existing CSV file
  for (const type of existingFiles) {
    const csvPath = csvFiles[type as keyof typeof csvFiles]
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const csvData = parseCsv(csvContent)
    const pdfConfigs = csvToPdfConfig(csvData)

    let configName = ''
    let outputPath = ''
    let isRecord = false

    switch (type) {
      case 'committee':
        configName = 'COMMITTEE_PDFS'
        outputPath = './lib/data/committee-pdfs.ts'
        isRecord = true
        break
      case 'alumni':
        configName = 'ALUMNI_PDFS'
        outputPath = './lib/data/alumni-pdfs.ts'
        break
      case 'mandatoryDisclosure':
        configName = 'MANDATORY_DISCLOSURE_PDFS'
        outputPath = './lib/data/mandatory-disclosure-pdfs.ts'
        break
    }

    const code = generateConfigCode(configName, pdfConfigs, isRecord)
    fs.writeFileSync(outputPath, code, 'utf-8')

    log(
      `✓ Updated ${outputPath} with ${pdfConfigs.length} PDF(s)`,
      colors.green
    )
  }

  log('\n✅ All files updated successfully!\n', colors.green)
  log('Next steps:', colors.cyan)
  log('1. Review the generated configuration files')
  log('2. Test the PDF links in your application')
  log('3. Commit the changes to your repository\n')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
