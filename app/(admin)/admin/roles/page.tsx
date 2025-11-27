import { getRoles } from '@/app/actions/roles'
import { RolesPageClient } from './roles-page-client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Shield } from 'lucide-react'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'

export default async function RolesPage() {
  const roles = await getRoles()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Mobile Responsive */}
      <ResponsivePageHeader
        icon={<Shield className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />}
        title="Roles & Permissions"
        description="Manage user roles and their associated permissions"
        badge="RBAC"
        actions={
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 w-full sm:w-auto min-h-[44px]"
          >
            <Link href="/admin/roles/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Link>
          </Button>
        }
      />

      {/* Roles Content with View Toggle */}
      <RolesPageClient roles={roles} />
    </div>
  )
}
