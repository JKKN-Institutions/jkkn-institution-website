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
import { Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { updatePage } from '@/app/actions/cms/pages'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'

const pageSettingsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(500, 'Slug is too long') // Increased for hierarchical paths
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/,
      'Slug must be lowercase with hyphens, paths separated by /'
    ),
  description: z.string().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  visibility: z.enum(['public', 'private', 'password_protected']),
  sort_order: z.number().min(1, 'Order must be at least 1').optional(),
  show_in_navigation: z.boolean(),
  is_homepage: z.boolean(),
  external_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
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

  // Check if this is a child page
  const isChildPage = !!page.parent_id

  const form = useForm<PageSettingsFormData>({
    resolver: zodResolver(pageSettingsSchema),
    defaultValues: {
      title: page.title,
      slug: page.slug,
      description: page.description || '',
      parent_id: page.parent_id || null,
      visibility: page.visibility as 'public' | 'private' | 'password_protected',
      sort_order: page.sort_order ?? 1,
      show_in_navigation: page.show_in_navigation ?? true,
      is_homepage: page.is_homepage ?? false,
      external_url: page.external_url || '',
    },
  })

  // Fetch children count and parent pages
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

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
    }

    if (open) {
      fetchData()
    }
  }, [open, page.id])

  // Reset form when page data changes
  useEffect(() => {
    form.reset({
      title: page.title,
      slug: page.slug,
      description: page.description || '',
      parent_id: page.parent_id || null,
      visibility: page.visibility as 'public' | 'private' | 'password_protected',
      sort_order: page.sort_order ?? 1,
      show_in_navigation: page.show_in_navigation ?? true,
      is_homepage: page.is_homepage ?? false,
      external_url: page.external_url || '',
    })
  }, [page, form])

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    const currentSlug = form.getValues('slug')
    const expectedSlug = page.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Only auto-generate if slug hasn't been manually changed
    if (currentSlug === expectedSlug || currentSlug === page.slug) {
      const newSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      form.setValue('slug', newSlug)
    }
  }

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
                        <Input placeholder="page-url" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Lowercase, hyphens only
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* Current Full Path Display */}
              <div className="p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Current Full Path:</p>
                <p className="text-sm font-mono text-foreground break-all">/{page.slug}</p>
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
                      Nest this page under another page
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
