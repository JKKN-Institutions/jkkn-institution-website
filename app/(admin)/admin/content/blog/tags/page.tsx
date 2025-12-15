'use client'

import { useActionState, useState, useEffect, useTransition } from 'react'
import { ArrowLeft, Tag, Plus, Edit, Trash2, Loader2, Search, Merge } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getBlogTags,
  createBlogTag,
  updateBlogTag,
  deleteBlogTag,
  bulkDeleteBlogTags,
  mergeBlogTags,
  type BlogTag,
} from '@/app/actions/cms/blog-tags'
import { toast } from 'sonner'

export default function BlogTagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([])
  const [filteredTags, setFilteredTags] = useState<BlogTag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState('')

  // Selection state
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null)
  const [deleteTag, setDeleteTag] = useState<BlogTag | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false)
  const [mergeTargetId, setMergeTargetId] = useState<string>('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3b82f6',
  })

  // Form actions
  const action = editingTag ? updateBlogTag : createBlogTag
  const [formState, formAction] = useActionState(action, {})

  // Fetch tags
  const fetchTags = async () => {
    setIsLoading(true)
    try {
      const data = await getBlogTags()
      setTags(data)
      setFilteredTags(data)
    } catch (error) {
      console.error('Error fetching tags:', error)
      toast.error('Failed to fetch tags')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  // Filter tags based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTags(tags)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredTags(
        tags.filter(
          (tag) =>
            tag.name.toLowerCase().includes(query) ||
            tag.slug.toLowerCase().includes(query) ||
            tag.description?.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, tags])

  // Handle form state changes
  useEffect(() => {
    if (formState.success) {
      toast.success(formState.message)
      setIsDialogOpen(false)
      setEditingTag(null)
      resetForm()
      fetchTags()
    } else if (formState.message && !formState.success) {
      toast.error(formState.message)
    }
  }, [formState])

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#3b82f6',
    })
  }

  // Open dialog for new tag
  const handleNewTag = () => {
    setEditingTag(null)
    resetForm()
    setIsDialogOpen(true)
  }

  // Open dialog for editing
  const handleEditTag = (tag: BlogTag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || '',
      color: tag.color || '#3b82f6',
    })
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteTag) return

    startTransition(async () => {
      const result = await deleteBlogTag(deleteTag.id)
      if (result.success) {
        toast.success(result.message)
        fetchTags()
      } else {
        toast.error(result.message)
      }
      setDeleteTag(null)
    })
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedTags.length === 0) return

    startTransition(async () => {
      const result = await bulkDeleteBlogTags(selectedTags)
      if (result.success) {
        toast.success(result.message)
        setSelectedTags([])
        fetchTags()
      } else {
        toast.error(result.message)
      }
      setIsBulkDeleteOpen(false)
    })
  }

  // Handle merge
  const handleMerge = async () => {
    if (selectedTags.length < 2 || !mergeTargetId) return

    const sourceIds = selectedTags.filter((id) => id !== mergeTargetId)

    startTransition(async () => {
      const result = await mergeBlogTags(sourceIds, mergeTargetId)
      if (result.success) {
        toast.success(result.message)
        setSelectedTags([])
        setMergeTargetId('')
        fetchTags()
      } else {
        toast.error(result.message)
      }
      setIsMergeDialogOpen(false)
    })
  }

  // Generate slug from name
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        !editingTag && !prev.slug
          ? name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
          : prev.slug,
    }))
  }

  // Toggle tag selection
  const toggleTagSelection = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    )
  }

  // Select all visible tags
  const toggleSelectAll = () => {
    if (selectedTags.length === filteredTags.length) {
      setSelectedTags([])
    } else {
      setSelectedTags(filteredTags.map((tag) => tag.id))
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Tag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="Blog Tags"
        description="Manage tags to help organize and discover blog posts"
        badge="Blog"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Link>
            </Button>
            <Button onClick={handleNewTag} className="bg-primary hover:bg-primary/90 min-h-[44px]">
              <Plus className="mr-2 h-4 w-4" />
              New Tag
            </Button>
          </div>
        }
      />

      {/* Search and Actions Bar */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {selectedTags.length > 0 && (
            <div className="flex gap-2">
              <Badge variant="secondary">
                {selectedTags.length} selected
              </Badge>
              {selectedTags.length >= 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMergeDialogOpen(true)}
                >
                  <Merge className="mr-2 h-4 w-4" />
                  Merge
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tags Grid */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">
              {searchQuery ? 'No tags found' : 'No tags yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first tag to help organize blog posts'}
            </p>
            {!searchQuery && (
              <Button onClick={handleNewTag}>
                <Plus className="mr-2 h-4 w-4" />
                Create Tag
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
              <Checkbox
                checked={selectedTags.length === filteredTags.length && filteredTags.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                Select all ({filteredTags.length} tags)
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTags.map((tag) => (
                <Card
                  key={tag.id}
                  className={`cursor-pointer transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'ring-2 ring-primary'
                      : 'hover:shadow-md'
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => toggleTagSelection(tag.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: tag.color || '#3b82f6' }}
                        />
                        <CardTitle className="text-sm font-medium">
                          {tag.name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditTag(tag)
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteTag(tag)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {tag.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {tag.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-mono">
                        /{tag.slug}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {tag.usage_count || 0} posts
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form action={formAction}>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? 'Edit Tag' : 'New Tag'}
              </DialogTitle>
              <DialogDescription>
                {editingTag
                  ? 'Update the tag details below'
                  : 'Create a new tag to organize your blog posts'}
              </DialogDescription>
            </DialogHeader>

            {editingTag && (
              <input type="hidden" name="id" value={editingTag.id} />
            )}

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Tag name"
                  required
                />
                {formState.errors?.name && (
                  <p className="text-sm text-destructive">{formState.errors.name[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="tag-slug"
                  required
                />
                {formState.errors?.slug && (
                  <p className="text-sm text-destructive">{formState.errors.slug[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Brief description of this tag"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, color: e.target.value }))
                    }
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingTag ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTag}
        onOpenChange={(open) => !open && setDeleteTag(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTag?.name}&quot;?
              {deleteTag?.usage_count && deleteTag.usage_count > 0 && (
                <span className="block mt-2 text-amber-600">
                  This tag is used in {deleteTag.usage_count} posts. It will be
                  removed from all posts.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Tags</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedTags.length} tags? This
              action cannot be undone and will remove these tags from all
              associated posts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete {selectedTags.length} Tags
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Merge Dialog */}
      <Dialog open={isMergeDialogOpen} onOpenChange={setIsMergeDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Merge Tags</DialogTitle>
            <DialogDescription>
              Select a target tag to merge the selected tags into. All posts
              using the source tags will be updated to use the target tag.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Selected Tags ({selectedTags.length})</Label>
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId)
                  return tag ? (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      style={{ borderColor: tag.color || undefined }}
                    >
                      {tag.name}
                    </Badge>
                  ) : null
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Merge Into (Target Tag) *</Label>
              <Select value={mergeTargetId} onValueChange={setMergeTargetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target tag" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTags.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId)
                    return tag ? (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ) : null
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Other selected tags will be deleted after merging
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsMergeDialogOpen(false)
                setMergeTargetId('')
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMerge}
              disabled={!mergeTargetId || isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Merge Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
