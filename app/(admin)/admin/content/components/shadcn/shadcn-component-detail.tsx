'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ExternalLink,
  Copy,
  Check,
  Package,
  GitBranch,
  FileCode,
  Terminal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CategorizedComponent } from './categories'
import { getIconComponent } from './icon-resolver'
import { toast } from 'sonner'

interface ShadcnComponentDetailProps {
  component: CategorizedComponent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ComponentDetails {
  name: string
  type: string
  author: string
  dependencies?: string[]
  registryDependencies?: string[]
  homepage: string
  files: Array<{
    type: string
    path: string
    content: string
    target: string
  }>
}

export function ShadcnComponentDetail({
  component,
  open,
  onOpenChange,
}: ShadcnComponentDetailProps) {
  const [details, setDetails] = useState<ComponentDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!component || !open) {
      setDetails(null)
      return
    }

    setLoading(true)
    // Note: In a real implementation, this would call a Server Action
    // For now, we'll show basic info from the component itself
    // The MCP can't be called directly from client components
    const timer = setTimeout(() => {
      setDetails({
        name: component.name,
        type: 'registry:ui',
        author: 'shadcn.io',
        homepage: `https://www.shadcn.io/components/${component.name}`,
        files: [],
      })
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [component, open])

  const handleCopyInstall = () => {
    if (!component) return
    navigator.clipboard.writeText(`npx shadcn@latest add ${component.name}`)
    setCopied(true)
    toast.success('Install command copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!component) return null

  const Icon = getIconComponent(component.category.iconName)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="space-y-4">
          {/* Header with gradient */}
          <div
            className={cn(
              'h-24 -mx-6 -mt-6 flex items-center justify-center bg-gradient-to-br relative',
              component.category.gradient
            )}
          >
            <Icon className="h-12 w-12 text-white/80" />
          </div>

          <div className="space-y-2">
            <SheetTitle className="text-xl">{component.displayName}</SheetTitle>
            <SheetDescription className="flex items-center gap-2">
              <Badge variant="secondary">{component.category.name}</Badge>
              <span className="text-muted-foreground font-mono text-xs">
                {component.name}
              </span>
            </SheetDescription>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-280px)] mt-6 pr-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          ) : details ? (
            <div className="space-y-6">
              {/* Install Command */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Install Command
                </h4>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted font-mono text-sm">
                  <code className="flex-1 truncate">
                    npx shadcn@latest add {component.name}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={handleCopyInstall}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Component Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Component Info
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-muted-foreground text-xs">Type</p>
                    <p className="font-medium">{details.type}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-muted-foreground text-xs">Author</p>
                    <p className="font-medium">{details.author}</p>
                  </div>
                </div>
              </div>

              {/* Dependencies (if available) */}
              {details.dependencies && details.dependencies.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Dependencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {details.dependencies.map((dep) => (
                      <Badge key={dep} variant="outline" className="font-mono">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Registry Dependencies (if available) */}
              {details.registryDependencies &&
                details.registryDependencies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <FileCode className="h-4 w-4" />
                      Required Components
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {details.registryDependencies.map((dep) => (
                        <Badge key={dep} variant="secondary" className="font-mono">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {/* Documentation Link */}
              <div className="pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <a
                    href={details.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on shadcn.io
                  </a>
                </Button>
              </div>
            </div>
          ) : null}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
