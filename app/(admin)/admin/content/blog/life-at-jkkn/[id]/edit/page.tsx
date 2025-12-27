import { Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { LifeAtJKKNForm } from '../../life-at-jkkn-form'
import { getLifeAtJKKNItem, getLifeAtJKKNCategories } from '@/app/actions/cms/life-at-jkkn'

interface EditLifeAtJKKNPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditLifeAtJKKNPage({ params }: EditLifeAtJKKNPageProps) {
  const { id } = await params

  // Fetch item and categories
  const [item, categories] = await Promise.all([
    getLifeAtJKKNItem(id),
    getLifeAtJKKNCategories({ includeInactive: false }),
  ])

  if (!item) {
    notFound()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="Edit Life@JKKN Card"
        description={`Editing: ${item.title}`}
        badge="Life@JKKN"
        actions={
          <Button asChild variant="outline" className="min-h-[44px]">
            <Link href="/admin/content/blog/life-at-jkkn">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cards
            </Link>
          </Button>
        }
      />

      {/* Form */}
      <LifeAtJKKNForm item={item} categories={categories} />
    </div>
  )
}
