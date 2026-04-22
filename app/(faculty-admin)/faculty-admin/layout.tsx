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
  // Shell for manage/* provides its own full-height layout + background.
  // The login page (`/faculty-admin`) has its own full-screen layout.
  return <>{children}</>
}
