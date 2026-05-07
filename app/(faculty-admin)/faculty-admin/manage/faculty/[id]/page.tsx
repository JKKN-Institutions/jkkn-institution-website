import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getFacultyById } from '@/app/actions/faculty'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink, Cloud, Archive, Globe } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

const MYJKKN_PROFILE_URL = (id: string) => `https://www.jkkn.ai/profile/${id}`

export default async function VerifyFacultyProfilePage({ params }: Props) {
  const { id } = await params
  const faculty = await getFacultyById(id)
  if (!faculty) notFound()

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 flex-wrap">
        <Button asChild variant="ghost" size="sm">
          <Link href="/faculty-admin/manage/faculty"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
        </Button>
        {faculty.synced_from_api ? (
          <Badge className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Cloud className="w-3 h-3" /> Synced from MyJKKN
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1">
            <Archive className="w-3 h-3" /> Legacy (read-only)
          </Badge>
        )}
        <Badge variant={faculty.status === 'published' ? 'default' : 'secondary'}>
          {faculty.status}
        </Badge>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
          {faculty.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={faculty.photo_url}
              alt={faculty.full_name}
              className="w-24 h-24 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-bold shrink-0">
              {faculty.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold">{faculty.full_name}</h1>
            <p className="text-sm text-muted-foreground">{faculty.designation}</p>
            <p className="text-sm text-muted-foreground">{faculty.department}</p>
            <p className="text-xs text-muted-foreground mt-1">{faculty.email}</p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            {faculty.synced_from_api && (
              <Button asChild>
                <a href={MYJKKN_PROFILE_URL(faculty.id)} target="_blank" rel="noopener noreferrer">
                  Edit my profile in MyJKKN <ExternalLink className="ml-1 w-3.5 h-3.5" />
                </a>
              </Button>
            )}
            {faculty.status === 'published' && faculty.is_active && faculty.slug && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/faculty/${faculty.slug}`} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-3.5 h-3.5 mr-1" /> View live page
                </Link>
              </Button>
            )}
          </div>
        </div>

        {faculty.synced_from_api ? (
          <div className="rounded-md border-l-4 border-blue-400 bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-medium mb-1">This profile is read-only here.</p>
            <p>
              Your faculty profile is now managed in MyJKKN. Click <em>Edit my profile in MyJKKN</em>
              {' '}to make changes. The next sync (every 15 minutes, or via the admin
              {' '}<em>Sync from MyJKKN</em> button) will pull your edits to this site.
            </p>
            {faculty.status === 'draft' && (
              <p className="mt-2">
                <strong>Status:</strong> Draft — your profile won&apos;t appear publicly until you fill in
                photo, professional summary, qualifications, designation, department, and email in MyJKKN.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-md border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-medium mb-1">This is a legacy profile.</p>
            <p>
              Faculty editing has moved to MyJKKN. To activate your profile on the live site,
              ask an administrator to add you in MyJKKN with role <code className="font-mono">hod</code> or{' '}
              <code className="font-mono">principal</code>; the next sync will pick you up.
            </p>
          </div>
        )}

        {faculty.synced_from_api && faculty.last_synced_at && (
          <p className="mt-4 text-xs text-muted-foreground">
            Last synced from MyJKKN: {new Date(faculty.last_synced_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}
