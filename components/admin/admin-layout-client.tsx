'use client'

import { type ReactNode } from 'react'
import { RealtimeNotificationsProvider } from '@/components/providers/realtime-notifications-provider'
import { UserDataProvider } from '@/components/providers/user-data-provider'

interface UserData {
  name: string
  email: string
  role: string
  permissions: string[]
}

interface AdminLayoutClientProps {
  children: ReactNode
  userId: string
  initialUserData?: UserData
}

/**
 * Client wrapper for the admin layout that provides:
 * - Real-time notifications context
 * - User data context (cached, doesn't re-fetch on navigation)
 */
export function AdminLayoutClient({ children, userId, initialUserData }: AdminLayoutClientProps) {
  return (
    <UserDataProvider userId={userId} initialData={initialUserData}>
      <RealtimeNotificationsProvider userId={userId}>
        {children}
      </RealtimeNotificationsProvider>
    </UserDataProvider>
  )
}
