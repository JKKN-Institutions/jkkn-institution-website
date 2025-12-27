import { Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { LifeAtJKKNForm } from '../life-at-jkkn-form'
import { getLifeAtJKKNCategories } from '@/app/actions/cms/life-at-jkkn'

export default async function NewLifeAtJKKNPage() {
  // Fetch categories
  const categories = await getLifeAtJKKNCategories({ includeInactive: false })

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="New Life@JKKN Card"
        description="Create a new campus life card"
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
      <LifeAtJKKNForm categories={categories} />
    </div>
  )
}
