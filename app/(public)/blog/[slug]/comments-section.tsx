'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MessageCircle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommentForm } from './comment-form'

interface Comment {
  id: string
  author_name: string
  author_avatar: string | null
  content: string
  created_at: string
}

interface CommentsSectionProps {
  postId: string
  comments: Comment[]
  allowComments: boolean
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function CommentsSection({ postId, comments, allowComments }: CommentsSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!allowComments) return null

  return (
    <section className="mt-12">
      {/* Collapsible Toggle Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4 rounded-2xl',
          'bg-white/10 backdrop-blur-md border border-white/20',
          'shadow-lg hover:shadow-xl transition-all duration-300',
          'hover:bg-white/15 group cursor-pointer'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary/20 text-secondary">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="font-semibold text-white">
            Comments
            <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-sm">
              {comments.length}
            </span>
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-white/60 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Collapsible Content - Only comments list */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-[5000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        )}
      >
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
              <p className="text-center text-white/70">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                <div className="flex items-start gap-3">
                  {comment.author_avatar ? (
                    <Image
                      src={comment.author_avatar}
                      alt={comment.author_name}
                      width={40}
                      height={40}
                      className="rounded-full ring-2 ring-secondary/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center ring-2 ring-secondary/30">
                      <span className="text-lg font-medium text-primary">
                        {comment.author_name[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{comment.author_name}</h4>
                      <span className="text-xs text-white/50">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-white/80">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Comment Form - Always visible */}
      <CommentForm postId={postId} />
    </section>
  )
}
