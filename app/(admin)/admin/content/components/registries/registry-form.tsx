'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Loader2, Globe, Package, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { addRegistryDirect, updateRegistryDirect } from '@/app/actions/cms/registries'
import type { Database } from '@/lib/supabase/database.types'

type Registry = Database['public']['Tables']['cms_external_registries']['Row']

const registrySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().optional(),
  registry_url: z.string().url('Must be a valid URL'),
  registry_type: z.enum(['shadcn', 'reactbits', 'custom']),
  api_endpoint: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_active: z.boolean(),
})

type RegistryFormData = z.infer<typeof registrySchema>

interface RegistryFormProps {
  registry?: Registry
}

const PRESET_REGISTRIES = [
  {
    name: 'shadcn/ui',
    slug: 'shadcn-ui',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
    registry_url: 'https://ui.shadcn.com',
    registry_type: 'shadcn' as const,
    api_endpoint: 'https://ui.shadcn.com/r',
  },
  {
    name: 'React Bits',
    slug: 'reactbits',
    description: 'Copy-paste UI components for React',
    registry_url: 'https://reactbits.dev',
    registry_type: 'reactbits' as const,
    api_endpoint: '',
  },
]

export function RegistryForm({ registry }: RegistryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const isEditing = !!registry

  const form = useForm<RegistryFormData>({
    resolver: zodResolver(registrySchema),
    defaultValues: {
      name: registry?.name || '',
      slug: registry?.slug || '',
      description: registry?.description || '',
      registry_url: registry?.registry_url || '',
      registry_type: (registry?.registry_type as 'shadcn' | 'reactbits' | 'custom') || 'custom',
      api_endpoint: registry?.api_endpoint || '',
      is_active: registry?.is_active ?? true,
    },
  })

  const handlePresetSelect = (preset: (typeof PRESET_REGISTRIES)[0]) => {
    form.setValue('name', preset.name)
    form.setValue('slug', preset.slug)
    form.setValue('description', preset.description)
    form.setValue('registry_url', preset.registry_url)
    form.setValue('registry_type', preset.registry_type)
    form.setValue('api_endpoint', preset.api_endpoint)
    setSelectedPreset(preset.slug)
  }

  const onSubmit = async (data: RegistryFormData) => {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      const result = isEditing
        ? await updateRegistryDirect(registry!.id, formData)
        : await addRegistryDirect(formData)

      if (result.success) {
        toast.success(isEditing ? 'Registry updated' : 'Registry added')
        router.push('/admin/content/components/registries')
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to save registry')
      }
    })
  }

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    if (!isEditing) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50)
      form.setValue('slug', slug)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Preset Registries */}
        {!isEditing && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Quick Start</CardTitle>
              <CardDescription>
                Select a popular registry or configure a custom one below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_REGISTRIES.map((preset) => (
                  <button
                    key={preset.slug}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedPreset === preset.slug
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {preset.name[0]}
                      </div>
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {preset.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              Registry Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Component Library"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleNameChange(e.target.value)
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
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-library" {...field} disabled={isEditing} />
                  </FormControl>
                  <FormDescription>
                    Unique identifier used in URLs (auto-generated from name)
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
                      placeholder="A brief description of this component library..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registry_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registry Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="shadcn">shadcn/ui</SelectItem>
                      <SelectItem value="reactbits">React Bits</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type determines how components are fetched and installed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Connection Settings */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Connection Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="registry_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registry URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="https://ui.example.com"
                        className="pr-10"
                        {...field}
                      />
                      {field.value && (
                        <a
                          href={field.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>The main URL of the component library website</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="api_endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Endpoint (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://ui.example.com/api/components" {...field} />
                  </FormControl>
                  <FormDescription>
                    The API endpoint for fetching component data. For shadcn, use the /r endpoint.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Enable this registry for browsing and installing components
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Registry' : 'Add Registry'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/content/components/registries')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
