#!/usr/bin/env tsx
/**
 * Automated Gold Color Accessibility Fix
 *
 * This script updates all hardcoded #D4AF37 gold color instances
 * to use accessible CSS variables that meet WCAG AA/AAA standards.
 *
 * Usage: npx tsx scripts/fix-gold-contrast.ts
 */

import fs from 'fs/promises'
import path from 'path'

interface FixRule {
  find: RegExp
  replace: string
  description: string
}

// Color replacement rules
const rules: FixRule[] = [
  // Component registry accentColor defaults
  {
    find: /accentColor:\s*['"]#D4AF37['"]/g,
    replace: "accentColor: 'var(--gold-on-light)'",
    description: 'Component accentColor → accessible text gold'
  },
  // Schema default accentColor
  {
    find: /(accentColor.*?default\(['"])#D4AF37(['"]\))/g,
    replace: "$1var(--gold-on-light)$2",
    description: 'Schema accentColor default → accessible text gold'
  },
  // Label/header colors (likely text)
  {
    find: /(labelColor|headerColor|titleAccentColor):\s*z\.string\(\)\.default\(['"]#D4AF37['"]\)/g,
    replace: "$1: z.string().default('var(--gold-on-light)')",
    description: 'Label/header colors → accessible text gold'
  },
  // Active/accent colors in components (decorative use)
  {
    find: /(activeColor|borderColor):\s*['"]#D4AF37['"]/g,
    replace: "$1: 'var(--gold-decorative)'",
    description: 'Active/border colors → decorative gold'
  },
]

async function fixFile(filePath: string): Promise<number> {
  let content = await fs.readFile(filePath, 'utf-8')
  const original = content
  let changes = 0

  for (const rule of rules) {
    const matches = content.match(rule.find)
    if (matches) {
      content = content.replace(rule.find, rule.replace)
      changes += matches.length
      console.log(`  ✓ ${rule.description}: ${matches.length} instances`)
    }
  }

  if (changes > 0) {
    await fs.writeFile(filePath, content)
  }

  return changes
}

async function getAllFiles(dir: string, extension: string): Promise<string[]> {
  const files: string[] = []

  async function walk(currentPath: string) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name)

      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath)
      }
    }
  }

  await walk(dir)
  return files
}

async function main() {
  console.log('🎨 Fixing gold color contrast violations...\n')

  const searchDirs = [
    path.join(process.cwd(), 'lib', 'cms'),
  ]

  let totalChanges = 0
  let filesChanged = 0

  for (const dir of searchDirs) {
    try {
      const tsFiles = await getAllFiles(dir, '.ts')
      const tsxFiles = await getAllFiles(dir, '.tsx')
      const allFiles = [...tsFiles, ...tsxFiles]

      for (const file of allFiles) {
        const changes = await fixFile(file)
        if (changes > 0) {
          console.log(`\n📝 ${path.relative(process.cwd(), file)}`)
          totalChanges += changes
          filesChanged++
        }
      }
    } catch (error) {
      console.error(`Error processing ${dir}:`, error)
    }
  }

  console.log(`\n✅ Complete: ${totalChanges} changes across ${filesChanged} files`)

  if (totalChanges > 0) {
    console.log('\n⚠️  Next steps:')
    console.log('   1. Review changes with: git diff')
    console.log('   2. Fix critical components manually (education-videos.tsx)')
    console.log('   3. Run: npm run test:contrast')
    console.log('   4. Test visually in the browser')
  }
}

main().catch(console.error)
