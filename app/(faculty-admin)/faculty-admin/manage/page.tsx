import { getAllFaculty } from '@/app/actions/faculty'
import { Users, Globe, FileEdit } from 'lucide-react'
import { FacultyManageTable } from './faculty-manage-table'

export default async function FacultyManagePage() {
  const faculty = await getAllFaculty()

  const published = faculty.filter(f => f.status === 'published' && f.is_active)
  const drafts = faculty.filter(f => f.status === 'draft')

  return (
    <div className="space-y-6" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
      {/* Welcome bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Faculty Members</h1>
          <p className="text-[0.78rem] text-gray-400">Manage all faculty profiles from here</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-[1.5rem] font-bold text-gray-800 leading-none">{faculty.length}</p>
            <p className="text-[0.72rem] text-gray-400 mt-0.5">Total Faculty</p>
          </div>
        </div>

        {/* Published */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[1.5rem] font-bold text-gray-800 leading-none">{published.length}</p>
            <p className="text-[0.72rem] text-gray-400 mt-0.5">Published & Live</p>
          </div>
        </div>

        {/* Drafts */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
            <FileEdit className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-[1.5rem] font-bold text-gray-800 leading-none">{drafts.length}</p>
            <p className="text-[0.72rem] text-gray-400 mt-0.5">Drafts</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        <FacultyManageTable faculty={faculty} />
      </div>
    </div>
  )
}
