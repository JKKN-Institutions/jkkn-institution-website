'use client'

import { useActionState } from 'react'
import { useRef, useEffect } from 'react'
import { createComment, FormState } from '@/app/actions/cms/blog-comments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react'

interface CommentFormProps {
  postId: string
  parentId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

const initialState: FormState = {}

export function CommentForm({ postId, parentId, onSuccess, onCancel }: CommentFormProps) {
  const [state, formAction, isPending] = useActionState(createComment, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  // Reset form on success
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      onSuccess?.()
    }
  }, [state.success, onSuccess])

  return (
    <div className="mt-6 p-0 overflow-hidden bg-gray-50 border border-gray-200 rounded-2xl">
      {/* Header with gradient accent */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-secondary/10 via-transparent to-primary/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary/20 text-secondary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">
              {parentId ? 'Reply to Comment' : 'Leave a Comment'}
            </h3>
            <p className="text-sm text-primary/60">
              {parentId
                ? 'Share your reply to this comment'
                : 'Share your thoughts on this post'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {state.success ? (
          <Alert className="bg-green-500/20 border-green-500/30 backdrop-blur-sm">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">
              {state.message || 'Your comment has been submitted and is awaiting moderation.'}
            </AlertDescription>
          </Alert>
        ) : (
          <form ref={formRef} action={formAction} className="space-y-4">
            {/* Hidden fields */}
            <input type="hidden" name="post_id" value={postId} />
            {parentId && <input type="hidden" name="parent_id" value={parentId} />}

            {/* Error alert */}
            {state.message && !state.success && (
              <Alert variant="destructive" className="backdrop-blur-sm bg-red-500/20 border-red-500/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            {/* Name field */}
            <div className="space-y-2">
              <Label htmlFor="author_name" className="font-medium text-primary/90">Name *</Label>
              <Input
                id="author_name"
                name="author_name"
                placeholder="Your name"
                required
                disabled={isPending}
                className={`bg-white border-gray-300 text-primary placeholder:text-primary/40 focus:border-secondary/50 focus:ring-secondary/20 ${state.errors?.author_name ? 'border-red-500/50' : ''}`}
              />
              {state.errors?.author_name && (
                <p className="text-sm text-red-500">{state.errors.author_name[0]}</p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="author_email" className="font-medium text-primary/90">Email *</Label>
              <Input
                id="author_email"
                name="author_email"
                type="email"
                placeholder="your.email@example.com"
                required
                disabled={isPending}
                className={`bg-white border-gray-300 text-primary placeholder:text-primary/40 focus:border-secondary/50 focus:ring-secondary/20 ${state.errors?.author_email ? 'border-red-500/50' : ''}`}
              />
              {state.errors?.author_email && (
                <p className="text-sm text-red-500">{state.errors.author_email[0]}</p>
              )}
              <p className="text-xs text-primary/50">
                Your email will not be published.
              </p>
            </div>

            {/* Comment field */}
            <div className="space-y-2">
              <Label htmlFor="content" className="font-medium text-primary/90">Comment *</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your comment here..."
                rows={4}
                required
                disabled={isPending}
                className={`bg-white border-gray-300 text-primary placeholder:text-primary/40 focus:border-secondary/50 focus:ring-secondary/20 ${state.errors?.content ? 'border-red-500/50' : ''}`}
              />
              {state.errors?.content && (
                <p className="text-sm text-red-500">{state.errors.content[0]}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-secondary hover:bg-secondary/90 text-primary font-semibold shadow-lg shadow-secondary/25"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {parentId ? 'Post Reply' : 'Post Comment'}
                  </>
                )}
              </Button>
              {onCancel && (
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending} className="text-primary/70 hover:text-primary hover:bg-primary/10">
                  Cancel
                </Button>
              )}
            </div>

            <p className="text-xs text-primary/50">
              All comments are moderated and will appear after approval.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
