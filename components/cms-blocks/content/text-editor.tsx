'use client'

import { cn } from '@/lib/utils'
import type { TextEditorProps } from '@/lib/cms/registry-types'

export default function TextEditor({
  content = '',
  alignment = 'left',
  maxWidth = 'prose',
  className,
  isEditing,
}: TextEditorProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
    prose: 'max-w-prose',
  }

  return (
    <div
      className={cn(
        'mx-auto',
        maxWidthClasses[maxWidth],
        `text-${alignment}`,
        className
      )}
    >
      {content ? (
        <div
          className={cn(
            // Base prose styling with enhanced typography
            'prose prose-slate dark:prose-invert prose-lg max-w-none',
            // Better text colors and spacing
            'text-gray-700 leading-relaxed'
          )}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : isEditing ? (
        <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <p className="text-muted-foreground text-center">Click to add content</p>
        </div>
      ) : null}
    </div>
  )
}
