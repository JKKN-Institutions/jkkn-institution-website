'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

interface Member {
  id: string
  email: string
  full_name: string
  role: string
  permissions: string[]
  chapter_id: string
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
      const { data, error } = await supabase
        .from('members')
        .select(
          `
          id,
          email,
          full_name,
          role,
          permissions,
          chapter_id
        `
        )
        .eq('id', userId)
        .single()

      if (error) throw error

      setMember(data as Member)
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
