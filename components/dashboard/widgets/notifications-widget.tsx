'use client'

import { useEffect, useState } from 'react'
import { Bell, Check, X, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { WidgetProps } from '@/lib/dashboard/widget-registry'

interface Notification {
  id: string
  title: string
  description: string | null
  type: string
  icon: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

interface NotificationsConfig {
  maxItems?: number
  userId?: string
}

const TYPE_STYLES: Record<string, { icon: typeof Info; color: string }> = {
  info: { icon: Info, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  success: { icon: CheckCircle, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' },
  error: { icon: XCircle, color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
}

export function NotificationsCenterWidget({ config }: WidgetProps) {
  const { maxItems = 5, userId } = config as NotificationsConfig
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchNotifications = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('in_app_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(maxItems)

    setNotifications((data as Notification[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchNotifications()

    if (!userId) return

    // Real-time subscription
    const channel = supabase
      .channel('notifications-widget')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'in_app_notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId, maxItems])

  const markAsRead = async (id: string) => {
    await supabase
      .from('in_app_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  const markAllAsRead = async () => {
    if (!userId) return

    await supabase
      .from('in_app_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false)

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Bell className="h-6 w-6 animate-pulse text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="h-5 w-5 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground">Notifications</h3>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-primary hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const typeStyle = TYPE_STYLES[notification.type] || TYPE_STYLES.info
            const Icon = typeStyle.icon

            const content = (
              <div
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl transition-all duration-200',
                  notification.is_read
                    ? 'bg-transparent hover:bg-muted/30'
                    : 'bg-primary/5 hover:bg-primary/10'
                )}
              >
                <div className={cn('p-1.5 rounded-lg', typeStyle.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium', !notification.is_read && 'text-foreground')}>
                    {notification.title}
                  </p>
                  {notification.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
                {!notification.is_read && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      markAsRead(notification.id)
                    }}
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    <Check className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            )

            if (notification.link) {
              return (
                <Link key={notification.id} href={notification.link}>
                  {content}
                </Link>
              )
            }

            return <div key={notification.id}>{content}</div>
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Bell className="h-10 w-10 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No notifications</p>
            <p className="text-xs text-muted-foreground mt-1">You&apos;re all caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}
