'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { FacultyAdminSidebar } from './faculty-admin-sidebar'
import { FacultyAdminTopbar } from './faculty-admin-topbar'

const COLLAPSE_KEY = 'faculty-admin-sidebar-collapsed'

interface FacultyAdminShellProps {
  userEmail: string
  children: React.ReactNode
}

export function FacultyAdminShell({ userEmail, children }: FacultyAdminShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(COLLAPSE_KEY) === '1') setCollapsed(true)
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed, hydrated])

  return (
    <div className="admin-layout flex h-screen w-full max-w-full overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
      {/* Decorative gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-primary/10 to-primary/5 blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-t from-secondary/10 to-secondary/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <FacultyAdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={() => setCollapsed(v => !v)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Spacer for desktop fixed sidebar */}
      <div
        className={cn(
          'hidden lg:block flex-shrink-0 transition-all duration-300',
          collapsed ? 'w-20' : 'w-72',
        )}
      />

      {/* Main content column */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <FacultyAdminTopbar
          userEmail={userEmail}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
