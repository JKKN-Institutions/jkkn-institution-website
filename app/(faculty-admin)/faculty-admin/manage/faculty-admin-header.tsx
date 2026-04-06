'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GraduationCap, LogOut, Plus, ExternalLink, User } from 'lucide-react'
import Link from 'next/link'

interface FacultyAdminHeaderProps {
  userEmail: string
}

export function FacultyAdminHeader({ userEmail }: FacultyAdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/faculty-admin')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[60px]">
          {/* Left — Logo */}
          <Link href="/faculty-admin/manage" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0b6d41]/10 flex items-center justify-center group-hover:bg-[#0b6d41]/15 transition-colors">
              <GraduationCap className="w-4 h-4 text-[#0b6d41]" />
            </div>
            <div className="leading-none">
              <span className="text-[0.85rem] font-bold text-gray-800">Faculty Portal</span>
              <span className="hidden sm:block text-[0.6rem] text-gray-400 mt-0.5">JKKN Engineering</span>
            </div>
          </Link>

          {/* Right — Actions + User */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/faculty-admin/manage/new"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[0.8rem] font-semibold text-white bg-[#0b6d41] hover:bg-[#085533] transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Faculty</span>
            </Link>

            <Link
              href="/faculty"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[0.8rem] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-gray-100 mx-1" />

            {/* User pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50">
              <div className="w-6 h-6 rounded-full bg-[#0b6d41]/10 flex items-center justify-center">
                <User className="w-3 h-3 text-[#0b6d41]" />
              </div>
              <span className="text-[0.7rem] text-gray-500 max-w-[120px] truncate">{userEmail}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[0.8rem] font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
