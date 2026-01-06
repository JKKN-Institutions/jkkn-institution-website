'use client'

import { cn } from '@/lib/utils'
import type { ContainerProps } from '@/lib/cms/registry-types'

export default function Container({
  maxWidth = 'xl',
  padding = '4',
  centered = true,
  background,
  children,
  className,
  isEditing,
}: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  }

  const hasChildren = children && (Array.isArray(children) ? children.length > 0 : true)

  return (
    <div
      className={cn(
        maxWidthClasses[maxWidth],
        centered && 'mx-auto',
        className
      )}
      style={{
        padding: `${Number(padding) * 0.25}rem`,
        background: background || undefined,
      }}
    >
      {hasChildren ? (
        children
      ) : isEditing ? (
        <div className="min-h-[100px] p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Drop blocks here or click to configure container
          </p>
        </div>
      ) : (
        <div className="min-h-[20px]" />
      )}
    </div>
  )
}
