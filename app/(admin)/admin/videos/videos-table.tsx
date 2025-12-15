'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { EducationVideo, deleteEducationVideo, toggleVideoStatus, reorderVideos } from '@/app/actions/videos'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Pencil, Trash2, ExternalLink, GripVertical, Video } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface VideosTableProps {
  videos: EducationVideo[]
}

export function VideosTable({ videos: initialVideos }: VideosTableProps) {
  const router = useRouter()
  const [videos, setVideos] = useState(initialVideos)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleVideoStatus(id, !currentStatus)
    if (result.success) {
      setVideos(videos.map(v => v.id === id ? { ...v, is_active: !currentStatus } : v))
      toast.success(currentStatus ? 'Video hidden' : 'Video activated')
    } else {
      toast.error(result.error || 'Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const result = await deleteEducationVideo(deleteId)

    if (result.success) {
      setVideos(videos.filter(v => v.id !== deleteId))
      toast.success('Video deleted')
    } else {
      toast.error(result.error || 'Failed to delete video')
    }

    setIsDeleting(false)
    setDeleteId(null)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newVideos = [...videos]
    const [draggedItem] = newVideos.splice(draggedIndex, 1)
    newVideos.splice(index, 0, draggedItem)
    setVideos(newVideos)
    setDraggedIndex(index)
  }

  const handleDragEnd = async () => {
    if (draggedIndex === null) return

    const videoIds = videos.map(v => v.id)
    const result = await reorderVideos(videoIds)

    if (result.success) {
      toast.success('Order updated')
    } else {
      toast.error('Failed to update order')
      router.refresh()
    }

    setDraggedIndex(null)
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Video className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
        <p className="text-muted-foreground mb-4">
          Add YouTube videos to display on the homepage
        </p>
        <Button asChild>
          <Link href="/admin/videos/new">Add Your First Video</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {videos.map((video, index) => (
          <div
            key={video.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-all ${
              draggedIndex === index ? 'opacity-50 scale-[0.98]' : ''
            }`}
          >
            {/* Drag Handle */}
            <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
              <GripVertical className="w-5 h-5" />
            </div>

            {/* Thumbnail */}
            <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              {video.thumbnail_url ? (
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{video.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {video.description || 'No description'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {video.category && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {video.category}
                  </span>
                )}
                {video.duration && (
                  <span className="text-xs text-muted-foreground">
                    {video.duration}
                  </span>
                )}
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {video.is_active ? 'Active' : 'Hidden'}
              </span>
              <Switch
                checked={video.is_active}
                onCheckedChange={() => handleToggleStatus(video.id, video.is_active)}
              />
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/videos/${video.id}/edit`} className="flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on YouTube
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteId(video.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this video? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
