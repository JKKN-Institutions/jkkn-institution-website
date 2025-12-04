import { Suspense } from 'react'
import { ComponentForm } from './component-form'
import { ArrowLeft, Puzzle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { getCollections } from '@/app/actions/cms/collections'

interface NewComponentPageProps {
  searchParams: Promise<{
    collection?: string
    source?: string
  }>
}

export default async function NewComponentPage({ searchParams }: NewComponentPageProps) {
  const params = await searchParams
  const preselectedCollection = params.collection || ''
  const sourceType = params.source || 'manual'

  // Fetch collections for the form
  const collections = await getCollections()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Puzzle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="Add Component"
        description="Add a new custom component to your library"
        badge="New"
        actions={
          <Button variant="outline" asChild className="min-h-[44px]">
            <Link href="/admin/content/components">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Components
            </Link>
          </Button>
        }
      />

      {/* Form */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-4xl">
        <Suspense fallback={<FormSkeleton />}>
          <ComponentForm
            collections={collections}
            preselectedCollection={preselectedCollection}
            defaultSourceType={sourceType as 'manual' | 'shadcn' | 'reactbits' | 'external'}
          />
        </Suspense>
      </div>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Name fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>

      {/* Category and Collection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>

      {/* Code editor */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  )
}
