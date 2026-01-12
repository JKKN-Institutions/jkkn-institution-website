#!/usr/bin/env tsx
/**
 * Baseline Performance Metrics Capture
 *
 * Captures current bundle sizes and performance metrics before optimization.
 * Run this script to establish a baseline for comparison.
 *
 * Usage: npx tsx scripts/capture-baseline-metrics.ts
 */

import { execSync } from 'child_process'
import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

interface BundleMetrics {
  timestamp: string
  nextVersion: string
  bundles: {
    name: string
    size: number
    sizeKB: number
    sizeMB: number
  }[]
  totalSize: {
    bytes: number
    KB: number
    MB: number
  }
}

function getBundleSize(filePath: string): number {
  try {
    return statSync(filePath).size
  } catch {
    return 0
  }
}

function formatBytes(bytes: number): { KB: number; MB: number } {
  return {
    KB: Math.round(bytes / 1024),
    MB: Math.round((bytes / 1024 / 1024) * 100) / 100
  }
}

function captureBundleMetrics(): BundleMetrics {
  console.log('📊 Capturing baseline performance metrics...\n')

  const buildDir = join(process.cwd(), '.next')

  if (!existsSync(buildDir)) {
    console.log('⚠️  No .next directory found. Running production build first...\n')
    execSync('npm run build', { stdio: 'inherit' })
  }

  const staticDir = join(buildDir, 'static', 'chunks')

  if (!existsSync(staticDir)) {
    console.error('❌ Build directory not found. Please run npm run build first.')
    process.exit(1)
  }

  const bundles: BundleMetrics['bundles'] = []
  let totalSize = 0

  // Read all .js files in chunks directory
  const files = readdirSync(staticDir)

  files.forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = join(staticDir, file)
      const size = getBundleSize(filePath)
      const formatted = formatBytes(size)

      bundles.push({
        name: file,
        size: size,
        sizeKB: formatted.KB,
        sizeMB: formatted.MB
      })

      totalSize += size
    }
  })

  // Sort by size (largest first)
  bundles.sort((a, b) => b.size - a.size)

  // Get Next.js version
  const packageJson = require('../package.json')
  const nextVersion = packageJson.dependencies.next

  const metrics: BundleMetrics = {
    timestamp: new Date().toISOString(),
    nextVersion,
    bundles,
    totalSize: {
      bytes: totalSize,
      ...formatBytes(totalSize)
    }
  }

  return metrics
}

function displayMetrics(metrics: BundleMetrics) {
  console.log('=' .repeat(70))
  console.log('📊 BASELINE PERFORMANCE METRICS')
  console.log('='.repeat(70))
  console.log(`⏰ Captured: ${new Date(metrics.timestamp).toLocaleString()}`)
  console.log(`📦 Next.js Version: ${metrics.nextVersion}`)
  console.log(`💾 Total Bundle Size: ${metrics.totalSize.MB} MB (${metrics.totalSize.KB} KB)`)
  console.log('='.repeat(70))
  console.log('\n📦 Top 10 Largest Bundles:\n')

  metrics.bundles.slice(0, 10).forEach((bundle, index) => {
    const size = bundle.sizeMB >= 0.1 ? `${bundle.sizeMB} MB` : `${bundle.sizeKB} KB`
    console.log(`${(index + 1).toString().padStart(2)}. ${bundle.name.padEnd(50)} ${size.padStart(10)}`)
  })

  console.log('\n' + '='.repeat(70))
  console.log(`📁 Total Chunks: ${metrics.bundles.length}`)
  console.log('='.repeat(70))
}

function saveMetrics(metrics: BundleMetrics) {
  const metricsDir = join(process.cwd(), 'metrics')

  if (!existsSync(metricsDir)) {
    mkdirSync(metricsDir, { recursive: true })
  }

  const filename = `baseline-${Date.now()}.json`
  const filepath = join(metricsDir, filename)

  writeFileSync(filepath, JSON.stringify(metrics, null, 2))

  // Also save as baseline-latest.json for easy comparison
  writeFileSync(join(metricsDir, 'baseline-latest.json'), JSON.stringify(metrics, null, 2))

  console.log(`\n💾 Metrics saved to: ${filepath}`)
  console.log(`💾 Latest baseline: metrics/baseline-latest.json`)
}

function generateReport(metrics: BundleMetrics) {
  const report = `
# Baseline Performance Metrics

**Captured:** ${new Date(metrics.timestamp).toLocaleString()}
**Next.js Version:** ${metrics.nextVersion}
**Total Bundle Size:** ${metrics.totalSize.MB} MB (${metrics.totalSize.KB} KB)

## Bundle Analysis

### Top 10 Largest Bundles

| Rank | Bundle Name | Size (MB) | Size (KB) |
|------|-------------|-----------|-----------|
${metrics.bundles.slice(0, 10).map((bundle, index) =>
  `| ${index + 1} | ${bundle.name} | ${bundle.sizeMB} | ${bundle.sizeKB} |`
).join('\n')}

### Summary Statistics

- **Total Chunks:** ${metrics.bundles.length}
- **Largest Bundle:** ${metrics.bundles[0].name} (${metrics.bundles[0].sizeMB} MB)
- **Smallest Bundle:** ${metrics.bundles[metrics.bundles.length - 1].name} (${metrics.bundles[metrics.bundles.length - 1].sizeKB} KB)
- **Average Bundle Size:** ${Math.round(metrics.totalSize.bytes / metrics.bundles.length / 1024)} KB

## Performance Targets (After Optimization)

Based on the analysis, we expect the following improvements:

- **LCP Improvement:** 40-60% faster (target: < 2.5s)
- **TTFB Improvement:** 50-70% faster (target: < 600ms)
- **Bundle Size Reduction:** 60-75% for public routes
- **Database Query Reduction:** 70% fewer queries

## Next Steps

1. **Phase 2:** Database Optimization (indexes + functions)
2. **Phase 3:** Next.js 16 Cache Components Migration
3. **Phase 4:** Code Splitting & Bundle Optimization
4. **Phase 5:** Verification & Monitoring

---

*Generated by: scripts/capture-baseline-metrics.ts*
`

  const reportPath = join(process.cwd(), 'metrics', 'BASELINE-REPORT.md')
  writeFileSync(reportPath, report)

  console.log(`📄 Report generated: metrics/BASELINE-REPORT.md\n`)
}

// Main execution
try {
  const metrics = captureBundleMetrics()
  displayMetrics(metrics)
  saveMetrics(metrics)
  generateReport(metrics)

  console.log('\n✅ Baseline metrics captured successfully!')
  console.log('💡 Tip: Run "npm run analyze" to visualize the bundle breakdown\n')
} catch (error) {
  console.error('\n❌ Error capturing metrics:', error)
  process.exit(1)
}
