import { notFound } from 'next/navigation'
import { getUserById } from '@/app/actions/users'
import { getRoles } from '@/app/actions/roles'
import { UserDetailView } from './user-detail-view'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, User, Sparkles, Activity } from 'lucide-react'

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params
  const [user, roles] = await Promise.all([getUserById(id), getRoles()])

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header with Glassmorphism */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hover:bg-primary/5">
              <Link href="/admin/users">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="p-3 rounded-xl bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  {user.full_name || 'User Details'}
                </h1>
                <span className="badge-brand">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Profile
                </span>
              </div>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/admin/users/${id}/activity`}>
                <Activity className="mr-2 h-4 w-4" />
                View Activity
              </Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-brand">
              <Link href={`/admin/users/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* User Detail View */}
      <UserDetailView user={user} roles={roles} />
    </div>
  )
}
