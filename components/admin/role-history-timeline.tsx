'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Shield, ShieldOff, Clock, User } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { getRoleHistory, type RoleHistoryEntry } from '@/app/actions/users'

interface RoleHistoryTimelineProps {
  userId: string
}

const getRoleColor = (roleName: string | null | undefined) => {
  switch (roleName) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300'
    case 'director':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
    case 'chair':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
    case 'member':
      return 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary/90'
    case 'guest':
      return 'bg-secondary/20 text-secondary-foreground border-secondary/30'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

export function RoleHistoryTimeline({ userId }: RoleHistoryTimelineProps) {
  const [history, setHistory] = useState<RoleHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true)
      const data = await getRoleHistory(userId)
      setHistory(data)
      setIsLoading(false)
    }
    fetchHistory()
  }, [userId])

  if (isLoading) {
    return (
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Role History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Role History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No role changes recorded</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Role History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-6">
            {history.map((entry, index) => (
              <div key={entry.id} className="relative flex gap-4">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    entry.action === 'assigned'
                      ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700'
                      : 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700'
                  }`}
                >
                  {entry.action === 'assigned' ? (
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ShieldOff className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-medium ${
                        entry.action === 'assigned'
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-red-700 dark:text-red-400'
                      }`}
                    >
                      {entry.action === 'assigned' ? 'Assigned' : 'Removed'}
                    </span>
                    {entry.role && (
                      <Badge variant="secondary" className={getRoleColor(entry.role.name)}>
                        {entry.role.display_name}
                      </Badge>
                    )}
                  </div>

                  {/* Changed by and timestamp */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    {entry.changed_by_user && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        by {entry.changed_by_user.full_name || entry.changed_by_user.email}
                      </span>
                    )}
                    <span
                      title={format(new Date(entry.changed_at), 'PPpp')}
                      className="cursor-help"
                    >
                      {formatDistanceToNow(new Date(entry.changed_at), { addSuffix: true })}
                    </span>
                  </div>

                  {/* Reason if provided */}
                  {entry.reason && (
                    <p className="mt-1 text-sm text-muted-foreground italic">
                      &quot;{entry.reason}&quot;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
