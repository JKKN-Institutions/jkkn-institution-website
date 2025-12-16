'use client'

import { useState, useTransition, useEffect, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CodeEditor } from '@/components/cms/code-editor'
import {
  Loader2,
  Save,
  Code,
  Settings,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react'
import { toast } from 'sonner'
import type { CollectionWithCount } from '@/app/actions/cms/collections'
import type { ComponentWithCollection } from '@/app/actions/cms/components'
import {
  updateCustomComponent,
  validateComponentCode,
  extractPropsSchema,
  type FormState,
} from '@/app/actions/cms/components'
// Monaco editor types - using inline types to avoid dependency issues
type MonacoEditor = {
  getValue: () => string
  setValue: (value: string) => void
  onDidChangeModelContent: (callback: () => void) => { dispose: () => void }
}

// Monaco marker data type for validation errors
interface IMarkerData {
  severity: number
  message: string
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
}

// Namespace to match monaco-editor's editor namespace
const editor = {
  MarkerSeverity: {
    Error: 8,
    Warning: 4,
    Info: 2,
    Hint: 1,
  }
}

type EditorIMarkerData = IMarkerData
import * as LucideIcons from 'lucide-react'

// Form schema
const componentFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Component name is required')
    .max(100, 'Component name is too long')
    .regex(/^[A-Z][a-zA-Z0-9]*$/, 'Component name must be PascalCase (e.g., MyComponent)'),
  display_name: z.string().min(1, 'Display name is required').max(200),
  description: z.string().optional(),
  category: z.enum(['content', 'media', 'layout', 'data', 'custom']),
  icon: z.string().optional(),
  source_type: z.enum(['manual', 'shadcn', 'reactbits', 'external']),
  source_url: z.string().url().optional().or(z.literal('')),
  collection_id: z.string().optional().or(z.literal('')),
  code: z.string().min(1, 'Component code is required'),
  supports_children: z.boolean().optional(),
  is_full_width: z.boolean().optional(),
})

type ComponentFormData = z.infer<typeof componentFormSchema>

interface EditComponentFormProps {
  component: ComponentWithCollection
  collections: CollectionWithCount[]
}

const CATEGORY_OPTIONS = [
  { value: 'content', label: 'Content', description: 'Text, headings, hero sections' },
  { value: 'media', label: 'Media', description: 'Images, videos, galleries' },
  { value: 'layout', label: 'Layout', description: 'Containers, grids, sections' },
  { value: 'data', label: 'Data', description: 'Tables, lists, charts' },
  { value: 'custom', label: 'Custom', description: 'Other components' },
]

const ICON_OPTIONS = [
  'Puzzle',
  'Box',
  'Layout',
  'Type',
  'Image',
  'Video',
  'Grid',
  'List',
  'Table',
  'BarChart',
  'PieChart',
  'FileText',
  'MessageSquare',
  'Users',
  'Calendar',
  'Star',
  'Heart',
  'Zap',
  'Award',
  'Target',
]

