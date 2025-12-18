/**
 * Environment Validator Utility
 *
 * Runtime validation of environment variables, especially for Supabase configuration.
 * Provides detailed diagnostics to help identify configuration issues in production.
 */

export interface EnvValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  diagnostics: {
    supabaseUrl: { configured: boolean; valid: boolean; value?: string }
    anonKey: { configured: boolean; valid: boolean; masked?: string }
    serviceRoleKey: { configured: boolean; valid: boolean; masked?: string; testPassed?: boolean }
  }
}

/**
 * Mask sensitive values for safe logging
 * Shows first 8 and last 4 characters
 */
function maskSensitiveValue(value: string | undefined): string | undefined {
  if (!value) return undefined
  if (value.length <= 12) return '***'
  return `${value.slice(0, 8)}...${value.slice(-4)}`
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && parsed.hostname.length > 0
  } catch {
    return false
  }
}

/**
 * Validate JWT format (Supabase keys are JWTs)
 */
function isValidJWT(token: string): boolean {
  // JWT format: header.payload.signature (three base64url parts separated by dots)
  const parts = token.split('.')
  if (parts.length !== 3) return false

  // Check if it starts with 'eyJ' which is the base64 encoding of '{"'
  return token.startsWith('eyJ')
}

/**
 * Validate Supabase URL format
 */
function isValidSupabaseUrl(url: string): boolean {
  if (!isValidUrl(url)) return false

  try {
    const parsed = new URL(url)
    // Supabase URLs typically end with .supabase.co or custom domains
    return (
      parsed.hostname.endsWith('.supabase.co') ||
      parsed.hostname.includes('supabase') ||
      // Allow custom domains
      parsed.hostname.length > 0
    )
  } catch {
    return false
  }
}

/**
 * Comprehensive environment variable validation for Supabase
 *
 * @returns Validation result with detailed diagnostics
 */
export function validateSupabaseEnv(): EnvValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check NEXT_PUBLIC_SUPABASE_URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseUrlConfigured = !!supabaseUrl
  const supabaseUrlValid = supabaseUrl ? isValidSupabaseUrl(supabaseUrl) : false

  if (!supabaseUrlConfigured) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is not configured')
  } else if (!supabaseUrlValid) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL has invalid format (expected https://...supabase.co)')
  }

  // Check NEXT_PUBLIC_SUPABASE_ANON_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const anonKeyConfigured = !!anonKey
  const anonKeyValid = anonKey ? isValidJWT(anonKey) : false

  if (!anonKeyConfigured) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured')
  } else if (!anonKeyValid) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY has invalid format (expected JWT starting with eyJ)')
  }

  // Check SUPABASE_SERVICE_ROLE_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const serviceRoleKeyConfigured = !!serviceRoleKey
  const serviceRoleKeyValid = serviceRoleKey ? isValidJWT(serviceRoleKey) : false

  if (!serviceRoleKeyConfigured) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is not configured')
  } else if (!serviceRoleKeyValid) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY has invalid format (expected JWT starting with eyJ)')
  } else if (serviceRoleKey === anonKey) {
    errors.push(
      'SUPABASE_SERVICE_ROLE_KEY appears to be the same as anon key (should be the service_role key)'
    )
  }

  // Warnings for additional checks
  if (supabaseUrl && !supabaseUrl.includes('.supabase.co')) {
    warnings.push(
      'NEXT_PUBLIC_SUPABASE_URL uses a custom domain. Ensure it points to your Supabase project.'
    )
  }

  if (serviceRoleKey && serviceRoleKey.length < 100) {
    warnings.push(
      'SUPABASE_SERVICE_ROLE_KEY seems unusually short. Verify it is the correct key from Supabase Dashboard > Settings > API.'
    )
  }

  const isValid = errors.length === 0

  return {
    isValid,
    errors,
    warnings,
    diagnostics: {
      supabaseUrl: {
        configured: supabaseUrlConfigured,
        valid: supabaseUrlValid,
        value: supabaseUrl, // Not sensitive, can show full value
      },
      anonKey: {
        configured: anonKeyConfigured,
        valid: anonKeyValid,
        masked: maskSensitiveValue(anonKey),
      },
      serviceRoleKey: {
        configured: serviceRoleKeyConfigured,
        valid: serviceRoleKeyValid,
        masked: maskSensitiveValue(serviceRoleKey),
      },
    },
  }
}

/**
 * Get safe diagnostic report for logging/display
 * All sensitive values are masked
 */
export function getEnvDiagnostics(): {
  timestamp: string
  environment: string
  validation: EnvValidationResult
} {
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    validation: validateSupabaseEnv(),
  }
}

/**
 * Validate service role key specifically
 * Used before creating admin client
 */
export function validateServiceRoleKey(): {
  isValid: boolean
  error?: string
  key?: { masked: string; format: string }
} {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    return {
      isValid: false,
      error: 'SUPABASE_SERVICE_ROLE_KEY environment variable is not set',
    }
  }

  if (!isValidJWT(serviceRoleKey)) {
    return {
      isValid: false,
      error:
        'SUPABASE_SERVICE_ROLE_KEY has invalid format. Expected JWT token starting with "eyJ"',
      key: {
        masked: maskSensitiveValue(serviceRoleKey) || '***',
        format: 'invalid',
      },
    }
  }

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (serviceRoleKey === anonKey) {
    return {
      isValid: false,
      error:
        'SUPABASE_SERVICE_ROLE_KEY is the same as NEXT_PUBLIC_SUPABASE_ANON_KEY. You must use the "service_role" key, not the "anon" key.',
      key: {
        masked: maskSensitiveValue(serviceRoleKey) || '***',
        format: 'anon_key',
      },
    }
  }

  return {
    isValid: true,
    key: {
      masked: maskSensitiveValue(serviceRoleKey) || '***',
      format: 'valid_jwt',
    },
  }
}

/**
 * Throw descriptive error if environment is invalid
 * Use this at the start of admin operations
 */
export function assertValidEnv(): void {
  const validation = validateSupabaseEnv()

  if (!validation.isValid) {
    const errorMessage = [
      'Environment validation failed:',
      ...validation.errors.map((e) => `  - ${e}`),
    ].join('\n')

    throw new Error(errorMessage)
  }

  if (validation.warnings.length > 0) {
    console.warn('Environment warnings:')
    validation.warnings.forEach((w) => console.warn(`  - ${w}`))
  }
}
