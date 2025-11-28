'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Folder,
  FolderPlus,
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  ChevronRight,
  FolderOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  DialogFooter,
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
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  createFolder,
  renameFolder,
  deleteFolder,
} from '@/app/actions/cms/media'
import { toast } from 'sonner'

interface FolderSidebarProps {
  folders: string[]
  folderStats: Record<string, number>
  selectedFolder: string
  onFolderSelect: (folder: string) => void
}

export function FolderSidebar({
  folders,
  folderStats,
  selectedFolder,
  onFolderSelect,
}: FolderSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for dialogs
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedFolderForAction, setSelectedFolderForAction] = useState<string | null>(null)

  // Form state
  const [newFolderName, setNewFolderName] = useState('')
  const [renameFolderName, setRenameFolderName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle folder selection
  const handleFolderClick = (folder: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (folder === 'all') {
      params.delete('folder')
    } else {
      params.set('folder', folder)
    }
    params.set('page', '1') // Reset to first page
    router.push(`/admin/content/media?${params.toString()}`)
    onFolderSelect(folder)
  }

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name is required')
      return
    }

    setIsLoading(true)
    try {
      const result = await createFolder(newFolderName)
      if (result.success) {
        toast.success(result.message)
        setShowCreateDialog(false)
        setNewFolderName('')
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to create folder')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Rename folder
  const handleRenameFolder = async () => {
    if (!selectedFolderForAction || !renameFolderName.trim()) {
      toast.error('Folder name is required')
      return
    }

    setIsLoading(true)
    try {
      const result = await renameFolder(selectedFolderForAction, renameFolderName)
      if (result.success) {
        toast.success(result.message)
        setShowRenameDialog(false)
        setRenameFolderName('')
        setSelectedFolderForAction(null)
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to rename folder')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete folder
  const handleDeleteFolder = async () => {
    if (!selectedFolderForAction) return

    setIsLoading(true)
    try {
      const result = await deleteFolder(selectedFolderForAction, true)
      if (result.success) {
        toast.success(result.message)
        setShowDeleteDialog(false)
        setSelectedFolderForAction(null)
        // If deleted folder was selected, go back to all
        if (selectedFolder === selectedFolderForAction) {
          handleFolderClick('all')
        }
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to delete folder')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Open rename dialog
  const openRenameDialog = (folder: string) => {
    setSelectedFolderForAction(folder)
    setRenameFolderName(folder)
    setShowRenameDialog(true)
  }

  // Open delete dialog
  const openDeleteDialog = (folder: string) => {
    setSelectedFolderForAction(folder)
    setShowDeleteDialog(true)
  }

  // Calculate total files
  const totalFiles = Object.values(folderStats).reduce((sum, count) => sum + count, 0)

  return (
    <div className="w-64 border-r border-border bg-card/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Folders</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowCreateDialog(true)}
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Folder List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* All Files */}
          <button
            onClick={() => handleFolderClick('all')}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
              selectedFolder === 'all'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted text-foreground'
            )}
          >
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span>All Files</span>
            </div>
            <span className="text-xs text-muted-foreground">{totalFiles}</span>
          </button>

          {/* Folder items */}
          {folders.map((folder) => (
            <div
              key={folder}
              className={cn(
                'group flex items-center rounded-lg transition-colors',
                selectedFolder === folder
                  ? 'bg-primary/10'
                  : 'hover:bg-muted'
              )}
            >
              <button
                onClick={() => handleFolderClick(folder)}
                className={cn(
                  'flex-1 flex items-center justify-between px-3 py-2 text-sm',
                  selectedFolder === folder ? 'text-primary' : 'text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  {selectedFolder === folder ? (
                    <FolderOpen className="h-4 w-4" />
                  ) : (
                    <Folder className="h-4 w-4" />
                  )}
                  <span className="truncate">{folder}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {folderStats[folder] || 0}
                </span>
              </button>

              {/* Folder actions (not for general) */}
              {folder !== 'general' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-7 w-7 mr-1 opacity-0 group-hover:opacity-100 transition-opacity',
                        selectedFolder === folder && 'opacity-100'
                      )}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openRenameDialog(folder)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => openDeleteDialog(folder)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize your media files.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                placeholder="Enter folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <p className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, hyphens, and underscores are allowed.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false)
                setNewFolderName('')
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for the folder &quot;{selectedFolderForAction}&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-folder">New Name</Label>
              <Input
                id="rename-folder"
                placeholder="Enter new folder name..."
                value={renameFolderName}
                onChange={(e) => setRenameFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRenameDialog(false)
                setRenameFolderName('')
                setSelectedFolderForAction(null)
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameFolder} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete folder &quot;{selectedFolderForAction}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              All files in this folder will be moved to the &quot;general&quot; folder.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isLoading}
              onClick={() => {
                setSelectedFolderForAction(null)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Folder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
