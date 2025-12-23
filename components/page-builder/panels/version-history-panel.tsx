'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  History,
  RotateCcw,
  Trash2,
  Eye,
  Clock,
  User,
  Loader2,
  Check,
  Save,
  GitCompare,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getPageVersions,
  restoreVersion,
  deleteVersion,
  createPageVersion,
  type PageVersion,
} from '@/app/actions/cms/versions'
import { toast } from 'sonner'

interface VersionHistoryPanelProps {
  pageId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onVersionRestored?: () => void
}

export function VersionHistoryPanel({
  pageId,
  open,
  onOpenChange,
  onVersionRestored,
}: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<PageVersion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<PageVersion | null>(null)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [versionToAction, setVersionToAction] = useState<PageVersion | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSavingVersion, setIsSavingVersion] = useState(false)

  // Fetch versions
  const fetchVersions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getPageVersions(pageId)
      setVersions(data)
    } catch (error) {
      console.error('Error fetching versions:', error)
      toast.error('Failed to load versions')
    } finally {
      setIsLoading(false)
    }
  }, [pageId])

  useEffect(() => {
    if (open) {
      fetchVersions()
    }
  }, [open, fetchVersions])

  // Create a new version
  const handleSaveVersion = async () => {
    setIsSavingVersion(true)
    try {
      const result = await createPageVersion(pageId, 'Manual save')
      if (result.success) {
        toast.success(result.message)
        fetchVersions()
      } else {
        toast.error(result.message || 'Failed to save version')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsSavingVersion(false)
    }
  }

  // Restore version
  const handleRestore = async () => {
    if (!versionToAction) return

    setIsRestoring(true)
    try {
      const result = await restoreVersion(versionToAction.id)
      if (result.success) {
        toast.success(result.message)
        setShowRestoreConfirm(false)
        setVersionToAction(null)
        onVersionRestored?.()
        onOpenChange(false)
      } else {
        toast.error(result.message || 'Failed to restore version')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsRestoring(false)
    }
  }

  // Delete version
  const handleDelete = async () => {
    if (!versionToAction) return

    setIsDeleting(true)
    try {
      const result = await deleteVersion(versionToAction.id)
      if (result.success) {
        toast.success(result.message)
        setShowDeleteConfirm(false)
        setVersionToAction(null)
        fetchVersions()
      } else {
        toast.error(result.message || 'Failed to delete version')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  // Open restore confirmation
  const openRestoreConfirm = (version: PageVersion) => {
    setVersionToAction(version)
    setShowRestoreConfirm(true)
  }

  // Open delete confirmation
  const openDeleteConfirm = (version: PageVersion) => {
    setVersionToAction(version)
    setShowDeleteConfirm(true)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </SheetTitle>
            <SheetDescription>
              View and restore previous versions of this page
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Save current version button */}
            <Button
              onClick={handleSaveVersion}
              disabled={isSavingVersion}
              className="w-full"
              variant="outline"
            >
              {isSavingVersion ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Current Version
            </Button>

            {/* Versions list */}
            <ScrollArea className="h-[calc(100vh-250px)]">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : versions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <History className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No versions yet</p>
                  <p className="text-sm text-muted-foreground/70">
                    Save a version to create your first snapshot
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pr-4">
                  {versions.map((version, index) => (
                    <div
                      key={version.id}
                      className={cn(
                        'p-4 rounded-lg border transition-colors',
                        selectedVersion?.id === version.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              Version {version.version_number}
                            </span>
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Latest
                              </Badge>
                            )}
                            {version.is_published_version && (
                              <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                                <Check className="h-3 w-3 mr-1" />
                                Published
                              </Badge>
                            )}
                            {version.is_auto_save && (
                              <Badge variant="outline" className="text-xs">
                                Auto-save
                              </Badge>
                            )}
                          </div>

                          {version.change_summary && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {version.change_summary}
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {version.created_at
                                ? formatDistanceToNow(new Date(version.created_at), {
                                    addSuffix: true,
                                  })
                                : 'Unknown'}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {version.creator?.full_name || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelectedVersion(
                              selectedVersion?.id === version.id ? null : version
                            )
                          }
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openRestoreConfirm(version)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                        {version.is_auto_save && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => openDeleteConfirm(version)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Restore Confirmation - Custom inline to avoid Dialog/Sheet context conflicts */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => !isRestoring && setShowRestoreConfirm(false)} />
          <div className="relative z-[101] w-full max-w-md mx-4 bg-background rounded-lg border shadow-lg p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    Restore to Version {versionToAction?.version_number}?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will replace the current page content with this version. A backup of the
                    current state will be saved automatically.
                  </p>
                  {versionToAction?.change_summary && (
                    <p className="text-sm font-medium mt-2 text-foreground">
                      &quot;{versionToAction.change_summary}&quot;
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRestoreConfirm(false)}
                  disabled={isRestoring}
                >
                  Cancel
                </Button>
                <Button onClick={handleRestore} disabled={isRestoring}>
                  {isRestoring && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Restore Version
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation - Custom inline to avoid Dialog/Sheet context conflicts */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => !isDeleting && setShowDeleteConfirm(false)} />
          <div className="relative z-[101] w-full max-w-md mx-4 bg-background rounded-lg border shadow-lg p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    Delete Version {versionToAction?.version_number}?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will permanently delete this auto-save version. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  variant="destructive"
                >
                  {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
