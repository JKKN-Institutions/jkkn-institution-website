import { notFound } from 'next/navigation'
import { ArrowLeft, Video } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getEducationVideo } from '@/app/actions/videos'
import { VideoForm } from '../../video-form'

interface EditVideoPageProps {
  params: Promise<{ id: string }>
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const { id } = await params
  const video = await getEducationVideo(id)

  if (!video) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/videos">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Video</h1>
            <p className="text-sm text-muted-foreground truncate max-w-md">
              {video.title}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <VideoForm video={video} mode="edit" />
      </div>
    </div>
  )
}
