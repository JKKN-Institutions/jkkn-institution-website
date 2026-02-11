/**
 * Environment Validation Utilities for Scripts
 *
 * Prevents scripts from accidentally writing localhost URLs to production database
 * or using wrong institution configuration.
 */

import { validateSiteUrl } from '@/lib/utils/site-url'
import * as readline from 'readline'

/**
 * Require production-safe environment before running script
 * Validates that NEXT_PUBLIC_SITE_URL is not localhost
 *
 * @param scriptName - Name of the script being executed
 * @throws Process exits if validation fails and user doesn't confirm
 */
export async function requireProductionEnvironment(scriptName: string): Promise<void> {
  const validation = validateSiteUrl()

  if (!validation.isValid) {
    console.error(`\n❌ Environment validation failed for: ${scriptName}\n`)
    console.error('Issues found:')
    validation.warnings.forEach(w => console.error(`  ${w}`))
    console.error('')

    // Ask user if they want to continue anyway
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const answer = await new Promise<string>(resolve => {
      rl.question('⚠️  Continue anyway? This may corrupt database with localhost URLs. (yes/no): ', resolve)
    })

    rl.close()

    if (answer.toLowerCase() !== 'yes') {
      console.log('\n✅ Script execution cancelled to protect data integrity.\n')
      console.log('To fix this issue:')
      console.log('  1. Set NEXT_PUBLIC_SITE_URL in your .env.local file')
      console.log('  2. Use a valid production URL (e.g., https://engg.jkkn.ac.in)')
      console.log('  3. Or use institution switcher: npm run switch engineering\n')
      process.exit(0)
    }

    console.log('\n⚠️  Proceeding with invalid environment. BE CAREFUL!\n')
  } else {
    console.log(`✅ Environment validated: ${validation.url}`)
  }
}

/**
 * Require specific institution environment
 * Validates that NEXT_PUBLIC_INSTITUTION_ID matches expected value
 *
 * @param expectedInstitution - Expected institution ID (e.g., 'engineering', 'dental')
 * @param scriptName - Name of the script being executed
 * @throws Process exits if institution doesn't match
 */
export async function requireInstitution(expectedInstitution: string, scriptName: string): Promise<void> {
  const currentInstitution = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'

  if (currentInstitution !== expectedInstitution) {
    console.error(`\n❌ Wrong institution environment!\n`)
    console.error(`Script: ${scriptName}`)
    console.error(`Expected institution: ${expectedInstitution}`)
    console.error(`Current institution: ${currentInstitution}\n`)

    console.log('To switch institution, run:')
    console.log(`  npm run switch ${expectedInstitution}\n`)

    process.exit(1)
  }

  console.log(`✅ Institution validated: ${currentInstitution}`)
}

/**
 * Display environment summary for confirmation
 * Shows current institution, site URL, and Supabase project
 */
export function displayEnvironmentSummary(): void {
  console.log('\n📋 Current Environment:')
  console.log('  Institution:', process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main')
  console.log('  Site URL:', process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET')
  console.log('  Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].replace('https://', '') || 'NOT SET')
  console.log('')
}
