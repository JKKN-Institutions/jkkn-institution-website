'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { checkPermission } from '@/app/actions/permissions'
import { logActivity } from '@/lib/utils/activity-logger'

// Types
export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam'

export interface BlogComment {
  id: string
  post_id: string
  parent_id: string | null
  author_id: string | null
  author_name: string
  author_email: string
  author_avatar: string | null
  content: string
  status: CommentStatus
  moderated_by: string | null
  moderated_at: string | null
  rejection_reason: string | null
  likes_count: number
  replies_count: number
  ip_address: string | null
  user_agent: string | null
  is_edited: boolean
  edited_at: string | null
  created_at: string
  updated_at: string
}

export interface BlogCommentWithRelations extends BlogComment {
  post?: {
    id: string
    title: string
    slug: string
  }
  author?: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
  } | null
  moderator?: {
    id: string
    full_name: string | null
    email: string
  } | null
  replies?: BlogCommentWithRelations[]
}

// Form state type
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: BlogComment
}

// Validation schemas
const createCommentSchema = z.object({
  post_id: z.string().uuid('Invalid post ID'),
  parent_id: z.string().uuid().optional().nullable(),
  author_name: z.string().min(1, 'Name is required').max(100),
  author_email: z.string().email('Invalid email address'),
  content: z.string().min(1, 'Comment cannot be empty').max(5000, 'Comment is too long'),
})

const moderateCommentSchema = z.object({
  status: z.enum(['approved', 'rejected', 'spam']),
  rejection_reason: z.string().optional(),
})

// Get comments for a post (public - approved only)
export async function getPostComments(
  postId: string,
  options?: {
    includeReplies?: boolean
    limit?: number
  }
): Promise<BlogCommentWithRelations[]> {
  const supabase = await createServerSupabaseClient()

  // Simple query without complex nested relationships
  let query = supabase
    .from('blog_comments')
    .select('*')
    .eq('post_id', postId)
    .eq('status', 'approved')
    .is('parent_id', null)
    .order('created_at', { ascending: false })

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching comments:', error.message, error.code, error.details)
    return []
  }

  // Return comments without nested relationships for now
  return (data || []).map((comment) => ({
    ...comment,
    replies: [],
  }))
}

// Get all comments for moderation (admin)
export async function getAllComments(options?: {
  status?: CommentStatus | 'all'
  postId?: string
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}): Promise<{ comments: BlogCommentWithRelations[]; total: number }> {
  const supabase = await createServerSupabaseClient()

  // Check permission
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { comments: [], total: 0 }
  }

  const hasPermission = await checkPermission(user.id, 'cms:blog:comments')
  if (!hasPermission) {
    return { comments: [], total: 0 }
  }

  const page = options?.page || 1
  const pageSize = options?.pageSize || 20
  const offset = (page - 1) * pageSize

  let query = supabase
    .from('blog_comments')
    .select(`
      *,
      post:blog_posts!blog_comments_post_id_fkey(id, title, slug),
      author:profiles!blog_comments_author_id_fkey(id, full_name, email, avatar_url),
      moderator:profiles!blog_comments_moderated_by_fkey(id, full_name, email)
    `, { count: 'exact' })

  // Apply filters
  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status)
  }

  if (options?.postId) {
    query = query.eq('post_id', options.postId)
  }

  if (options?.search) {
    query = query.or(`content.ilike.%${options.search}%,author_name.ilike.%${options.search}%,author_email.ilike.%${options.search}%`)
  }

  // Sorting
  const sortBy = options?.sortBy || 'created_at'
  const sortOrder = options?.sortOrder || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Pagination
  query = query.range(offset, offset + pageSize - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching comments:', error)
    return { comments: [], total: 0 }
  }

  return {
    comments: data || [],
    total: count || 0,
  }
}

