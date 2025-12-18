import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { validateServiceRoleKey, validateSupabaseEnv } from '@/lib/utils/env-validator'
import { logError } from '@/lib/utils/error-logger'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

/**
 * Create a Supabase client with admin privileges using service role key
 * Use this only for server-side admin operations (user creation, etc.)
 * NEVER expose this to the client
 *
 * @throws Error if environment variables are misconfigured
 */
export async function createAdminSupabaseClient() {
  // STEP 1: Validate complete environment
  const envValidation = validateSupabaseEnv()

  if (!envValidation.isValid) {
    const error = new Error(
      `Admin client misconfigured: ${envValidation.errors.join(', ')}`
    )

    // Log the error with diagnostics
    await logError(error, 'create_admin_client', {
      validation: envValidation,
      diagnostics: envValidation.diagnostics,
    })

    throw error
  }

  // STEP 2: Validate service role key specifically
  const serviceKeyValidation = validateServiceRoleKey()

  if (!serviceKeyValidation.isValid) {
    const error = new Error(serviceKeyValidation.error || 'Invalid service role key')

    await logError(error, 'validate_service_role_key', {
      keyInfo: serviceKeyValidation.key,
    })

    throw error
  }

  // Log warnings if any
  if (envValidation.warnings.length > 0) {
    console.warn('Environment warnings detected:')
    envValidation.warnings.forEach((w) => console.warn(`  - ${w}`))
  }

  // STEP 3: Create admin client
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}

/**
 * Test admin client connectivity and permissions
 * Returns success/failure with error details
 */
export async function testAdminClient(): Promise<{
  success: boolean
  error?: string
  details?: Record<string, unknown>
}> {
  try {
    // First validate environment
    const envValidation = validateSupabaseEnv()

    if (!envValidation.isValid) {
      return {
        success: false,
        error: `Environment validation failed: ${envValidation.errors.join(', ')}`,
        details: {
          validation: envValidation,
        },
      }
    }

    // Try to create admin client
    const admin = await createAdminSupabaseClient()

    // Test with a simple query that requires service role permissions
    const { data, error } = await admin.from('roles').select('id').limit(1)

    if (error) {
      return {
        success: false,
        error: error.message,
        details: {
          errorCode: error.code,
          errorHint: error.hint,
          errorDetails: error.details,
        },
      }
    }

    return {
      success: true,
      details: {
        message: 'Admin client is working correctly',
        testedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return {
      success: false,
      error: errorMessage,
      details: {
        caught: true,
        errorType: error instanceof Error ? error.name : typeof error,
      },
    }
  }
}
