'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateSettings } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2, Save, Search, BarChart3, Globe } from 'lucide-react'
import { toast } from 'sonner'

const seoSettingsSchema = z.object({
  default_meta_title: z.string().optional(),
  default_meta_description: z
    .string()
    .max(160, 'Meta description should be under 160 characters')
    .optional(),
  google_analytics_id: z.string().optional(),
  google_tag_manager_id: z.string().optional(),
})

type SEOSettingsFormValues = z.infer<typeof seoSettingsSchema>

interface SEOSettingsFormProps {
  initialSettings: Record<string, unknown>
}

export function SEOSettingsForm({ initialSettings }: SEOSettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<SEOSettingsFormValues>({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues: {
      default_meta_title: (initialSettings.default_meta_title as string) || '',
      default_meta_description: (initialSettings.default_meta_description as string) || '',
      google_analytics_id: (initialSettings.google_analytics_id as string) || '',
      google_tag_manager_id: (initialSettings.google_tag_manager_id as string) || '',
    },
  })

  async function onSubmit(data: SEOSettingsFormValues) {
    startTransition(async () => {
      const result = await updateSettings(data)

      if (result.success) {
        toast.success('SEO settings saved successfully')
      } else {
        toast.error(result.message || 'Failed to save settings')
      }
    })
  }

  const metaDescription = form.watch('default_meta_description') || ''
  const metaTitle = form.watch('default_meta_title') || ''

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Meta Tags */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Search className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Default Meta Tags</h3>
          </div>

          <FormField
            control={form.control}
            name="default_meta_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Page Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="JKKN Institution | Excellence in Education"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Used when pages don&apos;t have a custom title ({metaTitle.length}/60 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="default_meta_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Meta Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="JKKN Group of Institutions - A leading educational institution in Tamil Nadu offering quality education since 1975."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription className={metaDescription.length > 160 ? 'text-destructive' : ''}>
                  Used when pages don&apos;t have a custom description ({metaDescription.length}/160 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SERP Preview */}
          <div className="p-4 rounded-xl border bg-muted/30">
            <p className="text-sm font-medium mb-3">Search Engine Preview</p>
            <div className="space-y-1">
              <p className="text-blue-600 dark:text-blue-400 text-lg hover:underline cursor-pointer truncate">
                {metaTitle || 'JKKN Institution | Excellence in Education'}
              </p>
              <p className="text-green-700 dark:text-green-500 text-sm">
                https://jkkn.ac.in
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {metaDescription || 'JKKN Group of Institutions - A leading educational institution in Tamil Nadu offering quality education since 1975.'}
              </p>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Analytics & Tracking</h3>
          </div>

          <FormField
            control={form.control}
            name="google_analytics_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Analytics ID</FormLabel>
                <FormControl>
                  <Input placeholder="G-XXXXXXXXXX" {...field} />
                </FormControl>
                <FormDescription>
                  Your Google Analytics 4 measurement ID
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="google_tag_manager_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Tag Manager ID</FormLabel>
                <FormControl>
                  <Input placeholder="GTM-XXXXXXX" {...field} />
                </FormControl>
                <FormDescription>
                  Your Google Tag Manager container ID
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Additional SEO Info */}
        <div className="p-4 rounded-xl border bg-blue-50 dark:bg-blue-900/20 space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="font-medium text-blue-900 dark:text-blue-100">SEO Best Practices</p>
          </div>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-7 list-disc">
            <li>Keep page titles under 60 characters</li>
            <li>Meta descriptions should be 120-160 characters</li>
            <li>Each page should have unique title and description</li>
            <li>Use the CMS to customize SEO for individual pages</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isPending} className="min-w-32">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
