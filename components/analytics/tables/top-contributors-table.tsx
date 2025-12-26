'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trophy, Medal, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnalyticsCard } from '../analytics-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useDateRange } from '../date-range-selector'
import { getTopContributors } from '@/app/actions/analytics'
import { dateRangeToParams } from '@/lib/analytics/date-presets'
import { exportAnalyticsAsCSV, topContributorsColumns } from '@/lib/analytics/export-utils'
import type { TopContributor } from '@/lib/analytics/types'

interface TopContributorsTableProps {
  limit?: number
  className?: string
}

export function TopContributorsTable({
  limit = 10,
  className
}: TopContributorsTableProps) {
  const [contributors, setContributors] = useState<TopContributor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const dateRange = useDateRange()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const params = dateRangeToParams(dateRange)
        const result = await getTopContributors(params, limit)
        setContributors(result)
      } catch (error) {
        console.error('Failed to fetch top contributors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange, limit])

  const handleExportCSV = () => {
    exportAnalyticsAsCSV(contributors, topContributorsColumns, 'top-contributors')
  }

  return (
    <AnalyticsCard
      title="Top Contributors"
      description="Most active users by activity count"
      isLoading={isLoading}
      onExportCSV={handleExportCSV}
      className={className}
    >
      <div className="space-y-2">
        {contributors.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No activity data for this period
          </p>
        ) : (
          <div className="space-y-2">
            {contributors.map((contributor) => (
              <ContributorRow
                key={contributor.userId}
                contributor={contributor}
              />
            ))}
          </div>
        )}
      </div>
    </AnalyticsCard>
  )
}

function ContributorRow({ contributor }: { contributor: TopContributor }) {
  const initials = contributor.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link
      href={`/admin/users/${contributor.userId}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      {/* Rank */}
      <div className="w-8 flex justify-center">
        <RankBadge rank={contributor.rank} />
      </div>

      {/* Avatar */}
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={contributor.avatarUrl || undefined}
          alt={contributor.fullName}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {/* Name & Email */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{contributor.fullName}</p>
        <p className="text-xs text-muted-foreground truncate">
          {contributor.email}
        </p>
      </div>

      {/* Activity Count */}
      <div className="text-right">
        <p className="font-bold text-lg">{contributor.activityCount}</p>
        <p className="text-xs text-muted-foreground">activities</p>
      </div>
    </Link>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
        <Trophy className="h-4 w-4 text-yellow-600" />
      </div>
    )
  }

  if (rank === 2) {
    return (
      <div className="h-8 w-8 rounded-full bg-slate-400/20 flex items-center justify-center">
        <Medal className="h-4 w-4 text-slate-500" />
      </div>
    )
  }

  if (rank === 3) {
    return (
      <div className="h-8 w-8 rounded-full bg-amber-600/20 flex items-center justify-center">
        <Award className="h-4 w-4 text-amber-700" />
      </div>
    )
  }

  return (
    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
      <span className="text-sm font-medium text-muted-foreground">{rank}</span>
    </div>
  )
}

// Loading skeleton
export function TopContributorsTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="space-y-1 mb-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-5 w-12 ml-auto" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
