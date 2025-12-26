'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { AnalyticsCard } from '../analytics-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getRecentUsers } from '@/app/actions/analytics'
import { exportAnalyticsAsCSV } from '@/lib/analytics/export-utils'
import type { RecentUser } from '@/lib/analytics/types'

interface RecentUsersTableProps {
  limit?: number
  className?: string
}

export function RecentUsersTable({ limit = 10, className }: RecentUsersTableProps) {
  const [users, setUsers] = useState<RecentUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const result = await getRecentUsers(limit)
        setUsers(result)
      } catch (error) {
        console.error('Failed to fetch recent users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [limit])

  const handleExportCSV = () => {
    const columns = [
      { key: 'fullName', header: 'Name' },
      { key: 'email', header: 'Email' },
      {
        key: 'roles',
        header: 'Roles',
        accessor: (row: unknown) => {
          const user = row as RecentUser
          return user.roles.map((r) => r.displayName).join(', ')
        }
      },
      { key: 'createdAt', header: 'Joined' }
    ]
    exportAnalyticsAsCSV(users, columns, 'recent-users')
  }

  return (
    <AnalyticsCard
      title="Recent Users"
      description={`Last ${limit} users who joined`}
      isLoading={isLoading}
      onExportCSV={handleExportCSV}
      className={className}
    >
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No users found
          </p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </AnalyticsCard>
  )
}

function UserRow({ user }: { user: RecentUser }) {
  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link
      href={`/admin/users/${user.id}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.fullName}</p>
        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex gap-1">
          {user.roles.slice(0, 2).map((role) => (
            <Badge key={role.id} variant="secondary" className="text-xs">
              {role.displayName}
            </Badge>
          ))}
          {user.roles.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{user.roles.length - 2}
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
        </span>
      </div>
    </Link>
  )
}

// Loading skeleton
export function RecentUsersTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="space-y-1 mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
