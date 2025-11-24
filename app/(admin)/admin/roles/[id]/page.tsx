import { notFound } from 'next/navigation'
import { getRoleById, getAvailablePermissions } from '@/app/actions/roles'
import { RoleDetailView } from './role-detail-view'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Shield, Sparkles } from 'lucide-react'

interface RoleDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function RoleDetailPage({ params }: RoleDetailPageProps) {
  const { id } = await params
  const [role, availablePermissions] = await Promise.all([
    getRoleById(id),
    getAvailablePermissions(),
  ])

  if (!role) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header with Glassmorphism */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hover:bg-primary/5">
              <Link href="/admin/roles">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">{role.display_name}</h1>
                <span className="badge-brand">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Role
                </span>
              </div>
              <p className="text-muted-foreground">{role.description || 'No description'}</p>
            </div>
          </div>

          {!role.is_system_role && (
            <Button asChild className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20">
              <Link href={`/admin/roles/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Role
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Role Detail View */}
      <RoleDetailView role={role} availablePermissions={availablePermissions} />
    </div>
  )
}
