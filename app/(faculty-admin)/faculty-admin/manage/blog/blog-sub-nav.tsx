'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Newspaper, FolderOpen, Tag, MessageSquare } from 'lucide-react'

const TABS = [
  { href: '/faculty-admin/manage/blog', label: 'Posts', icon: Newspaper, exact: true },
  { href: '/faculty-admin/manage/blog/categories', label: 'Categories', icon: FolderOpen },
  { href: '/faculty-admin/manage/blog/tags', label: 'Tags', icon: Tag },
  { href: '/faculty-admin/manage/blog/comments', label: 'Comments', icon: MessageSquare },
]

export function BlogSubNav() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div
      className="flex items-center gap-1 overflow-x-auto bg-white rounded-2xl border border-gray-100 p-1.5"
      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
    >
      {TABS.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact)
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[0.78rem] font-medium whitespace-nowrap transition-colors ${
              active
                ? 'bg-[#0b6d41] text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        )
      })}
    </div>
  )
}