export function EditComponentForm({
  component,
  collections,
}: EditComponentFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState('code')

  // Code validation state
  const [codeValidation, setCodeValidation] = useState<{
    valid: boolean
    errors: string[]
    warnings: string[]
  } | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [editorMarkers, setEditorMarkers] = useState<IMarkerData[]>([])

  // Form action state
  const [state, formAction] = useActionState<FormState, FormData>(updateCustomComponent, {})

  // Form setup with existing component data
  const form = useForm<ComponentFormData>({
    resolver: zodResolver(componentFormSchema),
    defaultValues: {
      name: component.name,
      display_name: component.display_name,
      description: component.description || '',
      category: component.category as ComponentFormData['category'],
      icon: component.icon || 'Puzzle',
      source_type: component.source_type as ComponentFormData['source_type'],
      source_url: component.source_url || '',
      collection_id: component.collection_id || '',
      code: component.code,
      supports_children: component.supports_children || false,
      is_full_width: component.is_full_width || false,
    },
  })

  // Watch form values
  const watchCode = form.watch('code')

  // Validate code when it changes (debounced)
  useEffect(() => {
    if (!watchCode) {
      setCodeValidation(null)
      return
    }

    const timeout = setTimeout(async () => {
      setIsValidating(true)
      try {
        const result = await validateComponentCode(watchCode)
        setCodeValidation(result)
      } catch {
        setCodeValidation({ valid: false, errors: ['Validation failed'], warnings: [] })
      } finally {
        setIsValidating(false)
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [watchCode])

  // Handle Monaco editor markers
  const handleEditorValidate = (markers: IMarkerData[]) => {
    setEditorMarkers(markers.filter((m) => m.severity >= 8)) // Only errors
  }

  // Auto-extract props schema
  const handleExtractProps = async () => {
    if (!watchCode) return

    try {
      await extractPropsSchema(watchCode)
      form.setValue('supports_children', watchCode.includes('children'))
      toast.success('Props schema extracted')
    } catch {
      toast.error('Failed to extract props schema')
    }
  }

  // Handle form submission
  const onSubmit = (data: ComponentFormData) => {
    // Check for validation errors
    if (codeValidation && !codeValidation.valid) {
      toast.error('Please fix code errors before saving')
      return
    }

    if (editorMarkers.length > 0) {
      toast.error('Please fix syntax errors before saving')
      return
    }

    // Create FormData for server action
    const formData = new FormData()

    // Important: Include the component ID for update
    formData.append('id', component.id)

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    // Add default JSON fields
    formData.append('props_schema', JSON.stringify(component.props_schema || {}))
    formData.append('default_props', JSON.stringify(component.default_props || {}))
    formData.append('editable_props', JSON.stringify(component.editable_props || []))
    formData.append('keywords', JSON.stringify([data.name.toLowerCase(), data.category]))
    formData.append('dependencies', JSON.stringify(component.dependencies || []))

    startTransition(() => {
      formAction(formData)
    })
  }

  // Handle form state changes
  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      router.push('/admin/content/components')
    } else if (state.message && !state.success) {
      toast.error(state.message)
    }
  }, [state, router])

  const IconPreview = ICON_OPTIONS.includes(form.watch('icon') || '')
    ? (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
        form.watch('icon') || 'Puzzle'
      ]
    : LucideIcons.Puzzle

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code" className="gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Code Tab */}
          <TabsContent value="code" className="space-y-6 mt-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MyComponent"
                        {...field}
                        className="rounded-xl font-mono"
                      />
                    </FormControl>
                    <FormDescription>PascalCase, e.g., HeroSection</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="My Component" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormDescription>Human-readable name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Code Editor */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Component Code *</FormLabel>
                    <div className="flex items-center gap-2">
                      {isValidating && (
                        <Badge variant="secondary" className="text-xs">
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Validating...
                        </Badge>
                      )}
                      {codeValidation && !isValidating && (
                        <Badge
                          variant={codeValidation.valid ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {codeValidation.valid ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Valid
                            </>
                          ) : (
                            <>
                              <AlertCircle className="mr-1 h-3 w-3" />
                              {codeValidation.errors.length} error
                              {codeValidation.errors.length !== 1 ? 's' : ''}
                            </>
                          )}
                        </Badge>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleExtractProps}
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        Auto-detect Props
                      </Button>
                    </div>
                  </div>
                  <FormControl>
                    <CodeEditor
                      value={field.value}
                      onChange={field.onChange}
                      language="typescript"
                      height="400px"
                      onValidate={handleEditorValidate}
                      placeholder="// Paste your React component code here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Validation Messages */}
            {codeValidation && (
              <div className="space-y-2">
                {codeValidation.errors.map((error, i) => (
                  <Alert key={i} variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ))}
                {codeValidation.warnings.map((warning, i) => (
                  <Alert key={i}>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>{warning}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 mt-6">
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of what this component does..."
                      {...field}
                      className="rounded-xl resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Icon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {option.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <div className="flex gap-2">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl flex-1">
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ICON_OPTIONS.map((icon) => {
                            const Icon = (
                              LucideIcons as unknown as Record<
                                string,
                                React.ComponentType<{ className?: string }>
                              >
                            )[icon]
                            return (
                              <SelectItem key={icon} value={icon}>
                                <div className="flex items-center gap-2">
                                  {Icon && <Icon className="h-4 w-4" />}
                                  <span>{icon}</span>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <IconPreview className="h-5 w-5" />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Collection and Source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="collection_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
                      value={field.value || 'none'}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="No collection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No collection</SelectItem>
                        {collections.map((collection) => (
                          <SelectItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Organize component into a folder</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manual">Manual (Custom Code)</SelectItem>
                        <SelectItem value="shadcn">shadcn/ui</SelectItem>
                        <SelectItem value="reactbits">ReactBits</SelectItem>
                        <SelectItem value="external">External URL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Source URL (conditional) */}
            {form.watch('source_type') !== 'manual' && (
              <FormField
                control={form.control}
                name="source_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://ui.shadcn.com/docs/components/button"
                        {...field}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormDescription>Original source of this component</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Component Options</CardTitle>
                <CardDescription>Configure how this component behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="supports_children"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Supports Children</FormLabel>
                        <FormDescription>
                          Can this component wrap other components?
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
                  name="is_full_width"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Full Width</FormLabel>
                        <FormDescription>
                          Should this component span the full page width?
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Errors */}
        {state.errors && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Validation Errors</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside">
                {Object.entries(state.errors).map(([field, errors]) =>
                  errors?.map((error, i) => (
                    <li key={`${field}-${i}`}>
                      {field}: {error}
                    </li>
                  ))
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
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
