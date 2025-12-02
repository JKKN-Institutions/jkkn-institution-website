'use client'

import { useState, useEffect, useCallback } from 'react'

interface NetworkStatus {
  isOnline: boolean
  wasOffline: boolean
  lastOnlineAt: Date | null
}

/**
 * Hook to detect and track network status changes.
 * Useful for showing offline banners and queueing operations.
 */
export function useNetworkStatus(): NetworkStatus & {
  checkConnection: () => Promise<boolean>
} {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    wasOffline: false,
    lastOnlineAt: null,
  })

  // Check actual connectivity by making a small request
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Use a small fetch to verify actual connectivity
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-store',
      })
      return response.ok
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({
        isOnline: true,
        wasOffline: !prev.isOnline,
        lastOnlineAt: new Date(),
      }))
    }

    const handleOffline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
      }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial check
    if (navigator.onLine) {
      setStatus(prev => ({
        ...prev,
        lastOnlineAt: new Date(),
      }))
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return {
    ...status,
    checkConnection,
  }
}

/**
 * Simple offline banner component
 */
export function OfflineBanner({ message = 'You are offline. Changes will be saved when you reconnect.' }: { message?: string }) {
  const { isOnline, wasOffline } = useNetworkStatus()

  if (isOnline && !wasOffline) return null

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg shadow-lg flex items-center gap-2 text-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive-foreground opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive-foreground" />
        </span>
        {message}
      </div>
    )
  }

  // Show reconnection message briefly
  if (wasOffline) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-2">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        Back online! Syncing changes...
      </div>
    )
  }

  return null
}

export default useNetworkStatus
