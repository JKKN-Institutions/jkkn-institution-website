'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Check,
  X,
  AlertTriangle,
  Trash2,
  Loader2,
  Eye,
  Filter,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  getAllComments,
  getCommentStats,
  moderateComment,
  bulkModerateComments,
  deleteComment,
  bulkDeleteComments,
  type BlogCommentWithRelations,
  type CommentStatus,
} from '@/app/actions/cms/blog-comments'
import { toast } from 'sonner'
import { formatDistanceToNow, format } from 'date-fns'

export default function CommentsPage() {
  const [comments, setComments] = useState<BlogCommentWithRelations[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    spam: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CommentStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  // Selection state
  const [selectedComments, setSelectedComments] = useState<string[]>([])

  // Dialog state
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectCommentId, setRejectCommentId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [viewComment, setViewComment] = useState<BlogCommentWithRelations | null>(null)

  // Fetch comments
  const fetchComments = useCallback(async () => {
    setIsLoading(true)
    try {
      const [commentsData, statsData] = await Promise.all([
        getAllComments({
          status: statusFilter,
          search: searchQuery,
          page,
          pageSize,
        }),
        getCommentStats(),
      ])
      setComments(commentsData.comments)
      setTotal(commentsData.total)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast.error('Failed to fetch comments')
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, searchQuery, page])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle single comment moderation
  const handleModerate = async (commentId: string, status: CommentStatus, reason?: string) => {
    startTransition(async () => {
      const result = await moderateComment(commentId, status, reason)
      if (result.success) {
        toast.success(result.message)
        fetchComments()
        setRejectDialogOpen(false)
        setRejectCommentId(null)
        setRejectionReason('')
      } else {
        toast.error(result.message)
      }
    })
  }

  // Handle bulk moderation
  const handleBulkModerate = async (status: CommentStatus) => {
    if (selectedComments.length === 0) return

    startTransition(async () => {
      const result = await bulkModerateComments(selectedComments, status)
      if (result.success) {
        toast.success(result.message)
        setSelectedComments([])
        fetchComments()
      } else {
        toast.error(result.message)
      }
    })
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteCommentId) return

    startTransition(async () => {
      const result = await deleteComment(deleteCommentId)
      if (result.success) {
        toast.success(result.message)
        fetchComments()
      } else {
        toast.error(result.message)
      }
      setDeleteCommentId(null)
    })
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedComments.length === 0) return

    startTransition(async () => {
      const result = await bulkDeleteComments(selectedComments)
      if (result.success) {
        toast.success(result.message)
        setSelectedComments([])
        fetchComments()
      } else {
        toast.error(result.message)
      }
      setIsBulkDeleteOpen(false)
    })
  }

  // Toggle selection
  const toggleSelection = (commentId: string) => {
    setSelectedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    )
  }

  // Select all visible
  const toggleSelectAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([])
    } else {
      setSelectedComments(comments.map((c) => c.id))
    }
  }

  // Status badge
  const getStatusBadge = (status: CommentStatus) => {
    const variants: Record<CommentStatus, { class: string; label: string }> = {
      pending: { class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', label: 'Pending' },
      approved: { class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Approved' },
      rejected: { class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Rejected' },
      spam: { class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400', label: 'Spam' },
    }
    const variant = variants[status]
    return <Badge className={variant.class}>{variant.label}</Badge>
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="Comment Moderation"
        description="Review and moderate blog comments"
        badge="Blog"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => fetchComments()}
              disabled={isLoading}
              className="min-h-[44px]"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card
          className={`cursor-pointer transition-colors ${
            statusFilter === 'all' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setStatusFilter('all')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            statusFilter === 'pending' ? 'ring-2 ring-amber-500' : ''
          }`}
          onClick={() => setStatusFilter('pending')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            statusFilter === 'approved' ? 'ring-2 ring-green-500' : ''
          }`}
          onClick={() => setStatusFilter('approved')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            statusFilter === 'rejected' ? 'ring-2 ring-red-500' : ''
          }`}
          onClick={() => setStatusFilter('rejected')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            statusFilter === 'spam' ? 'ring-2 ring-gray-500' : ''
          }`}
          onClick={() => setStatusFilter('spam')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Spam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-600">{stats.spam}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions Bar */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as CommentStatus | 'all')
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedComments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{selectedComments.length} selected</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkModerate('approved')}
                disabled={isPending}
              >
                <Check className="mr-1 h-3 w-3" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkModerate('rejected')}
                disabled={isPending}
              >
                <X className="mr-1 h-3 w-3" />
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkModerate('spam')}
                disabled={isPending}
              >
                <AlertTriangle className="mr-1 h-3 w-3" />
                Spam
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteOpen(true)}
                disabled={isPending}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No comments found</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Comments will appear here once users start commenting'}
            </p>
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
              <Checkbox
                checked={selectedComments.length === comments.length && comments.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                Select all on this page
              </span>
            </div>

            {/* Comments */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    selectedComments.includes(comment.id) ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedComments.includes(comment.id)}
                      onCheckedChange={() => toggleSelection(comment.id)}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author_avatar || undefined} />
                      <AvatarFallback>
                        {comment.author_name[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{comment.author_name}</span>
                        <span className="text-sm text-muted-foreground">
                          {comment.author_email}
                        </span>
                        {getStatusBadge(comment.status as CommentStatus)}
                        {comment.parent_id && (
                          <Badge variant="outline">Reply</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        On:{' '}
                        <Link
                          href={`/admin/content/blog/${comment.post?.id}`}
                          className="hover:underline text-primary"
                        >
                          {comment.post?.title || 'Unknown post'}
                        </Link>
                      </p>
                      <p className="mt-2 text-sm line-clamp-3">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                        {comment.is_edited && (
                          <span className="italic">(edited)</span>
                        )}
                        <span>{comment.likes_count} likes</span>
                        <span>{comment.replies_count} replies</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewComment(comment)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {comment.status !== 'approved' && (
                          <DropdownMenuItem
                            onClick={() => handleModerate(comment.id, 'approved')}
                          >
                            <Check className="mr-2 h-4 w-4 text-green-600" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {comment.status !== 'rejected' && (
                          <DropdownMenuItem
                            onClick={() => {
                              setRejectCommentId(comment.id)
                              setRejectDialogOpen(true)
                            }}
                          >
                            <X className="mr-2 h-4 w-4 text-red-600" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        {comment.status !== 'spam' && (
                          <DropdownMenuItem
                            onClick={() => handleModerate(comment.id, 'spam')}
                          >
                            <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
                            Mark as Spam
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteCommentId(comment.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * pageSize + 1} to{' '}
                  {Math.min(page * pageSize, total)} of {total} comments
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Comment Dialog */}
      <Dialog open={!!viewComment} onOpenChange={() => setViewComment(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Comment Details</DialogTitle>
          </DialogHeader>
          {viewComment && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={viewComment.author_avatar || undefined} />
                  <AvatarFallback>
                    {viewComment.author_name[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{viewComment.author_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {viewComment.author_email}
                  </p>
                </div>
                {getStatusBadge(viewComment.status as CommentStatus)}
              </div>
              <div>
                <Label className="text-muted-foreground">Post</Label>
                <p className="font-medium">{viewComment.post?.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Content</Label>
                <p className="p-3 bg-muted rounded-lg mt-1">{viewComment.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p>{format(new Date(viewComment.created_at), 'PPpp')}</p>
                </div>
                {viewComment.moderated_at && (
                  <div>
                    <Label className="text-muted-foreground">Moderated</Label>
                    <p>{format(new Date(viewComment.moderated_at), 'PPpp')}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Likes</Label>
                  <p>{viewComment.likes_count}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Replies</Label>
                  <p>{viewComment.replies_count}</p>
                </div>
              </div>
              {viewComment.rejection_reason && (
                <div>
                  <Label className="text-muted-foreground">Rejection Reason</Label>
                  <p className="text-red-600">{viewComment.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewComment(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reject Comment</DialogTitle>
            <DialogDescription>
              Optionally provide a reason for rejecting this comment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason (optional)</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false)
                setRejectCommentId(null)
                setRejectionReason('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (rejectCommentId) {
                  handleModerate(rejectCommentId, 'rejected', rejectionReason)
                }
              }}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteCommentId}
        onOpenChange={(open) => !open && setDeleteCommentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be
              undone and will also delete all replies to this comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Comments</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedComments.length} comments?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete {selectedComments.length} Comments
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
