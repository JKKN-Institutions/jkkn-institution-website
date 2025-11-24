'use client'

import { Bell, Search, Sun, Moon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface AdminHeaderProps {
  userName: string
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

export function AdminHeader({ userName }: AdminHeaderProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <header className="glass-header sticky top-0 z-30">
      <div className="px-4 lg:px-6 py-4">
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

            {/* User Greeting with Badge */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Welcome,{' '}
                <span className="font-semibold text-foreground">
                  {userName?.split(' ')[0] || 'User'}
                </span>
              </span>
              <span className="badge-brand">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
