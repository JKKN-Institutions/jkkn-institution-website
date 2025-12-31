'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

interface User {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  created_at: string
}

export function RecentUsersSection() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRecentUsers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url, created_at')
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error('Error fetching recent users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentUsers()
  }, [])

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  return (
    <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Users</h2>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
          Latest 5
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      ) : users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-transparent hover:border-primary/20 hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-200 group"
            >
              <Avatar className="w-10 h-10 ring-2 ring-white dark:ring-zinc-800 shadow-sm">
                <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || user.email} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-bold">
                  {getInitials(user.full_name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors">
                  {user.full_name || 'Unnamed User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
              <span className="text-xs font-medium text-gray-400 whitespace-nowrap bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md" suppressHydrationWarning>
                {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-primary/5 mb-4">
            <Users className="h-8 w-8 text-primary/40" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No users found</p>
          <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
            New registrations will appear here instantly.
          </p>
        </div>
      )}
    </div>
  )
}
