'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { createBlogPost, updateBlogPost, type BlogPostWithRelations } from '@/app/actions/cms/blog'
import { type BlogCategory } from '@/app/actions/cms/blog-categories'
import { createBlogTagInline, searchBlogTags } from '@/app/actions/cms/blog-tags'

// Simplified tag type for form state (matches what comes from BlogPostWithRelations)
interface TagItem {
  id: string
  name: string
  slug: string
  color: string | null
}
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Loader2,
  Save,
  Send,
  Eye,
  Image as ImageIcon,
  X,
  Plus,
  Clock,
  Star,
  Pin,
  MessageSquare,
  Search,
  Settings,
  FileText,
  Globe,
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { MediaPickerModal } from '@/components/cms/media-picker-modal'
import type { MediaItem } from '@/app/actions/cms/media'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

interface BlogPostFormProps {
  post?: BlogPostWithRelations
  categories: BlogCategory[]
  tags: TagItem[]
  author?: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
  } | null
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="min-h-[44px]">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Save className="mr-2 h-4 w-4" />
      )}
      {pending ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
    </Button>
  )
}

export function BlogPostForm({ post, categories, tags: initialTags, author }: BlogPostFormProps) {
  const router = useRouter()
  const isEdit = !!post

  // Form action
  const action = isEdit ? updateBlogPost : createBlogPost
  const [state, formAction] = useActionState(action, {})

  // Local state
  const [slug, setSlug] = useState(post?.slug || '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!post?.slug) // Track if user manually edited slug
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(
    post?.content ? JSON.stringify(post.content, null, 2) : '{"type": "doc", "content": []}'
  )
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '')
  const [categoryId, setCategoryId] = useState(post?.category_id || '')
  const [selectedTags, setSelectedTags] = useState<TagItem[]>(post?.tags || [])
  const [status, setStatus] = useState<string>(post?.status || 'draft')
  const [visibility, setVisibility] = useState<string>(post?.visibility || 'public')
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false)
  const [isPinned, setIsPinned] = useState(post?.is_pinned || false)
  const [allowComments, setAllowComments] = useState(post?.allow_comments !== false)
  const [readingTime, setReadingTime] = useState(post?.reading_time_minutes || 5)
  const [seoTitle, setSeoTitle] = useState(post?.seo_title || '')
  const [seoDescription, setSeoDescription] = useState(post?.seo_description || '')
  const [ogImage, setOgImage] = useState(post?.og_image || '')
  const [canonicalUrl, setCanonicalUrl] = useState(post?.canonical_url || '')

  // Tag search state
  const [tagSearch, setTagSearch] = useState('')
  const [tagSearchResults, setTagSearchResults] = useState<TagItem[]>([])
  const [isSearchingTags, setIsSearchingTags] = useState(false)

  // Media library modal
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [mediaTarget, setMediaTarget] = useState<'featured' | 'og' | 'content' | 'gallery'>('featured')
  const [contentImageInsertCallback, setContentImageInsertCallback] = useState<
    ((src: string, alt?: string) => void) | null
  >(null)
  const [galleryImagesCallback, setGalleryImagesCallback] = useState<
    ((images: Array<{src: string, alt?: string}>) => void) | null
  >(null)

  // Generate slug from title (only if not manually edited)
  useEffect(() => {
    if (!isEdit && title && !slugManuallyEdited) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setSlug(generatedSlug)
    }
  }, [title, slugManuallyEdited, isEdit])

  // Handle state success/error
  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      if (!isEdit && state.data) {
        router.push(`/admin/content/blog/${(state.data as { id: string }).id}/edit`)
      }
    } else if (state.message && !state.success) {
      toast.error(state.message)
    }
  }, [state, isEdit, router])

  // Search tags
  useEffect(() => {
    if (tagSearch.length < 2) {
      setTagSearchResults([])
      return
    }

    const searchTimer = setTimeout(async () => {
      setIsSearchingTags(true)
      try {
        const results = await searchBlogTags(tagSearch)
        setTagSearchResults(
          results.filter((t) => !selectedTags.some((st) => st.id === t.id)) as TagItem[]
        )
      } catch (error) {
        console.error('Error searching tags:', error)
      } finally {
        setIsSearchingTags(false)
      }
    }, 300)

    return () => clearTimeout(searchTimer)
  }, [tagSearch, selectedTags])

  // Add tag
  const handleAddTag = async (tag: TagItem) => {
    setSelectedTags((prev) => [...prev, tag])
    setTagSearch('')
    setTagSearchResults([])
  }

  // Create and add new tag
  const handleCreateTag = async () => {
    if (!tagSearch.trim()) return

    const newTag = await createBlogTagInline(tagSearch.trim())
    if (newTag) {
      handleAddTag(newTag as TagItem)
      toast.success(`Tag "${newTag.name}" created`)
    } else {
      toast.error('Failed to create tag')
    }
  }

  // Remove tag
  const handleRemoveTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tagId))
  }

  // Handle media selection
  const handleMediaSelect = (media: MediaItem | MediaItem[]) => {
    if (mediaTarget === 'gallery') {
      // Handle gallery multi-select
      const items = Array.isArray(media) ? media : [media]
      if (items.length > 0 && galleryImagesCallback) {
        const images = items.map(item => ({
          src: item.file_url,
          alt: item.alt_text || item.original_name || ''
        }))
        galleryImagesCallback(images)
        setGalleryImagesCallback(null)
      }
    } else {
      const item = Array.isArray(media) ? media[0] : media
      if (!item) return

      if (mediaTarget === 'featured') {
        setFeaturedImage(item.file_url)
      } else if (mediaTarget === 'og') {
        setOgImage(item.file_url)
      } else if (mediaTarget === 'content' && contentImageInsertCallback) {
        // Insert image into editor content at cursor position
        contentImageInsertCallback(item.file_url, item.alt_text || item.original_name || '')
        setContentImageInsertCallback(null)
      }
    }
    setIsMediaModalOpen(false)
  }

  // Handler for content image upload from rich text editor
  const handleContentImageUpload = (insertCallback: (src: string, alt?: string) => void) => {
    setContentImageInsertCallback(() => insertCallback)
    setMediaTarget('content')
    setIsMediaModalOpen(true)
  }

  // Handler for gallery image selection from rich text editor
  const handleGalleryImageSelect = (onImagesSelected: (images: Array<{src: string, alt?: string}>) => void) => {
    setGalleryImagesCallback(() => onImagesSelected)
    setMediaTarget('gallery')
    setIsMediaModalOpen(true)
  }

  // Calculate reading time from content
  const calculateReadingTime = () => {
    try {
      const contentObj = JSON.parse(content)
      const extractText = (node: unknown): string => {
        if (!node || typeof node !== 'object') return ''
        const n = node as Record<string, unknown>
        if (n.text && typeof n.text === 'string') return n.text
        if (Array.isArray(n.content)) {
          return n.content.map(extractText).join(' ')
        }
        return ''
      }
      const text = extractText(contentObj)
      const wordCount = text.split(/\s+/).filter(Boolean).length
      const time = Math.max(1, Math.ceil(wordCount / 200))
      setReadingTime(time)
      toast.success(`Reading time calculated: ${time} min`)
    } catch {
      toast.error('Invalid content format')
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields */}
      {isEdit && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="author_id" value={author?.id || ''} />
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="tags" value={JSON.stringify(selectedTags.map((t) => t.id))} />
      <input type="hidden" name="is_featured" value={String(isFeatured)} />
      <input type="hidden" name="is_pinned" value={String(isPinned)} />
      <input type="hidden" name="allow_comments" value={String(allowComments)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Post Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  className="min-h-[44px]"
                  required
                />
                {state.errors?.title && (
                  <p className="text-sm text-destructive">{state.errors.title[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setSlugManuallyEdited(true)
                  }}
                  placeholder="post-url-slug"
                  className="min-h-[44px]"
                  required
                />
                {state.errors?.slug && (
                  <p className="text-sm text-destructive">{state.errors.slug[0]}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  URL: /blog/{slug || 'post-slug'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the post (shown in listings)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {excerpt.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Content</CardTitle>
              <CardDescription>
                Write your blog post content using the rich text editor below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your blog post..."
                onContentImageUpload={handleContentImageUpload}
                onGalleryImageSelect={handleGalleryImageSelect}
              />
              <div className="flex items-center gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={calculateReadingTime}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Calculate Reading Time
                </Button>
                <span className="text-sm text-muted-foreground">
                  Current: {readingTime} min
                </span>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input
                  id="seo_title"
                  name="seo_title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Custom SEO title (defaults to post title)"
                  className="min-h-[44px]"
                />
                <p className="text-xs text-muted-foreground">
                  {seoTitle.length}/200 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  name="seo_description"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Meta description for search engines"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {seoDescription.length}/500 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_image">Open Graph Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="og_image"
                    name="og_image"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="Social share image URL"
                    className="min-h-[44px] flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setMediaTarget('og')
                      setIsMediaModalOpen(true)
                    }}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical_url">Canonical URL</Label>
                <Input
                  id="canonical_url"
                  name="canonical_url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://example.com/original-post"
                  className="min-h-[44px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus} name="status">
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={visibility} onValueChange={setVisibility} name="visibility">
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="password_protected">Password Protected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reading_time_minutes">Reading Time (minutes)</Label>
                <Input
                  id="reading_time_minutes"
                  name="reading_time_minutes"
                  type="number"
                  min="1"
                  value={readingTime}
                  onChange={(e) => setReadingTime(parseInt(e.target.value) || 1)}
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <Label htmlFor="is_featured" className="cursor-pointer">
                      Featured
                    </Label>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pin className="h-4 w-4 text-primary" />
                    <Label htmlFor="is_pinned" className="cursor-pointer">
                      Pinned
                    </Label>
                  </div>
                  <Switch
                    id="is_pinned"
                    checked={isPinned}
                    onCheckedChange={setIsPinned}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <Label htmlFor="allow_comments" className="cursor-pointer">
                      Allow Comments
                    </Label>
                  </div>
                  <Switch
                    id="allow_comments"
                    checked={allowComments}
                    onCheckedChange={setAllowComments}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <SubmitButton isEdit={isEdit} />
                <Button type="button" variant="outline" asChild className="min-h-[44px]">
                  <a href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input type="hidden" name="featured_image" value={featuredImage} />
              {featuredImage ? (
                <div className="relative">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={featuredImage}
                      alt="Featured"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
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
                  onClick={() => {
                    setMediaTarget('featured')
                    setIsMediaModalOpen(true)
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to select image
                    </span>
                  </div>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={categoryId || 'none'} onValueChange={(v) => setCategoryId(v === 'none' ? '' : v)}>
                <SelectTrigger className="min-h-[44px]">
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
              <input type="hidden" name="category_id" value={categoryId} />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="gap-1"
                      style={{ borderColor: tag.color || undefined }}
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Tag Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Search or create tags..."
                  className="pl-9 min-h-[44px]"
                />
                {isSearchingTags && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
                )}
              </div>

              {/* Tag Search Results */}
              {(tagSearchResults.length > 0 || tagSearch.length >= 2) && (
                <div className="border rounded-lg divide-y">
                  {tagSearchResults.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex items-center justify-between"
                    >
                      <span>{tag.name}</span>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                  {tagSearch.length >= 2 && !tagSearchResults.some((t) => t.name.toLowerCase() === tagSearch.toLowerCase()) && (
                    <button
                      type="button"
                      onClick={handleCreateTag}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex items-center justify-between text-primary"
                    >
                      <span>Create &quot;{tagSearch}&quot;</span>
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Author */}
          {author && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {author.avatar_url ? (
                    <Image
                      src={author.avatar_url}
                      alt={author.full_name || 'Author'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {(author.full_name || author.email)[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{author.full_name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{author.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        open={isMediaModalOpen}
        onOpenChange={setIsMediaModalOpen}
        onSelect={handleMediaSelect}
        fileType="image"
        multiple={mediaTarget === 'gallery'}
      />
    </form>
  )
}
