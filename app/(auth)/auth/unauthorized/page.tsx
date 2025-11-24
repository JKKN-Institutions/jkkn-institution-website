'use client'

import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-6 p-4 bg-amber-50 rounded-full">
        <AlertTriangle className="h-12 w-12 text-amber-600" />
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Access Denied
      </h1>

      <p className="text-gray-600 mb-6 max-w-md">
        You don&apos;t have permission to access this page. If you believe this
        is an error, please contact your administrator.
      </p>

      <div className="flex gap-4">
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Go to Dashboard
        </Link>

        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
