import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getFacultyById } from '@/app/actions/faculty'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink, Cloud, Archive } from 'lucide-react'

interface ViewFacultyPageProps {
  params: Promise<{ id: string }>
}

const MYJKKN_STAFF_EDIT_URL = (id: string) => `https://www.jkkn.ai/admin/staff/${id}`

export default async function ViewFacultyPage({ params }: ViewFacultyPageProps) {
  const { id } = await params
  const faculty = await getFacultyById(id)
  if (!faculty) notFound()

  // Synced rows: redirect straight to MyJKKN — there's no edit UI here anymore.
  if (faculty.synced_from_api) {
    redirect(MYJKKN_STAFF_EDIT_URL(faculty.id))
  }

  // Legacy (manually-managed) rows: show a simple read-only summary explaining
  // the row is no longer editable here. User can soft-delete via SQL if they want.
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/faculty"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
        </Button>
        <Badge variant="outline" className="gap-1">
          <Archive className="w-3 h-3" /> Legacy (read-only)
        </Badge>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-bold shrink-0">
            {faculty.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{faculty.full_name}</h1>
            <p className="text-sm text-muted-foreground">{faculty.designation} — {faculty.department}</p>
          </div>
        </div>

        <div className="rounded-md border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900 mb-6">
          <p className="font-medium mb-1">This is a legacy faculty row.</p>
          <p>
            Faculty editing has moved to MyJKKN. To activate this person on the live site,
            add them in MyJKKN with role <code className="font-mono">hod</code> or <code className="font-mono">principal</code>;
            the next sync (every 15 min, or click <em>Sync from MyJKKN</em> on the list page) will pick them up.
            Until then this row stays inactive.
          </p>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{faculty.email}</dd></div>
          <div><dt className="text-muted-foreground">Status</dt><dd><Badge variant={faculty.status === 'published' ? 'default' : 'secondary'}>{faculty.status}</Badge></dd></div>
          <div><dt className="text-muted-foreground">Active</dt><dd>{faculty.is_active ? 'Yes' : 'No'}</dd></div>
          <div><dt className="text-muted-foreground">Slug</dt><dd className="font-mono text-xs">{faculty.slug}</dd></div>
          <div><dt className="text-muted-foreground">Source</dt><dd className="flex items-center gap-1"><Cloud className="w-3 h-3 inline" />Local DB (not synced)</dd></div>
          <div><dt className="text-muted-foreground">Last updated</dt><dd>{new Date(faculty.updated_at).toLocaleString()}</dd></div>
        </dl>
      </div>
    </div>
  )
}
