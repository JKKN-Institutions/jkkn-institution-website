'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Upload,
  Image as ImageIcon,
  Video,
  FileAudio,
  FileText,
  Check,
  X,
  FolderOpen,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getMediaLibrary,
  getMediaFolders,
  uploadMedia,
  type MediaItem,
} from '@/app/actions/cms/media'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'

interface MediaPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (media: MediaItem | MediaItem[]) => void
  multiple?: boolean
  fileType?: 'image' | 'video' | 'audio' | 'document' | 'all'
  currentValue?: string // Current URL value for pre-selection
}

const FILE_TYPE_ICONS: Record<string, React.ReactNode> = {
  image: <ImageIcon className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  audio: <FileAudio className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
}

const ACCEPTED_TYPES: Record<string, string> = {
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*',
  document: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
  all: 'image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
}

export function MediaPickerModal({
  open,
  onOpenChange,
  onSelect,
  multiple = false,
  fileType = 'all',
  currentValue,
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [folders, setFolders] = useState<string[]>(['general'])
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  // Filters
  const [search, setSearch] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Load media library
  const loadMedia = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getMediaLibrary({
        page,
        limit: 24,
        file_type: fileType !== 'all' ? fileType : undefined,
        folder: selectedFolder !== 'all' ? selectedFolder : undefined,
        search: search || undefined,
      })
      setMedia(result.items)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading media:', error)
      toast.error('Failed to load media library')
    } finally {
      setLoading(false)
    }
  }, [page, fileType, selectedFolder, search])

  // Load folders
  const loadFolders = useCallback(async () => {
    try {
      const result = await getMediaFolders()
      setFolders(result)
    } catch (error) {
      console.error('Error loading folders:', error)
    }
  }, [])

  useEffect(() => {
    if (open) {
      loadMedia()
      loadFolders()
    }
  }, [open, loadMedia, loadFolders])

  // Pre-select current value if exists
  useEffect(() => {
    if (currentValue && media.length > 0) {
      const existing = media.find((m) => m.file_url === currentValue)
      if (existing && !selectedMedia.find((s) => s.id === existing.id)) {
        setSelectedMedia([existing])
      }
    }
  }, [currentValue, media, selectedMedia])

  // Handle media selection
  const handleSelect = (item: MediaItem) => {
    if (multiple) {
      setSelectedMedia((prev) => {
        const isSelected = prev.find((m) => m.id === item.id)
        if (isSelected) {
          return prev.filter((m) => m.id !== item.id)
        }
        return [...prev, item]
      })
    } else {
      setSelectedMedia([item])
    }
  }

  // Handle confirm selection
  const handleConfirm = () => {
    if (selectedMedia.length === 0) {
      toast.error('Please select at least one media item')
      return
    }
    onSelect(multiple ? selectedMedia : selectedMedia[0])
    onOpenChange(false)
    setSelectedMedia([])
  }

  // Handle file upload
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const supabase = createClient()
    const uploadedItems: MediaItem[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileId = uuidv4()
      const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
      const fileName = `${fileId}.${fileExt}`
      const filePath = `${selectedFolder === 'all' ? 'general' : selectedFolder}/${fileName}`

      // Update progress
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

      try {
        // Determine file type
        let detectedFileType = 'document'
        if (file.type.startsWith('image/')) detectedFileType = 'image'
        else if (file.type.startsWith('video/')) detectedFileType = 'video'
        else if (file.type.startsWith('audio/')) detectedFileType = 'audio'

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cms-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        setUploadProgress((prev) => ({ ...prev, [file.name]: 50 }))

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('cms-media')
          .getPublicUrl(filePath)

        // Get image dimensions if applicable
        let width: number | undefined
        let height: number | undefined
        if (detectedFileType === 'image') {
          const dimensions = await getImageDimensions(file)
          width = dimensions.width
          height = dimensions.height
        }

        // Save metadata to database
        const result = await uploadMedia({
          file_name: fileName,
          original_name: file.name,
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_type: detectedFileType,
          mime_type: file.type,
          file_size: file.size,
          width,
          height,
          folder: selectedFolder === 'all' ? 'general' : selectedFolder,
        })

        if (result.success && result.data) {
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))

          // Fetch the uploaded item
          const newItem: MediaItem = {
            id: (result.data as { id: string }).id,
            file_name: fileName,
            original_name: file.name,
            file_path: filePath,
            file_url: urlData.publicUrl,
            file_type: detectedFileType,
            mime_type: file.type,
            file_size: file.size,
            width: width || null,
            height: height || null,
            alt_text: null,
            caption: null,
            folder: selectedFolder === 'all' ? 'general' : selectedFolder,
            tags: null,
            metadata: null,
            uploaded_by: '',
            created_at: new Date().toISOString(),
            updated_at: null,
          }
          uploadedItems.push(newItem)
        } else {
          throw new Error(result.message || 'Upload failed')
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        toast.error(`Failed to upload ${file.name}`)
        setUploadProgress((prev) => ({ ...prev, [file.name]: -1 }))
      }
    }

    // Refresh media list
    await loadMedia()

    // Auto-select uploaded items
    if (uploadedItems.length > 0) {
      if (multiple) {
        setSelectedMedia((prev) => [...prev, ...uploadedItems])
      } else {
        setSelectedMedia([uploadedItems[0]])
      }
      setActiveTab('library')
    }

    setUploading(false)
    setUploadProgress({})
    toast.success(`${uploadedItems.length} file(s) uploaded successfully`)
  }

  // Get image dimensions helper
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
        URL.revokeObjectURL(img.src)
      }
      img.onerror = () => {
        resolve({ width: 0, height: 0 })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {multiple ? 'Select Media' : 'Select Media'}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'library' | 'upload')}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2 max-w-xs">
              <TabsTrigger value="library" className="gap-2">
                <FolderOpen className="h-4 w-4" />
                Media Library
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="library" className="flex-1 flex flex-col overflow-hidden mt-0 px-6">
            {/* Filters */}
            <div className="flex gap-3 py-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="pl-9"
                />
              </div>
              <Select value={selectedFolder} onValueChange={(v) => { setSelectedFolder(v); setPage(1) }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Folders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Folders</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder} value={folder}>
                      {folder.charAt(0).toUpperCase() + folder.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Media Grid */}
            <ScrollArea className="flex-1">
              {loading ? (
                <div className="grid grid-cols-4 gap-4 pb-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-lg" />
                  ))}
                </div>
              ) : media.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-4" />
                  <p>No media found</p>
                  <Button
                    variant="link"
                    onClick={() => setActiveTab('upload')}
                    className="mt-2"
                  >
                    Upload new media
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 pb-4">
                  {media.map((item) => {
                    const isSelected = selectedMedia.find((m) => m.id === item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={cn(
                          'relative aspect-square rounded-lg overflow-hidden border-2 transition-all group',
                          isSelected
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-transparent hover:border-muted-foreground/30'
                        )}
                      >
                        {item.file_type === 'image' ? (
                          <img
                            src={item.file_url}
                            alt={item.alt_text || item.original_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-2">
                            {FILE_TYPE_ICONS[item.file_type] || <FileText className="h-8 w-8" />}
                            <span className="text-xs text-muted-foreground truncate max-w-[80%]">
                              {item.original_name}
                            </span>
                          </div>
                        )}

                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <div className="text-white text-xs truncate">
                            <p className="font-medium truncate">{item.original_name}</p>
                            <p className="text-white/70">{formatFileSize(item.file_size)}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="flex-1 flex flex-col mt-0 px-6 py-4">
            <div
              className={cn(
                'flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 transition-colors',
                uploading ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary'
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                handleUpload(e.dataTransfer.files)
              }}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Uploading files...</p>
                  <div className="space-y-2 w-full max-w-xs">
                    {Object.entries(uploadProgress).map(([name, progress]) => (
                      <div key={name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="truncate">{name}</span>
                          <span>{progress === -1 ? 'Failed' : `${progress}%`}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full transition-all',
                              progress === -1 ? 'bg-destructive' : 'bg-primary'
                            )}
                            style={{ width: `${Math.max(0, progress)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-lg font-medium">Drag and drop files here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept={ACCEPTED_TYPES[fileType]}
                    onChange={(e) => handleUpload(e.target.files)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Max file size: 50MB • Supported: Images, Videos, Audio, Documents
                  </p>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer with selection info and actions */}
        <div className="px-6 py-4 border-t flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            {selectedMedia.length > 0 && (
              <>
                <Badge variant="secondary">{selectedMedia.length} selected</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMedia([])}
                  className="h-7 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={selectedMedia.length === 0}>
              {multiple ? `Select ${selectedMedia.length} Item(s)` : 'Select'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
