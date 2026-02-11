'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Link2,
  Copy,
  Plus,
  Trash2,
  Eye,
  Clock,
  Lock,
  Users,
  Loader2,
  Check,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getPreviewLinks,
  createPreviewLink,
  deletePreviewLink,
  updatePreviewLink,
  type PreviewLink,
} from '@/app/actions/cms/preview'
import { toast } from 'sonner'

// Client-side utility to generate preview URL
function getPreviewUrl(token: string): string {
  // Use environment variable first, then fallback to current origin (for development)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')

  if (!baseUrl) {
    console.warn('⚠️  NEXT_PUBLIC_SITE_URL not set and window.location unavailable')
  }

  return `${baseUrl}/preview/${token}`
}

interface SharePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pageId: string
  pageTitle: string
}

export function SharePreviewDialog({
  open,
  onOpenChange,
  pageId,
  pageTitle,
}: SharePreviewDialogProps) {
  const [links, setLinks] = useState<PreviewLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // New link form state
  const [showNewLinkForm, setShowNewLinkForm] = useState(false)
  const [newLinkName, setNewLinkName] = useState('')
  const [newLinkExpiry, setNewLinkExpiry] = useState('never')
  const [newLinkPassword, setNewLinkPassword] = useState('')
  const [newLinkMaxViews, setNewLinkMaxViews] = useState('')
  const [usePassword, setUsePassword] = useState(false)
  const [useMaxViews, setUseMaxViews] = useState(false)

  // Fetch links
  const fetchLinks = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getPreviewLinks(pageId)
      setLinks(data)
    } catch (error) {
      console.error('Error fetching preview links:', error)
      toast.error('Failed to load preview links')
    } finally {
      setIsLoading(false)
    }
  }, [pageId])

  useEffect(() => {
    if (open) {
      fetchLinks()
    }
  }, [open, fetchLinks])

  // Reset form
  const resetForm = () => {
    setNewLinkName('')
    setNewLinkExpiry('never')
    setNewLinkPassword('')
    setNewLinkMaxViews('')
    setUsePassword(false)
    setUseMaxViews(false)
    setShowNewLinkForm(false)
  }

  // Create new link
  const handleCreateLink = async () => {
    setIsCreating(true)
    try {
      // Calculate expiry hours
      let expiresIn: number | undefined
      switch (newLinkExpiry) {
        case '1h':
          expiresIn = 1
          break
        case '24h':
          expiresIn = 24
          break
        case '7d':
          expiresIn = 24 * 7
          break
        case '30d':
          expiresIn = 24 * 30
          break
        default:
          expiresIn = undefined
      }

      const result = await createPreviewLink(pageId, {
        name: newLinkName || undefined,
        expiresIn,
        password: usePassword && newLinkPassword ? newLinkPassword : undefined,
        maxViews: useMaxViews && newLinkMaxViews ? parseInt(newLinkMaxViews) : undefined,
      })

      if (result.success) {
        toast.success('Preview link created')
        resetForm()
        fetchLinks()
      } else {
        toast.error(result.message || 'Failed to create preview link')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsCreating(false)
    }
  }

  // Copy link to clipboard
  const handleCopyLink = async (token: string, linkId: string) => {
    const url = getPreviewUrl(token)
    await navigator.clipboard.writeText(url)
    setCopiedId(linkId)
    toast.success('Preview link copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Toggle link active status
  const handleToggleActive = async (linkId: string, isActive: boolean) => {
    try {
      const result = await updatePreviewLink(linkId, { is_active: !isActive })
      if (result.success) {
        setLinks(prev =>
          prev.map(link =>
            link.id === linkId ? { ...link, is_active: !isActive } : link
          )
        )
        toast.success(isActive ? 'Link deactivated' : 'Link activated')
      } else {
        toast.error(result.message || 'Failed to update link')
      }
    } catch {
      toast.error('An error occurred')
    }
  }

  // Open delete confirmation
  const openDeleteConfirm = (linkId: string) => {
    setLinkToDelete(linkId)
    setShowDeleteConfirm(true)
  }

  // Delete link
  const handleDelete = async () => {
    if (!linkToDelete) return

    setIsDeleting(true)
    try {
      const result = await deletePreviewLink(linkToDelete)
      if (result.success) {
        toast.success('Preview link deleted')
        setShowDeleteConfirm(false)
        setLinkToDelete(null)
        fetchLinks()
      } else {
        toast.error(result.message || 'Failed to delete link')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  // Get expiry status
  const getExpiryStatus = (link: PreviewLink) => {
    if (!link.expires_at) return null
    const expiry = new Date(link.expires_at)
    const now = new Date()
    if (expiry < now) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
    }
    return { label: `Expires ${format(expiry, 'MMM d, yyyy')}`, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Share Preview
            </DialogTitle>
            <DialogDescription>
              Create shareable preview links for &quot;{pageTitle}&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Create new link section */}
            {showNewLinkForm ? (
              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-4">
                <h4 className="font-medium">Create New Preview Link</h4>

                <div className="space-y-2">
                  <Label htmlFor="link-name">Link Name (optional)</Label>
                  <Input
                    id="link-name"
                    placeholder="e.g., For Marketing Review"
                    value={newLinkName}
                    onChange={(e) => setNewLinkName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expiration</Label>
                  <Select value={newLinkExpiry} onValueChange={setNewLinkExpiry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never expires</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                      <SelectItem value="30d">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="use-password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password Protection
                    </Label>
                    <Switch
                      id="use-password"
                      checked={usePassword}
                      onCheckedChange={setUsePassword}
                    />
                  </div>
                  {usePassword && (
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={newLinkPassword}
                      onChange={(e) => setNewLinkPassword(e.target.value)}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="use-max-views" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View Limit
                    </Label>
                    <Switch
                      id="use-max-views"
                      checked={useMaxViews}
                      onCheckedChange={setUseMaxViews}
                    />
                  </div>
                  {useMaxViews && (
                    <Input
                      type="number"
                      placeholder="Maximum views"
                      min="1"
                      value={newLinkMaxViews}
                      onChange={(e) => setNewLinkMaxViews(e.target.value)}
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLink} disabled={isCreating}>
                    {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Link
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setShowNewLinkForm(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Preview Link
              </Button>
            )}

            <Separator />

            {/* Existing links */}
            <div>
              <h4 className="font-medium mb-3">
                Existing Links ({links.length})
              </h4>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : links.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Link2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No preview links created yet</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3 pr-4">
                    {links.map((link) => {
                      const expiry = getExpiryStatus(link)
                      const isExpired = link.expires_at && new Date(link.expires_at) < new Date()
                      const isViewLimitReached = link.max_views && link.view_count >= link.max_views

                      return (
                        <div
                          key={link.id}
                          className={cn(
                            'p-4 rounded-lg border transition-colors',
                            !link.is_active || isExpired || isViewLimitReached
                              ? 'border-border/50 bg-muted/30 opacity-75'
                              : 'border-border bg-card'
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {link.name || 'Unnamed Link'}
                                </span>
                                {!link.is_active && (
                                  <Badge variant="secondary">Inactive</Badge>
                                )}
                                {link.password_hash && (
                                  <Badge variant="outline" className="text-xs">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Protected
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                {expiry && (
                                  <Badge variant="secondary" className={expiry.color}>
                                    <Clock className="h-3 w-3 mr-1" />
                                    {expiry.label}
                                  </Badge>
                                )}
                                {link.max_views && (
                                  <Badge variant="secondary">
                                    <Eye className="h-3 w-3 mr-1" />
                                    {link.view_count} / {link.max_views} views
                                  </Badge>
                                )}
                                {!link.max_views && link.view_count > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {link.view_count} views
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => handleCopyLink(link.token, link.id)}
                              >
                                {copiedId === link.id ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                asChild
                              >
                                <a
                                  href={getPreviewUrl(link.token)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => openDeleteConfirm(link.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Toggle active */}
                          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Created {link.created_at ? format(new Date(link.created_at), 'MMM d, yyyy') : 'Unknown'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Active</span>
                              <Switch
                                checked={link.is_active}
                                onCheckedChange={() => handleToggleActive(link.id, link.is_active)}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation - Custom inline to avoid Dialog context conflicts */}
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
                  <h3 className="text-lg font-semibold">Delete preview link?</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will permanently delete this preview link. Anyone with this link will no longer be able to access the preview.
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
