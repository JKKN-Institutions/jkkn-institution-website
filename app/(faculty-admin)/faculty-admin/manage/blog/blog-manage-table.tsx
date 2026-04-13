'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Globe, Search, Send, Loader2,
} from 'lucide-react'
import {
  getBlogPosts,
  publishBlogPost,
  unpublishBlogPost,
  deleteBlogPost,
  type PostStatus,
} from '@/app/actions/cms/blog'
import { getBlogCategories } from '@/app/actions/cms/blog-categories'
import { toast } from 'sonner'
import { format } from 'date-fns'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
}

interface BlogPostRow {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  status: PostStatus | null
  is_featured: boolean | null
  reading_time_minutes: number | null
  view_count: number | null
  created_at: string | null
  published_at: string | null
  category?: { id: string; name: string; slug: string; color: string | null } | null
  author?: { id: string; full_name: string | null; avatar_url: string | null } | null
}

export function BlogManageTable() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [data, setData] = useState<BlogPostRow[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  // Action dialog
  const [actionDialog, setActionDialog] = useState<{
    type: 'publish' | 'unpublish' | 'delete' | null
    postId: string | null
    postTitle: string
    isOpen: boolean
  }>({ type: null, postId: null, postTitle: '', isOpen: false })
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch categories
  useEffect(() => {
    getBlogCategories().then(setCategories).catch(console.error)
  }, [])

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getBlogPosts({
        page,
        limit,
        search: search || undefined,
        status: (statusFilter || undefined) as PostStatus | undefined,
        category_id: categoryFilter || undefined,
      })
      setData(result.data as BlogPostRow[])
      setTotal(result.total)
    } catch {
      toast.error('Failed to fetch blog posts')
    } finally {
      setIsLoading(false)
    }
  }, [page, search, statusFilter, categoryFilter])

  useEffect(() => { fetchData() }, [fetchData])

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch !== search) {
        setSearch(debouncedSearch)
        setPage(1)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [debouncedSearch])

  // Handle action confirmation
  const handleActionConfirm = async () => {
    if (!actionDialog.postId || !actionDialog.type) return
    setIsProcessing(true)
    try {
      let result
      switch (actionDialog.type) {
        case 'publish':
          result = await publishBlogPost(actionDialog.postId)
          break
        case 'unpublish':
          result = await unpublishBlogPost(actionDialog.postId)
          break
        case 'delete':
          result = await deleteBlogPost(actionDialog.postId)
          break
      }
      if (result?.success) {
        toast.success(result.message)
        fetchData()
      } else {
        toast.error(result?.message || 'Action failed')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsProcessing(false)
      setActionDialog({ type: null, postId: null, postTitle: '', isOpen: false })
    }
  }

  const statusBadge = (status: string | null) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">published</Badge>
      case 'draft':
        return <Badge variant="secondary">draft</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">scheduled</Badge>
      case 'archived':
        return <Badge variant="outline" className="text-gray-400">archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalPages = Math.ceil(total / limit)

  const ActionMenu = ({ post }: { post: BlogPostRow }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/faculty-admin/manage/blog/${post.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Link>
        </DropdownMenuItem>
        {post.status === 'published' && (
          <DropdownMenuItem asChild>
            <Link href={`/blog/${post.slug}`} target="_blank">
              <Globe className="mr-2 h-4 w-4" /> View Live
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {post.status !== 'published' ? (
          <DropdownMenuItem onClick={() => setActionDialog({ type: 'publish', postId: post.id, postTitle: post.title, isOpen: true })}>
            <Send className="mr-2 h-4 w-4" /> Publish
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => setActionDialog({ type: 'unpublish', postId: post.id, postTitle: post.title, isOpen: true })}>
            <EyeOff className="mr-2 h-4 w-4" /> Unpublish
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={() => setActionDialog({ type: 'delete', postId: post.id, postTitle: post.title, isOpen: true })}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search posts..."
            value={debouncedSearch}
            onChange={e => setDebouncedSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter || 'all'} onValueChange={v => { setStatusFilter(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter || 'all'} onValueChange={v => { setCategoryFilter(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading posts...
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                      {search || statusFilter || categoryFilter
                        ? 'No posts found matching your filters'
                        : 'No blog posts yet. Click "New Post" to get started.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((post, index) => (
                    <TableRow key={post.id} className={isPending ? 'opacity-50' : ''}>
                      <TableCell className="text-gray-400">{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {post.featured_image ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              <Image
                                src={post.featured_image}
                                alt=""
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                              <span className="text-[0.65rem] font-bold text-emerald-600">
                                {post.title.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link
                              href={`/faculty-admin/manage/blog/${post.id}/edit`}
                              className="font-medium text-gray-900 hover:text-[#0b6d41] transition-colors line-clamp-1"
                            >
                              {post.title}
                            </Link>
                            {post.excerpt && (
                              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{post.excerpt}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.category ? (
                          <span className="text-sm text-gray-600">{post.category.name}</span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </TableCell>
                      <TableCell>{statusBadge(post.status)}</TableCell>
                      <TableCell className="text-sm text-gray-500">{post.view_count ?? 0}</TableCell>
                      <TableCell className="text-xs text-gray-400">
                        {post.published_at
                          ? format(new Date(post.published_at), 'MMM d, yyyy')
                          : post.created_at
                          ? format(new Date(post.created_at), 'MMM d, yyyy')
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <ActionMenu post={post} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card List */}
          <div className="sm:hidden space-y-3">
            {data.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                {search || statusFilter || categoryFilter ? 'No posts found' : 'No blog posts yet'}
              </div>
            ) : (
              data.map((post) => (
                <div key={post.id} className="border border-gray-100 rounded-xl p-4 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/faculty-admin/manage/blog/${post.id}/edit`} className="flex items-center gap-3 flex-1 min-w-0">
                      {post.featured_image ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Image src={post.featured_image} alt="" width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-emerald-600">{post.title.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{post.title}</p>
                        <p className="text-xs text-gray-400 truncate">{post.category?.name || 'Uncategorized'}</p>
                      </div>
                    </Link>
                    <ActionMenu post={post} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {post.published_at
                        ? format(new Date(post.published_at), 'MMM d, yyyy')
                        : post.created_at
                        ? format(new Date(post.created_at), 'MMM d, yyyy')
                        : ''}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {statusBadge(post.status)}
                      <span className="text-[10px] text-gray-300">{post.view_count ?? 0} views</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="h-8 text-xs"
                >
                  Previous
                </Button>
                <span className="text-xs text-gray-500 px-2">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-8 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Confirmation Dialog */}
      <AlertDialog
        open={actionDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) setActionDialog({ type: null, postId: null, postTitle: '', isOpen: false })
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.type === 'delete' ? 'Delete' : actionDialog.type === 'publish' ? 'Publish' : 'Unpublish'} Post
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.type === 'delete'
                ? `This will permanently delete "${actionDialog.postTitle}". This action cannot be undone.`
                : `Are you sure you want to ${actionDialog.type} "${actionDialog.postTitle}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActionConfirm}
              disabled={isProcessing}
              className={actionDialog.type === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {actionDialog.type === 'delete' ? 'Delete' : actionDialog.type === 'publish' ? 'Publish' : 'Unpublish'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
