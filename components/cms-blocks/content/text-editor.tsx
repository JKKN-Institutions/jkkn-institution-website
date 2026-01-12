'use client'

import { cn } from '@/lib/utils'
import type { TextEditorProps } from '@/lib/cms/registry-types'
import { RichTextInlineEditor } from '@/components/page-builder/elementor/inline-editor'

export default function TextEditor({
  content = '',
  alignment = 'left',
  maxWidth = 'prose',
  className,
  isEditing,
  id,
  style,
  ...restProps
}: TextEditorProps) {
  // Extract custom _styles from props (comes from database)
  const customProps = restProps as any
  const _styles = customProps._styles || {}

  // Merge custom styles from database
  const mergedStyles: React.CSSProperties = {
    ...style,
    // Background
    backgroundColor: _styles.background?.backgroundColor || undefined,
    backgroundImage: _styles.background?.backgroundImage || undefined,
    // Spacing
    padding: _styles.spacing?.padding || undefined,
    borderRadius: _styles.spacing?.borderRadius || undefined,
    border: _styles.spacing?.border || _styles.effects?.border || undefined,
    marginBottom: _styles.spacing?.marginBottom || undefined,
    // Glassmorphism effects
    backdropFilter: _styles.effects?.backdropFilter || undefined,
    WebkitBackdropFilter: _styles.effects?.WebkitBackdropFilter || undefined,
    boxShadow: _styles.effects?.boxShadow || undefined,
    transition: _styles.effects?.transition || undefined,
    cursor: _styles.effects?.cursor || undefined,
  } as React.CSSProperties

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
    prose: 'max-w-prose',
  }

  const containerClasses = cn(
    'mx-auto',
    maxWidthClasses[maxWidth],
    `text-${alignment}`,
    className
  )

  const proseClasses = cn(
    // Base prose styling with enhanced typography
    'prose prose-slate dark:prose-invert prose-lg max-w-none',
    // Better spacing (removed text-gray-700 to allow inline color styles from Tiptap)
    'leading-relaxed'
  )

  if (isEditing && id) {
    // Use RichTextInlineEditor in edit mode for inline editing with toolbar
    return (
      <div className={containerClasses} style={mergedStyles}>
        <RichTextInlineEditor
          blockId={id}
          propName="content"
          value={content || '<p></p>'}
          className={proseClasses}
          placeholder="Click to add content..."
        />
      </div>
    )
  }

  // Preview mode or when no ID - render as static HTML
  return (
    <div className={containerClasses} style={mergedStyles}>
      {content ? (
        <div
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <p className="text-muted-foreground text-center">No content</p>
        </div>
      )}
    </div>
  )
}
