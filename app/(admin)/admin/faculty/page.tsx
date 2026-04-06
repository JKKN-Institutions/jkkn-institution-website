import { getAllFaculty } from '@/app/actions/faculty'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { FacultyTable } from './faculty-table'

export default async function FacultyPage() {
  const faculty = await getAllFaculty()

  const published = faculty.filter(f => f.status === 'published' && f.is_active)
  const drafts = faculty.filter(f => f.status === 'draft')
  const inactive = faculty.filter(f => !f.is_active)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Faculty Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage faculty profiles displayed on the website
              </p>
            </div>
          </div>
          <Button asChild className="gap-2">
            <Link href="/admin/faculty/new">
              <Plus className="w-4 h-4" />
              Add Faculty
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{faculty.length}</p>
            <p className="text-sm text-muted-foreground">Total Faculty</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{published.length}</p>
            <p className="text-sm text-muted-foreground">Published</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{drafts.length}</p>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{inactive.length}</p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </div>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <FacultyTable faculty={faculty} />
      </div>
    </div>
  )
}
