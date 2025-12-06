'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useCallback, useEffect } from 'react'
import { getUserActivityLogs, exportActivityLogsToCSV } from '@/app/actions/users'
import { DataTable } from '@/components/data-table/data-table'
import { columns, type ActivityLogRow } from './columns'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X, Download } from 'lucide-react'
import { toast } from 'sonner'

interface ActivityLogTableProps {
  page: number
  limit: number
  moduleFilter: string
  actionFilter: string
  userIdFilter: string
}

const MODULES = [
  { value: 'users', label: 'Users' },
  { value: 'content', label: 'Content' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'system', label: 'System' },
]

const ACTIONS = [
  { value: 'create', label: 'Create' },
  { value: 'edit', label: 'Edit' },
  { value: 'delete', label: 'Delete' },
  { value: 'view', label: 'View' },
  { value: 'assign_role', label: 'Assign Role' },
  { value: 'remove_role', label: 'Remove Role' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
]

export function ActivityLogTable({
  page: initialPage,
  limit: initialLimit,
  moduleFilter: initialModuleFilter,
  actionFilter: initialActionFilter,
  userIdFilter: initialUserIdFilter,
}: ActivityLogTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State
  const [data, setData] = useState<ActivityLogRow[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [moduleValue, setModuleValue] = useState(initialModuleFilter)
  const [actionValue, setActionValue] = useState(initialActionFilter)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  // Update URL params
  const updateUrlParams = useCallback(
    (params: Record<string, string | number>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, String(value))
        } else {
          newParams.delete(key)
        }
      })

      router.push(`/admin/activity?${newParams.toString()}`)
    },
    [router, searchParams]
  )

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getUserActivityLogs({
        page,
        limit,
        module: moduleValue,
        action: actionValue,
        userId: initialUserIdFilter || undefined,
      })

      setData(result.data as ActivityLogRow[])
      setTotal(result.total)
      setPageCount(result.totalPages)
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      toast.error('Failed to load activity logs')
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, moduleValue, actionValue, initialUserIdFilter])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle filter changes
  const handleModuleChange = (value: string) => {
    setModuleValue(value === 'all' ? '' : value)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ module: value === 'all' ? '' : value, page: 1 })
    })
  }

  const handleActionChange = (value: string) => {
    setActionValue(value === 'all' ? '' : value)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ action: value === 'all' ? '' : value, page: 1 })
    })
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    startTransition(() => {
      updateUrlParams({ page: newPage })
    })
  }

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ limit: newLimit, page: 1 })
    })
  }

  const clearFilters = () => {
    setModuleValue('')
    setActionValue('')
    setPage(1)
    router.push('/admin/activity')
  }

  const handleExport = async () => {
    try {
      toast.info('Preparing export...')

      // Call server action to get CSV data
      const csvData = await exportActivityLogsToCSV({
        userId: initialUserIdFilter || undefined,
        module: moduleValue || undefined,
        action: actionValue || undefined,
      })

      // Create blob and download
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `activity-logs-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Activity logs exported successfully!')
    } catch (error: any) {
      console.error('Export error:', error)
      toast.error(error.message || 'Failed to export activity logs')
    }
  }

  const hasFilters = moduleValue || actionValue

  return (
    <div className="space-y-4">
      {/* Toolbar - Mobile Optimized */}
      <div className="flex flex-col gap-3">
        {/* Filters - Stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={moduleValue || 'all'} onValueChange={handleModuleChange}>
            <SelectTrigger className="w-full sm:w-[150px] bg-background/50 border-border/50 rounded-xl">
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {MODULES.map((module) => (
                <SelectItem key={module.value} value={module.value}>
                  {module.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={actionValue || 'all'} onValueChange={handleActionChange}>
            <SelectTrigger className="w-full sm:w-[150px] bg-background/50 border-border/50 rounded-xl">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {ACTIONS.map((action) => (
                <SelectItem key={action.value} value={action.value}>
                  {action.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} className="self-start">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Export Button - Full width on mobile */}
        <Button onClick={handleExport} variant="outline" className="gap-2 w-full sm:w-auto">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden sm:block">
        <DataTable
          columns={columns}
          data={data}
          pageCount={pageCount}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading || isPending}
        />
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          // Loading skeleton for mobile
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-card animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-muted rounded-full" />
                <div className="h-5 w-16 bg-muted rounded-full" />
              </div>
            </div>
          ))
        ) : data.length > 0 ? (
          data.map((row) => (
            <MobileActivityCard key={row.id} activity={row} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No activity logs found.
          </div>
        )}

        {/* Mobile Pagination */}
        {!isLoading && data.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Page {page} of {pageCount}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pageCount}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Mobile Card Component for Activity Log
function MobileActivityCard({ activity }: { activity: ActivityLogRow }) {
  const user = activity.profiles
  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user?.email[0].toUpperCase() || '?'

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'edit':
      case 'update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {user?.full_name || 'Unknown User'}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user?.email || 'N/A'}</p>
        </div>
      </div>

      {/* Action & Module */}
      <div className="flex flex-wrap gap-2 mb-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
          {activity.action.replace('_', ' ').toUpperCase()}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          {activity.module}
        </span>
      </div>

      {/* Resource & Time */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{activity.resource_type || 'N/A'}</span>
        <span suppressHydrationWarning>{new Date(activity.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
