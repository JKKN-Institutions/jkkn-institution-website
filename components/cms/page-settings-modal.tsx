'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, AlertTriangle, ArrowRight, CheckCircle2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { updatePage } from '@/app/actions/cms/pages'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'

const pageSettingsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(500, 'Slug is too long'),
  description: z.string().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  visibility: z.enum(['public', 'private', 'password_protected']),
  sort_order: z.number().min(1, 'Order must be at least 1').optional(),
  show_in_navigation: z.boolean(),
  is_homepage: z.boolean(),
  external_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  redirect_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  slug_overridden: z.boolean(),
})

type PageSettingsFormData = z.infer<typeof pageSettingsSchema>

interface PageSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  page: {
    id: string
    title: string
    slug: string
    description?: string | null
    visibility: string
    sort_order?: number | null
    parent_id?: string | null
    show_in_navigation: boolean | null
    is_homepage: boolean | null
    external_url?: string | null
  }
  parentOrder?: number | null
}

export function PageSettingsModal({ open, onOpenChange, page, parentOrder }: PageSettingsModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [childrenCount, setChildrenCount] = useState(0)
  const [parentPages, setParentPages] = useState<Array<{ id: string; title: string; slug: string }>>([])
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [newPathPreview, setNewPathPreview] = useState<string>('')

  // Check if this is a child page
  const isChildPage = !!page.parent_id

  // Extract slug segment from full hierarchical path
  const getSlugSegment = (fullSlug: string) => {
    const parts = fullSlug.split('/')
    return parts[parts.length - 1] // Return last segment
  }

  const form = useForm<PageSettingsFormData>({
    resolver: zodResolver(pageSettingsSchema),
    defaultValues: {
      title: page.title,
      slug: getSlugSegment(page.slug), // Extract segment only
      description: page.description || '',
      parent_id: page.parent_id || null,
      visibility: page.visibility as 'public' | 'private' | 'password_protected',
      sort_order: page.sort_order ?? 1,
      show_in_navigation: page.show_in_navigation ?? true,
      is_homepage: page.is_homepage ?? false,
      external_url: page.external_url || '',
      redirect_url: '', // Will be fetched from metadata
      meta_title: '',
      meta_description: '',
      slug_overridden: false, // Will be fetched from database
    },
  })

  // Fetch children count, parent pages, SEO metadata, and slug override status
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Reset slug manual edit flag when modal opens
      setSlugManuallyEdited(false)

      // Fetch page data including slug_overridden and metadata
      const { data: pageData } = await supabase
        .from('cms_pages')
        .select('slug_overridden, metadata')
        .eq('id', page.id)
        .single()

      if (pageData) {
        form.setValue('slug_overridden', pageData.slug_overridden || false)
        // Extract redirect_url from metadata
        const metadata = pageData.metadata as Record<string, unknown> | null
        const redirectUrl = (metadata?.redirect_url as string) || ''
        form.setValue('redirect_url', redirectUrl)
      }

      // Check for children
      const { data: children } = await supabase
        .from('cms_pages')
        .select('id')
        .eq('parent_id', page.id)

      setChildrenCount(children?.length || 0)

      // Fetch potential parent pages (excluding self and descendants)
      const { data: pages } = await supabase
        .from('cms_pages')
        .select('id, title, slug')
        .is('parent_id', null) // Only root pages can be parents for now
        .neq('id', page.id) // Exclude self
        .order('title')

      setParentPages(pages || [])

      // Fetch SEO metadata
      const { data: seoData } = await supabase
        .from('cms_seo_metadata')
        .select('meta_title, meta_description')
        .eq('page_id', page.id)
        .single()

      if (seoData) {
        form.setValue('meta_title', seoData.meta_title || '')
        form.setValue('meta_description', seoData.meta_description || '')
      }
    }

    if (open) {
      fetchData()
    }
  }, [open, page.id, form])

  // Reset form when page data changes
  useEffect(() => {
    form.reset({
      title: page.title,
      slug: getSlugSegment(page.slug), // Extract segment only
      description: page.description || '',
      parent_id: page.parent_id || null,
      visibility: page.visibility as 'public' | 'private' | 'password_protected',
      sort_order: page.sort_order ?? 1,
      show_in_navigation: page.show_in_navigation ?? true,
      is_homepage: page.is_homepage ?? false,
      external_url: page.external_url || '',
      redirect_url: '', // Will be fetched from metadata in fetchData
      meta_title: '',
      meta_description: '',
    })
  }, [page, form])

  // Auto-generate slug from title (only if not manually edited)
  const handleTitleChange = (value: string) => {
    // Don't auto-generate if user has manually edited the slug
    if (slugManuallyEdited) return

    const newSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    form.setValue('slug', newSlug)
  }

  // Handle manual slug changes
  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true)
    form.setValue('slug', value)
  }

  // Update path preview when parent, slug, or override changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const selectedParentId = value.parent_id
      const currentSlug = value.slug || ''
      const isOverridden = value.slug_overridden || false

      if (!currentSlug) {
        setNewPathPreview('')
        return
      }

      // If slug override is enabled, use custom URL (ignore parent)
      if (isOverridden) {
        setNewPathPreview(`/${currentSlug}`)
        return
      }

      // Otherwise, use hierarchical structure based on parent
      // If no parent (root level)
      if (!selectedParentId || selectedParentId === 'none') {
        setNewPathPreview(`/${currentSlug}`)
        return
      }

      // Find parent and build hierarchical path
      const selectedParent = parentPages.find((p) => p.id === selectedParentId)
      if (selectedParent) {
        setNewPathPreview(`/${selectedParent.slug}/${currentSlug}`)
      } else {
        setNewPathPreview(`/${currentSlug}`)
      }
    })

    return () => subscription.unsubscribe()
  }, [form, parentPages])

  const onSubmit = async (data: PageSettingsFormData) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('id', page.id)
      formData.append('title', data.title)
      formData.append('slug', data.slug)
      formData.append('description', data.description || '')
      formData.append('parent_id', data.parent_id || '')
      formData.append('visibility', data.visibility)
      formData.append('sort_order', String(data.sort_order ?? 1))
      formData.append('show_in_navigation', String(data.show_in_navigation))
      formData.append('is_homepage', String(data.is_homepage))
      formData.append('external_url', data.external_url || '')
      formData.append('redirect_url', data.redirect_url || '')
      formData.append('meta_title', data.meta_title || '')
      formData.append('meta_description', data.meta_description || '')
      formData.append('slug_overridden', String(data.slug_overridden))

      const result = await updatePage({ success: false }, formData)

      if (result.success) {
        toast.success('Page settings updated successfully')
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to update page settings')
      }
    } catch (error) {
      toast.error('An error occurred while updating page settings')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Page Settings</DialogTitle>
          <DialogDescription>
            Update the page title, URL, and other settings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Page title"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleTitleChange(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-1">/</span>
                        <Input
                          placeholder={form.watch('slug_overridden') ? "custom-url" : "page-url"}
                          {...field}
                          onChange={(e) => handleSlugChange(e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      {form.watch('slug_overridden')
                        ? 'Custom URL independent of navigation hierarchy.'
                        : 'Lowercase, hyphens only. Auto-generated from title unless manually edited.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug Override Switch */}
              {page.parent_id && (
                <FormField
                  control={form.control}
                  name="slug_overridden"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium">Override URL Structure</FormLabel>
                        <FormDescription className="text-xs">
                          Use a custom URL independent of parent hierarchy. Page will still appear in "{parentPages.find(p => p.id === page.parent_id)?.title || 'parent'}" menu, but have a different URL.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this page"
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Used for SEO if no meta description is set
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SEO Metadata Fields */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <h4 className="text-sm font-semibold text-foreground">SEO Metadata</h4>
                </div>

                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Custom SEO title (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Overrides page title in search results. Leave blank to use page title.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO meta description (optional)"
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Shown in search results. Recommended: 150-160 characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Path Preview - Shows current and new path */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Current Path:</p>
                  <p className="text-sm font-mono text-foreground break-all">/{page.slug}</p>
                </div>

                {newPathPreview && newPathPreview !== `/${page.slug}` && (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
                    <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/30">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            New Path After Save:
                            {form.watch('slug_overridden') && (
                              <span className="ml-1 px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded">
                                CUSTOM URL
                              </span>
                            )}
                          </p>
                          <p className="text-sm font-mono text-foreground font-semibold break-all">
                            {newPathPreview}
                          </p>
                        </div>
                      </div>
                      {form.watch('slug_overridden') && page.parent_id && (
                        <p className="text-xs text-primary/80 mt-2 flex items-start gap-1">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0" />
                          <span>Navigation: "{parentPages.find(p => p.id === page.parent_id)?.title}" → URL: {newPathPreview}</span>
                        </p>
                      )}
                      {!form.watch('slug_overridden') && !form.watch('parent_id') && page.parent_id && (
                        <p className="text-xs text-primary/80 mt-2 flex items-start gap-1">
                          <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                          <span>Moving from child page to root level page</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {newPathPreview && newPathPreview === `/${page.slug}` && (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                    <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Path will remain the same
                    </p>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Page</FormLabel>
                    <Select
                      value={field.value || 'none'}
                      onValueChange={(val) => field.onChange(val === 'none' ? null : val)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None (Root level)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None (Root level page)</SelectItem>
                        {parentPages.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.title} (/{p.slug})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Change parent to control the page hierarchy. Select "None" to move to root level.
                    </FormDescription>

                    {childrenCount > 0 && field.value !== page.parent_id && (
                      <Alert variant="default" className="mt-2 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <AlertDescription className="text-xs text-yellow-800 dark:text-yellow-200">
                          This page has {childrenCount} child page{childrenCount !== 1 ? 's' : ''}.
                          Changing the parent will update URLs for all descendants.
                        </AlertDescription>
                      </Alert>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="password_protected">Password Protected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Order</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        {isChildPage && parentOrder && (
                          <span className="text-sm font-semibold text-primary">{parentOrder}.</span>
                        )}
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          className="w-20"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                        {isChildPage && parentOrder && (
                          <span className="text-xs text-muted-foreground">
                            (Displayed as {parentOrder}.{field.value || 1})
                          </span>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      {isChildPage
                        ? 'Order within parent page. Lower numbers appear first.'
                        : 'Navigation order. Lower numbers appear first in menus.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3 pt-2">
                <FormField
                  control={form.control}
                  name="show_in_navigation"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium">Show in Navigation</FormLabel>
                        <FormDescription className="text-xs">
                          Display in site navigation menu
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch('show_in_navigation') && (
                  <FormField
                    control={form.control}
                    name="external_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>External URL</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          If set, navigation will link to this URL instead of the page (opens in new tab)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="redirect_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Redirect URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://drive.google.com/file/d/xxx/view"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        If set, visiting this page will redirect to this URL in the same tab (e.g., Google Drive PDF)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_homepage"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium">Set as Homepage</FormLabel>
                        <FormDescription className="text-xs">
                          Make this the main landing page
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Fixed footer */}
            <DialogFooter className="px-6 py-4 border-t shrink-0 bg-muted/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
