'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

/**
 * Custom hook for subscribing to Supabase Realtime table changes
 * Automatically handles subscription cleanup and re-subscription on parameter changes
 *
 * @param tableName - The database table to subscribe to
 * @param onInsert - Callback when a new row is inserted
 * @param onUpdate - Callback when a row is updated
 * @param onDelete - Callback when a row is deleted
 * @param filter - Optional filter string (e.g., "user_id=eq.123")
 *
 * @example
 * useRealtimeTable('user_activity_logs', {
 *   onInsert: (payload) => console.log('New activity:', payload.new),
 *   onUpdate: (payload) => console.log('Updated:', payload.new),
 *   onDelete: (payload) => console.log('Deleted:', payload.old),
 *   filter: 'user_id=eq.' + userId
 * })
 */
export function useRealtimeTable<T extends { [key: string]: any } = { [key: string]: any }>(
  tableName: string,
  callbacks?: {
    onInsert?: (payload: RealtimePostgresChangesPayload<T>) => void
    onUpdate?: (payload: RealtimePostgresChangesPayload<T>) => void
    onDelete?: (payload: RealtimePostgresChangesPayload<T>) => void
  },
  filter?: string
) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const setupChannel = async () => {
      try {
        // Create a unique channel name
        const channelName = `realtime:${tableName}${filter ? `:${filter}` : ''}`

        channel = supabase.channel(channelName)

        // Subscribe to all events on the table
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName,
            filter,
          },
          (payload: RealtimePostgresChangesPayload<T>) => {
            // Route to appropriate callback
            if (payload.eventType === 'INSERT' && callbacks?.onInsert) {
              callbacks.onInsert(payload)
            } else if (payload.eventType === 'UPDATE' && callbacks?.onUpdate) {
              callbacks.onUpdate(payload)
            } else if (payload.eventType === 'DELETE' && callbacks?.onDelete) {
              callbacks.onDelete(payload)
            }
          }
        )

        // Subscribe and handle connection status
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true)
            setError(null)
          } else if (status === 'CHANNEL_ERROR') {
            setIsConnected(false)
            setError('Failed to connect to realtime channel')
          } else if (status === 'TIMED_OUT') {
            setIsConnected(false)
            setError('Realtime connection timed out')
          }
        })
      } catch (err) {
        console.error('Error setting up realtime channel:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    setupChannel()

    // Cleanup function
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
        setIsConnected(false)
      }
    }
  }, [tableName, filter, supabase, callbacks])

  return { isConnected, error }
}

/**
 * Custom hook for managing a real-time list of records from a table
 * Automatically syncs with database changes (inserts, updates, deletes)
 *
 * @param tableName - The database table to subscribe to
 * @param initialData - Initial data to display before real-time updates
 * @param filter - Optional filter string
 *
 * @example
 * const { data, isLoading, error } = useRealtimeList('user_activity_logs', initialLogs)
 */
export function useRealtimeList<T extends { id: string; [key: string]: any }>(
  tableName: string,
  initialData: T[] = [],
  filter?: string
) {
  const [data, setData] = useState<T[]>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInsert = useCallback((payload: RealtimePostgresChangesPayload<T>) => {
    setData((prev) => [payload.new as T, ...prev])
  }, [])

  const handleUpdate = useCallback((payload: RealtimePostgresChangesPayload<T>) => {
    setData((prev) =>
      prev.map((item) => (item.id === (payload.new as T).id ? (payload.new as T) : item))
    )
  }, [])

  const handleDelete = useCallback((payload: RealtimePostgresChangesPayload<T>) => {
    setData((prev) => prev.filter((item) => item.id !== (payload.old as T).id))
  }, [])

  useRealtimeTable<T>(
    tableName,
    {
      onInsert: handleInsert,
      onUpdate: handleUpdate,
      onDelete: handleDelete,
    },
    filter
  )

  return { data, isLoading, error, setData }
}

/**
 * Custom hook for subscribing to a specific record in a table
 * Automatically updates when the record changes
 *
 * @param tableName - The database table
 * @param recordId - The ID of the record to watch
 * @param initialData - Initial record data
 *
 * @example
 * const { data, isLoading } = useRealtimeRecord('profiles', userId, initialProfile)
 */
export function useRealtimeRecord<T extends { id: string; [key: string]: any }>(
  tableName: string,
  recordId: string,
  initialData?: T
) {
  const [data, setData] = useState<T | null>(initialData || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = useCallback((payload: RealtimePostgresChangesPayload<T>) => {
    setData(payload.new as T)
  }, [])

  const handleDelete = useCallback(() => {
    setData(null)
  }, [])

  useRealtimeTable<T>(
    tableName,
    {
      onUpdate: handleUpdate,
      onDelete: handleDelete,
    },
    `id=eq.${recordId}`
  )

  return { data, isLoading, error, setData }
}

/**
 * Custom hook for counting rows in a table with real-time updates
 * Useful for dashboard stats and counters
 *
 * @param tableName - The database table to count
 * @param initialCount - Initial count value
 * @param filter - Optional filter string
 *
 * @example
 * const { count } = useRealtimeCount('user_activity_logs', 0)
 */
export function useRealtimeCount(
  tableName: string,
  initialCount: number = 0,
  filter?: string
) {
  const [count, setCount] = useState<number>(initialCount)
  const supabase = createClient()

  const fetchCount = useCallback(async () => {
    let query = supabase.from(tableName).select('id', { count: 'exact', head: true })

    if (filter) {
      // Parse filter and apply (basic implementation)
      // For more complex filters, consider using a server action
      const [column, operator, value] = filter.split(/[=.]/)
      if (operator === 'eq') {
        query = query.eq(column, value)
      }
    }

    const { count: newCount, error } = await query

    if (!error && newCount !== null) {
      setCount(newCount)
    }
  }, [tableName, filter, supabase])

  // Fetch initial count
  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  // Subscribe to changes and refetch count
  useRealtimeTable(tableName, {
    onInsert: () => setCount((prev) => prev + 1),
    onDelete: () => setCount((prev) => Math.max(0, prev - 1)),
  })

  return { count, refetch: fetchCount }
}

/**
 * Custom hook for presence tracking (who's online)
 * Useful for collaborative features
 *
 * @param channelName - Unique channel name
 * @param userInfo - Current user information to share
 *
 * @example
 * const { presences, trackPresence } = usePresence('dashboard', { userId, userName })
 */
export function usePresence<T extends { [key: string]: any } = { [key: string]: any }>(channelName: string, userInfo?: T) {
  const [presences, setPresences] = useState<Record<string, T>>({})
  const [isTracking, setIsTracking] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel(`presence:${channelName}`)

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<T>()
        const presenceMap: Record<string, T> = {}

        Object.keys(state).forEach((key) => {
          const presence = state[key]
          if (presence && presence[0]) {
            presenceMap[key] = presence[0] as T
          }
        })

        setPresences(presenceMap)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && userInfo) {
          await channel.track(userInfo)
          setIsTracking(true)
        }
      })

    return () => {
      channel.untrack()
      supabase.removeChannel(channel)
      setIsTracking(false)
    }
  }, [channelName, userInfo, supabase])

  const trackPresence = useCallback(
    async (info: T) => {
      const channel = supabase.channel(`presence:${channelName}`)
      await channel.track(info)
    },
    [channelName, supabase]
  )

  return { presences, isTracking, trackPresence }
}
