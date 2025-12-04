import { Suspense } from 'react'
import { ComponentsGrid } from './components-grid'
import { CollectionSidebar } from './collection-sidebar'
import { Plus, Puzzle, LayoutGrid, List } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCollectionTree, getUncategorizedCount } from '@/app/actions/cms/collections'
import { getComponents } from '@/app/actions/cms/components'
import type { ComponentCategory } from '@/lib/supabase/database.types'

interface ComponentsPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    search?: string
    category?: string
    collection?: string
    view?: string
    mode?: string
    returnTo?: string
  }>
}

export default async function ComponentsPage({ searchParams }: ComponentsPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 24
  const search = params.search || ''
  const category = params.category || ''
  const collectionId = params.collection || ''
  const viewMode = params.view || 'grid'
  const selectMode = params.mode === 'select'
  const returnTo = params.returnTo || ''

  // Fetch data in parallel
  const [collectionsData, componentsData] = await Promise.all([
    getCollectionTree(),
    getComponents({
      page,
      limit,
      search: search || undefined,
      category: category as ComponentCategory | undefined,
      collection_id: collectionId === 'uncategorized' ? null : collectionId || undefined,
    }),
  ])

  const uncategorizedCount = await getUncategorizedCount()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Mobile Responsive */}
      <ResponsivePageHeader
        icon={<Puzzle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title={selectMode ? 'Select Component' : 'Components'}
        description={
          selectMode
            ? 'Choose a component to add to your page'
            : 'Manage custom components for the page builder'
        }
        badge="Library"
        actions={
          !selectMode && (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                className="hidden sm:flex"
              >
                <Link href="/admin/content/components/browse">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Browse Library
                </Link>
              </Button>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 shadow-brand w-full sm:w-auto min-h-[44px]"
              >
                <Link href="/admin/content/components/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Component
                </Link>
              </Button>
            </div>
          )
        }
      />

      {/* Main Content - Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Collection Sidebar - Desktop only */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="glass-card rounded-xl p-4 sticky top-4">
            <Suspense fallback={<CollectionSidebarSkeleton />}>
              <CollectionSidebar
                collections={collectionsData}
                selectedCollection={collectionId}
                uncategorizedCount={uncategorizedCount}
                selectMode={selectMode}
                returnTo={returnTo}
              />
            </Suspense>
          </div>
        </aside>

        {/* Components Grid/List */}
        <div className="flex-1 min-w-0">
          <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <Suspense fallback={<ComponentsGridSkeleton viewMode={viewMode} />}>
              <ComponentsGrid
                components={componentsData.components}
                total={componentsData.total}
                page={page}
                limit={limit}
                totalPages={componentsData.totalPages}
                search={search}
                category={category}
                collectionId={collectionId}
                viewMode={viewMode}
                selectMode={selectMode}
                returnTo={returnTo}
                collections={collectionsData}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function CollectionSidebarSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-24 rounded-lg" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 flex-1 rounded-lg" />
            <Skeleton className="h-4 w-6 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ComponentsGridSkeleton({ viewMode }: { viewMode: string }) {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
        {Array.from({ length: viewMode === 'grid' ? 12 : 8 }).map((_, i) =>
          viewMode === 'grid' ? (
            <div key={i} className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-border/50">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          )
        )}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-4 w-48 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
