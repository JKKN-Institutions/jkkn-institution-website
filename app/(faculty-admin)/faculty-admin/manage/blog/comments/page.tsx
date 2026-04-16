'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import {
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

const STATUS_PILL: Record<CommentStatus, { class: string; label: string }> = {
  pending: { class: 'bg-amber-50 text-amber-700 border border-amber-100', label: 'Pending' },
  approved: { class: 'bg-emerald-50 text-emerald-700 border border-emerald-100', label: 'Approved' },
  rejected: { class: 'bg-red-50 text-red-700 border border-red-100', label: 'Rejected' },
  spam: { class: 'bg-gray-100 text-gray-700 border border-gray-200', label: 'Spam' },
}

const STAT_CARDS: Array<{
  key: 'all' | CommentStatus
  label: string
  ringColor: string
  textColor: string
  dotColor: string
}> = [
  { key: 'all', label: 'Total', ringColor: 'ring-[#0b6d41]', textColor: 'text-gray-800', dotColor: 'bg-[#0b6d41]' },
  { key: 'pending', label: 'Pending', ringColor: 'ring-amber-400', textColor: 'text-amber-600', dotColor: 'bg-amber-400' },
  { key: 'approved', label: 'Approved', ringColor: 'ring-emerald-500', textColor: 'text-emerald-600', dotColor: 'bg-emerald-500' },
  { key: 'rejected', label: 'Rejected', ringColor: 'ring-red-500', textColor: 'text-red-500', dotColor: 'bg-red-500' },
  { key: 'spam', label: 'Spam', ringColor: 'ring-gray-400', textColor: 'text-gray-600', dotColor: 'bg-gray-400' },
]

