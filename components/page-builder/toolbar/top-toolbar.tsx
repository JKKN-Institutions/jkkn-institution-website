'use client'

import { usePageBuilder } from '../page-builder-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
  ArrowLeft,
  Save,
  Eye,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  MoreVertical,
  Send,
  FileText,
  Settings,
  Loader2,
  ExternalLink,
  Clock,
  ChevronDown,
  XCircle,
  Layout,
  BookTemplate,
  History,
  Trash2,
  Pencil,
  Check,
  X,
  Menu,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { publishPage, cancelScheduledPublish, updatePage } from '@/app/actions/cms/pages'
import { toast } from 'sonner'
import { useState, useRef, useEffect } from 'react'
import { SchedulePublishDialog } from '../modals/schedule-publish-dialog'
import { TemplateBrowserModal } from '../modals/template-browser-modal'
import { SaveTemplateDialog } from '../modals/save-template-dialog'
import { VersionHistoryPanel } from '../panels/version-history-panel'
import { SharePreviewDialog } from '../modals/share-preview-dialog'
import { LayoutPresetsModal } from '../modals/layout-presets-modal'
import { format } from 'date-fns'
import { Share2, Layers, List } from 'lucide-react'
import type { LayoutPreset } from '@/lib/cms/layout-presets'

interface TopToolbarProps {
  onSave: () => Promise<void>
  onPresetSelect?: (preset: LayoutPreset) => void
  isNavigatorOpen?: boolean
  onNavigatorToggle?: () => void
}

