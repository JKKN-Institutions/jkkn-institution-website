'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUserData } from '@/components/providers/user-data-provider'
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  Image,
  Activity,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  ExternalLink,
  Globe,
  Mail,
  Puzzle,
  Layers,
  Video,
  PenLine,
  Tags,
  FolderOpen,
  MessageSquare,
  Briefcase,
  Building2,
  UserCheck,
} from 'lucide-react'

// Types
interface NavSubModule {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission?: string
  badge?: number
}

interface NavModule {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color?: string
  permission?: string
  badge?: number
  subModules?: NavSubModule[]
}

interface NavGroup {
  id: string
  label: string
  items: NavModule[]
}


// Navigation configuration with grouped sections (matching target design)
const navigationGroups: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        color: 'bg-blue-500',
      },
    ],
  },
  {
    id: 'access-management',
    label: 'Access Management',
    items: [
      {
        id: 'users',
        label: 'User Management',
        href: '/admin/users',
        icon: Users,
        permission: 'users:profiles:view',
      },
      {
        id: 'roles',
        label: 'Role Management',
        href: '/admin/roles',
        icon: Shield,
        color: 'bg-purple-500',
        permission: 'users:roles:view',
      },
    ],
  },
  {
    id: 'activities',
    label: 'Activities',
    items: [
      {
        id: 'activity',
        label: 'Activities',
        href: '/admin/activity',
        icon: Activity,
        color: 'bg-orange-500',
        permission: 'users:activity:view',
        subModules: [
          {
            id: 'activity-logs',
            label: 'Activity Logs',
            href: '/admin/activity',
            icon: Activity,
            permission: 'users:activity:view',
          },
        ],
      },
    ],
  },
  {
    id: 'content-management',
    label: 'Content Management',
    items: [
      {
        id: 'content',
        label: 'Content',
        href: '/admin/content',
        icon: FileText,
        color: 'bg-pink-500',
        permission: 'cms:pages:view',
        subModules: [
          {
            id: 'pages',
            label: 'Pages',
            href: '/admin/content/pages',
            icon: FileText,
            permission: 'cms:pages:view',
          },
          {
            id: 'components',
            label: 'Components',
            href: '/admin/content/components',
            icon: Puzzle,
            permission: 'cms:components:view',
          },
          {
            id: 'templates',
            label: 'Templates',
            href: '/admin/content/templates',
            icon: Layers,
            permission: 'cms:templates:view',
          },
          {
            id: 'media',
            label: 'Media Library',
            href: '/admin/content/media',
            icon: Image,
            permission: 'cms:media:view',
          },
          {
            id: 'videos',
            label: 'Videos',
            href: '/admin/videos',
            icon: Video,
            permission: 'cms:videos:view',
          },
        ],
      },
      {
        id: 'blog',
        label: 'Blog',
        href: '/admin/content/blog',
        icon: PenLine,
        color: 'bg-emerald-500',
        permission: 'cms:blog:view',
        subModules: [
          {
            id: 'blog-posts',
            label: 'All Posts',
            href: '/admin/content/blog',
            icon: PenLine,
            permission: 'cms:blog:view',
          },
          {
            id: 'blog-categories',
            label: 'Categories',
            href: '/admin/content/blog/categories',
            icon: FolderOpen,
            permission: 'cms:blog:view',
          },
          {
            id: 'blog-tags',
            label: 'Tags',
            href: '/admin/content/blog/tags',
            icon: Tags,
            permission: 'cms:blog:view',
          },
          {
            id: 'blog-comments',
            label: 'Comments',
            href: '/admin/content/blog/comments',
            icon: MessageSquare,
            permission: 'cms:blog:comments',
          },
        ],
      },
      {
        id: 'careers',
        label: 'Careers',
        href: '/admin/content/careers',
        icon: Briefcase,
        color: 'bg-amber-500',
        permission: 'cms:careers:view',
        subModules: [
          {
            id: 'career-jobs',
            label: 'All Jobs',
            href: '/admin/content/careers',
            icon: Briefcase,
            permission: 'cms:careers:view',
          },
          {
            id: 'career-departments',
            label: 'Departments',
            href: '/admin/content/careers/departments',
            icon: Building2,
            permission: 'cms:careers:view',
          },
          {
            id: 'career-applications',
            label: 'Applications',
            href: '/admin/content/careers/applications',
            icon: UserCheck,
            permission: 'cms:careers:applications',
          },
          {
            id: 'career-emails',
            label: 'Email Templates',
            href: '/admin/content/careers/emails',
            icon: Mail,
            permission: 'cms:careers:emails',
          },
        ],
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      {
        id: 'inquiries',
        label: 'Inquiries',
        href: '/admin/inquiries',
        icon: Mail,
        permission: 'system:inquiries:view',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/admin/analytics',
        icon: Activity,
        permission: 'system:analytics:view',
      },
    ],
  },
]