export default function FacultyBlogCommentsPage() {
  const [comments, setComments] = useState<BlogCommentWithRelations[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CommentStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  const [selectedComments, setSelectedComments] = useState<string[]>([])

  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectCommentId, setRejectCommentId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [viewComment, setViewComment] = useState<BlogCommentWithRelations | null>(null)

  const fetchComments = useCallback(async () => {
    setIsLoading(true)
    try {
      const [commentsData, statsData] = await Promise.all([
        getAllComments({ status: statusFilter, search: searchQuery, page, pageSize }),
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

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleModerate = async (
    commentId: string,
    status: CommentStatus,
    reason?: string
  ) => {
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

  const toggleSelection = (commentId: string) =>
    setSelectedComments((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]
    )

  const toggleSelectAll = () =>
    setSelectedComments(
      selectedComments.length === comments.length ? [] : comments.map((c) => c.id)
    )

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Comment Moderation</h1>
          <p className="text-[0.78rem] text-gray-400">Review and moderate blog comments</p>
        </div>
        <button
          onClick={() => fetchComments()}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[0.78rem] font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STAT_CARDS.map(({ key, label, ringColor, textColor, dotColor }) => {
          const value = key === 'all' ? stats.total : stats[key]
          const active = statusFilter === key
          return (
            <button
              key={key}
              onClick={() => {
                setStatusFilter(key)
                setPage(1)
              }}
              className={`text-left bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all ${
                active ? `ring-2 ${ringColor}` : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                <span className="text-[0.72rem] text-gray-400 font-medium">{label}</span>
              </div>
              <p className={`text-[1.5rem] font-bold leading-none ${textColor}`}>{value}</p>
            </button>
          )
        })}
      </div>

      {/* Filters & bulk actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-[0.8rem]"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as CommentStatus | 'all')
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-40 h-9 text-[0.8rem]">
                <Filter className="mr-2 h-3.5 w-3.5" />
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
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[0.72rem] text-gray-500 px-2 py-1 rounded-md bg-gray-50">
                {selectedComments.length} selected
              </span>
              <button
                onClick={() => handleBulkModerate('approved')}
                disabled={isPending}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[0.72rem] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:opacity-50"
              >
                <Check className="w-3 h-3" /> Approve
              </button>
              <button
                onClick={() => handleBulkModerate('rejected')}
                disabled={isPending}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[0.72rem] font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <X className="w-3 h-3" /> Reject
              </button>
              <button
                onClick={() => handleBulkModerate('spam')}
                disabled={isPending}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[0.72rem] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors disabled:opacity-50"
              >
                <AlertTriangle className="w-3 h-3" /> Spam
              </button>
              <button
                onClick={() => setIsBulkDeleteOpen(true)}
                disabled={isPending}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[0.72rem] font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments list */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-sm font-semibold text-gray-700">No comments found</h3>
            <p className="text-[0.78rem] text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Comments will appear here once users start commenting'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
              <Checkbox
                checked={selectedComments.length === comments.length && comments.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-[0.75rem] text-gray-500">Select all on this page</span>
            </div>

            <div className="space-y-3">
              {comments.map((comment) => {
                const pill = STATUS_PILL[comment.status as CommentStatus]
                return (
                  <div
                    key={comment.id}
                    className={`p-4 border rounded-xl transition-colors ${
                      selectedComments.includes(comment.id)
                        ? 'border-[#0b6d41]/40 bg-[#0b6d41]/[0.02]'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedComments.includes(comment.id)}
                        onCheckedChange={() => toggleSelection(comment.id)}
                        className="mt-1"
                      />
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={comment.author_avatar || undefined} />
                        <AvatarFallback className="text-[0.7rem] bg-[#0b6d41]/10 text-[#0b6d41]">
                          {comment.author_name[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[0.85rem] font-semibold text-gray-800">
                            {comment.author_name}
                          </span>
                          <span className="text-[0.72rem] text-gray-400">
                            {comment.author_email}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[0.68rem] font-medium ${pill.class}`}
                          >
                            {pill.label}
                          </span>
                          {comment.parent_id && (
                            <span className="px-2 py-0.5 rounded-full text-[0.68rem] font-medium bg-gray-50 text-gray-600 border border-gray-100">
                              Reply
                            </span>
                          )}
                        </div>
                        <p className="text-[0.72rem] text-gray-400 mt-1">
                          On:{' '}
                          {comment.post?.id ? (
                            <Link
                              href={`/faculty-admin/manage/blog/${comment.post.id}/edit`}
                              className="text-[#0b6d41] hover:underline"
                            >
                              {comment.post?.title || 'Unknown post'}
                            </Link>
                          ) : (
                            <span>{comment.post?.title || 'Unknown post'}</span>
                          )}
                        </p>
                        <p className="mt-2 text-[0.82rem] text-gray-700 line-clamp-3">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[0.7rem] text-gray-400">
                          <span>
                            {formatDistanceToNow(new Date(comment.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                          {comment.is_edited && <span className="italic">(edited)</span>}
                          <span>{comment.likes_count} likes</span>
                          <span>{comment.replies_count} replies</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 text-[0.75rem]">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewComment(comment)}>
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {comment.status !== 'approved' && (
                            <DropdownMenuItem
                              onClick={() => handleModerate(comment.id, 'approved')}
                            >
                              <Check className="mr-2 h-3.5 w-3.5 text-emerald-600" />
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
                              <X className="mr-2 h-3.5 w-3.5 text-red-600" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          {comment.status !== 'spam' && (
                            <DropdownMenuItem
                              onClick={() => handleModerate(comment.id, 'spam')}
                            >
                              <AlertTriangle className="mr-2 h-3.5 w-3.5 text-amber-600" />
                              Mark as Spam
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteCommentId(comment.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <p className="text-[0.75rem] text-gray-400">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of{' '}
                  {total} comments
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-md text-[0.75rem] font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-md text-[0.75rem] font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
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
                  <AvatarFallback className="bg-[#0b6d41]/10 text-[#0b6d41]">
                    {viewComment.author_name[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">{viewComment.author_name}</p>
                  <p className="text-sm text-gray-500">{viewComment.author_email}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[0.68rem] font-medium ${
                    STATUS_PILL[viewComment.status as CommentStatus].class
                  }`}
                >
                  {STATUS_PILL[viewComment.status as CommentStatus].label}
                </span>
              </div>
              <div>
                <Label className="text-gray-500">Post</Label>
                <p className="font-medium text-gray-800">{viewComment.post?.title}</p>
              </div>
              <div>
                <Label className="text-gray-500">Content</Label>
                <p className="p-3 bg-gray-50 rounded-lg mt-1 text-sm text-gray-700">
                  {viewComment.content}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Created</Label>
                  <p className="text-gray-700">
                    {format(new Date(viewComment.created_at), 'PPpp')}
                  </p>
                </div>
                {viewComment.moderated_at && (
                  <div>
                    <Label className="text-gray-500">Moderated</Label>
                    <p className="text-gray-700">
                      {format(new Date(viewComment.moderated_at), 'PPpp')}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-500">Likes</Label>
                  <p className="text-gray-700">{viewComment.likes_count}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Replies</Label>
                  <p className="text-gray-700">{viewComment.replies_count}</p>
                </div>
              </div>
              {viewComment.rejection_reason && (
                <div>
                  <Label className="text-gray-500">Rejection Reason</Label>
                  <p className="text-red-600 text-sm">{viewComment.rejection_reason}</p>
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
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                if (rejectCommentId)
                  handleModerate(rejectCommentId, 'rejected', rejectionReason)
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
              Are you sure you want to delete this comment? This action cannot be undone and will
              also delete all replies to this comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
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
              Are you sure you want to delete {selectedComments.length} comments? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
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