export function TopToolbar({ onSave, onPresetSelect, isNavigatorOpen, onNavigatorToggle }: TopToolbarProps) {
  const {
    state,
    undo,
    redo,
    canUndo,
    canRedo,
    setDevice,
    setPreviewMode,
    resetBlocks,
    setPage,
  } = usePageBuilder()

  const { page, isDirty, isSaving, isPreviewMode, device } = state
  const [isPublishing, setIsPublishing] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isCancellingSchedule, setIsCancellingSchedule] = useState(false)
  const [isTemplateBrowserOpen, setIsTemplateBrowserOpen] = useState(false)
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false)
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false)
  const [isSharePreviewOpen, setIsSharePreviewOpen] = useState(false)
  const [isLayoutPresetsOpen, setIsLayoutPresetsOpen] = useState(false)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

  // Inline title editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(page?.title || '')
  const [isSavingTitle, setIsSavingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Update editedTitle when page changes
  useEffect(() => {
    if (page?.title) {
      setEditedTitle(page.title)
    }
  }, [page?.title])

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  const handleTitleSave = async () => {
    if (!page || !editedTitle.trim()) {
      setEditedTitle(page?.title || '')
      setIsEditingTitle(false)
      return
    }

    if (editedTitle === page.title) {
      setIsEditingTitle(false)
      return
    }

    setIsSavingTitle(true)
    try {
      const formData = new FormData()
      formData.append('id', page.id)
      formData.append('title', editedTitle.trim())

      const result = await updatePage({ success: false }, formData)

      if (result.success) {
        // Update local state
        setPage({ ...page, title: editedTitle.trim() })
        toast.success('Page title updated')
        setIsEditingTitle(false)
      } else {
        toast.error(result.message || 'Failed to update title')
        setEditedTitle(page.title)
      }
    } catch (error) {
      toast.error('An error occurred while updating title')
      setEditedTitle(page.title)
    } finally {
      setIsSavingTitle(false)
    }
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTitleSave()
    } else if (e.key === 'Escape') {
      setEditedTitle(page?.title || '')
      setIsEditingTitle(false)
    }
  }

  const handleTitleCancel = () => {
    setEditedTitle(page?.title || '')
    setIsEditingTitle(false)
  }

  const handlePublish = async () => {
    if (!page) return

    setIsPublishing(true)
    try {
      // Save first if dirty
      if (isDirty) {
        await onSave()
      }

      const result = await publishPage(page.id)
      if (result.success) {
        toast.success('Page published successfully')
      } else {
        toast.error(result.message || 'Failed to publish')
      }
    } catch (error) {
      toast.error('An error occurred while publishing')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleCancelSchedule = async () => {
    if (!page) return

    setIsCancellingSchedule(true)
    try {
      const result = await cancelScheduledPublish(page.id)
      if (result.success) {
        toast.success('Scheduled publication cancelled')
      } else {
        toast.error(result.message || 'Failed to cancel schedule')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsCancellingSchedule(false)
    }
  }

  const handleReset = () => {
    resetBlocks()
    setIsResetConfirmOpen(false)
    toast.success('All blocks have been removed')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'draft':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        {/* Left section: Back button and page info */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/content/pages">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to pages</TooltipContent>
          </Tooltip>

          <div className="hidden sm:block h-6 w-px bg-border" />

          <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[200px] sm:max-w-[300px]">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <div className="flex items-center gap-1">
                    <Input
                      ref={titleInputRef}
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onKeyDown={handleTitleKeyDown}
                      onBlur={handleTitleSave}
                      className="h-7 w-48 text-sm font-medium"
                      disabled={isSavingTitle}
                    />
                    {isSavingTitle ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={handleTitleSave}
                        >
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={handleTitleCancel}
                        >
                          <X className="h-3.5 w-3.5 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setIsEditingTitle(true)}
                        className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors group truncate min-w-0"
                      >
                        <span className="truncate">{page?.title || 'Untitled Page'}</span>
                        <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Click to edit title</TooltipContent>
                  </Tooltip>
                )}
                {isDirty && !isEditingTitle && (
                  <span className="text-xs text-amber-600 hidden sm:inline">• Unsaved changes</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground truncate">
                /{page?.slug || ''}
              </span>
            </div>
          </div>

          {page?.status && (
            <Badge variant="secondary" className={cn(getStatusColor(page.status), "hidden xs:inline-flex")}>
              {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
            </Badge>
          )}
        </div>

        {/* Center section: Device preview and undo/redo */}
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
          {/* Undo/Redo - hide on mobile */}
          <div className="hidden sm:flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo || isPreviewMode}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo || isPreviewMode}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </div>

          <div className="hidden sm:block h-6 w-px bg-border" />

          {/* Navigator toggle - hide on mobile */}
          {onNavigatorToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isNavigatorOpen ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={onNavigatorToggle}
                  disabled={isPreviewMode}
                  className="hidden sm:flex"
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Navigator (Ctrl+L)</TooltipContent>
            </Tooltip>
          )}

          <div className="hidden sm:block h-6 w-px bg-border" />

          {/* Device preview */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={device === 'desktop' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setDevice('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Desktop view</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={device === 'tablet' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setDevice('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tablet view</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={device === 'mobile' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setDevice('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mobile view</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center gap-2">
          {/* Layout Presets button - hide on mobile */}
          {onPresetSelect && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLayoutPresetsOpen(true)}
                  disabled={isPreviewMode}
                  className="hidden md:flex"
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Presets
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Add pre-built layout sections
              </TooltipContent>
            </Tooltip>
          )}

          {/* Preview toggle - responsive */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isPreviewMode ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode(!isPreviewMode)}
              >
                <Eye className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isPreviewMode ? 'Exit preview mode' : 'Preview page'}
            </TooltipContent>
          </Tooltip>

          {/* Save button - responsive */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                disabled={!isDirty || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 md:mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 md:mr-2" />
                )}
                <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save changes (Ctrl+S)</TooltipContent>
          </Tooltip>

          {/* Publish button with dropdown */}
          {page?.status === 'scheduled' ? (
            // Show scheduled status with cancel option
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Scheduled
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {page.scheduled_publish_at
                    ? `Scheduled for ${format(new Date(page.scheduled_publish_at), 'PPP \'at\' p')}`
                    : 'Scheduled for publication'}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelSchedule}
                    disabled={isCancellingSchedule}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {isCancellingSchedule ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cancel scheduled publication</TooltipContent>
              </Tooltip>
            </div>
          ) : page?.status === 'published' ? (
            // Show published status
            <Button
              size="sm"
              disabled
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Published
            </Button>
          ) : (
            // Show publish dropdown for draft/archived pages
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  disabled={isPublishing}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isPublishing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Publish
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handlePublish}>
                  <Send className="mr-2 h-4 w-4" />
                  Publish Now
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsScheduleDialogOpen(true)}>
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule Publication
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile hamburger menu - only visible on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Undo/Redo on mobile */}
              <DropdownMenuItem onClick={undo} disabled={!canUndo || isPreviewMode}>
                <Undo2 className="mr-2 h-4 w-4" />
                Undo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={redo} disabled={!canRedo || isPreviewMode}>
                <Redo2 className="mr-2 h-4 w-4" />
                Redo
              </DropdownMenuItem>
              {onNavigatorToggle && (
                <DropdownMenuItem onClick={onNavigatorToggle} disabled={isPreviewMode}>
                  <List className="mr-2 h-4 w-4" />
                  {isNavigatorOpen ? 'Hide' : 'Show'} Navigator
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {/* Preview */}
              <DropdownMenuItem onClick={() => setPreviewMode(!isPreviewMode)}>
                <Eye className="mr-2 h-4 w-4" />
                {isPreviewMode ? 'Exit Preview' : 'Preview'}
              </DropdownMenuItem>
              {/* Save */}
              <DropdownMenuItem onClick={onSave} disabled={!isDirty || isSaving}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Publish options */}
              {page?.status !== 'published' && (
                <>
                  <DropdownMenuItem onClick={handlePublish} disabled={isPublishing}>
                    <Send className="mr-2 h-4 w-4" />
                    Publish Now
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsScheduleDialogOpen(true)}>
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {/* Other actions */}
              {onPresetSelect && (
                <DropdownMenuItem onClick={() => setIsLayoutPresetsOpen(true)} disabled={isPreviewMode}>
                  <Layers className="mr-2 h-4 w-4" />
                  Layout Presets
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setIsVersionHistoryOpen(true)}>
                <History className="mr-2 h-4 w-4" />
                Version History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSaveTemplateOpen(true)}>
                <BookTemplate className="mr-2 h-4 w-4" />
                Save as Template
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/content/pages/${page?.id}`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Page Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More actions dropdown - desktop only */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {page?.status === 'published' && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/${page.slug}`} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View live page
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => setIsLayoutPresetsOpen(true)}>
                <Layers className="mr-2 h-4 w-4" />
                Layout presets
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTemplateBrowserOpen(true)}>
                <Layout className="mr-2 h-4 w-4" />
                Apply template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSaveTemplateOpen(true)}>
                <BookTemplate className="mr-2 h-4 w-4" />
                Save as template
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsVersionHistoryOpen(true)}>
                <History className="mr-2 h-4 w-4" />
                Version history
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSharePreviewOpen(true)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share preview
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/content/pages/${page?.id}`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Page settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsResetConfirmOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Reset all blocks
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Schedule Publish Dialog */}
      {page && (
        <SchedulePublishDialog
          open={isScheduleDialogOpen}
          onOpenChange={setIsScheduleDialogOpen}
          pageId={page.id}
          pageName={page.title || 'Untitled Page'}
          existingSchedule={page.scheduled_publish_at ? new Date(page.scheduled_publish_at) : null}
        />
      )}

      {/* Template Browser Modal */}
      {page && (
        <TemplateBrowserModal
          open={isTemplateBrowserOpen}
          onOpenChange={setIsTemplateBrowserOpen}
          pageId={page.id}
        />
      )}

      {/* Save as Template Dialog */}
      {page && (
        <SaveTemplateDialog
          open={isSaveTemplateOpen}
          onOpenChange={setIsSaveTemplateOpen}
          pageId={page.id}
          pageTitle={page.title || 'Untitled Page'}
        />
      )}

      {/* Version History Panel */}
      {page && (
        <VersionHistoryPanel
          pageId={page.id}
          open={isVersionHistoryOpen}
          onOpenChange={setIsVersionHistoryOpen}
          onVersionRestored={() => {
            // Refresh the page to show restored content
            window.location.reload()
          }}
        />
      )}

      {/* Share Preview Dialog */}
      {page && (
        <SharePreviewDialog
          open={isSharePreviewOpen}
          onOpenChange={setIsSharePreviewOpen}
          pageId={page.id}
          pageTitle={page.title || 'Untitled Page'}
        />
      )}

      {/* Layout Presets Modal */}
      {onPresetSelect && (
        <LayoutPresetsModal
          open={isLayoutPresetsOpen}
          onOpenChange={setIsLayoutPresetsOpen}
          onPresetSelect={onPresetSelect}
        />
      )}

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all blocks?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all blocks from the page. This action can be undone using the undo button.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset all blocks
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}
