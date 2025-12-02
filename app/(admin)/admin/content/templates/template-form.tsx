'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Lock,
  AlertCircle,
  X,
  Blocks,
} from 'lucide-react'
import Link from 'next/link'
import { createTemplate, updateTemplate, type Template, type TemplateCategory, type FormState } from '@/app/actions/cms/templates'
import { MediaPickerModal } from '@/components/cms/media-picker-modal'
import type { MediaItem } from '@/app/actions/cms/media'

interface TemplateFormProps {
  template?: Template | null
  mode: 'create' | 'edit'
}

const CATEGORIES: { value: TemplateCategory; label: string; color: string }[] = [
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
  { value: 'landing', label: 'Landing Page', color: 'bg-blue-100 text-blue-800' },
  { value: 'content', label: 'Content', color: 'bg-green-100 text-green-800' },
  { value: 'blog', label: 'Blog', color: 'bg-amber-100 text-amber-800' },
  { value: 'portfolio', label: 'Portfolio', color: 'bg-purple-100 text-purple-800' },
  { value: 'ecommerce', label: 'E-commerce', color: 'bg-pink-100 text-pink-800' },
]

function SubmitButton({ mode, isSystem }: { mode: 'create' | 'edit'; isSystem?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending || isSystem}
      className="min-w-32"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {mode === 'create' ? 'Creating...' : 'Saving...'}
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          {mode === 'create' ? 'Create Template' : 'Save Changes'}
        </>
      )}
    </Button>
  )
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function TemplateForm({ template, mode }: TemplateFormProps) {
  const isEdit = mode === 'edit'
  const isSystem = template?.is_system ?? false

  // Form state
  const [name, setName] = useState(template?.name || '')
  const [slug, setSlug] = useState(template?.slug || '')
  const [description, setDescription] = useState(template?.description || '')
  const [category, setCategory] = useState<TemplateCategory>(template?.category || 'general')
  const [thumbnailUrl, setThumbnailUrl] = useState(template?.thumbnail_url || '')
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  // Auto-generate slug from name (only in create mode)
  useEffect(() => {
    if (mode === 'create' && name) {
      setSlug(generateSlug(name))
    }
  }, [name, mode])

  // Action for form submission - wrapped to match useActionState signature
  const action = async (_prevState: FormState, formData: FormData): Promise<FormState> => {
    if (isEdit && template) {
      const updates = {
        name: formData.get('name') as string,
        description: formData.get('description') as string || undefined,
        thumbnail_url: formData.get('thumbnail_url') as string || undefined,
        category: formData.get('category') as TemplateCategory,
      }
      return updateTemplate(template.id, updates)
    }
    return createTemplate(formData)
  }

  const [state, formAction] = useActionState(action, {})

  const handleMediaSelect = (media: MediaItem | MediaItem[]) => {
    const selected = Array.isArray(media) ? media[0] : media
    setThumbnailUrl(selected.file_url)
  }

  return (
    <form action={formAction} className="space-y-8">
      {/* Back Link */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/content/templates"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Link>
      </div>

      {/* System Template Warning */}
      {isSystem && (
        <Alert variant="destructive" className="border-yellow-500/50 bg-yellow-500/10">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            This is a system template and cannot be edited. You can duplicate it to create your own version.
          </AlertDescription>
        </Alert>
      )}

      {/* Error/Success Messages */}
      {state.message && (
        <Alert variant={state.success ? 'default' : 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold">Template Details</h2>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Template Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Landing Page Hero"
                disabled={isSystem}
                required
                className="bg-background/50"
              />
              {state.errors?.name && (
                <p className="text-sm text-red-500">{state.errors.name[0]}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="landing-page-hero"
                disabled={isSystem || isEdit}
                required
                className="bg-background/50 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                This will be used to identify the template. Only lowercase letters, numbers, and hyphens.
              </p>
              {state.errors?.slug && (
                <p className="text-sm text-red-500">{state.errors.slug[0]}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of what this template is for..."
                disabled={isSystem}
                rows={3}
                className="bg-background/50 resize-none"
              />
              {state.errors?.description && (
                <p className="text-sm text-red-500">{state.errors.description[0]}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <input type="hidden" name="category" value={category} />
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as TemplateCategory)}
                disabled={isSystem}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={cat.color}>
                          {cat.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.category && (
                <p className="text-sm text-red-500">{state.errors.category[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Thumbnail */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Thumbnail</h2>
            <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />

            {thumbnailUrl ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border/50">
                <img
                  src={thumbnailUrl}
                  alt="Template thumbnail"
                  className="w-full h-full object-cover"
                />
                {!isSystem && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => setThumbnailUrl('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="aspect-video rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No thumbnail</p>
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setMediaPickerOpen(true)}
              disabled={isSystem}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              {thumbnailUrl ? 'Change Thumbnail' : 'Add Thumbnail'}
            </Button>
          </div>

          {/* Blocks Info (for edit mode) */}
          {isEdit && template && (
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold">Template Blocks</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {(template.default_blocks || []).length} block(s)
                </Badge>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                asChild
              >
                <Link href={`/admin/content/templates/${template.id}/blocks`}>
                  <Blocks className="mr-2 h-4 w-4" />
                  {isSystem ? 'View Blocks' : 'Edit Blocks'}
                </Link>
              </Button>
              {isSystem && (
                <p className="text-xs text-muted-foreground">
                  System template blocks are read-only. Duplicate the template to create an editable copy.
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Actions</h2>
            <div className="flex flex-col gap-3">
              <SubmitButton mode={mode} isSystem={isSystem} />
              <Button
                type="button"
                variant="outline"
                asChild
              >
                <Link href="/admin/content/templates">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleMediaSelect}
        fileType="image"
        currentValue={thumbnailUrl}
      />
    </form>
  )
}
