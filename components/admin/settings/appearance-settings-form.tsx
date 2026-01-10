'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateSettings } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ColorPicker } from './color-picker'
import { MediaLibraryImagePicker } from './media-library-image-picker'
import { Input } from '@/components/ui/input'
import { Loader2, Save, Palette, Image as ImageIcon, Maximize2 } from 'lucide-react'
import { toast } from 'sonner'

const appearanceSettingsSchema = z.object({
  theme_primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  theme_secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  logo_url: z.string().optional(),
  logo_dark_url: z.string().optional(),
  favicon_url: z.string().optional(),
  hero_background_url: z.string().optional(),
  // Logo sizes
  logo_mobile_size: z.number().min(32).max(128),
  logo_tablet_size: z.number().min(32).max(128),
  logo_desktop_size: z.number().min(32).max(128),
  logo_desktop_large_size: z.number().min(32).max(128),
})

type AppearanceSettingsFormValues = z.infer<typeof appearanceSettingsSchema>

interface AppearanceSettingsFormProps {
  initialSettings: Record<string, unknown>
}

export function AppearanceSettingsForm({ initialSettings }: AppearanceSettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<AppearanceSettingsFormValues>({
    resolver: zodResolver(appearanceSettingsSchema),
    defaultValues: {
      theme_primary_color: (initialSettings.theme_primary_color as string) || '#1e40af',
      theme_secondary_color: (initialSettings.theme_secondary_color as string) || '#f97316',
      logo_url: (initialSettings.logo_url as string) || '',
      logo_dark_url: (initialSettings.logo_dark_url as string) || '',
      favicon_url: (initialSettings.favicon_url as string) || '',
      hero_background_url: (initialSettings.hero_background_url as string) || '',
      logo_mobile_size: Number(initialSettings.logo_mobile_size) || 64,
      logo_tablet_size: Number(initialSettings.logo_tablet_size) || 80,
      logo_desktop_size: Number(initialSettings.logo_desktop_size) || 80,
      logo_desktop_large_size: Number(initialSettings.logo_desktop_large_size) || 96,
    },
  })

  async function onSubmit(data: AppearanceSettingsFormValues) {
    startTransition(async () => {
      const result = await updateSettings(data)

      if (result.success) {
        toast.success('Appearance settings saved successfully')
      } else {
        toast.error(result.message || 'Failed to save settings')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Brand Colors */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Brand Colors</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="theme_primary_color"
              render={({ field }) => (
                <FormItem>
                  <ColorPicker
                    value={field.value}
                    onChange={field.onChange}
                    label="Primary Color"
                    description="Main brand color used for buttons, links, and accents"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme_secondary_color"
              render={({ field }) => (
                <FormItem>
                  <ColorPicker
                    value={field.value}
                    onChange={field.onChange}
                    label="Secondary Color"
                    description="Accent color for highlights and secondary elements"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Color Preview */}
          <div className="p-4 rounded-xl border bg-muted/30">
            <p className="text-sm font-medium mb-3">Preview</p>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                style={{ backgroundColor: form.watch('theme_primary_color') }}
                className="text-white"
              >
                Primary Button
              </Button>
              <Button
                type="button"
                variant="outline"
                style={{
                  borderColor: form.watch('theme_secondary_color'),
                  color: form.watch('theme_secondary_color'),
                }}
              >
                Secondary Button
              </Button>
              <span
                style={{ color: form.watch('theme_primary_color') }}
                className="font-medium"
              >
                Link Text
              </span>
            </div>
          </div>
        </div>

        {/* Logo & Branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Logo & Branding</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <MediaLibraryImagePicker
                    value={field.value || ''}
                    onChange={field.onChange}
                    label="Logo (Light Mode)"
                    description="Recommended size: 200x60px, transparent PNG"
                    folder="branding"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_dark_url"
              render={({ field }) => (
                <FormItem>
                  <MediaLibraryImagePicker
                    value={field.value || ''}
                    onChange={field.onChange}
                    label="Logo (Dark Mode)"
                    description="Used when dark theme is active"
                    folder="branding"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="favicon_url"
              render={({ field }) => (
                <FormItem>
                  <MediaLibraryImagePicker
                    value={field.value || ''}
                    onChange={field.onChange}
                    label="Favicon"
                    description="32x32px or 64x64px PNG/ICO"
                    folder="branding"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hero_background_url"
              render={({ field }) => (
                <FormItem>
                  <MediaLibraryImagePicker
                    value={field.value || ''}
                    onChange={field.onChange}
                    label="Default Hero Background"
                    description="Used as fallback for page heroes"
                    folder="branding"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Logo Sizes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Maximize2 className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Logo Sizes</h3>
          </div>

          <p className="text-sm text-muted-foreground">
            Adjust logo sizes for different screen sizes. Changes apply to the navigation header.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="logo_mobile_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Logo Size</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min={32}
                        max={128}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        px
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Logo size on mobile devices (32-128px)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_tablet_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tablet Logo Size</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min={32}
                        max={128}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        px
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Logo size on tablet devices (32-128px)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_desktop_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desktop Logo Size</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min={32}
                        max={128}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        px
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Logo size on desktop (single-row nav)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_desktop_large_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desktop Large Logo Size</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min={32}
                        max={128}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        px
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Logo size on desktop (double-row nav)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
