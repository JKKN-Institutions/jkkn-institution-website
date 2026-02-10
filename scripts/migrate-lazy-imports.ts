/**
 * Automated Import Migration Script
 *
 * This script automatically updates imports from direct to lazy-loaded versions
 * for heavy components (Monaco, TipTap, Recharts).
 *
 * Usage:
 *   npm run migrate:lazy           # Dry run (preview changes)
 *   npm run migrate:lazy --apply   # Apply changes
 *
 * What it does:
 * 1. Finds all files importing heavy components
 * 2. Updates import paths to lazy versions
 * 3. Preserves all other code unchanged
 * 4. Creates backup before applying changes
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get project root directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')

// Import mappings: old path → new path
const IMPORT_MAPPINGS = {
  "@/components/cms/code-editor": "@/components/cms/code-editor.lazy",
  "@/components/ui/rich-text-editor": "@/components/ui/rich-text-editor.lazy",
  // Note: Chart imports will be handled separately (need to combine imports)
}

// Chart import patterns (need to consolidate)
const CHART_IMPORTS = [
  '@/components/analytics/charts/pageviews-chart',
  '@/components/analytics/charts/user-growth-chart',
  '@/components/analytics/charts/content-performance-chart',
  '@/components/analytics/charts/traffic-sources-chart',
  '@/components/analytics/charts/role-distribution-chart',
]

interface FileChange {
  file: string
  oldContent: string
  newContent: string
  changes: string[]
}

/**
 * Find all TypeScript/TSX files in the project
 */
function findTsxFiles(dir: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    // Skip node_modules, .next, etc.
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(entry.name)) {
        findTsxFiles(fullPath, files)
      }
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Check if file imports any heavy components
 */
function needsMigration(content: string): boolean {
  // Check for direct imports
  for (const oldPath of Object.keys(IMPORT_MAPPINGS)) {
    if (content.includes(`from '${oldPath}'`) || content.includes(`from "${oldPath}"`)) {
      return true
    }
  }

  // Check for chart imports
  for (const chartPath of CHART_IMPORTS) {
    if (content.includes(`from '${chartPath}'`) || content.includes(`from "${chartPath}"`)) {
      return true
    }
  }

  return false
}

/**
 * Migrate a single file's imports
 */
function migrateFile(filePath: string, content: string): FileChange | null {
  let newContent = content
  const changes: string[] = []

  // 1. Migrate simple imports (CodeEditor, RichTextEditor)
  for (const [oldPath, newPath] of Object.entries(IMPORT_MAPPINGS)) {
    const singleQuotePattern = new RegExp(`from '${oldPath.replace(/\//g, '\\/')}'`, 'g')
    const doubleQuotePattern = new RegExp(`from "${oldPath.replace(/\//g, '\\/')}"`, 'g')

    if (singleQuotePattern.test(newContent)) {
      newContent = newContent.replace(singleQuotePattern, `from '${newPath}'`)
      changes.push(`Updated import: ${oldPath} → ${newPath}`)
    }

    if (doubleQuotePattern.test(newContent)) {
      newContent = newContent.replace(doubleQuotePattern, `from "${newPath}"`)
      changes.push(`Updated import: ${oldPath} → ${newPath}`)
    }
  }

  // 2. Migrate chart imports (consolidate into single import)
  const chartImportLines: string[] = []
  const importedCharts: string[] = []

  for (const chartPath of CHART_IMPORTS) {
    const chartName = chartPath.split('/').pop()!.replace('.tsx', '').replace('.ts', '')
    const pascalCaseName = chartName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    // Find import lines
    const singleQuotePattern = new RegExp(
      `import\\s+{([^}]+)}\\s+from\\s+'${chartPath.replace(/\//g, '\\/')}'`,
      'g'
    )
    const doubleQuotePattern = new RegExp(
      `import\\s+{([^}]+)}\\s+from\\s+"${chartPath.replace(/\//g, '\\/')}"`,
      'g'
    )

    let match
    while ((match = singleQuotePattern.exec(content)) !== null) {
      chartImportLines.push(match[0])
      importedCharts.push(match[1].trim())
    }
    while ((match = doubleQuotePattern.exec(content)) !== null) {
      chartImportLines.push(match[0])
      importedCharts.push(match[1].trim())
    }
  }

  // If we found chart imports, replace with consolidated import
  if (chartImportLines.length > 0) {
    // Remove old import lines
    for (const line of chartImportLines) {
      newContent = newContent.replace(line, '')
    }

    // Add consolidated import at the top (after other imports)
    const consolidatedImport = `import {\n  ${importedCharts.join(',\n  ')}\n} from '@/components/analytics/charts/index.lazy'`

    // Find the last import statement
    const lastImportMatch = newContent.match(/import[^;]+;/g)
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1]
      newContent = newContent.replace(lastImport, `${lastImport}\n${consolidatedImport}`)
    }

    changes.push(`Consolidated ${chartImportLines.length} chart imports into single lazy import`)
  }

  // 3. Clean up multiple blank lines
  newContent = newContent.replace(/\n{3,}/g, '\n\n')

  if (changes.length === 0) {
    return null // No changes needed
  }

  return {
    file: path.relative(PROJECT_ROOT, filePath),
    oldContent: content,
    newContent,
    changes,
  }
}

/**
 * Create backup of a file
 */
function createBackup(filePath: string): void {
  const backupPath = `${filePath}.backup`
  fs.copyFileSync(filePath, backupPath)
}

/**
 * Main migration function
 */
async function main() {
  const args = process.argv.slice(2)
  const applyChanges = args.includes('--apply')

  console.log('🔍 Scanning for files to migrate...\n')

  const allFiles = findTsxFiles(path.join(PROJECT_ROOT, 'app'))
  allFiles.push(...findTsxFiles(path.join(PROJECT_ROOT, 'components')))

  const filesToMigrate: FileChange[] = []

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf-8')

    if (needsMigration(content)) {
      const change = migrateFile(filePath, content)
      if (change) {
        filesToMigrate.push(change)
      }
    }
  }

  if (filesToMigrate.length === 0) {
    console.log('✅ No files need migration. All imports are up to date!')
    return
  }

  console.log(`Found ${filesToMigrate.length} files to migrate:\n`)

  for (const change of filesToMigrate) {
    console.log(`📄 ${change.file}`)
    for (const desc of change.changes) {
      console.log(`   ├─ ${desc}`)
    }
    console.log()
  }

  if (applyChanges) {
    console.log('💾 Applying changes...\n')

    for (const change of filesToMigrate) {
      const fullPath = path.join(PROJECT_ROOT, change.file)

      // Create backup
      createBackup(fullPath)
      console.log(`   ├─ Created backup: ${change.file}.backup`)

      // Write new content
      fs.writeFileSync(fullPath, change.newContent, 'utf-8')
      console.log(`   ├─ Updated: ${change.file}`)
    }

    console.log('\n✅ Migration complete!')
    console.log('\n📋 Next steps:')
    console.log('   1. Run `npm run build` to verify changes')
    console.log('   2. Run `npm run dev` to test in development')
    console.log('   3. Review changes with `git diff`')
    console.log('   4. Delete .backup files if everything works')
    console.log('\n⚠️  If issues occur, restore from .backup files')
  } else {
    console.log('ℹ️  This is a dry run. No files were modified.')
    console.log('\n📋 To apply these changes, run:')
    console.log('   npm run migrate:lazy --apply')
  }
}

main().catch((error) => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
})
