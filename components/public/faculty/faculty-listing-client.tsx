'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import {
  compareFacultyForDirectory,
  facultyRoleRank,
  type FacultyRow,
} from '@/lib/schemas/faculty'

interface FacultyListingClientProps {
  faculty: FacultyRow[]
  departments: string[]
}

/** Short label for the rank badge shown on leadership cards. */
function roleLabel(f: FacultyRow): string | null {
  const rank = facultyRoleRank(f)
  if (rank === 0) return 'Principal'
  if (rank === 1) return 'Head of Department'
  return null
}

export function FacultyListingClient({ faculty, departments }: FacultyListingClientProps) {
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState<string>('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return faculty.filter(f => {
      const matchesSearch = q === '' ||
        f.full_name.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q)
      const matchesDept = selectedDept === 'all' || f.department === selectedDept
      return matchesSearch && matchesDept
    })
  }, [faculty, search, selectedDept])

  // No separate leadership band: every person appears exactly once, in their
  // own department, with Principal/HOD sorted to the front of that department's
  // cards. A dedicated band would list the same people twice on the unfiltered
  // view, which reads as a duplication bug rather than a highlight.
  const sections = useMemo(() => {
    const byDept = new Map<string, FacultyRow[]>()
    for (const f of filtered) {
      const list = byDept.get(f.department)
      if (list) list.push(f)
      else byDept.set(f.department, [f])
    }
    return departments
      .filter(d => byDept.has(d))
      .map(d => ({ department: d, members: byDept.get(d)!.sort(compareFacultyForDirectory) }))
  }, [filtered, departments])

  return (
    <>
      {/* Filters */}
      {/* Search sits on its own row: sharing one flex line with the department
          pills let them squeeze the flex-1 input down to icon width. */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8f80]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search senior learners by name, designation..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[rgba(11,109,65,0.1)] bg-white text-sm focus:outline-none focus:border-[rgba(11,109,65,0.3)] transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedDept === 'all'
                ? 'bg-[#0b6d41] text-white shadow-md'
                : 'bg-white text-[#3d5443] border border-[rgba(11,109,65,0.1)] hover:border-[rgba(11,109,65,0.25)]'
            }`}
          >
            All Departments
          </button>
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedDept === dept
                  ? 'bg-[#0b6d41] text-white shadow-md'
                  : 'bg-white text-[#3d5443] border border-[rgba(11,109,65,0.1)] hover:border-[rgba(11,109,65,0.25)]'
              }`}
            >
              {dept.replace('Department of ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[#7a8f80] mb-6">
        Showing {filtered.length} senior learner{filtered.length !== 1 ? 's' : ''}
        {selectedDept !== 'all' && <> in {selectedDept.replace('Department of ', '')}</>}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-[#3d5443]">No senior learners found</p>
          <p className="text-sm text-[#7a8f80] mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <>
          {sections.map(({ department, members }) => (
            <section key={department} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-5">
                {/* Explicit font-size: globals.css styles bare h2 up to
                    lg:text-4xl, which is far too loud for a section label. */}
                <h2
                  className="font-semibold text-[#1a2a1e] shrink-0"
                  style={{
                    fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                    fontSize: '1.05rem',
                    lineHeight: 1.3,
                  }}
                >
                  {department.replace('Department of ', '')}
                </h2>
                <span className="text-[0.72rem] font-medium text-[#7a8f80] px-2 py-0.5 rounded-full bg-[rgba(11,109,65,0.05)] border border-[rgba(11,109,65,0.1)] shrink-0">
                  {members.length}
                </span>
                <span className="h-px flex-1 bg-[rgba(11,109,65,0.12)]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {members.map(f => (
                  <FacultyCard key={f.id} faculty={f} highlight={facultyRoleRank(f) < 2} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </>
  )
}

function FacultyCard({ faculty, highlight = false }: { faculty: FacultyRow; highlight?: boolean }) {
  const initials = faculty.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const specialisations = (faculty.specialisations as string[]) || []
  const label = roleLabel(faculty)

  return (
    <Link
      href={`/faculty/${faculty.slug}`}
      className={`group block bg-white rounded-2xl p-6 text-center transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(11,109,65,0.08)] relative overflow-hidden border ${
        highlight
          ? 'border-[rgba(255,222,89,0.55)] shadow-[0_2px_12px_rgba(255,222,89,0.18)] hover:border-[rgba(255,222,89,0.8)]'
          : 'border-[rgba(11,109,65,0.08)] hover:border-[rgba(11,109,65,0.22)]'
      }`}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0b6d41] via-[#0e8a52] to-[#12a863] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

      {/* Avatar */}
      <div className="w-[70px] h-[70px] rounded-full mx-auto mb-3 overflow-hidden">
        {faculty.photo_url ? (
          <img src={faculty.photo_url} alt={faculty.full_name} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white text-lg font-bold"
            style={{ background: 'linear-gradient(135deg, #0b6d41, #12a863)' }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Rank badge — only Principal and HODs carry one */}
      {label && (
        <span
          className="inline-block text-[0.62rem] font-bold uppercase tracking-[1px] px-2.5 py-0.5 rounded-full mb-1.5"
          style={{ background: 'rgba(255,222,89,0.25)', color: '#8a7000' }}
        >
          {label}
        </span>
      )}

      {/* Name & Role */}
      <h3 className="text-[0.95rem] font-semibold text-[#1a2a1e] leading-tight">{faculty.full_name}</h3>
      <p className="text-xs text-[#7a8f80] mt-0.5">{faculty.designation}</p>
      <p className="text-[0.7rem] text-[#7a8f80] opacity-60 mt-0.5">{faculty.department}</p>

      {/* Quick stats */}
      <div className="flex items-center justify-center gap-4 mt-3 text-[0.7rem] text-[#3d5443]">
        {faculty.experience_years > 0 && <span>{faculty.experience_years}+ yrs</span>}
        {faculty.research_papers > 0 && <span>{faculty.research_papers} papers</span>}
      </div>

      {/* Specialisations preview */}
      {specialisations.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mt-3">
          {specialisations.slice(0, 2).map((s, i) => (
            <span key={i} className="text-[0.65rem] px-2 py-0.5 rounded-full bg-[rgba(11,109,65,0.05)] text-[#3d5443] border border-[rgba(11,109,65,0.1)]">
              {s}
            </span>
          ))}
          {specialisations.length > 2 && (
            <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-[rgba(11,109,65,0.05)] text-[#7a8f80]">
              +{specialisations.length - 2}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
