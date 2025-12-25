'use client'

import { Bell, Search, Sun, Moon, User, Settings, LogOut, Check, CheckCheck, Info, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { signOut } from '@/app/actions/auth'
import { useRealtimeNotifications } from '@/components/providers/realtime-notifications-provider'
import { useUserData } from '@/components/providers/user-data-provider'
import { formatDistanceToNow } from 'date-fns'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'Users',
  '/admin/users/approved-emails': 'Approved Emails',
  '/admin/roles': 'Roles & Permissions',
  '/admin/activity': 'Activity Logs',
  '/admin/content': 'Content',
  '/admin/content/pages': 'Pages',
  '/admin/content/media': 'Media Library',
  '/admin/settings': 'Settings',
  '/admin/notifications': 'Notifications',
}

const notificationIcons: Record<string, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
  announcement: MessageSquare,
}

const notificationStyles: Record<string, { icon: string; bg: string }> = {
  info: { icon: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  success: { icon: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' },
  warning: { icon: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30' },
  error: { icon: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
  announcement: { icon: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
}

export function AdminHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false)

  // Get user data from context (cached, doesn't re-fetch on navigation)
  const { name: userName, email: userEmail, role: userRole, isLoading } = useUserData()

  // Get notifications from context
  const { notifications, unreadCount, markAsRead, markAllAsRead, isConnected } = useRealtimeNotifications()

  // Get the 5 most recent notifications for the popover
  const recentNotifications = notifications.slice(0, 5)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get user initials for avatar
  const userInitials = userName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  const getPageTitle = () => {
    // Check exact match first
    if (pageTitles[pathname]) {
      return pageTitles[pathname]
    }

    // Check for dynamic routes
    if (pathname.startsWith('/admin/users/') && pathname !== '/admin/users/approved-emails') {
      return 'User Details'
    }
    if (pathname.startsWith('/admin/roles/')) {
      return 'Role Details'
    }
    if (pathname.startsWith('/admin/content/pages/')) {
      return 'Page Editor'
    }

    return 'Admin Panel'
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="glass-header border-b border-border/50 flex-shrink-0 w-full max-w-full overflow-hidden sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-3 lg:px-6 py-2 lg:py-3 w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between">
          {/* Logo + Page Title */}
          <div className="flex items-center gap-3">
            {/* JKKN Logo - visible on mobile */}
            <Link href="/admin" className="lg:hidden flex-shrink-0">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo.png"
                  alt="JKKN Institution"
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            {/* Page Title - no description */}
            <h1 className="text-lg lg:text-xl font-semibold text-foreground">{getPageTitle()}</h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-200 hidden sm:flex items-center justify-center">
              <Search className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-200 flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-secondary" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            )}

            {/* Notifications Popover */}
            <Popover open={notificationPopoverOpen} onOpenChange={setNotificationPopoverOpen}>
              <PopoverTrigger asChild>
                <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-200 relative flex items-center justify-center">
                  <Bell className="h-5 w-5" />
                  {/* Notification badge with unread count */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-secondary text-secondary-foreground text-[10px] font-bold border-2 border-background rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                  {/* Connection indicator */}
                  {isConnected && unreadCount === 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => markAllAsRead()}
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all read
                    </Button>
                  )}
                </div>

                <ScrollArea className="max-h-[300px]">
                  {recentNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Bell className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">No notifications yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        We&apos;ll notify you when something important happens
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {recentNotifications.map((notification) => {
                        const Icon = notificationIcons[notification.type] || Bell
                        const styles = notificationStyles[notification.type] || notificationStyles.info

                        return (
                          <div
                            key={notification.id}
                            className={`flex gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                              !notification.is_read ? styles.bg : ''
                            }`}
                            onClick={() => {
                              if (!notification.is_read) {
                                markAsRead(notification.id)
                              }
                              if (notification.link) {
                                setNotificationPopoverOpen(false)
                                window.location.href = notification.link
                              }
                            }}
                          >
                            <div className={`flex-shrink-0 mt-0.5 ${styles.icon}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.is_read ? 'font-medium' : ''}`}>
                                {notification.title}
                              </p>
                              {notification.message && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                  {notification.message}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </p>
                            </div>
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </ScrollArea>

                {notifications.length > 0 && (
                  <div className="p-2 border-t">
                    <Button
                      variant="ghost"
                      className="w-full h-8 text-xs"
                      asChild
                      onClick={() => setNotificationPopoverOpen(false)}
                    >
                      <Link href="/admin/notifications">View all notifications</Link>
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Divider */}
            <div className="h-8 w-px bg-border mx-2 hidden md:block" />

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-primary/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {/* Avatar First */}
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Name and Email */}
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-semibold text-foreground">
                      {userName || 'User'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {userEmail}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 glass-card border-border/50">
                <DropdownMenuLabel className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {userName || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {userEmail}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mt-1">
                        {userRole}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/admin/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/admin/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <form action={signOut}>
                  <button
                    type="submit"
                    className="relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-destructive/10 dark:hover:bg-destructive/20 text-destructive transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
