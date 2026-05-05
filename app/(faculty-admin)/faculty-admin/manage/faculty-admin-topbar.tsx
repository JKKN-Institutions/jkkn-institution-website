'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, Search, Bell, User, LogOut, HelpCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'

const PAGE_TITLES: Record<string, string> = {
  '/faculty-admin/manage': 'Dashboard',
  '/faculty-admin/manage/faculty': 'Faculty Members',
  '/faculty-admin/manage/faculty/new': 'Add Faculty',
  '/faculty-admin/manage/blog': 'Blog Posts',
  '/faculty-admin/manage/blog/new': 'New Blog Post',
  '/faculty-admin/manage/blog/categories': 'Blog Categories',
  '/faculty-admin/manage/blog/tags': 'Blog Tags',
  '/faculty-admin/manage/blog/comments': 'Comment Moderation',
}

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]

  if (pathname.match(/^\/faculty-admin\/manage\/blog\/[^/]+\/edit$/)) return 'Edit Blog Post'
  if (pathname.match(/^\/faculty-admin\/manage\/faculty\/[^/]+$/)) return 'Edit Faculty'

  return 'Faculty Portal'
}

interface FacultyAdminTopbarProps {
  userEmail: string
  onOpenMobileSidebar: () => void
}

export function FacultyAdminTopbar({ userEmail, onOpenMobileSidebar }: FacultyAdminTopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const title = getPageTitle(pathname)

  const initial = userEmail ? userEmail[0]?.toUpperCase() || 'U' : 'U'
  const username = userEmail ? userEmail.split('@')[0] : 'Faculty User'

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/faculty-admin')
    router.refresh()
  }

  return (
    <header className="glass-header border-b border-border/50 flex-shrink-0 w-full max-w-full overflow-hidden sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-3 lg:px-6 py-2 lg:py-3 w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between">
          {/* Left — Mobile menu + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 -ml-1 text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-200"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg lg:text-xl font-semibold text-foreground truncate">{title}</h1>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">
            {/* Search button (decorative, hits first form on page or future search) */}
            <button
              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-200 hidden sm:flex items-center justify-center"
              aria-label="Search"
              type="button"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications — placeholder bell with connection dot */}
            <button
              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-200 relative hidden sm:flex items-center justify-center"
              aria-label="Notifications"
              type="button"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 border-2 border-background rounded-full" />
            </button>

            {/* Help */}
            <Link
              href="/faculty"
              target="_blank"
              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-200 hidden md:flex items-center justify-center"
              aria-label="Preview faculty page"
            >
              <HelpCircle className="h-5 w-5" />
            </Link>

            {/* Divider */}
            <div className="h-8 w-px bg-border mx-2 hidden md:block" />

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-primary/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold text-sm">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold text-foreground capitalize">
                      {username}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {userEmail}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72 border-border/50">
                <DropdownMenuLabel className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate capitalize">
                        {username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mt-1">
                        Faculty Admin
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/faculty" target="_blank" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Preview Faculty Page
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