// Flatten groups to get all modules (for backward compatibility)
const navigationModules: NavModule[] = navigationGroups.flatMap(group => group.items)

// Desktop Sidebar Component
function DesktopSidebar({
  groups,
  activeModule,
  activeSubModule,
  collapsed,
  onToggleCollapse,
}: {
  groups: NavGroup[]
  activeModule: string
  activeSubModule: string
  collapsed: boolean
  onToggleCollapse: () => void
}) {
  const [expandedItems, setExpandedItems] = useState<string[]>([activeModule])

  const toggleExpand = (moduleId: string) => {
    setExpandedItems((prev) =>
      prev.includes(moduleId)
        ? prev.filter((item) => item !== moduleId)
        : [...prev, moduleId]
    )
  }

  const renderNavItem = (module: NavModule) => {
    const isActive = activeModule === module.id
    const isExpanded = expandedItems.includes(module.id)
    const hasSubModules = module.subModules && module.subModules.length > 0

    if (hasSubModules && !collapsed) {
      return (
        <div key={module.id}>
          <button
            onClick={() => toggleExpand(module.id)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground dark:hover:bg-primary/10'
            )}
          >
            <span className="flex items-center gap-3">
              <module.icon className="h-5 w-5 flex-shrink-0" />
              {module.label}
            </span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-2">
              {module.subModules?.map((sub) => (
                <Link
                  key={sub.id}
                  href={sub.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    activeSubModule === sub.id
                      ? 'bg-primary text-white shadow-brand'
                      : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground'
                  )}
                >
                  <sub.icon className="h-4 w-4" />
                  {sub.label}
                  {sub.badge && (
                    <span className="ml-auto px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {sub.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={module.id}
        href={module.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary text-white shadow-brand'
            : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground',
          collapsed && 'justify-center px-2'
        )}
        title={collapsed ? module.label : undefined}
      >
        <module.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-white')} />
        {!collapsed && module.label}
        {module.badge && !collapsed && (
          <span className="ml-auto px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
            {module.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col bg-card border-r border-border transition-all duration-300 ease-out',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300 flex-shrink-0">
            <span className="text-white font-bold text-lg">J</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="text-lg font-semibold text-foreground">JKKN Admin</span>
            </div>
          )}
        </Link>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation with Groups */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto overflow-x-hidden">
        {groups.map((group) => (
          <div key={group.id}>
            {/* Group Header */}
            {!collapsed && (
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                {group.label}
              </div>
            )}
            {/* Group Items */}
            <div className="space-y-1">
              {group.items.map(renderNavItem)}
            </div>
          </div>
        ))}
      </nav>

      {/* View Website Link */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 group',
            collapsed ? 'justify-center px-2' : ''
          )}
          title={collapsed ? 'View Website' : undefined}
        >
          <Globe className="h-4 w-4 group-hover:scale-110 transition-transform flex-shrink-0" />
          {!collapsed && (
            <>
              View Website
              <ExternalLink className="h-3 w-3 opacity-60" />
            </>
          )}
        </Link>
      </div>
    </aside>
  )
}

// Mobile Sidebar Navigation Component
function MobileSidebar({
  groups,
  activeModule,
  activeSubModule,
  isOpen,
  onClose,
}: {
  groups: NavGroup[]
  activeModule: string
  activeSubModule: string
  isOpen: boolean
  onClose: () => void
}) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([activeModule])

  const toggleExpand = (moduleId: string) => {
    setExpandedItems((prev) =>
      prev.includes(moduleId)
        ? prev.filter((item) => item !== moduleId)
        : [...prev, moduleId]
    )
  }

  // Close sidebar when route changes
  useEffect(() => {
    onClose()
  }, [pathname])

  const renderNavItem = (module: NavModule) => {
    const isActive = activeModule === module.id
    const isExpanded = expandedItems.includes(module.id)
    const hasSubModules = module.subModules && module.subModules.length > 0

    if (hasSubModules) {
      return (
        <div key={module.id}>
          <button
            onClick={() => toggleExpand(module.id)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground dark:hover:bg-primary/10'
            )}
          >
            <span className="flex items-center gap-3">
              <module.icon className="h-5 w-5 flex-shrink-0" />
              {module.label}
            </span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-2">
              {module.subModules?.map((sub) => (
                <Link
                  key={sub.id}
                  href={sub.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    activeSubModule === sub.id
                      ? 'bg-primary text-white shadow-brand'
                      : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground'
                  )}
                >
                  <sub.icon className="h-4 w-4" />
                  {sub.label}
                  {sub.badge && (
                    <span className="ml-auto px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {sub.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={module.id}
        href={module.href}
        onClick={onClose}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary text-white shadow-brand'
            : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground'
        )}
      >
        <module.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-white')} />
        {module.label}
        {module.badge && (
          <span className="ml-auto px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
            {module.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-card border-r border-border transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300 flex-shrink-0">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <div className="overflow-hidden">
              <span className="text-lg font-semibold text-foreground">JKKN Admin</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation with Groups */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto overflow-x-hidden">
          {groups.map((group) => (
            <div key={group.id}>
              {/* Group Header */}
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                {group.label}
              </div>
              {/* Group Items */}
              <div className="space-y-1">
                {group.items.map(renderNavItem)}
              </div>
            </div>
          ))}
        </nav>

        {/* View Website Link */}
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 group"
          >
            <Globe className="h-4 w-4 group-hover:scale-110 transition-transform flex-shrink-0" />
            View Website
            <ExternalLink className="h-3 w-3 opacity-60" />
          </Link>
        </div>
      </aside>
    </>
  )
}

// Mobile Menu Button Component
function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-6 left-4 z-50 p-2 hover:bg-black/5 rounded-lg transition-colors"
      aria-label="Open menu"
    >
      <Menu className="h-6 w-6 text-foreground" />
    </button>
  )
}

// Main Responsive Navigation Component
export function ResponsiveNavigation() {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Get user permissions from context (cached, doesn't re-fetch on navigation)
  const { permissions: userPermissions } = useUserData()

  // Permission check helper
  const hasPermission = (permission?: string): boolean => {
    if (!permission) return true
    if (userPermissions.includes('*:*:*')) return true
    if (userPermissions.includes(permission)) return true

    const [module, resource, action] = permission.split(':')
    for (const perm of userPermissions) {
      const [permModule, permResource, permAction] = perm.split(':')
      if (permModule === '*' && permResource === '*' && permAction === '*') return true
      if (permModule === module && permResource === '*' && permAction === '*') return true
      if (permModule === module && permResource === resource && permAction === '*') return true
    }
    return false
  }

  // Filter groups based on permissions
  const filteredGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items
        .filter((module) => hasPermission(module.permission))
        .map((module) => ({
          ...module,
          subModules: module.subModules?.filter((sub) => hasPermission(sub.permission)),
        })),
    }))
    .filter((group) => group.items.length > 0) // Remove empty groups

  // Flatten for backward compatibility and active detection
  const filteredModules = filteredGroups.flatMap((group) => group.items)

  // Determine active module and submodule based on pathname
  const getActiveIds = () => {
    for (const module of filteredModules) {
      // Check submodules first
      if (module.subModules) {
        for (const sub of module.subModules) {
          if (pathname === sub.href || pathname.startsWith(sub.href + '/')) {
            return { moduleId: module.id, subModuleId: sub.id }
          }
        }
      }

      // Dashboard should only be active for exact /admin or /admin/dashboard
      if (module.href === '/admin') {
        if (pathname === '/admin' || pathname === '/admin/dashboard') {
          return { moduleId: module.id, subModuleId: '' }
        }
        // Skip the general startsWith check for dashboard
        continue
      }

      // For other modules, check exact match or startsWith
      if (pathname === module.href || pathname.startsWith(module.href + '/')) {
        return { moduleId: module.id, subModuleId: '' }
      }
    }
    return { moduleId: 'dashboard', subModuleId: '' }
  }

  const { moduleId: activeModule, subModuleId: activeSubModule } = getActiveIds()

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar
        groups={filteredGroups}
        activeModule={activeModule}
        activeSubModule={activeSubModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Menu Button */}
      <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />

      {/* Mobile Sidebar Navigation */}
      <MobileSidebar
        groups={filteredGroups}
        activeModule={activeModule}
        activeSubModule={activeSubModule}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Spacer for desktop sidebar */}
      <div
        className={cn(
          'hidden lg:block flex-shrink-0 transition-all duration-300',
          sidebarCollapsed ? 'w-20' : 'w-72'
        )}
      />
    </>
  )
}

export { DesktopSidebar, MobileSidebar, MobileMenuButton }
