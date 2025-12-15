import { getEducationVideos } from '@/app/actions/videos'
import { Button } from '@/components/ui/button'
import { Plus, Video } from 'lucide-react'
import Link from 'next/link'
import { VideosTable } from './videos-table'

export default async function VideosPage() {
  const videos = await getEducationVideos()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Education Videos</h1>
              <p className="text-sm text-muted-foreground">
                Manage YouTube videos displayed on the homepage
              </p>
            </div>
          </div>
          <Button asChild className="gap-2">
            <Link href="/admin/videos/new">
              <Plus className="w-4 h-4" />
              Add Video
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Video className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{videos.length}</p>
            <p className="text-sm text-muted-foreground">Total Videos</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Video className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{videos.filter(v => v.is_active).length}</p>
            <p className="text-sm text-muted-foreground">Active Videos</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center">
            <Video className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{videos.filter(v => !v.is_active).length}</p>
            <p className="text-sm text-muted-foreground">Hidden Videos</p>
          </div>
        </div>
      </div>

      {/* Videos Table */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <VideosTable videos={videos} />
      </div>
    </div>
  )
}
