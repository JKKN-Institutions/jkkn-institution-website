/**
 * Error Logger Utility
 *
 * Provides comprehensive error logging with correlation IDs, error classification,
 * and safe serialization for production debugging.
 */

import { logActivity } from './activity-logger'

export enum UserCreationErrorCode {
  ENV_MISSING = 'ENV_MISSING',
  ENV_INVALID = 'ENV_INVALID',
  AUTH_FAILED = 'AUTH_FAILED',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  TRIGGER_FAILED = 'TRIGGER_FAILED',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNKNOWN = 'UNKNOWN',
}

export interface LoggedError {
  correlationId: string
  timestamp: string
  operation: string
  errorCode: UserCreationErrorCode
  errorMessage: string
  errorDetails: {
    name?: string
    status?: number
    hint?: string
    details?: string
    code?: string
  }
  context: Record<string, unknown>
  stackTrace?: string
}

/**
 * Safely serialize error object, avoiding circular references
 */
export function serializeError(error: unknown): Record<string, unknown> {
  if (!error) {
    return { message: 'Unknown error' }
  }

  if (typeof error === 'string') {
    return { message: error }
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      // Extract additional properties from Supabase errors
      ...(error as any).status && { status: (error as any).status },
      ...(error as any).code && { code: (error as any).code },
      ...(error as any).hint && { hint: (error as any).hint },
      ...(error as any).details && { details: (error as any).details },
    }
  }

  // For objects, safely extract common error properties
  if (typeof error === 'object') {
    const obj = error as Record<string, unknown>
    return {
      message: obj.message || 'Unknown error',
      name: obj.name,
      status: obj.status,
      code: obj.code,
      hint: obj.hint,
      details: obj.details,
    }
  }

  return { message: String(error) }
}

/**
 * Classify Supabase error into actionable error code
 */
export function getErrorCode(error: unknown): UserCreationErrorCode {
  if (!error) {
    return UserCreationErrorCode.UNKNOWN
  }

  const serialized = serializeError(error)
  const message = String(serialized.message).toLowerCase()
  const code = String(serialized.code || '').toLowerCase()
  const status = serialized.status as number | undefined

  // Check for specific error patterns
  if (message.includes('email') && message.includes('already')) {
    return UserCreationErrorCode.DUPLICATE_EMAIL
  }

  if (message.includes('rate limit') || status === 429) {
    return UserCreationErrorCode.RATE_LIMIT
  }

  if (message.includes('permission') || message.includes('unauthorized') || status === 403) {
    return UserCreationErrorCode.PERMISSION_DENIED
  }

  if (message.includes('network') || message.includes('timeout') || message.includes('econnrefused')) {
    return UserCreationErrorCode.NETWORK_ERROR
  }

  if (message.includes('trigger') || message.includes('profile') || message.includes('member')) {
    return UserCreationErrorCode.TRIGGER_FAILED
  }

  if (message.includes('role') && message.includes('not found')) {
    return UserCreationErrorCode.ROLE_NOT_FOUND
  }

  if (message.includes('auth') || code.includes('auth')) {
    return UserCreationErrorCode.AUTH_FAILED
  }

  if (message.includes('environment') || message.includes('env')) {
    return UserCreationErrorCode.ENV_MISSING
  }

  if (message.includes('invalid') && (message.includes('key') || message.includes('token'))) {
    return UserCreationErrorCode.ENV_INVALID
  }

  return UserCreationErrorCode.UNKNOWN
}

/**
 * Get user-friendly, actionable error message based on error code
 */
export function getActionableMessage(errorCode: UserCreationErrorCode): string {
  const messages: Record<UserCreationErrorCode, string> = {
    [UserCreationErrorCode.ENV_MISSING]:
      'System misconfiguration detected. Environment variables are not properly configured. Please contact your administrator.',
    [UserCreationErrorCode.ENV_INVALID]:
      'Invalid system configuration. The service role key format is incorrect. Please contact your administrator.',
    [UserCreationErrorCode.AUTH_FAILED]:
      'Failed to create authentication account. This may be due to email restrictions, API limits, or configuration issues. Please try again or contact your administrator.',
    [UserCreationErrorCode.DUPLICATE_EMAIL]:
      'A user with this email address already exists. Please use a different email address.',
    [UserCreationErrorCode.TRIGGER_FAILED]:
      'User account created but profile setup failed. Database triggers may be misconfigured. Please contact your administrator.',
    [UserCreationErrorCode.ROLE_NOT_FOUND]:
      'System configuration error: Default user role not found. Please contact your administrator to seed the database.',
    [UserCreationErrorCode.NETWORK_ERROR]:
      'Network error occurred while connecting to the authentication service. Please check your internet connection and try again.',
    [UserCreationErrorCode.RATE_LIMIT]:
      'Too many user creation requests. Please wait a few minutes and try again.',
    [UserCreationErrorCode.PERMISSION_DENIED]:
      'Permission denied. You do not have the required permissions to create users, or the service role key lacks necessary permissions.',
    [UserCreationErrorCode.UNKNOWN]:
      'An unexpected error occurred while creating the user. Please try again or contact your administrator.',
  }

  return messages[errorCode]
}

