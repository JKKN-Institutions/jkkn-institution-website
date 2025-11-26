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
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { publishPage } from '@/app/actions/cms/pages'
import { toast } from 'sonner'
import { useState } from 'react'

interface TopToolbarProps {
  onSave: () => Promise<void>
}

export function TopToolbar({ onSave }: TopToolbarProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'draft':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
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

          {/* Publish button */}
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isPublishing || page?.status === 'published'}
            className={cn(
              page?.status === 'published'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-primary hover:bg-primary/90'
            )}
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {page?.status === 'published' ? 'Published' : 'Publish'}
          </Button>

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
    </TooltipProvider>
  )
}
