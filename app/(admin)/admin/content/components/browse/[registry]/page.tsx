/**
 * Browse Specific Registry Page
 *
 * Browse and install components from a specific external registry.
 */

import { getRegistries, syncRegistry, fetchRegistryComponents } from '@/app/actions/cms/registries'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { ComponentBrowser } from './component-browser'
import { Store, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ registry: string }>
}

export default async function BrowseRegistryPage({ params }: Props) {
  const resolvedParams = await params
  const registrySlug = resolvedParams.registry

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

  const registry = registries?.find((r) => r.slug === registrySlug)

  if (!registry) {
    notFound()
  }

  // Get cached components from registry
  const cachedComponents = (registry.cached_components as unknown[]) || []
  const needsSync = !cachedComponents || cachedComponents.length === 0

  return (
    <div className="container py-6 space-y-6">
      <ResponsivePageHeader
        icon={<Store className="h-6 w-6 text-primary" />}
        title={registry.name}
        description={registry.description || `Browse components from ${registry.name}`}
        actions={
          <Link
            href="/admin/content/components/browse"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Libraries
          </Link>
        }
      />

      {/* Registry Info */}
      <div className="flex items-center gap-4 p-4 rounded-xl border bg-card">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
          {registry.name[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{registry.name}</span>
            <Badge variant="outline" className="capitalize">
              {registry.registry_type}
            </Badge>
            {registry.is_active ? (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>
          <a
            href={registry.registry_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            {registry.registry_url}
          </a>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <div>{cachedComponents.length} components</div>
          {registry.last_synced_at && (
            <div>Last synced: {new Date(registry.last_synced_at).toLocaleDateString()}</div>
          )}
        </div>
      </div>

      {/* Needs Sync Warning */}
      {needsSync && (
        <div className="flex items-center gap-4 p-4 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <p className="font-medium text-amber-800 dark:text-amber-200">
              Registry needs to be synced
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Click the sync button to fetch available components from this registry.
            </p>
          </div>
          <form
            action={async () => {
              'use server'
              await syncRegistry(registry.id)
            }}
          >
            <Button type="submit" variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync Now
            </Button>
          </form>
        </div>
      )}

      {/* Component Browser */}
      {!needsSync && (
        <ComponentBrowser
          registry={registry}
          components={cachedComponents as Array<{
            name: string
            displayName?: string
            description?: string
            category?: string
            type?: string
          }>}
        />
      )}

      {/* Empty State */}
      {needsSync && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <Store className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No components loaded</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Sync this registry to load available components. The sync process will fetch
            component metadata from the registry API.
          </p>
        </div>
      )}
    </div>
  )
}
