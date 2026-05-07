import {
  Users,
  UserPlus,
  Globe,
  BarChart3,
  Eye,
  FileText,
} from 'lucide-react'
import { getAllFaculty } from '@/app/actions/faculty'
import { FacultyManageTable } from '../faculty-manage-table'

export default async function FacultyMembersPage() {
  const faculty = await getAllFaculty()

  const published = faculty.filter(f => f.status === 'published' && f.is_active)
  const drafts = faculty.filter(f => f.status === 'draft')
  const inactive = faculty.filter(f => !f.is_active)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Professional Header with Stats */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">Faculty Members</h1>
                  <span className="badge-brand text-xs whitespace-nowrap">
                    <Globe className="h-3 w-3 mr-1" />
                    Directory
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create, edit, publish, or archive faculty profiles shown on the public site.
                </p>
              </div>
            </div>

            {/* Action area: faculty data is managed in MyJKKN now */}
            <div className="flex items-center gap-2 sm:flex-shrink-0 max-w-md">
              <div className="text-xs text-muted-foreground bg-blue-50 border border-blue-100 rounded-md px-3 py-2">
                Faculty data is now managed in <strong>MyJKKN</strong>. Edits there sync to this site every 15 minutes.
              </div>
            </div>
          </div>

          {/* Statistics Cards — faculty-specific */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={BarChart3}
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
              hoverBorder="hover:border-blue-500/30"
              hoverShadow="hover:shadow-blue-500/5"
              value={faculty.length}
              title="Total Faculty"
              description="All profiles in system"
            />
            <StatCard
              icon={Eye}
              iconColor="text-green-500"
              iconBg="bg-green-500/10"
              hoverBorder="hover:border-green-500/30"
              hoverShadow="hover:shadow-green-500/5"
              value={published.length}
              title="Published"
              description="Live on website"
            />
            <StatCard
              icon={FileText}
              iconColor="text-orange-500"
              iconBg="bg-orange-500/10"
              hoverBorder="hover:border-orange-500/30"
              hoverShadow="hover:shadow-orange-500/5"
              value={drafts.length}
              title="Drafts"
              description="Work in progress"
            />
            <StatCard
              icon={UserPlus}
              iconColor="text-gray-500"
              iconBg="bg-gray-500/10"
              hoverBorder="hover:border-gray-500/30"
              hoverShadow="hover:shadow-gray-500/5"
              value={inactive.length}
              title="Inactive"
              description="Archived profiles"
            />
          </div>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">All Members</h2>
              <p className="text-xs text-muted-foreground">
                Edit, publish, or remove individual faculty profiles.
              </p>
            </div>
          </div>
        </div>
        <FacultyManageTable faculty={faculty} />
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  hoverBorder,
  hoverShadow,
  value,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  hoverBorder: string
  hoverShadow: string
  value: number
  title: string
  description: string
}) {
  return (
    <div
      className={`group bg-gradient-to-br from-card to-card/50 rounded-xl p-4 border border-border/50 transition-all duration-300 hover:shadow-lg ${hoverBorder} ${hoverShadow}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${iconBg}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </div>
      <div>
        <div className="text-sm font-medium text-foreground mb-1">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}
