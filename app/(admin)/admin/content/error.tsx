'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ContentError({
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
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center max-w-sm px-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Content section error</h2>
        <p className="text-gray-500 text-sm mb-4">
          This content page ran into an issue. Your published content is safe.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
          >
            Try again
          </button>
          <Link
            href="/admin/content/pages"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm"
          >
            All Pages
          </Link>
        </div>
      </div>
    </div>
  )
}
