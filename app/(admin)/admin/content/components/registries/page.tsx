/**
 * Registry Management Page
 *
 * Manage external component registries (shadcn, reactbits, custom URLs)
 * for installing pre-built components into the library.
 */

import { getRegistries } from '@/app/actions/cms/registries'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { RegistriesTable } from './registries-table'
import { Plus, Store } from 'lucide-react'

export default async function RegistriesPage() {
  const { registries, error } = await getRegistries()

  if (error) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <ResponsivePageHeader
        icon={<Store className="h-6 w-6 text-primary" />}
        title="Component Registries"
        description="Manage external component libraries and registries"
        actions={
          <a
            href="/admin/content/components/registries/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Registry
          </a>
        }
      />

      {/* Registry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <div className="text-sm text-muted-foreground">Total Registries</div>
          <div className="text-2xl font-bold mt-1">{registries?.length || 0}</div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold mt-1 text-green-600">
            {registries?.filter((r) => r.is_active).length || 0}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-sm text-muted-foreground">shadcn/ui</div>
          <div className="text-2xl font-bold mt-1">
            {registries?.filter((r) => r.registry_type === 'shadcn').length || 0}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-sm text-muted-foreground">Custom</div>
          <div className="text-2xl font-bold mt-1">
            {registries?.filter((r) => r.registry_type === 'custom').length || 0}
          </div>
        </div>
      </div>

      {/* Registries Table */}
      <RegistriesTable registries={registries || []} />
    </div>
  )
}
