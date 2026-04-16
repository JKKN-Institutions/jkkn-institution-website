import { BlogSubNav } from './blog-sub-nav'

export default function FacultyBlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <BlogSubNav />
      {children}
    </div>
  )
}
