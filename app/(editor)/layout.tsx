import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Editor | JKKN CMS',
  description: 'Visual page editor for JKKN Institution website',
}

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Minimal layout - no admin sidebar, just the editor
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
