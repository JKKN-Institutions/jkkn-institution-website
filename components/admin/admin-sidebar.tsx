'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  Image,
  Settings,
  Activity,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  permission?: string
  children?: NavItem[]
}

interface AdminSidebarProps {
  userPermissions: string[]
  userName: string
  userEmail: string
  userRole: string
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    permission: 'users:profiles:view',
    children: [
      {
        title: 'All Users',
        href: '/admin/users',
        icon: Users,
        permission: 'users:profiles:view',
      },
      {
        title: 'Approved Emails',
        href: '/admin/users/approved-emails',
        icon: FileText,
        permission: 'users:emails:view',
      },
    ],
  },
  {
    title: 'Roles & Permissions',
    href: '/admin/roles',
    icon: Shield,
    permission: 'users:roles:view',
  },
  {
    title: 'Activity Logs',
    href: '/admin/activity',
    icon: Activity,
    permission: 'users:activity:view',
  },
  {
    title: 'Content',
    href: '/admin/content',
    icon: FileText,
    permission: 'content:pages:view',
    children: [
      {
        title: 'Pages',
        href: '/admin/content/pages',
        icon: FileText,
        permission: 'content:pages:view',
      },
      {
        title: 'Media Library',
        href: '/admin/content/media',
        icon: Image,
        permission: 'content:media:view',
      },
    ],
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: 'system:settings:view',
  },
]

export function AdminSidebar({
  userPermissions,
  userName,
  userEmail,
  userRole,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const hasPermission = (permission?: string): boolean => {
    if (!permission) return true
    if (userPermissions.includes('*:*:*')) return true

    // Check exact match
    if (userPermissions.includes(permission)) return true

    // Check wildcards
    const [module, resource, action] = permission.split(':')

    for (const perm of userPermissions) {
      const [permModule, permResource, permAction] = perm.split(':')

      if (permModule === '*' && permResource === '*' && permAction === '*') return true
      if (permModule === module && permResource === '*' && permAction === '*') return true
      if (permModule === module && permResource === resource && permAction === '*') return true
    }

    return false
  }

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin' || pathname === '/admin/dashboard'
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  const filteredNavItems = navigationItems.filter((item) => hasPermission(item.permission))

  const NavLink = ({ item, isChild = false }: { item: NavItem; isChild?: boolean }) => {
    const active = isActive(item.href)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.href)

    const filteredChildren = item.children?.filter((child) => hasPermission(child.permission))

    if (hasChildren && filteredChildren && filteredChildren.length > 0) {
      return (
        <div>
          <button
            onClick={() => toggleExpand(item.href)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              active
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground dark:hover:bg-primary/10'
            )}
          >
            <span className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              {item.title}
            </span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-2">
              {filteredChildren.map((child) => (
                <NavLink key={child.href} item={child} isChild />
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          active
            ? 'bg-primary text-white shadow-brand dark:bg-primary dark:text-white'
            : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground dark:hover:bg-primary/10',
          isChild && 'pl-4 text-sm'
        )}
      >
        <item.icon className={cn('h-5 w-5', active && 'text-white')} />
        {item.title}
      </Link>
    )
  }

  const SidebarContent = () => (
    <>
      {/* Logo with Brand Gradient */}
      <div className="p-5 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center shadow-brand group-hover:shadow-lg transition-shadow duration-300">
            <span className="text-white font-bold text-lg">JK</span>
          </div>
          <div>
            <span className="text-lg font-semibold text-foreground">JKKN Admin</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-secondary" />
              <span>Institution Portal</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
          Main Menu
        </div>
        {filteredNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* User Info with Glassmorphism */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="glass-card rounded-xl p-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-medium text-sm">
                {userName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase() || '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{userRole}</p>
            </div>
          </div>
        </div>

        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button with Glassmorphism */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 glass rounded-xl shadow-brand hover:shadow-lg transition-all duration-300"
      >
        {isMobileOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
      </button>

      {/* Mobile Overlay with Blur */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar with Glassmorphism */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-72 glass-sidebar flex flex-col transform transition-all duration-300 ease-out',
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
