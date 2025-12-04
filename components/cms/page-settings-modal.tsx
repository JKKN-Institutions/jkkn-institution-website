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
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updatePage } from '@/app/actions/cms/pages'

const pageSettingsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private', 'password_protected']),
  show_in_navigation: z.boolean(),
  is_homepage: z.boolean(),
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
    show_in_navigation: boolean | null
    is_homepage: boolean | null
  }
}

export function PageSettingsModal({ open, onOpenChange, page }: PageSettingsModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PageSettingsFormData>({
    resolver: zodResolver(pageSettingsSchema),
    defaultValues: {
      title: page.title,
      slug: page.slug,
      description: page.description || '',
      visibility: page.visibility as 'public' | 'private' | 'password_protected',
      show_in_navigation: page.show_in_navigation ?? true,
      is_homepage: page.is_homepage ?? false,
    },
  })

  // Reset form when page data changes
  useEffect(() => {
    form.reset({
      title: page.title,
      slug: page.slug,
      description: page.description || '',
      visibility: page.visibility as 'public' | 'private' | 'password_protected',
      show_in_navigation: page.show_in_navigation ?? true,
      is_homepage: page.is_homepage ?? false,
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
      formData.append('visibility', data.visibility)
      formData.append('show_in_navigation', String(data.show_in_navigation))
      formData.append('is_homepage', String(data.is_homepage))

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
