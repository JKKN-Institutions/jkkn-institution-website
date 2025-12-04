/**
 * Add Registry Page
 *
 * Form to add a new external component registry.
 */

import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { RegistryForm } from '../registry-form'
import { Store } from 'lucide-react'

export default function NewRegistryPage() {
  return (
    <div className="container py-6 space-y-6 max-w-2xl">
      <ResponsivePageHeader
        icon={<Store className="h-6 w-6 text-primary" />}
        title="Add Registry"
        description="Configure a new external component registry"
      />

      <RegistryForm />
    </div>
  )
}
