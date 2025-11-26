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
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  Globe,
  UserPlus,
  Mail,
  Plus,
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

interface ResponsiveNavigationProps {
  userPermissions: string[]
}

// Navigation configuration
const navigationModules: NavModule[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    color: 'bg-blue-500',
  },
  {
    id: 'users',
    label: 'Users',
    href: '/admin/users',
    icon: Users,
    color: 'bg-green-500',
    permission: 'users:profiles:view',
    subModules: [
      {
        id: 'all-users',
        label: 'All Users',
        href: '/admin/users',
        icon: Users,
        permission: 'users:profiles:view',
      },
      {
        id: 'new-user',
        label: 'Add User',
        href: '/admin/users/new',
        icon: UserPlus,
        permission: 'users:profiles:create',
      },
    ],
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    href: '/admin/roles',
    icon: Shield,
    color: 'bg-purple-500',
    permission: 'users:roles:view',
  },
  {
    id: 'activity',
    label: 'Activity Logs',
    href: '/admin/activity',
    icon: Activity,
    color: 'bg-orange-500',
    permission: 'users:activity:view',
  },
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
        id: 'media',
        label: 'Media Library',
        href: '/admin/content/media',
        icon: Image,
        permission: 'cms:media:view',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    color: 'bg-gray-500',
    permission: 'system:settings:view',
  },
]

// Desktop Sidebar Component
function DesktopSidebar({
  modules,
  activeModule,
  activeSubModule,
  collapsed,
  onToggleCollapse,
}: {
  modules: NavModule[]
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

  return (
    <aside
      className={cn(
        'hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col glass-sidebar transition-all duration-300 ease-out',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center shadow-brand group-hover:shadow-lg transition-shadow duration-300 flex-shrink-0">
            <span className="text-white font-bold text-lg">JK</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="text-lg font-semibold text-foreground">JKKN Admin</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3 text-secondary" />
                <span>Institution Portal</span>
              </div>
            </div>
          )}
        </Link>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Main Menu
          </div>
        )}
        {modules.map((module) => {
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
        })}
      </nav>

      {/* View Website Link */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 group',
            collapsed ? 'justify-center px-2' : 'justify-center'
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

// Mobile Bottom Navigation Component
function MobileBottomNav({
  modules,
  activeModule,
  activeSubModule,
  onModuleClick,
}: {
  modules: NavModule[]
  activeModule: string
  activeSubModule: string
  onModuleClick: (moduleId: string) => void
}) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const pathname = usePathname()

  const handleModuleClick = (module: NavModule) => {
    if (module.subModules && module.subModules.length > 0) {
      setExpandedModule(expandedModule === module.id ? null : module.id)
    } else {
      setExpandedModule(null)
      onModuleClick(module.id)
    }
  }

  // Close expanded menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setExpandedModule(null)
    if (expandedModule) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [expandedModule])

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      {/* Submodule Popup */}
      {expandedModule && (
        <div
          className="absolute bottom-full mb-3 left-0 right-0 mx-auto max-w-fit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-2 p-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl">
            {modules
              .find((m) => m.id === expandedModule)
              ?.subModules?.map((sub) => {
                const isActive = pathname === sub.href || pathname.startsWith(sub.href + '/')
                return (
                  <Link
                    key={sub.id}
                    href={sub.href}
                    onClick={() => setExpandedModule(null)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-foreground/80 hover:bg-primary/10'
                    )}
                  >
                    <sub.icon className="h-5 w-5" />
                    <span className="font-medium">{sub.label}</span>
                    {sub.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                        {sub.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div
        className="flex items-center justify-around px-2 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {modules.slice(0, 5).map((module) => {
          const isActive = activeModule === module.id
          const isExpanded = expandedModule === module.id
          const hasSubModules = module.subModules && module.subModules.length > 0

          return (
            <button
              key={module.id}
              onClick={() => handleModuleClick(module)}
              className={cn(
                'relative flex flex-col items-center justify-center min-w-[56px] px-2 py-2 rounded-xl transition-all duration-300',
                isActive || isExpanded
                  ? 'bg-primary/15 text-primary scale-105'
                  : 'text-foreground/60 hover:text-foreground hover:bg-primary/5'
              )}
            >
              <div className="relative">
                <module.icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-200',
                    (isActive || isExpanded) && 'scale-110'
                  )}
                />
                {module.badge && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {module.badge > 9 ? '9+' : module.badge}
                  </span>
                )}
                {hasSubModules && (
                  <ChevronDown
                    className={cn(
                      'absolute -bottom-1 -right-1 h-3 w-3 transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                  />
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium truncate max-w-[56px]">
                {module.label}
              </span>
              {isActive && !isExpanded && (
                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// Main Responsive Navigation Component
export function ResponsiveNavigation({ userPermissions }: ResponsiveNavigationProps) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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

  // Filter modules based on permissions
  const filteredModules = navigationModules
    .filter((module) => hasPermission(module.permission))
    .map((module) => ({
      ...module,
      subModules: module.subModules?.filter((sub) => hasPermission(sub.permission)),
    }))

  // Determine active module and submodule based on pathname
  const getActiveIds = () => {
    for (const module of filteredModules) {
      if (module.subModules) {
        for (const sub of module.subModules) {
          if (pathname === sub.href || pathname.startsWith(sub.href + '/')) {
            return { moduleId: module.id, subModuleId: sub.id }
          }
        }
      }
      if (module.href === '/admin' && (pathname === '/admin' || pathname === '/admin/dashboard')) {
        return { moduleId: module.id, subModuleId: '' }
      }
      if (pathname === module.href || pathname.startsWith(module.href + '/')) {
        return { moduleId: module.id, subModuleId: '' }
      }
    }
    return { moduleId: 'dashboard', subModuleId: '' }
  }

  const { moduleId: activeModule, subModuleId: activeSubModule } = getActiveIds()

  const handleModuleClick = (moduleId: string) => {
    // Navigation is handled by Link components
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar
        modules={filteredModules}
        activeModule={activeModule}
        activeSubModule={activeSubModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        modules={filteredModules}
        activeModule={activeModule}
        activeSubModule={activeSubModule}
        onModuleClick={handleModuleClick}
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

export { DesktopSidebar, MobileBottomNav }
