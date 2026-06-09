'use client'

// Minimal client table skeleton. Co-locate as app/(admin)/admin/<entity>/<entity>-table.tsx.
// IMPORTANT: For the real implementation (TanStack Table v8, server-side pagination/sort/filter,
// row selection, bulk actions, CSV/Excel export), load the `advanced-tables-components` skill and
// follow its patterns. This skeleton is only the wiring + row actions shape.

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteWidget, type Widget } from '@/app/actions/widgets'

export function WidgetsTable({ widgets }: { widgets: Widget[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete(id: string) {
    if (!confirm('Delete this widget?')) return
    startTransition(async () => {
      const res = await deleteWidget(id)
      if (!res.success) setError(res.error ?? 'Delete failed')
      else router.refresh() // server action already revalidated; refresh re-fetches
    })
  }

  if (widgets.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No widgets yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="py-2 pr-4 font-medium">Name</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 pr-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {widgets.map((w) => (
            <tr key={w.id} className="border-b last:border-0">
              <td className="py-2 pr-4">{w.name}</td>
              <td className="py-2 pr-4">{w.is_active ? 'Active' : 'Hidden'}</td>
              <td className="py-2 pr-4">
                <div className="flex justify-end gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/widgets/${w.id}/edit`}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleDelete(w.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
