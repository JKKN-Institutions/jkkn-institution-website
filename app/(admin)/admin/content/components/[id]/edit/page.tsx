import { notFound } from 'next/navigation'
import { getComponentById } from '@/app/actions/cms/components'
import { getCollections } from '@/app/actions/cms/collections'
import { EditComponentForm } from './edit-component-form'

interface EditComponentPageProps {
  params: Promise<{ id: string }>
}

export default async function EditComponentPage({ params }: EditComponentPageProps) {
  const { id } = await params

  // Fetch component and collections in parallel
  const [component, collections] = await Promise.all([
    getComponentById(id),
    getCollections()
  ])

  if (!component) {
    notFound()
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Component</h1>
        <p className="text-muted-foreground mt-2">
          Modify the component code and settings
        </p>
      </div>

      <EditComponentForm
        component={component}
        collections={collections}
      />
    </div>
  )
}