/**
 * Get troubleshooting hint based on error code
 */
export function getTroubleshootingHint(errorCode: UserCreationErrorCode): string {
  const hints: Record<UserCreationErrorCode, string> = {
    [UserCreationErrorCode.ENV_MISSING]:
      'Administrator: Check that SUPABASE_SERVICE_ROLE_KEY is configured in your deployment platform (e.g., Vercel environment variables).',
    [UserCreationErrorCode.ENV_INVALID]:
      'Administrator: Verify the SUPABASE_SERVICE_ROLE_KEY is the correct "service_role" key from Supabase Dashboard > Settings > API. It should start with "eyJ".',
    [UserCreationErrorCode.AUTH_FAILED]:
      'Administrator: Check Supabase Dashboard > Authentication > Providers for email provider configuration and domain restrictions.',
    [UserCreationErrorCode.DUPLICATE_EMAIL]:
      'Try using a different email address, or check if the user already exists in the system.',
    [UserCreationErrorCode.TRIGGER_FAILED]:
      'Administrator: Verify the handle_new_user() trigger is active and the guest role exists in the database.',
    [UserCreationErrorCode.ROLE_NOT_FOUND]:
      'Administrator: Run the seed migration to create default roles, or manually insert the guest role into the roles table.',
    [UserCreationErrorCode.NETWORK_ERROR]:
      'Check your internet connection. If the problem persists, there may be an issue with the Supabase service.',
    [UserCreationErrorCode.RATE_LIMIT]:
      'Wait 5-10 minutes before trying again. If you need to create multiple users, consider bulk import functionality.',
    [UserCreationErrorCode.PERMISSION_DENIED]:
      'Administrator: Verify the service role key has admin permissions and your user account has the users:profiles:create permission.',
    [UserCreationErrorCode.UNKNOWN]:
      'Check the detailed error message and correlation ID. Contact support with this information.',
  }

  return hints[errorCode]
}

/**
 * Comprehensive error logging with correlation ID and activity tracking
 *
 * @param error - The error object to log
 * @param operation - The operation that failed (e.g., 'create_auth_user')
 * @param context - Additional context for debugging (e.g., email, userId)
 * @returns LoggedError object with correlation ID
 */
export async function logError(
  error: unknown,
  operation: string,
  context: Record<string, unknown> = {}
): Promise<LoggedError> {
  const correlationId = crypto.randomUUID()
  const timestamp = new Date().toISOString()
  const serialized = serializeError(error)
  const errorCode = getErrorCode(error)

  const loggedError: LoggedError = {
    correlationId,
    timestamp,
    operation,
    errorCode,
    errorMessage: String(serialized.message || 'Unknown error'),
    errorDetails: {
      name: serialized.name as string | undefined,
      status: serialized.status as number | undefined,
      hint: serialized.hint as string | undefined,
      details: serialized.details as string | undefined,
      code: serialized.code as string | undefined,
    },
    context,
    stackTrace: serialized.stack as string | undefined,
  }

  // Log to console in development, structured logging in production
  if (process.env.NODE_ENV === 'development') {
    console.error('=== ERROR LOGGED ===')
    console.error('Correlation ID:', correlationId)
    console.error('Operation:', operation)
    console.error('Error Code:', errorCode)
    console.error('Message:', loggedError.errorMessage)
    console.error('Details:', loggedError.errorDetails)
    console.error('Context:', context)
    if (loggedError.stackTrace) {
      console.error('Stack:', loggedError.stackTrace)
    }
    console.error('===================')
  } else {
    // In production, use structured JSON logging for better log aggregation
    console.error(
      JSON.stringify({
        type: 'error',
        correlationId,
        timestamp,
        operation,
        errorCode,
        message: loggedError.errorMessage,
        details: loggedError.errorDetails,
        context,
      })
    )
  }

  // Log to activity system if userId is provided
  if (context.userId) {
    try {
      await logActivity({
        userId: context.userId as string,
        action: 'error',
        module: 'system',
        resourceType: operation,
        resourceId: correlationId,
        metadata: {
          errorCode,
          errorMessage: loggedError.errorMessage,
          context,
        },
      })
    } catch (activityLogError) {
      // Don't let activity logging failure affect error logging
      console.error('Failed to log error to activity system:', activityLogError)
    }
  }

  return loggedError
}

/**
 * Log error specifically for user creation failures
 * Convenience wrapper with appropriate context
 */
export async function logUserCreationError(
  error: unknown,
  operation: string,
  email: string,
  userId?: string
): Promise<LoggedError> {
  return logError(error, operation, {
    email,
    userId,
    timestamp: new Date().toISOString(),
  })
}
