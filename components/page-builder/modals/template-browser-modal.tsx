'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, FileText, Layout, Newspaper, Briefcase, ShoppingCart, FolderOpen, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  getTemplates,
  applyTemplateToPage,
  type Template,
  type TemplateCategory,
} from '@/app/actions/cms/templates'
import { toast } from 'sonner'

interface TemplateBrowserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pageId: string
  onTemplateApplied?: () => void
}

const categoryConfig: Record<TemplateCategory, { label: string; icon: React.ReactNode }> = {
  general: { label: 'General', icon: <FolderOpen className="h-4 w-4" /> },
  landing: { label: 'Landing', icon: <Layout className="h-4 w-4" /> },
  content: { label: 'Content', icon: <FileText className="h-4 w-4" /> },
  blog: { label: 'Blog', icon: <Newspaper className="h-4 w-4" /> },
  portfolio: { label: 'Portfolio', icon: <Briefcase className="h-4 w-4" /> },
  ecommerce: { label: 'E-commerce', icon: <ShoppingCart className="h-4 w-4" /> },
}

export function TemplateBrowserModal({
  open,
  onOpenChange,
  pageId,
  onTemplateApplied,
}: TemplateBrowserModalProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<TemplateCategory | 'all'>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [replaceExisting, setReplaceExisting] = useState(true)

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getTemplates({
        category: category === 'all' ? undefined : category,
        search: search || undefined,
        includeSystem: true,
      })
      setTemplates(result.templates)
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setIsLoading(false)
    }
  }, [category, search])

  useEffect(() => {
    if (open) {
      fetchTemplates()
    }
  }, [open, fetchTemplates])

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (open) {
        fetchTemplates()
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, open, fetchTemplates])

  const handleApply = async () => {
    if (!selectedTemplate) return

    setIsApplying(true)
    try {
      const result = await applyTemplateToPage(pageId, selectedTemplate.id, replaceExisting)

      if (result.success) {
        toast.success(result.message || 'Template applied successfully')
        onOpenChange(false)
        onTemplateApplied?.()
      } else {
        toast.error(result.message || 'Failed to apply template')
      }
    } catch (error) {
      toast.error('An error occurred while applying template')
    } finally {
      setIsApplying(false)
    }
  }

  const handleClose = () => {
    setSelectedTemplate(null)
    setSearch('')
    setCategory('all')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" />
            Choose a Template
          </DialogTitle>
          <DialogDescription>
            Select a template to apply to your page. This will add blocks from the template.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={category} onValueChange={(v) => setCategory(v as TemplateCategory | 'all')}>
              <TabsList className="grid grid-cols-4 sm:flex">
                <TabsTrigger value="all">All</TabsTrigger>
                {Object.entries(categoryConfig).slice(0, 3).map(([key, config]) => (
                  <TabsTrigger key={key} value={key}>
                    {config.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Templates Grid */}
          <ScrollArea className="flex-1 min-h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <FileText className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No templates found</p>
                <p className="text-sm">Try adjusting your search or category filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-1">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={cn(
                      'group relative flex flex-col rounded-lg border-2 overflow-hidden transition-all text-left',
                      selectedTemplate?.id === template.id
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {template.thumbnail_url ? (
                        <img
                          src={template.thumbnail_url}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}

                      {/* Selected indicator */}
                      {selectedTemplate?.id === template.id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary rounded-full p-1">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}

                      {/* System badge */}
                      {template.is_system && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 right-2 text-xs"
                        >
                          System
                        </Badge>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{template.name}</span>
                      </div>
                      {template.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {categoryConfig[template.category]?.label || template.category}
                        </Badge>
                        {(template.default_blocks as unknown[])?.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {(template.default_blocks as unknown[]).length} blocks
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Selected template preview */}
          {selectedTemplate && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-medium">{selectedTemplate.name}</h4>
                  {selectedTemplate.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedTemplate.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={replaceExisting}
                      onChange={(e) => setReplaceExisting(e.target.checked)}
                      className="rounded border-border"
                    />
                    Replace existing blocks
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isApplying}>
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!selectedTemplate || isApplying}
          >
            {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
