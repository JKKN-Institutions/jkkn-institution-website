/**
 * Browse External Libraries Page
 *
 * Browse components from all configured registries.
 */

import { getRegistries } from '@/app/actions/cms/registries'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import Link from 'next/link'
import { Globe, Package, ArrowRight, RefreshCw, Blocks, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function BrowseLibrariesPage() {
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

  const activeRegistries = registries?.filter((r) => r.is_active) || []

  return (
    <div className="container py-6 space-y-6">
      <ResponsivePageHeader
        icon={<Globe className="h-6 w-6 text-primary" />}
        title="Browse Libraries"
        description="Explore and install components from external libraries"
      />

      {/* Built-in Libraries */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Star className="h-4 w-4" />
          Built-in Libraries
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* shadcn/ui Library Card */}
          <Link
            href="/admin/content/components/shadcn"
            className="group rounded-xl border bg-card hover:shadow-lg hover:border-primary/50 transition-all overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="h-24 bg-gradient-to-br from-violet-500 to-purple-600 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Blocks className="h-10 w-10 text-white/80" />
              </div>
              <div className="absolute bottom-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0 backdrop-blur-sm"
                >
                  Official
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  shadcn/ui
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  Beautifully designed components built with Radix UI and Tailwind CSS
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>257 components</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* External Registries */}
      {activeRegistries.length === 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Globe className="h-4 w-4" />
            External Registries
          </h3>
          <div className="rounded-xl border bg-card p-12 text-center">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No registries configured</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a component registry to start browsing external libraries.
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/content/components/registries/new">Add Registry</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Globe className="h-4 w-4" />
            External Registries
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRegistries.map((registry) => {
            const cachedComponents = registry.cached_components as unknown[]
            const componentCount = Array.isArray(cachedComponents) ? cachedComponents.length : 0

            return (
              <Link
                key={registry.id}
                href={`/admin/content/components/browse/${registry.slug}`}
                className="group rounded-xl border bg-card hover:shadow-lg hover:border-primary/50 transition-all overflow-hidden"
              >
                {/* Header with gradient */}
                <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-0 backdrop-blur-sm"
                    >
                      {registry.registry_type}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {registry.name}
                    </h3>
                    {registry.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {registry.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>
                        {componentCount > 0
                          ? `${componentCount} components`
                          : 'Sync to load components'}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Sync status */}
                  {registry.sync_status === 'never' && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-1 rounded-md">
                      <RefreshCw className="h-3 w-3" />
                      Sync required to browse components
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/content/components/registries">Manage Registries</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/content/components/registries/new">Add New Registry</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
