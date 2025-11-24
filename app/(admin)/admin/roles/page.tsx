import { getRoles } from '@/app/actions/roles'
import { RolesList } from './roles-list'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Shield, Sparkles } from 'lucide-react'

export default async function RolesPage() {
  const roles = await getRoles()

  return (
    <div className="space-y-6">
      {/* Page Header with Glassmorphism */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">Roles & Permissions</h1>
                <span className="badge-brand">
                  <Sparkles className="h-3 w-3 mr-1" />
                  RBAC
                </span>
              </div>
              <p className="text-muted-foreground mt-1">
                Manage user roles and their associated permissions
              </p>
            </div>
          </div>

          <Button asChild className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20">
            <Link href="/admin/roles/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Link>
          </Button>
        </div>
      </div>

      {/* Roles List */}
      <RolesList roles={roles} />
    </div>
  )
}
