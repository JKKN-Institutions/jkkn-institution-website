'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Newspaper,
  FolderOpen,
  Tags,
  MessageSquare,
  PenLine,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  ExternalLink,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubNavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  subModules?: SubNavItem[]
}

interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/faculty-admin/manage',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 'faculty-management',
    label: 'Faculty Management',
    items: [
      {
        id: 'faculty',
        label: 'Faculty',
        href: '/faculty-admin/manage',
        icon: Users,
        subModules: [
          {
            id: 'faculty-members',
            label: 'All Members',
            href: '/faculty-admin/manage',
            icon: Users,
          },
          {
            id: 'faculty-new',
            label: 'Add Faculty',
            href: '/faculty-admin/manage/new',
            icon: UserPlus,
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
        id: 'blog',
        label: 'Blog',
        href: '/faculty-admin/manage/blog',
        icon: PenLine,
        subModules: [
          {
            id: 'blog-posts',
            label: 'All Posts',
            href: '/faculty-admin/manage/blog',
            icon: Newspaper,
          },
          {
            id: 'blog-categories',
            label: 'Categories',
            href: '/faculty-admin/manage/blog/categories',
            icon: FolderOpen,
          },
          {
            id: 'blog-tags',
            label: 'Tags',
            href: '/faculty-admin/manage/blog/tags',
            icon: Tags,
          },
          {
            id: 'blog-comments',
            label: 'Comments',
            href: '/faculty-admin/manage/blog/comments',
            icon: MessageSquare,
          },
        ],
      },
    ],
  },
]

function getActiveIds(pathname: string): { moduleId: string; subId: string } {
  // Dashboard — only exact /manage
  if (pathname === '/faculty-admin/manage') {
    return { moduleId: 'dashboard', subId: 'faculty-members' }
  }

  // Faculty add
  if (pathname === '/faculty-admin/manage/new') {
    return { moduleId: 'faculty', subId: 'faculty-new' }
  }

  // Faculty edit — /manage/[id]
  if (
    pathname.startsWith('/faculty-admin/manage/') &&
    !pathname.startsWith('/faculty-admin/manage/blog')
  ) {
    return { moduleId: 'faculty', subId: 'faculty-members' }
  }

  // Blog routes
  if (pathname.startsWith('/faculty-admin/manage/blog/categories')) {
    return { moduleId: 'blog', subId: 'blog-categories' }
  }
  if (pathname.startsWith('/faculty-admin/manage/blog/tags')) {
    return { moduleId: 'blog', subId: 'blog-tags' }
  }
  if (pathname.startsWith('/faculty-admin/manage/blog/comments')) {
    return { moduleId: 'blog', subId: 'blog-comments' }
  }
  if (pathname.startsWith('/faculty-admin/manage/blog')) {
    return { moduleId: 'blog', subId: 'blog-posts' }
  }

  return { moduleId: 'dashboard', subId: '' }
}

interface FacultyAdminSidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onToggleCollapsed: () => void
  onCloseMobile: () => void
}

export function FacultyAdminSidebar({
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: FacultyAdminSidebarProps) {
  const pathname = usePathname()
  const { moduleId: activeModule, subId: activeSub } = getActiveIds(pathname)

  // Keep the active module expanded; allow user to toggle others
  const [expanded, setExpanded] = useState<string[]>([activeModule])

  useEffect(() => {
    setExpanded(prev => (prev.includes(activeModule) ? prev : [...prev, activeModule]))
  }, [activeModule])

  useEffect(() => {
    onCloseMobile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const toggleExpand = (id: string) =>
    setExpanded(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))

  const renderItem = (item: NavItem) => {
    const isActive = activeModule === item.id
    const hasSubs = item.subModules && item.subModules.length > 0
    const isExpanded = expanded.includes(item.id)
    const Icon = item.icon

    if (hasSubs && !collapsed) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpand(item.id)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground',
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-2">
              {item.subModules!.map(sub => {
                const SubIcon = sub.icon
                const active = activeSub === sub.id
                return (
                  <Link
                    key={sub.id}
                    href={sub.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-primary text-white shadow-brand'
                        : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground',
                    )}
                  >
                    <SubIcon className="h-4 w-4 flex-shrink-0" />
                    {sub.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.id}
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary text-white shadow-brand'
            : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground',
          collapsed && 'justify-center px-2',
        )}
      >
        <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-white')} />
        {!collapsed && item.label}
      </Link>
    )
  }

  const SidebarContent = (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <Link href="/faculty-admin/manage" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300 flex-shrink-0">
            <span className="text-white font-bold text-lg">J</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden leading-tight">
              <span className="block text-[0.95rem] font-semibold text-foreground">JKKN Faculty</span>
              <span className="block text-[0.68rem] text-muted-foreground">Engineering Portal</span>
            </div>
          )}
        </Link>
        <button
          onClick={onToggleCollapsed}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto overflow-x-hidden">
        {NAV_GROUPS.map(group => (
          <div key={group.id}>
            {!collapsed && (
              <div className="text-xs font-semibold text-muted-foreground tracking-wider px-3 mb-2">
                {group.label}
              </div>
            )}
            <div className="space-y-1">{group.items.map(renderItem)}</div>
          </div>
        ))}
      </nav>

      {/* View Website */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 group',
            collapsed && 'justify-center px-2',
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
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col bg-card border-r border-border transition-all duration-300 ease-out',
          collapsed ? 'w-20' : 'w-72',
        )}
      >
        {SidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-card border-r border-border transform transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {SidebarContent}
      </aside>
    </>
  )
}
