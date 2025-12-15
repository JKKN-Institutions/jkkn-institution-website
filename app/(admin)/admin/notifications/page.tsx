'use client'

import { useState, useMemo } from 'react'
import { useRealtimeNotifications } from '@/components/providers/realtime-notifications-provider'
import { formatDistanceToNow, format } from 'date-fns'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Info,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Filter,
  Search,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const notificationIcons: Record<string, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
  announcement: MessageSquare,
}

const notificationStyles: Record<string, { icon: string; bg: string; badge: string }> = {
  info: {
    icon: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  success: {
    icon: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  warning: {
    icon: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  },
  error: {
    icon: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  announcement: {
    icon: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, isConnected } =
    useRealtimeNotifications()

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('all')

  // Filter notifications based on search, type, and tab
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      // Filter by tab (all, unread, read)
      if (activeTab === 'unread' && notification.is_read) return false
      if (activeTab === 'read' && !notification.is_read) return false

      // Filter by type
      if (typeFilter !== 'all' && notification.type !== typeFilter) return false

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = notification.title.toLowerCase().includes(query)
        const matchesMessage = notification.message?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesMessage) return false
      }

      return true
    })
  }, [notifications, activeTab, typeFilter, searchQuery])

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, typeof notifications> = {}

    filteredNotifications.forEach((notification) => {
      const date = new Date(notification.created_at)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let groupKey: string
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday'
      } else {
        groupKey = format(date, 'MMMM d, yyyy')
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(notification)
    })

    return groups
  }, [filteredNotifications])

  const handleNotificationClick = (notification: (typeof notifications)[0]) => {
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
    if (notification.link) {
      window.location.href = notification.link
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your latest notifications and alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Connection status */}
          <Badge variant={isConnected ? 'default' : 'secondary'} className="gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}
            />
            {isConnected ? 'Live' : 'Connecting...'}
          </Badge>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="gap-2" onClick={() => markAllAsRead()}>
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Notifications</CardDescription>
            <CardTitle className="text-3xl">{notifications.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unread</CardDescription>
            <CardTitle className="text-3xl text-primary">{unreadCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Read</CardDescription>
            <CardTitle className="text-3xl text-muted-foreground">
              {notifications.length - unreadCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Notifications List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary" className="ml-1">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            Unread
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-1">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Inbox className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No notifications</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  {activeTab === 'unread'
                    ? "You're all caught up! No unread notifications."
                    : activeTab === 'read'
                      ? 'No read notifications yet.'
                      : searchQuery || typeFilter !== 'all'
                        ? 'No notifications match your filters.'
                        : "You don't have any notifications yet. We'll notify you when something important happens."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedNotifications).map(([date, notifications]) => (
                <div key={date}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
                  <div className="space-y-2">
                    {notifications.map((notification) => {
                      const Icon = notificationIcons[notification.type] || Bell
                      const styles = notificationStyles[notification.type] || notificationStyles.info

                      return (
                        <Card
                          key={notification.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            !notification.is_read ? `border ${styles.bg}` : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <CardContent className="flex items-start gap-4 p-4">
                            <div className={`flex-shrink-0 mt-0.5 ${styles.icon}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p
                                      className={`text-sm ${!notification.is_read ? 'font-semibold' : 'font-medium'}`}
                                    >
                                      {notification.title}
                                    </p>
                                    <Badge variant="outline" className={`text-xs ${styles.badge}`}>
                                      {notification.type}
                                    </Badge>
                                    {!notification.is_read && (
                                      <span className="h-2 w-2 rounded-full bg-primary" />
                                    )}
                                  </div>
                                  {notification.message && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {notification.message}
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {formatDistanceToNow(new Date(notification.created_at), {
                                      addSuffix: true,
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {!notification.is_read && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        markAsRead(notification.id)
                                      }}
                                      title="Mark as read"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={(e) => e.stopPropagation()}
                                        title="Delete notification"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete notification?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This notification will be
                                          permanently deleted.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => clearNotification(notification.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
