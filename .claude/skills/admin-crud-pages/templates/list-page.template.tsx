// Template for an admin list page (Server Component).
// Copy to app/(admin)/admin/<entity>/page.tsx and replace Widget/widgets.
// Mirrors app/(admin)/admin/videos/page.tsx.

import { getWidgets } from '@/app/actions/widgets'
import { Button } from '@/components/ui/button'
import { Plus, Boxes } from 'lucide-react'
import Link from 'next/link'
import { WidgetsTable } from './widgets-table'

export default async function WidgetsPage() {
  const widgets = await getWidgets()

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Boxes className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Widgets</h1>
              <p className="text-sm text-muted-foreground">Manage widgets shown across the site</p>
            </div>
          </div>
          <Button asChild className="gap-2">
            <Link href="/admin/widgets/new">
              <Plus className="w-4 h-4" />
              Add Widget
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Boxes className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{widgets.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Boxes className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{widgets.filter((w) => w.is_active).length}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center">
            <Boxes className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{widgets.filter((w) => !w.is_active).length}</p>
            <p className="text-sm text-muted-foreground">Hidden</p>
          </div>
        </div>
      </div>

      {/* Table (client component) */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <WidgetsTable widgets={widgets} />
      </div>
    </div>
  )
}