// Get comment by ID
export async function getComment(id: string): Promise<BlogCommentWithRelations | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_comments')
    .select(`
      *,
      post:blog_posts!blog_comments_post_id_fkey(id, title, slug),
      author:profiles!blog_comments_author_id_fkey(id, full_name, email, avatar_url),
      moderator:profiles!blog_comments_moderated_by_fkey(id, full_name, email)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching comment:', error)
    return null
  }

  return data
}

// Get comment statistics
export async function getCommentStats(): Promise<{
  total: number
  pending: number
  approved: number
  rejected: number
  spam: number
}> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 }
  }

  const { data, error } = await supabase
    .from('blog_comments')
    .select('status')

  if (error) {
    console.error('Error fetching comment stats:', error)
    return { total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 }
  }

  const stats = {
    total: data.length,
    pending: data.filter((c) => c.status === 'pending').length,
    approved: data.filter((c) => c.status === 'approved').length,
    rejected: data.filter((c) => c.status === 'rejected').length,
    spam: data.filter((c) => c.status === 'spam').length,
  }

  return stats
}

// Create a comment (public)
export async function createComment(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user (optional - can be guest)
  const { data: { user } } = await supabase.auth.getUser()

  const rawData = {
    post_id: formData.get('post_id') as string,
    parent_id: formData.get('parent_id') as string || null,
    author_name: formData.get('author_name') as string,
    author_email: formData.get('author_email') as string,
    content: formData.get('content') as string,
  }

  // Validate
  const result = createCommentSchema.safeParse(rawData)
  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    }
  }

  const data = result.data

  // Verify post exists and allows comments
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .select('id, allow_comments')
    .eq('id', data.post_id)
    .eq('status', 'published')
    .single()

  if (postError || !post) {
    return {
      success: false,
      message: 'Post not found',
    }
  }

  if (!post.allow_comments) {
    return {
      success: false,
      message: 'Comments are disabled for this post',
    }
  }

  // Verify parent comment exists (if replying)
  if (data.parent_id) {
    const { data: parent, error: parentError } = await supabase
      .from('blog_comments')
      .select('id, status')
      .eq('id', data.parent_id)
      .eq('post_id', data.post_id)
      .single()

    if (parentError || !parent) {
      return {
        success: false,
        message: 'Parent comment not found',
      }
    }

    if (parent.status !== 'approved') {
      return {
        success: false,
        message: 'Cannot reply to this comment',
      }
    }
  }

  // Get user profile for avatar if logged in
  let authorAvatar = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single()
    authorAvatar = profile?.avatar_url
  }

  // Create comment
  const { data: comment, error } = await supabase
    .from('blog_comments')
    .insert({
      post_id: data.post_id,
      parent_id: data.parent_id,
      author_id: user?.id || null,
      author_name: data.author_name,
      author_email: data.author_email,
      author_avatar: authorAvatar,
      content: data.content,
      status: 'pending', // All comments start as pending
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    return {
      success: false,
      message: 'Failed to create comment',
    }
  }

  // Increment replies_count on parent if this is a reply
  if (data.parent_id) {
    await supabase.rpc('increment_comment_replies', { comment_id: data.parent_id })
  }

  revalidatePath(`/blog/[slug]`, 'page')
  revalidatePath('/admin/content/blog/comments')

  return {
    success: true,
    message: 'Comment submitted for review',
    data: comment,
  }
}

// Moderate a comment (admin)
export async function moderateComment(
  commentId: string,
  status: CommentStatus,
  rejectionReason?: string
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:blog:comments')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  // Validate
  const result = moderateCommentSchema.safeParse({ status, rejection_reason: rejectionReason })
  if (!result.success) {
    return {
      success: false,
      message: 'Invalid status',
    }
  }

  // Get comment for logging
  const { data: existingComment } = await supabase
    .from('blog_comments')
    .select('*, post:blog_posts(title, slug)')
    .eq('id', commentId)
    .single()

  if (!existingComment) {
    return { success: false, message: 'Comment not found' }
  }

  // Update comment
  const { data: comment, error } = await supabase
    .from('blog_comments')
    .update({
      status,
      moderated_by: user.id,
      moderated_at: new Date().toISOString(),
      rejection_reason: status === 'rejected' ? rejectionReason : null,
    })
    .eq('id', commentId)
    .select()
    .single()

  if (error) {
    console.error('Error moderating comment:', error)
    return {
      success: false,
      message: 'Failed to moderate comment',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'moderate',
    module: 'blog',
    resourceType: 'comment',
    resourceId: commentId,
    metadata: {
      newStatus: status,
      postTitle: existingComment.post?.title,
    },
  })

  revalidatePath(`/blog/[slug]`, 'page')
  revalidatePath('/admin/content/blog/comments')

  const statusLabels: Record<CommentStatus, string> = {
    approved: 'approved',
    rejected: 'rejected',
    spam: 'marked as spam',
    pending: 'set to pending',
  }

  return {
    success: true,
    message: `Comment ${statusLabels[status]}`,
    data: comment,
  }
}

// Bulk moderate comments
export async function bulkModerateComments(
  commentIds: string[],
  status: CommentStatus
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:blog:comments')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  if (commentIds.length === 0) {
    return { success: false, message: 'No comments selected' }
  }

  const { error } = await supabase
    .from('blog_comments')
    .update({
      status,
      moderated_by: user.id,
      moderated_at: new Date().toISOString(),
    })
    .in('id', commentIds)

  if (error) {
    console.error('Error bulk moderating comments:', error)
    return {
      success: false,
      message: 'Failed to moderate comments',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_moderate',
    module: 'blog',
    resourceType: 'comment',
    resourceId: commentIds.join(','),
    metadata: {
      count: commentIds.length,
      newStatus: status,
    },
  })

  revalidatePath(`/blog/[slug]`, 'page')
  revalidatePath('/admin/content/blog/comments')

  return {
    success: true,
    message: `${commentIds.length} comments updated`,
  }
}

// Delete a comment
export async function deleteComment(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:blog:comments')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  // Get comment for logging
  const { data: comment } = await supabase
    .from('blog_comments')
    .select('*, post:blog_posts(title)')
    .eq('id', id)
    .single()

  if (!comment) {
    return { success: false, message: 'Comment not found' }
  }

  // Delete comment (will cascade to replies)
  const { error } = await supabase
    .from('blog_comments')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting comment:', error)
    return {
      success: false,
      message: 'Failed to delete comment',
    }
  }

  // Decrement parent replies_count if this was a reply
  if (comment.parent_id) {
    await supabase.rpc('decrement_comment_replies', { comment_id: comment.parent_id })
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'blog',
    resourceType: 'comment',
    resourceId: id,
    metadata: {
      authorName: comment.author_name,
      postTitle: comment.post?.title,
    },
  })

  revalidatePath(`/blog/[slug]`, 'page')
  revalidatePath('/admin/content/blog/comments')

  return {
    success: true,
    message: 'Comment deleted',
  }
}

// Bulk delete comments
export async function bulkDeleteComments(commentIds: string[]): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:blog:comments')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  if (commentIds.length === 0) {
    return { success: false, message: 'No comments selected' }
  }

  const { error } = await supabase
    .from('blog_comments')
    .delete()
    .in('id', commentIds)

  if (error) {
    console.error('Error bulk deleting comments:', error)
    return {
      success: false,
      message: 'Failed to delete comments',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_delete',
    module: 'blog',
    resourceType: 'comment',
    resourceId: commentIds.join(','),
    metadata: { count: commentIds.length },
  })

  revalidatePath(`/blog/[slug]`, 'page')
  revalidatePath('/admin/content/blog/comments')

  return {
    success: true,
    message: `${commentIds.length} comments deleted`,
  }
}

// Like a comment (public, requires auth)
export async function likeComment(commentId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Please sign in to like comments' }
  }

  // Check if already liked
  const { data: existingLike } = await supabase
    .from('blog_comment_likes')
    .select('comment_id')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .single()

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('blog_comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error unliking comment:', error)
      return { success: false, message: 'Failed to unlike comment' }
    }

    // Decrement likes_count
    await supabase.rpc('decrement_comment_likes', { comment_id: commentId })

    revalidatePath(`/blog/[slug]`, 'page')

    return { success: true, message: 'Comment unliked' }
  } else {
    // Like
    const { error } = await supabase
      .from('blog_comment_likes')
      .insert({
        comment_id: commentId,
        user_id: user.id,
      })

    if (error) {
      console.error('Error liking comment:', error)
      return { success: false, message: 'Failed to like comment' }
    }

    // Increment likes_count
    await supabase.rpc('increment_comment_likes', { comment_id: commentId })

    revalidatePath(`/blog/[slug]`, 'page')

    return { success: true, message: 'Comment liked' }
  }
}

// Check if user has liked a comment
export async function hasLikedComment(commentId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  const { data } = await supabase
    .from('blog_comment_likes')
    .select('comment_id')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .single()

  return !!data
}

// Edit a comment (author only)
export async function editComment(
  commentId: string,
  content: string
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Verify ownership
  const { data: comment } = await supabase
    .from('blog_comments')
    .select('author_id')
    .eq('id', commentId)
    .single()

  if (!comment || comment.author_id !== user.id) {
    return { success: false, message: 'You can only edit your own comments' }
  }

  // Validate content
  if (!content.trim() || content.length > 5000) {
    return { success: false, message: 'Invalid comment content' }
  }

  const { error } = await supabase
    .from('blog_comments')
    .update({
      content: content.trim(),
      is_edited: true,
      edited_at: new Date().toISOString(),
    })
    .eq('id', commentId)

  if (error) {
    console.error('Error editing comment:', error)
    return { success: false, message: 'Failed to edit comment' }
  }

  revalidatePath(`/blog/[slug]`, 'page')

  return { success: true, message: 'Comment updated' }
}
