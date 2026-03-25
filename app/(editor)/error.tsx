'use client'

import { useEffect } from 'react'

export default function EditorError({
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Editor Error</h2>
        <p className="text-gray-600 mb-2">
          The editor encountered an unexpected error.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Your last saved version is safe. Close this tab and reopen the page from the Pages list.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
        >
          Try reloading editor
        </button>
      </div>
    </div>
  )
}
