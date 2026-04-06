import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Faculty Management Portal | JKKN Engineering',
  description: 'Manage faculty profiles for JKKN College of Engineering & Technology',
  robots: { index: false, follow: false },
}

export default function FacultyAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {children}
    </div>
  )
}
