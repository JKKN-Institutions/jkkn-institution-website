'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Settings,
  Palette,
  Bell,
  Shield,
  Search,
  ChevronRight,
  PanelBottom,
} from 'lucide-react'

const settingsNavItems = [
  {
    title: 'General',
    href: '/admin/settings/general',
    icon: Settings,
    description: 'Site name, contact info, and social links',
  },
  {
    title: 'Appearance',
    href: '/admin/settings/appearance',
    icon: Palette,
    description: 'Logo, colors, and branding',
  },
  {
    title: 'Notifications',
    href: '/admin/settings/notifications',
    icon: Bell,
    description: 'Email and SMTP configuration',
  },
  {
    title: 'System',
    href: '/admin/settings/system',
    icon: Shield,
    description: 'Maintenance mode and security',
  },
  {
    title: 'SEO',
    href: '/admin/settings/seo',
    icon: Search,
    description: 'Meta tags and analytics',
  },
  {
    title: 'Footer',
    href: '/admin/settings/footer',
    icon: PanelBottom,
    description: 'Footer links and content',
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure your website settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <nav className="w-full lg:w-64 flex-shrink-0">
          <div className="glass-card rounded-2xl p-4 space-y-1">
            {settingsNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-brand'
                      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      'font-medium text-sm',
                      isActive ? 'text-primary-foreground' : ''
                    )}>
                      {item.title}
                    </div>
                    <div className={cn(
                      'text-xs truncate',
                      isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {item.description}
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 flex-shrink-0 transition-transform',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground opacity-0 group-hover:opacity-100',
                      isActive && 'translate-x-0.5'
                    )}
                  />
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
