'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
        <p className="text-gray-600 mb-6">
          Something went wrong during sign-in. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
          >
            Try again
          </button>
          <Link
            href="/auth/login"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
