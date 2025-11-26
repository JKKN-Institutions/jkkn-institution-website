'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Upload,
  Search,
  Grid,
  List,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  FolderInput,
  ImageIcon,
  FileVideo,
  FileAudio,
  File,
  HardDrive,
  Filter,
  X,
  Check,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { cn, formatBytes } from '@/lib/utils'
import {
  deleteMedia,
  deleteMediaBatch,
  updateMediaMeta,
  type MediaItem,
  type MediaLibraryResult,
} from '@/app/actions/cms/media'
import { toast } from 'sonner'
import { MediaUploader } from './media-uploader'

interface MediaLibraryProps {
  initialMedia: MediaLibraryResult
  folders: string[]
  stats: {
    totalFiles: number
    totalSize: number
    byType: Record<string, { count: number; size: number }>
  }
}

const fileTypeIcons: Record<string, typeof ImageIcon> = {
  image: ImageIcon,
  video: FileVideo,
  audio: FileAudio,
  document: File,
}

const fileTypeFilters = [
  { value: 'all', label: 'All Files' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' },
  { value: 'document', label: 'Documents' },
]

export function MediaLibrary({ initialMedia, folders, stats }: MediaLibraryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [media, setMedia] = useState(initialMedia)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all')
  const [folderFilter, setFolderFilter] = useState(searchParams.get('folder') || 'all')

  // Dialogs
  const [showUploader, setShowUploader] = useState(false)
  const [editItem, setEditItem] = useState<MediaItem | null>(null)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Build URL with filters
  const buildUrl = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      return `/admin/content/media?${params.toString()}`
    },
    [searchParams]
  )

  // Handle search
  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value)
      router.push(buildUrl({ search: value || undefined }))
    },
    [router, buildUrl]
  )

  // Handle type filter
  const handleTypeFilter = useCallback(
    (value: string) => {
      setTypeFilter(value)
      router.push(buildUrl({ type: value === 'all' ? undefined : value }))
    },
    [router, buildUrl]
  )

  // Handle folder filter
  const handleFolderFilter = useCallback(
    (value: string) => {
      setFolderFilter(value)
      router.push(buildUrl({ folder: value === 'all' ? undefined : value }))
    },
    [router, buildUrl]
  )

  // Toggle item selection
  const toggleSelection = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  // Select all
  const selectAll = useCallback(() => {
    if (selectedItems.size === media.items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(media.items.map((item) => item.id)))
    }
  }, [media.items, selectedItems.size])

  // Copy URL to clipboard
  const copyUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard')
  }, [])

  // Delete single item
  const handleDelete = useCallback(async () => {
    if (!itemToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteMedia(itemToDelete)
      if (result.success) {
        toast.success('File deleted')
        setMedia((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.id !== itemToDelete),
          total: prev.total - 1,
        }))
      } else {
        toast.error(result.message || 'Failed to delete')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      setItemToDelete(null)
    }
  }, [itemToDelete])

  // Delete selected items
  const handleDeleteSelected = useCallback(async () => {
    if (selectedItems.size === 0) return

    setIsDeleting(true)
    try {
      const result = await deleteMediaBatch(Array.from(selectedItems))
      if (result.success) {
        toast.success(`${selectedItems.size} files deleted`)
        setMedia((prev) => ({
          ...prev,
          items: prev.items.filter((item) => !selectedItems.has(item.id)),
          total: prev.total - selectedItems.size,
        }))
        setSelectedItems(new Set())
      } else {
        toast.error(result.message || 'Failed to delete')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }, [selectedItems])

  // Update item metadata
  const handleUpdateMeta = useCallback(
    async (updates: { alt_text?: string; caption?: string }) => {
      if (!editItem) return

      setIsSaving(true)
      try {
        const result = await updateMediaMeta(editItem.id, updates)
        if (result.success) {
          toast.success('Media updated')
          setMedia((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
              item.id === editItem.id ? { ...item, ...updates } : item
            ),
          }))
          setEditItem(null)
        } else {
          toast.error(result.message || 'Failed to update')
        }
      } catch {
        toast.error('An error occurred')
      } finally {
        setIsSaving(false)
      }
    },
    [editItem]
  )

  // Get file icon
  const getFileIcon = (fileType: string) => {
    const Icon = fileTypeIcons[fileType] || File
    return Icon
  }

  // Check if file is previewable image
  const isPreviewableImage = (mimeType: string) => {
    return mimeType.startsWith('image/')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground">
            {stats.totalFiles} files &bull; {formatBytes(stats.totalSize)} used
          </p>
        </div>
        <Button onClick={() => setShowUploader(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <ImageIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Images</p>
              <p className="font-semibold">{stats.byType['image']?.count || 0}</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <FileVideo className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Videos</p>
              <p className="font-semibold">{stats.byType['video']?.count || 0}</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <File className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Documents</p>
              <p className="font-semibold">{stats.byType['document']?.count || 0}</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <HardDrive className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Storage Used</p>
              <p className="font-semibold">{formatBytes(stats.totalSize)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={handleTypeFilter}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fileTypeFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={folderFilter} onValueChange={handleFolderFilter}>
            <SelectTrigger className="w-32">
              <FolderInput className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Folders</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder} value={folder}>
                  {folder}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center border border-border rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedItems.size > 0 && (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
          <Checkbox
            checked={selectedItems.size === media.items.length}
            onCheckedChange={selectAll}
          />
          <span className="text-sm font-medium">
            {selectedItems.size} selected
          </span>
          <div className="flex-1" />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedItems(new Set())}
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      )}

      {/* Media Grid/List */}
      {media.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No files found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Upload files to get started'}
          </p>
          <Button onClick={() => setShowUploader(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.items.map((item) => {
            const Icon = getFileIcon(item.file_type)
            const isSelected = selectedItems.has(item.id)

            return (
              <div
                key={item.id}
                className={cn(
                  'group relative aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all',
                  isSelected
                    ? 'ring-2 ring-primary border-primary'
                    : 'border-border hover:border-primary/50'
                )}
                onClick={() => setPreviewItem(item)}
              >
                {/* Selection checkbox */}
                <div
                  className={cn(
                    'absolute top-2 left-2 z-10 transition-opacity',
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSelection(item.id)
                  }}
                >
                  <Checkbox checked={isSelected} />
                </div>

                {/* Thumbnail */}
                {isPreviewableImage(item.mime_type) ? (
                  <Image
                    src={item.file_url}
                    alt={item.alt_text || item.original_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Icon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-xs text-white truncate">{item.original_name}</p>
                  <p className="text-xs text-white/70">{formatBytes(item.file_size)}</p>
                </div>

                {/* Actions */}
                <div
                  className={cn(
                    'absolute top-2 right-2 transition-opacity',
                    'opacity-0 group-hover:opacity-100'
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-7 w-7">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyUrl(item.file_url)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditItem(item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Original
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setItemToDelete(item.id)
                          setShowDeleteConfirm(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="border border-border rounded-lg divide-y divide-border">
          {media.items.map((item) => {
            const Icon = getFileIcon(item.file_type)
            const isSelected = selectedItems.has(item.id)

            return (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer',
                  isSelected && 'bg-primary/5'
                )}
                onClick={() => setPreviewItem(item)}
              >
                <Checkbox
                  checked={isSelected}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSelection(item.id)
                  }}
                />

                {/* Thumbnail */}
                <div className="relative h-12 w-12 rounded overflow-hidden bg-muted flex-shrink-0">
                  {isPreviewableImage(item.mime_type) ? (
                    <Image
                      src={item.file_url}
                      alt={item.alt_text || item.original_name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.original_name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatBytes(item.file_size)}</span>
                    <span>&bull;</span>
                    <span>{item.mime_type}</span>
                    {item.width && item.height && (
                      <>
                        <span>&bull;</span>
                        <span>
                          {item.width} x {item.height}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Folder */}
                {item.folder && (
                  <Badge variant="secondary">{item.folder}</Badge>
                )}

                {/* Actions */}
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyUrl(item.file_url)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditItem(item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setItemToDelete(item.id)
                          setShowDeleteConfirm(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {media.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={media.page === 1}
            onClick={() => router.push(buildUrl({ page: String(media.page - 1) }))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {media.page} of {media.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={media.page === media.totalPages}
            onClick={() => router.push(buildUrl({ page: String(media.page + 1) }))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploader} onOpenChange={setShowUploader}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Drag and drop files or click to browse. Supports images, videos, and documents.
            </DialogDescription>
          </DialogHeader>
          <MediaUploader
            folders={folders}
            onSuccess={() => {
              setShowUploader(false)
              router.refresh()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
          </DialogHeader>
          {editItem && (
            <EditMediaForm
              item={editItem}
              onSave={handleUpdateMeta}
              onCancel={() => setEditItem(null)}
              isSaving={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="max-w-4xl">
          {previewItem && (
            <MediaPreview
              item={previewItem}
              onEdit={() => {
                setPreviewItem(null)
                setEditItem(previewItem)
              }}
              onDelete={() => {
                setPreviewItem(null)
                setItemToDelete(previewItem.id)
                setShowDeleteConfirm(true)
              }}
              onCopyUrl={() => copyUrl(previewItem.file_url)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedItems.size > 0 && !itemToDelete
                ? `Delete ${selectedItems.size} files?`
                : 'Delete this file?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The file(s) will be permanently deleted from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={itemToDelete ? handleDelete : handleDeleteSelected}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Edit form component
function EditMediaForm({
  item,
  onSave,
  onCancel,
  isSaving,
}: {
  item: MediaItem
  onSave: (updates: { alt_text?: string; caption?: string }) => void
  onCancel: () => void
  isSaving: boolean
}) {
  const [altText, setAltText] = useState(item.alt_text || '')
  const [caption, setCaption] = useState(item.caption || '')

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="alt_text">Alt Text</Label>
        <Input
          id="alt_text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the image for accessibility"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Optional caption"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={() => onSave({ alt_text: altText, caption })} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Preview component
function MediaPreview({
  item,
  onEdit,
  onDelete,
  onCopyUrl,
}: {
  item: MediaItem
  onEdit: () => void
  onDelete: () => void
  onCopyUrl: () => void
}) {
  const isImage = item.mime_type.startsWith('image/')
  const isVideo = item.mime_type.startsWith('video/')

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {isImage ? (
          <Image
            src={item.file_url}
            alt={item.alt_text || item.original_name}
            fill
            className="object-contain"
          />
        ) : isVideo ? (
          <video src={item.file_url} controls className="w-full h-full" />
        ) : (
          <div className="h-full flex items-center justify-center">
            <File className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Info */}
      <ScrollArea className="max-h-48">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">File Name</p>
            <p className="font-medium">{item.original_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Size</p>
              <p>{formatBytes(item.file_size)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p>{item.mime_type}</p>
            </div>
            {item.width && item.height && (
              <div>
                <p className="text-sm text-muted-foreground">Dimensions</p>
                <p>
                  {item.width} x {item.height}
                </p>
              </div>
            )}
            {item.folder && (
              <div>
                <p className="text-sm text-muted-foreground">Folder</p>
                <p>{item.folder}</p>
              </div>
            )}
          </div>
          {item.alt_text && (
            <div>
              <p className="text-sm text-muted-foreground">Alt Text</p>
              <p>{item.alt_text}</p>
            </div>
          )}
          {item.caption && (
            <div>
              <p className="text-sm text-muted-foreground">Caption</p>
              <p>{item.caption}</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCopyUrl} className="flex-1">
          <Copy className="h-4 w-4 mr-2" />
          Copy URL
        </Button>
        <Button variant="outline" onClick={onEdit} className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
