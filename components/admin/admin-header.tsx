'use client'

import { Bell, Search, Sun, Moon, User, Settings, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/app/actions/auth'

interface AdminHeaderProps {
  userName: string
  userEmail: string
  userRole: string
}

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
}

export function AdminHeader({ userName, userEmail, userRole }: AdminHeaderProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

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
    <header className="glass-header border-b border-border/50 flex-shrink-0 w-full max-w-full overflow-hidden">
      <div className="px-4 lg:px-6 py-4 w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between">
          {/* Page Title - with padding for mobile menu button */}
          <div className="pl-12 lg:pl-0">
            <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your institution efficiently
            </p>
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

            {/* Notifications */}
            <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-200 relative flex items-center justify-center">
              <Bell className="h-5 w-5" />
              {/* Notification badge with brand colors */}
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary border-2 border-background rounded-full animate-pulse" />
            </button>

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
