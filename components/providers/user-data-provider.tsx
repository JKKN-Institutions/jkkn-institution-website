'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

type RoleData = { id: string; name: string; display_name: string }

interface UserData {
  name: string
  email: string
  role: string
  permissions: string[]
  isLoading: boolean
}

const defaultUserData: UserData = {
  name: 'User',
  email: '',
  role: 'User',
  permissions: [],
  isLoading: true,
}

const UserDataContext = createContext<UserData>(defaultUserData)

export function useUserData() {
  return useContext(UserDataContext)
}

interface UserDataProviderProps {
  children: ReactNode
  userId: string
  initialData?: Partial<UserData>
}

/**
 * Client-side provider that fetches and caches user data.
 * This prevents re-fetching on every navigation.
 */
export function UserDataProvider({ children, userId, initialData }: UserDataProviderProps) {
  const [userData, setUserData] = useState<UserData>(() => ({
    ...defaultUserData,
    ...initialData,
    isLoading: !initialData,
  }))

  useEffect(() => {
    // ALWAYS fetch fresh data to ensure role changes are reflected
    // initialData is used for initial state only (prevents loading flash)
    async function fetchUserData() {
      const supabase = createClient()

      try {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', userId)
          .single()

        // Get user roles
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('roles(id, name, display_name)')
          .eq('user_id', userId)

        type RoleRelation = RoleData | RoleData[] | null
        const roles = userRoles?.map((ur: { roles: RoleRelation }) => {
          if (Array.isArray(ur.roles)) return ur.roles[0]
          return ur.roles
        }).filter(Boolean) as RoleData[] || []

        const roleNames = roles.map((r) => r?.name).filter(Boolean)
        const isSuperAdmin = roleNames.includes('super_admin')

        // Get permissions
        let permissions: string[] = []
        if (isSuperAdmin) {
          permissions = ['*:*:*']
        } else if (roles.length > 0) {
          const roleIds = roles.map((r) => r?.id).filter(Boolean)
          const { data: rolePermissions } = await supabase
            .from('role_permissions')
            .select('permission')
            .in('role_id', roleIds)

          permissions = [...new Set(rolePermissions?.map((rp) => rp.permission) || [])]
        }

        setUserData({
          name: profile?.full_name || 'User',
          email: profile?.email || '',
          role: roles[0]?.display_name || 'User',
          permissions,
          isLoading: false,
        })
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        setUserData(prev => ({ ...prev, isLoading: false }))
      }
    }

    fetchUserData()
  }, [userId])

  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  )
}
