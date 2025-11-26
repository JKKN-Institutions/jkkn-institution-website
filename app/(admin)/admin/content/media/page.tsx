import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getMediaLibrary, getMediaFolders, getStorageStats } from '@/app/actions/cms/media'
import { MediaLibrary } from './media-library'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Media Library | JKKN Admin',
}

async function checkAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const hasPermission = await checkPermission(user.id, 'cms:media:view')
  if (!hasPermission) {
    redirect('/admin/unauthorized')
  }

  return user
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    type?: string
    folder?: string
    search?: string
  }>
}

async function MediaLibraryContent({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const file_type = params.type || undefined
  const folder = params.folder || undefined
  const search = params.search || undefined

  const [mediaResult, folders, stats] = await Promise.all([
    getMediaLibrary({ page, limit: 24, file_type, folder, search }),
    getMediaFolders(),
    getStorageStats(),
  ])

  return (
    <MediaLibrary
      initialMedia={mediaResult}
      folders={folders}
      stats={stats}
    />
  )
}

function MediaLibrarySkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filters skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export default async function MediaLibraryPage({ searchParams }: PageProps) {
  await checkAccess()

  return (
    <div className="p-6">
      <Suspense fallback={<MediaLibrarySkeleton />}>
        <MediaLibraryContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
