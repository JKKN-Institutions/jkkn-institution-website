'use client'

import { useState, useEffect } from 'react'
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
  BarChart3,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  Globe,
  Layers,
  Puzzle,
  PenLine,
  Tags,
  FolderOpen,
  MessageSquare,
  Briefcase,
  Building2,
  UserCheck,
  Mail,
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
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
    permission: 'users:profiles:view',
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
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    permission: 'dashboard:analytics:view',
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
        title: 'Components',
        href: '/admin/content/components',
        icon: Puzzle,
        permission: 'cms:components:view',
      },
      {
        title: 'Templates',
        href: '/admin/content/templates',
        icon: Layers,
        permission: 'cms:templates:view',
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
    title: 'Blog',
    href: '/admin/content/blog',
    icon: PenLine,
    permission: 'cms:blog:view',
    children: [
      {
        title: 'All Posts',
        href: '/admin/content/blog',
        icon: PenLine,
        permission: 'cms:blog:view',
      },
      {
        title: 'Categories',
        href: '/admin/content/blog/categories',
        icon: FolderOpen,
        permission: 'cms:blog:view',
      },
      {
        title: 'Tags',
        href: '/admin/content/blog/tags',
        icon: Tags,
        permission: 'cms:blog:view',
      },
      {
        title: 'Comments',
        href: '/admin/content/blog/comments',
        icon: MessageSquare,
        permission: 'cms:blog:comments',
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
}: AdminSidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Auto-expand parent sections based on current path
  useEffect(() => {
    const expanded: string[] = []
    // Auto-expand based on current path
    if (pathname.startsWith('/admin/content/blog')) {
      expanded.push('/admin/content/blog')
    } else if (pathname.startsWith('/admin/content')) {
      expanded.push('/admin/content')
    }
    setExpandedItems(expanded)
  }, [pathname])

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
    // Dashboard is only active when exactly on /admin
    if (href === '/admin') {
      return pathname === '/admin'
    }
    // For all other routes, check exact match or if it's a child route
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
              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
              active
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary backdrop-blur-sm'
                : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground dark:hover:bg-primary/10'
            )}
          >
            <span className="flex items-center gap-3">
              <div className={cn(
                'p-1.5 rounded-lg transition-all duration-200',
                active ? 'bg-primary/15' : 'bg-transparent'
              )}>
                <item.icon className="h-4 w-4" />
              </div>
              {item.title}
            </span>
            <div className={cn(
              'p-1 rounded-md transition-all duration-200',
              isExpanded ? 'bg-primary/10 rotate-0' : 'rotate-0'
            )}>
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </div>
          </button>

          {isExpanded && (
            <div className="ml-5 mt-1.5 space-y-0.5 border-l-2 border-primary/20 pl-3 relative">
              <div className="absolute -left-[2px] top-0 w-0.5 h-full bg-gradient-to-b from-primary/30 to-primary/5" />
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
          'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          active
            ? 'bg-primary text-white shadow-brand dark:bg-primary dark:text-white'
            : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground dark:hover:bg-primary/10',
          isChild && 'pl-3 py-2 text-[13px]'
        )}
      >
        {/* Glow effect for active items */}
        {active && (
          <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10" />
        )}
        <div className={cn(
          'p-1.5 rounded-lg transition-all duration-200',
          active
            ? 'bg-white/20'
            : 'bg-primary/5 group-hover:bg-primary/10',
          isChild && 'p-1'
        )}>
          <item.icon className={cn(
            'transition-all duration-200',
            active ? 'text-white' : 'text-primary/70 group-hover:text-primary',
            isChild ? 'h-3.5 w-3.5' : 'h-4 w-4'
          )} />
        </div>
        <span className={cn(
          'transition-all duration-200',
          !active && 'group-hover:translate-x-0.5'
        )}>
          {item.title}
        </span>
        {/* Active indicator dot */}
        {active && !isChild && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        )}
      </Link>
    )
  }

  const SidebarContent = () => (
    <>
      {/* JKKN Admin Header */}
      <div className="p-5 border-b border-sidebar-border/50">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div>
            <span className="text-xl font-bold text-foreground tracking-tight">JKKN Admin</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Institution Portal</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Section with Grouped Menus */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto overflow-x-hidden">
        {/* Overview Section */}
        <div>
          <div className="text-xs font-bold text-foreground tracking-wider px-3 mb-3">
            Overview
          </div>
          <div className="space-y-1">
            {filteredNavItems.filter(item => item.href === '/admin' || item.href === '/admin/analytics').map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* Access Management Section */}
        <div>
          <div className="text-xs font-bold text-foreground tracking-wider px-3 mb-3">
            Access Management
          </div>
          <div className="space-y-1">
            {filteredNavItems.filter(item => item.href === '/admin/users' || item.href === '/admin/roles').map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* Activities Section */}
        <div>
          <div className="text-xs font-bold text-foreground tracking-wider px-3 mb-3">
            Activities
          </div>
          <div className="space-y-1">
            {filteredNavItems.filter(item => item.href === '/admin/activity').map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* Content Management Section */}
        <div>
          <div className="text-xs font-bold text-foreground tracking-wider px-3 mb-3">
            Content Management
          </div>
          <div className="space-y-1">
            {filteredNavItems.filter(item =>
              item.href === '/admin/content' ||
              item.href === '/admin/content/blog'
            ).map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* System Section */}
        <div>
          <div className="text-xs font-bold text-foreground tracking-wider px-3 mb-3">
            System
          </div>
          <div className="space-y-1">
            {filteredNavItems.filter(item => item.href === '/admin/settings').map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Section with Glass Card */}
      <div className="p-4 border-t border-sidebar-border/50">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsMobileOpen(false)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium glass-button text-primary hover:text-primary-foreground hover:bg-primary group"
        >
          <Globe className="h-4 w-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
          <span>View Website</span>
          <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </Link>
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
