import { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Trash2, AlertTriangle, RotateCcw, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { TrashTable } from './trash-table'
import { getTrashStatistics } from '@/app/actions/cms/pages'

export const metadata = {
  title: 'Trash | Content Management',
  description: 'Manage deleted pages',
}

export default async function TrashPage() {
  // Fetch trash statistics
  const stats = await getTrashStatistics()

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Professional Header with Statistics */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        {/* Title and Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Trash2 className="h-6 w-6 sm:h-7 sm:w-7 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Trash Bin</h1>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 whitespace-nowrap">
                  {stats.total_in_trash} {stats.total_in_trash === 1 ? 'page' : 'pages'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage deleted pages. Pages in trash are automatically purged after 30 days.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full sm:w-auto sm:flex-shrink-0">
            <Link href="/admin/content/pages">
              <RotateCcw className="mr-2 h-4 w-4" />
              Back to Pages
            </Link>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total in Trash Card */}
          <div className="relative group bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background border border-red-100 dark:border-red-900/30 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Total in Trash</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.total_in_trash}</p>
                <p className="text-xs text-muted-foreground">Pages waiting to be restored or purged</p>
              </div>
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          {/* Expiring Soon Card */}
          <div className="relative group bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-background border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Expiring Soon</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{stats.expiring_soon}</p>
                <p className="text-xs text-muted-foreground">Will be auto-deleted within 7 days</p>
              </div>
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        {stats.expiring_soon > 0 && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                {stats.expiring_soon} {stats.expiring_soon === 1 ? 'page' : 'pages'} will be permanently deleted soon
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Pages deleted more than 23 days ago will be automatically purged in the next 7 days. Restore them now to prevent permanent deletion.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Trash Table */}
      <Suspense fallback={<div>Loading trash...</div>}>
        <TrashTable />
      </Suspense>
    </div>
  )
}
