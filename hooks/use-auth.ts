'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

interface Member {
  id: string
  user_id: string
  member_id: string | null
  chapter: string | null
  status: string
  membership_type: string | null
  profile: {
    email: string
    full_name: string | null
  } | null
  roles: string[]
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          await fetchMemberData(session.user.id)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchMemberData(session.user.id)
      } else {
        setUser(null)
        setMember(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchMemberData = async (userId: string) => {
    try {
      // Fetch member data with profile info
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select(
          `
          id,
          user_id,
          member_id,
          chapter,
          status,
          membership_type,
          profile:profiles!members_profile_id_fkey(
            email,
            full_name
          )
        `
        )
        .eq('user_id', userId)
        .single()

      if (memberError) {
        console.error('Error fetching member:', memberError)
        return
      }

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', userId)

      if (rolesError) {
        console.error('Error fetching roles:', rolesError)
      }

      // Extract role names from the nested structure
      // Supabase returns roles as either an object or array depending on the join
      const roles: string[] = []
      if (rolesData) {
        for (const item of rolesData) {
          const rolesField = item.roles as unknown
          if (Array.isArray(rolesField)) {
            // If it's an array, extract names from each item
            for (const r of rolesField) {
              if (r && typeof r === 'object' && 'name' in r && typeof r.name === 'string') {
                roles.push(r.name)
              }
            }
          } else if (rolesField && typeof rolesField === 'object' && 'name' in rolesField) {
            // If it's a single object with name
            const name = (rolesField as { name: string }).name
            if (name) roles.push(name)
          }
        }
      }

      // Handle profile - Supabase returns array for foreign key selects with single()
      const profileData = memberData.profile
      const profile = Array.isArray(profileData)
        ? (profileData[0] as { email: string; full_name: string | null } | undefined) || null
        : profileData as { email: string; full_name: string | null } | null

      setMember({
        ...memberData,
        profile,
        roles,
      })
    } catch (error) {
      console.error('Error fetching member data:', error)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setMember(null)
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return {
    user,
    member,
    loading,
    signOut,
    isAuthenticated: !!user,
  }
}
