'use client'

import { usePageBuilder } from '../page-builder-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Sparkles,
  Clock,
  ChevronDown,
  XCircle,
  Layout,
  BookTemplate,
  History,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { publishPage, cancelScheduledPublish } from '@/app/actions/cms/pages'
import { toast } from 'sonner'
import { useState } from 'react'
import { SchedulePublishDialog } from '../modals/schedule-publish-dialog'
import { TemplateBrowserModal } from '../modals/template-browser-modal'
import { SaveTemplateDialog } from '../modals/save-template-dialog'
import { VersionHistoryPanel } from '../panels/version-history-panel'
import { SharePreviewDialog } from '../modals/share-preview-dialog'
import { LayoutPresetsModal } from '../modals/layout-presets-modal'
import { format } from 'date-fns'
import { Share2, Layers } from 'lucide-react'
import type { LayoutPreset } from '@/lib/cms/layout-presets'

interface TopToolbarProps {
  onSave: () => Promise<void>
  onAIEnhance?: () => void
  onPresetSelect?: (preset: LayoutPreset) => void
}

export function TopToolbar({ onSave, onAIEnhance, onPresetSelect }: TopToolbarProps) {
  const {
    state,
    undo,
    redo,
    canUndo,
    canRedo,
    setDevice,
    setPreviewMode,
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
        <div className="flex items-center gap-4">
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

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {page?.title || 'Untitled Page'}
                </span>
                {isDirty && (
                  <span className="text-xs text-amber-600">• Unsaved changes</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                /{page?.slug || ''}
              </span>
            </div>
          </div>

          {page?.status && (
            <Badge variant="secondary" className={getStatusColor(page.status)}>
              {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
            </Badge>
          )}
        </div>

        {/* Center section: Device preview and undo/redo */}
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 mr-2">
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

          <div className="h-6 w-px bg-border" />

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
          {/* Layout Presets button */}
          {onPresetSelect && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLayoutPresetsOpen(true)}
                  disabled={isPreviewMode}
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

          {/* AI Enhance button */}
          {onAIEnhance && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAIEnhance}
                  className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 hover:border-primary/40 hover:from-primary/20 hover:to-secondary/20"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  AI Enhance
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Apply AI-powered glassmorphism design
              </TooltipContent>
            </Tooltip>
          )}

          {/* Preview toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isPreviewMode ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode(!isPreviewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Exit Preview' : 'Preview'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isPreviewMode ? 'Exit preview mode' : 'Preview page'}
            </TooltipContent>
          </Tooltip>

          {/* Save button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                disabled={!isDirty || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save'}
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

          {/* More actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
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
    </TooltipProvider>
  )
}
