'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CategorizedComponent } from './categories'
import { getIconComponent } from './icon-resolver'
import { ExternalLink } from 'lucide-react'

interface ShadcnComponentCardProps {
  component: CategorizedComponent
  viewMode: 'grid' | 'list'
  onClick: () => void
}

export function ShadcnComponentCard({
  component,
  viewMode,
  onClick,
}: ShadcnComponentCardProps) {
  const Icon = getIconComponent(component.category.iconName)

  if (viewMode === 'list') {
    return (
      <div
        className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={onClick}
      >
        {/* Icon */}
        <div
          className={cn(
            'h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br',
            component.category.gradient
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{component.displayName}</h3>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {component.category.name}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
            {component.name}
          </p>
        </div>

        {/* Link to shadcn.io */}
        <a
          href={`https://www.shadcn.io/components/${component.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-muted transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Preview placeholder with gradient */}
      <div
        className={cn(
          'h-32 flex items-center justify-center bg-gradient-to-br relative',
          component.category.gradient
        )}
      >
        <Icon className="h-10 w-10 text-white/80 group-hover:scale-110 transition-transform" />

        {/* External link button */}
        <a
          href={`https://www.shadcn.io/components/${component.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3.5 w-3.5 text-white" />
        </a>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
          {component.displayName}
        </h3>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {component.category.name}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            {component.name}
          </span>
        </div>
      </div>
    </div>
  )
}
