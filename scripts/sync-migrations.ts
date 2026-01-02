#!/usr/bin/env npx tsx
/**
 * Migration Sync Utility
 *
 * This script synchronizes database migrations across all institution Supabase projects.
 * It reads migrations from supabase/migrations/ and applies them to each project.
 *
 * Usage:
 *   npx tsx scripts/sync-migrations.ts                    # Apply to all institutions
 *   npx tsx scripts/sync-migrations.ts --institution=dental  # Apply to specific institution
 *   npx tsx scripts/sync-migrations.ts --dry-run          # Preview without applying
 *   npx tsx scripts/sync-migrations.ts --from=006         # Apply from specific migration
 *
 * Environment:
 *   Requires a .env.institutions file with Supabase credentials for each institution:
 *
 *   SUPABASE_MAIN_URL=https://xxx.supabase.co
 *   SUPABASE_MAIN_SERVICE_KEY=eyJhbGc...
 *   SUPABASE_ARTS_URL=https://yyy.supabase.co
 *   SUPABASE_ARTS_SERVICE_KEY=eyJhbGc...
 *   ...
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// =============================================================================
// CONFIGU@RATION
// =============================================================================

interface InstitutionSupabaseConfig {
  id: string
  name: string
  url: string
  serviceKey: string
}

// Load environment variables from .env.institutions
config({ path: '.env.institutions' })

// Institution Supabase configurations
// These are loaded from environment variables
const INSTITUTION_CONFIGS: InstitutionSupabaseConfig[] = [
  {
    id: 'main',
    name: 'JKKN Main',
    url: process.env.SUPABASE_MAIN_URL || '',
    serviceKey: process.env.SUPABASE_MAIN_SERVICE_KEY || '',
  },
  {
    id: 'arts-science',
    name: 'JKKN Arts & Science',
    url: process.env.SUPABASE_ARTS_URL || '',
    serviceKey: process.env.SUPABASE_ARTS_SERVICE_KEY || '',
  },
  {
    id: 'engineering',
    name: 'JKKN Engineering',
    url: process.env.SUPABASE_ENGINEERING_URL || '',
    serviceKey: process.env.SUPABASE_ENGINEERING_SERVICE_KEY || '',
  },
  {
    id: 'dental',
    name: 'JKKN Dental',
    url: process.env.SUPABASE_DENTAL_URL || '',
    serviceKey: process.env.SUPABASE_DENTAL_SERVICE_KEY || '',
  },
  {
    id: 'pharmacy',
    name: 'JKKN Pharmacy',
    url: process.env.SUPABASE_PHARMACY_URL || '',
    serviceKey: process.env.SUPABASE_PHARMACY_SERVICE_KEY || '',
  },
  {
    id: 'nursing',
    name: 'JKKN Nursing',
    url: process.env.SUPABASE_NURSING_URL || '',
    serviceKey: process.env.SUPABASE_NURSING_SERVICE_KEY || '',
  },
].filter(config => config.url && config.serviceKey)

// =============================================================================
// TYPES
// =============================================================================

interface MigrationFile {
  version: string
  name: string
  path: string
  content: string
}

interface MigrationResult {
  institution: string
  migration: string
  success: boolean
  error?: string
  duration: number
}

interface ParsedArgs {
  institution?: string
  dryRun: boolean
  from?: string
  verbose: boolean
}

// =============================================================================
// UTILITIES
// =============================================================================

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2)
  const parsed: ParsedArgs = {
    dryRun: false,
    verbose: false,
  }

  for (const arg of args) {
    if (arg.startsWith('--institution=')) {
      parsed.institution = arg.split('=')[1]
    } else if (arg === '--dry-run') {
      parsed.dryRun = true
    } else if (arg.startsWith('--from=')) {
      parsed.from = arg.split('=')[1]
    } else if (arg === '--verbose' || arg === '-v') {
      parsed.verbose = true
    }
  }

  return parsed
}

function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  const colors = {
    info: '\x1b[36m',     // Cyan
    success: '\x1b[32m',  // Green
    error: '\x1b[31m',    // Red
    warning: '\x1b[33m',  // Yellow
  }
  const reset = '\x1b[0m'
  const icons = {
    info: 'i',
    success: '✓',
    error: '✗',
    warning: '!',
  }

  console.log(`${colors[type]}[${icons[type]}]${reset} ${message}`)
}

// =============================================================================
// MIGRATION DISCOVERY
// =============================================================================

function getMigrationFiles(fromVersion?: string): MigrationFile[] {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')

  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found: ${migrationsDir}`)
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  const migrations: MigrationFile[] = []

  for (const file of files) {
    const match = file.match(/^(\d+)_(.+)\.sql$/)
    if (!match) continue

    const [, version, name] = match

    // Skip if before the specified version
    if (fromVersion && version < fromVersion) continue

    const filePath = path.join(migrationsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    migrations.push({
      version,
      name,
      path: filePath,
      content,
    })
  }

  return migrations
}

// =============================================================================
// DATABASE OPERATIONS
// =============================================================================

async function getAppliedMigrations(supabase: SupabaseClient): Promise<string[]> {
  // Check if migrations table exists
  const { data: tableExists } = await supabase
    .from('schema_migrations')
    .select('version')
    .limit(1)

  if (!tableExists) {
    // Create migrations tracking table if it doesn't exist
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS schema_migrations (
            version VARCHAR(14) PRIMARY KEY,
            applied_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })
    } catch {
      // Table might not exist and rpc might fail, that's ok
    }

    return []
  }

  const { data, error } = await supabase
    .from('schema_migrations')
    .select('version')
    .order('version', { ascending: true })

  if (error) {
    // Table doesn't exist yet
    return []
  }

  return (data || []).map(row => row.version)
}

async function applyMigration(
  supabase: SupabaseClient,
  migration: MigrationFile,
  dryRun: boolean
): Promise<{ success: boolean; error?: string }> {
  if (dryRun) {
    log(`  [DRY-RUN] Would apply: ${migration.version}_${migration.name}`, 'info')
    return { success: true }
  }

  try {
    // Execute the migration SQL
    // Note: Supabase doesn't have a direct SQL execution method via the client
    // In production, you'd use the Supabase CLI or management API
    // For now, we'll use a database function if available

    const { error: execError } = await supabase.rpc('exec_sql', {
      sql: migration.content
    })

    if (execError) {
      // Try direct execution via REST (requires service key)
      const response = await fetch(`${supabase['supabaseUrl']}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase['supabaseKey']}`,
          'apikey': supabase['supabaseKey'],
        },
        body: JSON.stringify({ sql: migration.content }),
      })

      if (!response.ok) {
        throw new Error(`Failed to execute SQL: ${await response.text()}`)
      }
    }

    // Record the migration
    await supabase
      .from('schema_migrations')
      .insert({ version: migration.version })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// =============================================================================
// MAIN SYNC LOGIC
// =============================================================================

async function syncInstitution(
  config: InstitutionSupabaseConfig,
  migrations: MigrationFile[],
  dryRun: boolean,
  verbose: boolean
): Promise<MigrationResult[]> {
  const results: MigrationResult[] = []

  log(`\nProcessing: ${config.name} (${config.id})`, 'info')

  const supabase = createClient(config.url, config.serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  // Get already applied migrations
  const appliedVersions = await getAppliedMigrations(supabase)

  if (verbose) {
    log(`  Applied migrations: ${appliedVersions.length}`, 'info')
  }

  // Filter to only pending migrations
  const pendingMigrations = migrations.filter(m => !appliedVersions.includes(m.version))

  if (pendingMigrations.length === 0) {
    log(`  No pending migrations`, 'success')
    return results
  }

  log(`  Pending migrations: ${pendingMigrations.length}`, 'info')

  // Apply each migration
  for (const migration of pendingMigrations) {
    const startTime = Date.now()

    if (verbose) {
      log(`  Applying: ${migration.version}_${migration.name}`, 'info')
    }

    const { success, error } = await applyMigration(supabase, migration, dryRun)
    const duration = Date.now() - startTime

    results.push({
      institution: config.id,
      migration: `${migration.version}_${migration.name}`,
      success,
      error,
      duration,
    })

    if (success) {
      log(`  ${dryRun ? '[DRY-RUN] ' : ''}${migration.version}_${migration.name} (${duration}ms)`, 'success')
    } else {
      log(`  Failed: ${migration.version}_${migration.name}: ${error}`, 'error')
      // Stop on first error for this institution
      break
    }
  }

  return results
}

async function main() {
  console.log('\n========================================')
  console.log('  JKKN Migration Sync Utility')
  console.log('========================================\n')

  const args = parseArgs()

  if (INSTITUTION_CONFIGS.length === 0) {
    log('No institution configurations found. Create .env.institutions file.', 'error')
    log('Required format:', 'info')
    log('  SUPABASE_MAIN_URL=https://xxx.supabase.co', 'info')
    log('  SUPABASE_MAIN_SERVICE_KEY=eyJhbGc...', 'info')
    process.exit(1)
  }

  // Get migrations
  const migrations = getMigrationFiles(args.from)
  log(`Found ${migrations.length} migration(s)`, 'info')

  if (migrations.length === 0) {
    log('No migrations to apply', 'success')
    return
  }

  if (args.verbose) {
    migrations.forEach(m => log(`  - ${m.version}_${m.name}`, 'info'))
  }

  // Filter institutions if specified
  let configs = INSTITUTION_CONFIGS
  if (args.institution) {
    configs = configs.filter(c => c.id === args.institution)
    if (configs.length === 0) {
      log(`Institution not found: ${args.institution}`, 'error')
      log(`Available: ${INSTITUTION_CONFIGS.map(c => c.id).join(', ')}`, 'info')
      process.exit(1)
    }
  }

  log(`Target institutions: ${configs.map(c => c.id).join(', ')}`, 'info')

  if (args.dryRun) {
    log('\n[DRY-RUN MODE] No changes will be made\n', 'warning')
  }

  // Process each institution
  const allResults: MigrationResult[] = []

  for (const config of configs) {
    const results = await syncInstitution(config, migrations, args.dryRun, args.verbose)
    allResults.push(...results)
  }

  // Summary
  console.log('\n========================================')
  console.log('  Summary')
  console.log('========================================\n')

  const successful = allResults.filter(r => r.success)
  const failed = allResults.filter(r => !r.success)

  log(`Total migrations applied: ${successful.length}`, 'success')

  if (failed.length > 0) {
    log(`Failed migrations: ${failed.length}`, 'error')
    failed.forEach(r => {
      log(`  - ${r.institution}: ${r.migration}`, 'error')
      if (r.error) {
        log(`    Error: ${r.error}`, 'error')
      }
    })
  }

  if (args.dryRun) {
    log('\n[DRY-RUN] No changes were made. Remove --dry-run to apply.', 'warning')
  }

  process.exit(failed.length > 0 ? 1 : 0)
}

// Run
main().catch(error => {
  log(`Fatal error: ${error.message}`, 'error')
  process.exit(1)
})
