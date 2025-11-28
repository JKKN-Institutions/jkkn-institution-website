'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  Folder,
  FolderPlus,
  Check,
  Loader2,
} from 'lucide-react'
import { moveMediaToFolder, createFolder } from '@/app/actions/cms/media'
import { toast } from 'sonner'

interface MoveToFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folders: string[]
  selectedMediaIds: string[]
  currentFolder?: string
  onSuccess?: () => void
}

export function MoveToFolderDialog({
  open,
  onOpenChange,
  folders,
  selectedMediaIds,
  currentFolder,
  onSuccess,
}: MoveToFolderDialogProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [isMoving, setIsMoving] = useState(false)
  const [showCreateNew, setShowCreateNew] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Reset state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedFolder(null)
      setShowCreateNew(false)
      setNewFolderName('')
    }
    onOpenChange(open)
  }

  // Create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name is required')
      return
    }

    setIsCreating(true)
    try {
      const result = await createFolder(newFolderName)
      if (result.success && result.data) {
        toast.success('Folder created')
        setSelectedFolder((result.data as { folder: string }).folder)
        setShowCreateNew(false)
        setNewFolderName('')
      } else {
        toast.error(result.message || 'Failed to create folder')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsCreating(false)
    }
  }

  // Move media to selected folder
  const handleMove = async () => {
    if (!selectedFolder) {
      toast.error('Please select a folder')
      return
    }

    if (selectedFolder === currentFolder) {
      toast.error('Files are already in this folder')
      return
    }

    setIsMoving(true)
    try {
      const result = await moveMediaToFolder(selectedMediaIds, selectedFolder)
      if (result.success) {
        toast.success(result.message || 'Files moved successfully')
        handleOpenChange(false)
        onSuccess?.()
      } else {
        toast.error(result.message || 'Failed to move files')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsMoving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move to Folder</DialogTitle>
          <DialogDescription>
            Select a folder to move {selectedMediaIds.length} file
            {selectedMediaIds.length !== 1 ? 's' : ''} to.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {showCreateNew ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-folder-name">New Folder Name</Label>
                <Input
                  id="new-folder-name"
                  placeholder="Enter folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreateFolder()
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Only lowercase letters, numbers, hyphens, and underscores are allowed.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCreateNew(false)
                    setNewFolderName('')
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateFolder}
                  disabled={isCreating || !newFolderName.trim()}
                >
                  {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="h-64">
                <div className="space-y-1 pr-4">
                  {/* Create new folder option */}
                  <button
                    onClick={() => setShowCreateNew(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors"
                  >
                    <FolderPlus className="h-4 w-4" />
                    <span>Create new folder</span>
                  </button>

                  <div className="h-px bg-border my-2" />

                  {/* Existing folders */}
                  {folders.map((folder) => (
                    <button
                      key={folder}
                      onClick={() => setSelectedFolder(folder)}
                      disabled={folder === currentFolder}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                        selectedFolder === folder
                          ? 'bg-primary/10 text-primary'
                          : folder === currentFolder
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'hover:bg-muted text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        <span>{folder}</span>
                        {folder === currentFolder && (
                          <span className="text-xs text-muted-foreground">(current)</span>
                        )}
                      </div>
                      {selectedFolder === folder && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        {!showCreateNew && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isMoving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMove}
              disabled={isMoving || !selectedFolder || selectedFolder === currentFolder}
            >
              {isMoving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Move {selectedMediaIds.length} file{selectedMediaIds.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
