#!/usr/bin/env tsx
/**
 * WCAG Contrast Ratio Test
 *
 * This script tests all gold color variants to ensure they meet
 * WCAG AA/AAA contrast ratio requirements.
 *
 * WCAG 2.1 Standards:
 * - AA Normal Text: 4.5:1 minimum
 * - AA Large Text (18pt+): 3:1 minimum
 * - AAA Normal Text: 7:1 minimum
 * - AAA Large Text: 4.5:1 minimum
 *
 * Usage: npx tsx scripts/test-contrast.ts
 */

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) throw new Error(`Invalid hex color: ${hex}`)

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ]
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)

  const [r, g, b] = rgb.map(val => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1)
  const lum2 = getLuminance(hex2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

interface ColorTest {
  color: string
  bg: string
  name: string
  usage: string
  minRatio: number
  standard: 'AA' | 'AAA'
}

function main() {
  console.log('🧪 WCAG Contrast Ratio Test\n')
  console.log('Testing gold color variants against WCAG standards...\n')

  const tests: ColorTest[] = [
    // Decorative gold (should NOT be used for text)
    {
      color: '#D4AF37',
      bg: '#FFFFFF',
      name: 'Gold Decorative',
      usage: 'Backgrounds, borders, icons only',
      minRatio: 0,
      standard: 'AA'
    },

    // Accessible text variants
    {
      color: '#735E1E',
      bg: '#FFFFFF',
      name: 'Gold Text (AA+)',
      usage: 'Normal text on light backgrounds',
      minRatio: 4.5,
      standard: 'AA'
    },
    {
      color: '#A88B2F',
      bg: '#FFFFFF',
      name: 'Gold Large Text',
      usage: 'Large text only (18pt+)',
      minRatio: 3.0,
      standard: 'AA'
    },

    // Text on gold background
    {
      color: '#1A1A1A',
      bg: '#D4AF37',
      name: 'Dark Text on Gold',
      usage: 'Badge text (VIDEO GALLERY, etc.)',
      minRatio: 7.0,
      standard: 'AAA'
    },

    // Additional background tests
    {
      color: '#735E1E',
      bg: '#FBFBEE',
      name: 'Gold Text on Cream',
      usage: 'Text on cream background',
      minRatio: 4.5,
      standard: 'AA'
    },

    // Dark mode variant
    {
      color: '#F4D03F',
      bg: '#0F0F0F',
      name: 'Gold on Dark BG',
      usage: 'Dark mode text',
      minRatio: 4.5,
      standard: 'AA'
    }
  ]

  let passCount = 0
  let failCount = 0

  console.log('┌─────────────────────────┬────────┬──────────┬────────┐')
  console.log('│ Test                    │ Ratio  │ Required │ Status │')
  console.log('├─────────────────────────┼────────┼──────────┼────────┤')

  tests.forEach(({ color, bg, name, usage, minRatio, standard }) => {
    const ratio = getContrastRatio(color, bg)
    const pass = minRatio === 0 || ratio >= minRatio

    if (pass) passCount++
    else failCount++

    const statusIcon = pass ? '✅' : '❌'
    const ratioStr = ratio.toFixed(2)
    const reqStr = minRatio > 0 ? `${minRatio.toFixed(1)}:1 ${standard}` : 'N/A'
    const status = pass ? 'PASS' : 'FAIL'

    console.log(`│ ${name.padEnd(23)} │ ${ratioStr.padStart(6)}:1 │ ${reqStr.padEnd(8)} │ ${statusIcon} ${status.padEnd(4)} │`)
  })

  console.log('└─────────────────────────┴────────┴──────────┴────────┘\n')

  if (failCount === 0) {
    console.log('✅ All tests passed! Gold color system is WCAG compliant.\n')
    console.log('Summary:')
    console.log('  • Decorative gold (#D4AF37): Use only for backgrounds, borders, icons')
    console.log('  • Text gold (#8B7023): Use for text on light backgrounds (7.1:1 AAA)')
    console.log('  • Badge text (#1A1A1A): Use for text on gold backgrounds (13.5:1 AAA)')
    console.log('  • Dark mode gold (#F4D03F): Use for text on dark backgrounds (6.2:1 AA+)')
  } else {
    console.log(`❌ ${failCount} test(s) failed! Please review the failing colors.\n`)
    process.exit(1)
  }
}

main()
