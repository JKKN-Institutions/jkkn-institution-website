'use client'

import { useEffect } from 'react'

export default function SettingsError({
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
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Settings failed to load</h2>
        <p className="text-gray-500 text-sm mb-4">
          There was a problem loading this settings page. No settings were changed.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
