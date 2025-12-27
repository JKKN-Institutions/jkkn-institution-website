import { Suspense } from 'react'
import { Plus, Heart, FolderOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { LifeAtJKKNCards } from './life-at-jkkn-cards'
import { getLifeAtJKKNItems, getLifeAtJKKNCategories } from '@/app/actions/cms/life-at-jkkn'

interface LifeAtJKKNPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
    category?: string
  }>
}

export default async function LifeAtJKKNPage({ searchParams }: LifeAtJKKNPageProps) {
  const params = await searchParams

  // Fetch initial data server-side
  const [itemsResult, categories] = await Promise.all([
    getLifeAtJKKNItems({
      page: Number(params.page) || 1,
      limit: 50,
      status: params.status as 'draft' | 'published' | undefined,
      category_id: params.category || undefined,
      search: params.search || undefined,
    }),
    getLifeAtJKKNCategories({ includeInactive: true }),
  ])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="Life @ JKKN"
        description="Manage campus life cards - Sports, Culture, Community & more"
        badge="Life@JKKN"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/blog/life-at-jkkn/categories">
                <FolderOpen className="mr-2 h-4 w-4" />
                Categories
              </Link>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 shadow-brand min-h-[44px]"
            >
              <Link href="/admin/content/blog/life-at-jkkn/new">
                <Plus className="mr-2 h-4 w-4" />
                New Card
              </Link>
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Cards"
          value={itemsResult.total}
          icon={<Heart className="h-5 w-5" />}
          color="text-primary"
        />
        <StatCard
          label="Published"
          value={itemsResult.data.filter(i => i.status === 'published').length}
          icon={<Heart className="h-5 w-5" />}
          color="text-green-600"
        />
        <StatCard
          label="Drafts"
          value={itemsResult.data.filter(i => i.status === 'draft').length}
          icon={<Heart className="h-5 w-5" />}
          color="text-yellow-600"
        />
        <StatCard
          label="Categories"
          value={categories.length}
          icon={<FolderOpen className="h-5 w-5" />}
          color="text-blue-600"
        />
      </div>

      {/* Cards Grid */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <Suspense fallback={<CardsSkeleton />}>
          <LifeAtJKKNCards initialData={itemsResult} />
        </Suspense>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-4">
      <div className={`p-2 rounded-lg bg-muted ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

function CardsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
        <Skeleton className="h-10 w-full sm:w-32 rounded-xl" />
        <Skeleton className="h-10 w-full sm:w-32 rounded-xl" />
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-border/50">
            <Skeleton className="h-[200px] w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
