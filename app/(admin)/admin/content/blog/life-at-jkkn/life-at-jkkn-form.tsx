'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Loader2, Heart, Camera, Users, Trophy, Music, Book, Coffee, Dumbbell, Palette, Globe, Microscope, Utensils, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  createLifeAtJKKNItem,
  updateLifeAtJKKNItem,
  getLifeAtJKKNCategories,
  type LifeAtJKKNItem,
  type FormState,
} from '@/app/actions/cms/life-at-jkkn'
import type { BlogCategory } from '@/app/actions/cms/blog-categories'
import { toast } from 'sonner'
import { MediaPickerModal } from '@/components/cms/media-picker-modal'
import { cn } from '@/lib/utils'

// Icon options
const ICON_OPTIONS = [
  { value: 'Trophy', label: 'Trophy', icon: Trophy },
  { value: 'Music', label: 'Music', icon: Music },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'Book', label: 'Book', icon: Book },
  { value: 'Calendar', label: 'Calendar', icon: Calendar },
  { value: 'Camera', label: 'Camera', icon: Camera },
  { value: 'Palette', label: 'Palette', icon: Palette },
  { value: 'Globe', label: 'Globe', icon: Globe },
  { value: 'Microscope', label: 'Microscope', icon: Microscope },
  { value: 'Coffee', label: 'Coffee', icon: Coffee },
  { value: 'Dumbbell', label: 'Dumbbell', icon: Dumbbell },
  { value: 'Utensils', label: 'Utensils', icon: Utensils },
  { value: 'Heart', label: 'Heart', icon: Heart },
]

interface LifeAtJKKNFormProps {
  item?: LifeAtJKKNItem | null
  categories: BlogCategory[]
}

