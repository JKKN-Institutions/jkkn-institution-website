'use client'

import { cn } from '@/lib/utils'
import type { FacultyDirectoryProps, FacultyMember } from '@/lib/cms/registry-types'
import { Mail, Phone, GraduationCap, Award } from 'lucide-react'

// Single faculty card component
function FacultyCard({
  member,
  layout,
  showEmail,
  showPhone,
  showQualifications,
}: {
  member: FacultyMember
  layout: 'grid' | 'list' | 'compact'
  showEmail: boolean
  showPhone: boolean
  showQualifications: boolean
}) {
  if (layout === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {member.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm truncate">
            {member.name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {member.designation}
          </p>
        </div>
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className="flex gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                {member.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{member.name}</h3>
              <p className="text-sm text-primary">{member.designation}</p>
              {member.department && (
                <p className="text-sm text-muted-foreground">{member.department}</p>
              )}
            </div>
          </div>

          {showQualifications && member.qualifications && member.qualifications.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span>{member.qualifications.join(', ')}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mt-2">
            {showEmail && member.email && (
              <a
                href={`mailto:${member.email}`}
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <Mail className="h-3.5 w-3.5" />
                {member.email}
              </a>
            )}
            {showPhone && member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <Phone className="h-3.5 w-3.5" />
                {member.phone}
              </a>
            )}
          </div>

          {member.specializations && member.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {member.specializations.slice(0, 4).map((spec, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded"
                >
                  {spec}
                </span>
              ))}
              {member.specializations.length > 4 && (
                <span className="px-2 py-0.5 text-xs text-muted-foreground">
                  +{member.specializations.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Profile Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary/50">
              {member.name.charAt(0)}
            </span>
          </div>
        )}
        {member.department && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
            {member.department}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
          {member.name}
        </h3>
        <p className="text-sm text-primary font-medium">{member.designation}</p>

        {showQualifications && member.qualifications && member.qualifications.length > 0 && (
          <div className="flex items-start gap-1.5 mt-3 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{member.qualifications.join(', ')}</span>
          </div>
        )}

        {member.specializations && member.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {member.specializations.slice(0, 3).map((spec, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-border">
          {showEmail && member.email && (
            <a
              href={`mailto:${member.email}`}
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 truncate"
            >
              <Mail className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{member.email}</span>
            </a>
          )}
          {showPhone && member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5 flex-shrink-0" />
              {member.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FacultyDirectory({
  title = 'Our Faculty',
  faculty = [],
  layout = 'grid',
  columns = 4,
  showDepartmentFilter = true,
  showSearchBox = true,
  maxItems = 12,
  departmentFilter,
  className,
}: FacultyDirectoryProps) {
  // Filter faculty by department if specified
  const filteredFaculty = departmentFilter
    ? faculty.filter((member) => member.department === departmentFilter)
    : faculty

  // Limit to maxItems
  const displayFaculty = filteredFaculty.slice(0, maxItems)

  // Group faculty by department for display
  const departments = [...new Set(filteredFaculty.map((m) => m.department).filter(Boolean))]

  if (displayFaculty.length === 0) {
    return (
      <div className={cn('py-12', className)}>
        {title && (
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{title}</h2>
        )}
        <div className="text-center py-8 text-muted-foreground">
          <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No faculty members to display.</p>
        </div>
      </div>
    )
  }

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  }

  // Map the new schema props to component behavior
  // showDepartmentFilter and showSearchBox are available but we're using simpler display
  // These could be expanded to include actual filter/search UI in the future
  const showEmail = true
  const showPhone = true
  const showQualifications = true

  return (
    <div className={cn('py-12', className)}>
      {/* Header */}
      {title && (
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h2>
          {(showDepartmentFilter || showSearchBox) && departments.length > 1 && (
            <p className="text-muted-foreground mt-2">
              {departments.length} departments • {displayFaculty.length} faculty members
            </p>
          )}
        </div>
      )}

      {/* Faculty Grid/List */}
      <div
        className={cn(
          layout === 'grid' && `grid gap-6 ${gridCols[columns as keyof typeof gridCols] || gridCols[4]}`,
          layout === 'list' && 'space-y-4',
          layout === 'compact' && `grid gap-3 ${gridCols[4]}`
        )}
      >
        {displayFaculty.map((member, index) => (
          <FacultyCard
            key={member.id || index}
            member={member}
            layout={layout}
            showEmail={showEmail}
            showPhone={showPhone}
            showQualifications={showQualifications}
          />
        ))}
      </div>

      {/* Show more info if filtered */}
      {filteredFaculty.length > maxItems && (
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Showing {displayFaculty.length} of {filteredFaculty.length} faculty members
          </p>
        </div>
      )}
    </div>
  )
}
