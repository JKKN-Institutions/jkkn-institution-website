'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Bell, CheckCircle, AlertCircle, Info, MessageSquare } from 'lucide-react'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement'
  link?: string
  is_read: boolean
  created_at: string
  metadata?: Record<string, unknown>
}

interface RealtimeNotificationsContextValue {
  notifications: Notification[]
  unreadCount: number
  isConnected: boolean
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  clearNotification: (notificationId: string) => Promise<void>
}

const RealtimeNotificationsContext = createContext<RealtimeNotificationsContextValue | null>(null)

export function useRealtimeNotifications() {
  const context = useContext(RealtimeNotificationsContext)
  if (!context) {
    throw new Error('useRealtimeNotifications must be used within RealtimeNotificationsProvider')
  }
  return context
}

interface RealtimeNotificationsProviderProps {
  children: ReactNode
  userId?: string
}

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
  announcement: MessageSquare,
}

const notificationStyles = {
  info: { icon: 'text-blue-500', bg: 'bg-blue-50' },
  success: { icon: 'text-green-500', bg: 'bg-green-50' },
  warning: { icon: 'text-yellow-500', bg: 'bg-yellow-50' },
  error: { icon: 'text-red-500', bg: 'bg-red-50' },
  announcement: { icon: 'text-purple-500', bg: 'bg-purple-50' },
}

export function RealtimeNotificationsProvider({
  children,
  userId
}: RealtimeNotificationsProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const supabase = createClient()

  const unreadCount = notifications.filter(n => !n.is_read).length

  // Show toast for new notifications
  const showNotificationToast = useCallback((notification: Notification) => {
    const Icon = notificationIcons[notification.type] || Bell
    const styles = notificationStyles[notification.type] || notificationStyles.info

    toast.custom(
      (t) => (
        <div
          className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border ${styles.bg} max-w-md animate-in slide-in-from-right-5 duration-300`}
          onClick={() => {
            if (notification.link) {
              window.location.href = notification.link
            }
            toast.dismiss(t)
          }}
        >
          <div className={`flex-shrink-0 ${styles.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-right',
      }
    )
  }, [])

  // Fetch initial notifications
  useEffect(() => {
    if (!userId) return

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('in_app_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setNotifications(data as Notification[])
      }
    }

    fetchNotifications()
  }, [userId, supabase])

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return

    const newChannel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'in_app_notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as Notification
          setNotifications((prev) => [notification, ...prev])
          showNotificationToast(notification)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'in_app_notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as Notification
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'in_app_notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const deleted = payload.old as { id: string }
          setNotifications((prev) => prev.filter((n) => n.id !== deleted.id))
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    setChannel(newChannel)

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel)
      }
    }
  }, [userId, supabase, showNotificationToast])

  const markAsRead = useCallback(
    async (notificationId: string) => {
      const { error } = await supabase
        .from('in_app_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)

      if (!error) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        )
      }
    },
    [supabase]
  )

  const markAllAsRead = useCallback(async () => {
    if (!userId) return

    const { error } = await supabase
      .from('in_app_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      toast.success('All notifications marked as read')
    }
  }, [userId, supabase])

  const clearNotification = useCallback(
    async (notificationId: string) => {
      const { error } = await supabase
        .from('in_app_notifications')
        .delete()
        .eq('id', notificationId)

      if (!error) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      }
    },
    [supabase]
  )

  return (
    <RealtimeNotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        clearNotification,
      }}
    >
      {children}
    </RealtimeNotificationsContext.Provider>
  )
}