export function LifeAtJKKNForm({ item, categories }: LifeAtJKKNFormProps) {
  const router = useRouter()
  const isEditing = !!item

  // Form action
  const action = isEditing
    ? updateLifeAtJKKNItem
    : createLifeAtJKKNItem
  const [formState, formAction] = useActionState<FormState, FormData>(action, {})

  // Form state
  const [title, setTitle] = useState(item?.title || '')
  const [slug, setSlug] = useState(item?.slug || '')
  const [excerpt, setExcerpt] = useState(item?.excerpt || '')
  const [featuredImage, setFeaturedImage] = useState(item?.featured_image || '')
  const [categoryId, setCategoryId] = useState(item?.category_id || '')
  const [status, setStatus] = useState<'draft' | 'published'>(item?.status || 'draft')
  const [icon, setIcon] = useState(item?.icon || '')
  const [link, setLink] = useState(item?.link || '')
  const [video, setVideo] = useState(item?.video || '')
  const [sortOrder, setSortOrder] = useState(item?.sort_order || 0)

  // Media picker state
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  // Handle form state changes
  useEffect(() => {
    if (formState.success) {
      toast.success(formState.message)
      router.push('/admin/content/blog/life-at-jkkn')
    } else if (formState.message && !formState.success) {
      toast.error(formState.message)
    }
  }, [formState, router])

  // Generate slug from title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!isEditing && !slug) {
      setSlug(
        newTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      )
    }
  }

  // Handle media selection
  const handleMediaSelect = (media: { file_url: string } | Array<{ file_url: string }>) => {
    const selectedMedia = Array.isArray(media) ? media[0] : media
    if (selectedMedia?.file_url) {
      setFeaturedImage(selectedMedia.file_url)
    }
    setShowMediaPicker(false)
  }

  // Get selected icon component
  const SelectedIcon = icon ? ICON_OPTIONS.find(i => i.value === icon)?.icon || Heart : Heart

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields */}
      {isEditing && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="featured_image" value={featuredImage} />
      <input type="hidden" name="category_id" value={categoryId} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="icon" value={icon} />
      <input type="hidden" name="sort_order" value={sortOrder} />

      {/* Error Alert */}
      {formState.message && !formState.success && (
        <Alert variant="destructive">
          <AlertDescription>{formState.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
              <CardDescription>Basic information about this Life@JKKN card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Sports & Athletics"
                  required
                />
                {formState.errors?.title && (
                  <p className="text-sm text-destructive">{formState.errors.title[0]}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="sports-athletics"
                  required
                />
                {formState.errors?.slug && (
                  <p className="text-sm text-destructive">{formState.errors.slug[0]}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Description</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of this card (max 200 characters)"
                  maxLength={500}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {excerpt.length}/500 characters
                </p>
                {formState.errors?.excerpt && (
                  <p className="text-sm text-destructive">{formState.errors.excerpt[0]}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId || 'none'} onValueChange={(v) => setCategoryId(v === 'none' ? '' : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categories.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No categories yet.{' '}
                    <Link href="/admin/content/blog/life-at-jkkn/categories" className="text-primary hover:underline">
                      Create one
                    </Link>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Media Card */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>The background image for this card</CardDescription>
            </CardHeader>
            <CardContent>
              {featuredImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <Image
                    src={featuredImage}
                    alt="Featured image"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setFeaturedImage('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-32 border-dashed"
                  onClick={() => setShowMediaPicker(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
              )}
              {featuredImage && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => setShowMediaPicker(true)}
                >
                  Change Image
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Links Card */}
          <Card>
            <CardHeader>
              <CardTitle>Links (Optional)</CardTitle>
              <CardDescription>External links for this card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Link URL */}
              <div className="space-y-2">
                <Label htmlFor="link">Link URL</Label>
                <Input
                  id="link"
                  name="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com/more-details"
                />
                {formState.errors?.link && (
                  <p className="text-sm text-destructive">{formState.errors.link[0]}</p>
                )}
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="video">Video URL</Label>
                <Input
                  id="video"
                  name="video"
                  type="url"
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
                {formState.errors?.video && (
                  <p className="text-sm text-destructive">{formState.errors.video[0]}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Card */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="status-toggle">Status</Label>
                <div className="flex items-center gap-2">
                  <span className={cn('text-sm', status === 'draft' && 'font-medium')}>Draft</span>
                  <Switch
                    id="status-toggle"
                    checked={status === 'published'}
                    onCheckedChange={(checked) => setStatus(checked ? 'published' : 'draft')}
                  />
                  <span className={cn('text-sm', status === 'published' && 'font-medium')}>Published</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full">
                  {isEditing ? 'Update Card' : 'Create Card'}
                </Button>
                <Button type="button" variant="outline" asChild className="w-full">
                  <Link href="/admin/content/blog/life-at-jkkn">
                    Cancel
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Icon Card */}
          <Card>
            <CardHeader>
              <CardTitle>Icon</CardTitle>
              <CardDescription>Select an icon for this card</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {ICON_OPTIONS.map((opt) => {
                  const IconComp = opt.icon
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={cn(
                        'p-3 rounded-lg border transition-colors flex items-center justify-center',
                        icon === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted'
                      )}
                      onClick={() => setIcon(opt.value)}
                      title={opt.label}
                    >
                      <IconComp className="h-5 w-5" />
                    </button>
                  )
                })}
              </div>
              {icon && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setIcon('')}
                >
                  Clear Icon
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Sort Order Card */}
          <Card>
            <CardHeader>
              <CardTitle>Display Order</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min="0"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Lower numbers appear first
              </p>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-xl overflow-hidden h-[180px]">
                {featuredImage ? (
                  <Image
                    src={featuredImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-primary-dark">
                    <SelectedIcon className="w-12 h-12 text-white/30" />
                  </div>
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(11, 109, 65, 0.9) 0%, rgba(11, 109, 65, 0.4) 50%, transparent 100%)'
                  }}
                />
                {categoryId && (
                  <div
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: 'rgba(255, 222, 89, 0.9)' }}
                  >
                    <span className="text-gray-800">
                      {categories.find(c => c.id === categoryId)?.name || 'Category'}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-white/80">
                  <SelectedIcon className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {title || 'Card Title'}
                  </h3>
                  {excerpt && (
                    <p className="text-xs text-white/90 line-clamp-2">{excerpt}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onSelect={handleMediaSelect}
        fileType="image"
      />
    </form>
  )
}
