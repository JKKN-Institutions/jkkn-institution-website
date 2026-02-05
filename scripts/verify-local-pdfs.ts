/**
 * Verify Local PDFs Script
 *
 * This script checks if all PDFs referenced in configuration files
 * actually exist in the public/pdfs/ directory.
 *
 * Usage:
 *   npx tsx scripts/verify-local-pdfs.ts
 *
 * Features:
 * - Checks all committee PDFs
 * - Checks all alumni PDFs
 * - Checks all mandatory disclosure PDFs
 * - Reports missing files
 * - Reports file sizes (actual vs configured)
 */

import * as fs from 'fs'
import * as path from 'path'
import { LOCAL_COMMITTEE_PDFS } from '../lib/data/local-committee-pdfs'
import { LOCAL_ALUMNI_PDFS } from '../lib/data/local-alumni-pdfs'
import { LOCAL_MANDATORY_DISCLOSURE_PDFS } from '../lib/data/local-mandatory-disclosure-pdfs'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

interface VerificationResult {
  category: string
  total: number
  found: number
  missing: string[]
  sizeMismatches: Array<{
    file: string
    configured: string
    actual: string
  }>
}

function verifyPdfExists(pdfPath: string, configuredSize?: string): {
  exists: boolean
  actualSize?: string
  sizeMismatch: boolean
} {
  const fullPath = path.join(process.cwd(), 'public', 'pdfs', pdfPath)

  if (!fs.existsSync(fullPath)) {
    return { exists: false, sizeMismatch: false }
  }

  const stats = fs.statSync(fullPath)
  const actualSize = formatBytes(stats.size)

  // Check if configured size matches actual (within reason)
  const sizeMismatch = configuredSize ? configuredSize !== actualSize : false

  return {
    exists: true,
    actualSize,
    sizeMismatch,
  }
}

function verifyCommitteePdfs(): VerificationResult {
  const result: VerificationResult = {
    category: 'Committee PDFs',
    total: 0,
    found: 0,
    missing: [],
    sizeMismatches: [],
  }

  Object.entries(LOCAL_COMMITTEE_PDFS).forEach(([committee, pdfs]) => {
    pdfs.forEach((pdf) => {
      result.total++
      const verification = verifyPdfExists(pdf.pdfPath, pdf.fileSize)

      if (verification.exists) {
        result.found++
        if (verification.sizeMismatch) {
          result.sizeMismatches.push({
            file: pdf.pdfPath,
            configured: pdf.fileSize || 'N/A',
            actual: verification.actualSize || 'N/A',
          })
        }
      } else {
        result.missing.push(`${committee}: ${pdf.title} (${pdf.pdfPath})`)
      }
    })
  })

  return result
}

function verifyAlumniPdfs(): VerificationResult {
  const result: VerificationResult = {
    category: 'Alumni PDFs',
    total: 0,
    found: 0,
    missing: [],
    sizeMismatches: [],
  }

  LOCAL_ALUMNI_PDFS.forEach((pdf) => {
    result.total++
    const verification = verifyPdfExists(pdf.pdfPath, pdf.fileSize)

    if (verification.exists) {
      result.found++
      if (verification.sizeMismatch) {
        result.sizeMismatches.push({
          file: pdf.pdfPath,
          configured: pdf.fileSize || 'N/A',
          actual: verification.actualSize || 'N/A',
        })
      }
    } else {
      result.missing.push(`${pdf.title} (${pdf.pdfPath})`)
    }
  })

  return result
}

function verifyMandatoryDisclosurePdfs(): VerificationResult {
  const result: VerificationResult = {
    category: 'Mandatory Disclosure PDFs',
    total: 0,
    found: 0,
    missing: [],
    sizeMismatches: [],
  }

  LOCAL_MANDATORY_DISCLOSURE_PDFS.forEach((pdf) => {
    result.total++
    const verification = verifyPdfExists(pdf.pdfPath, pdf.fileSize)

    if (verification.exists) {
      result.found++
      if (verification.sizeMismatch) {
        result.sizeMismatches.push({
          file: pdf.pdfPath,
          configured: pdf.fileSize || 'N/A',
          actual: verification.actualSize || 'N/A',
        })
      }
    } else {
      result.missing.push(`${pdf.title} (${pdf.pdfPath})`)
    }
  })

  return result
}

function printResults(result: VerificationResult) {
  log(`\n📁 ${result.category}`, colors.bright)
  log('─'.repeat(50), colors.blue)

  const percentage = Math.round((result.found / result.total) * 100)
  log(`Total: ${result.total}`, colors.cyan)
  log(`Found: ${result.found} (${percentage}%)`,
    result.found === result.total ? colors.green : colors.yellow)
  log(`Missing: ${result.missing.length}`,
    result.missing.length === 0 ? colors.green : colors.red)

  if (result.missing.length > 0) {
    log('\n❌ Missing Files:', colors.red)
    result.missing.forEach((file, index) => {
      log(`  ${index + 1}. ${file}`, colors.red)
    })
  }

  if (result.sizeMismatches.length > 0) {
    log('\n⚠️  Size Mismatches:', colors.yellow)
    result.sizeMismatches.forEach((mismatch, index) => {
      log(`  ${index + 1}. ${path.basename(mismatch.file)}`, colors.yellow)
      log(`     Configured: ${mismatch.configured}`, colors.yellow)
      log(`     Actual: ${mismatch.actual}`, colors.yellow)
    })
  }
}

async function main() {
  log('\n📋 PDF Verification Script\n', colors.bright)
  log('Checking if all configured PDFs exist in public/pdfs/...\n', colors.cyan)

  // Verify all categories
  const committeeResults = verifyCommitteePdfs()
  const alumniResults = verifyAlumniPdfs()
  const mandatoryResults = verifyMandatoryDisclosurePdfs()

  // Print results
  printResults(committeeResults)
  printResults(alumniResults)
  printResults(mandatoryResults)

  // Summary
  const totalFiles = committeeResults.total + alumniResults.total + mandatoryResults.total
  const totalFound = committeeResults.found + alumniResults.found + mandatoryResults.found
  const totalMissing = committeeResults.missing.length + alumniResults.missing.length + mandatoryResults.missing.length

  log('\n' + '='.repeat(50), colors.blue)
  log('📊 SUMMARY', colors.bright)
  log('='.repeat(50), colors.blue)
  log(`Total PDFs configured: ${totalFiles}`, colors.cyan)
  log(`Total PDFs found: ${totalFound} (${Math.round((totalFound / totalFiles) * 100)}%)`,
    totalFound === totalFiles ? colors.green : colors.yellow)
  log(`Total PDFs missing: ${totalMissing}`,
    totalMissing === 0 ? colors.green : colors.red)

  if (totalMissing === 0) {
    log('\n✅ All PDFs are present!', colors.green)
    log('Your PDF system is ready to use.\n', colors.green)
  } else {
    log('\n⚠️  Some PDFs are missing.', colors.yellow)
    log('Please add the missing files to public/pdfs/ directory.\n', colors.yellow)
  }

  // Instructions
  log('💡 Tips:', colors.cyan)
  log('  1. Missing PDFs? Add them to public/pdfs/ directory')
  log('  2. Size mismatches? Update fileSize in configuration files')
  log('  3. Run this script after adding new PDFs to verify\n')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
