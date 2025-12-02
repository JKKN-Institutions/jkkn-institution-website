import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { TemplateForm } from '../../template-form'
import { Layout } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { getTemplateById } from '@/app/actions/cms/templates'

export const metadata = {
  title: 'Edit Template | JKKN Admin',
  description: 'Edit an existing page template',
}

interface EditTemplatePageProps {
  params: Promise<{ id: string }>
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { id } = await params
  const template = await getTemplateById(id)

  if (!template) {
    notFound()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Layout className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title={`Edit: ${template.name}`}
        description="Modify template details and settings"
        badge={template.is_system ? 'System' : 'Custom'}
      />

      {/* Template Form */}
      <Suspense fallback={<TemplateFormSkeleton />}>
        <TemplateForm template={template} mode="edit" />
      </Suspense>
    </div>
  )
}

function TemplateFormSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-6">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="glass-card rounded-xl p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="glass-card rounded-xl p-6 space-y-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
