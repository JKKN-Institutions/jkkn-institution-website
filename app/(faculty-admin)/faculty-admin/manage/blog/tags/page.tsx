'use client'

import { useActionState, useState, useEffect, useTransition } from 'react'
import { Tag, Plus, Edit, Trash2, Loader2, Search, Merge } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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

export default function FacultyBlogTagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([])
  const [filteredTags, setFilteredTags] = useState<BlogTag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null)
  const [deleteTag, setDeleteTag] = useState<BlogTag | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false)
  const [mergeTargetId, setMergeTargetId] = useState<string>('')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#0b6d41',
  })

  const action = editingTag ? updateBlogTag : createBlogTag
  const [formState, formAction] = useActionState(action, {})

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])

  const resetForm = () =>
    setFormData({ name: '', slug: '', description: '', color: '#0b6d41' })

  const handleNew = () => {
    setEditingTag(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (tag: BlogTag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || '',
      color: tag.color || '#0b6d41',
    })
    setIsDialogOpen(true)
  }

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

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        !editingTag && !prev.slug
          ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          : prev.slug,
    }))
  }

  const toggleTagSelection = (tagId: string) =>
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )

  const toggleSelectAll = () =>
    setSelectedTags(
      selectedTags.length === filteredTags.length ? [] : filteredTags.map((t) => t.id)
    )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Professional Header */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Tag className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Blog Tags</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Attach tags to posts so readers can discover related content quickly.
              </p>
            </div>
          </div>
          <Button
            onClick={handleNew}
            className="bg-primary hover:bg-primary/90 shadow-brand shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Tag
          </Button>
        </div>
      </div>

      {/* Search & Bulk Actions */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-[0.8rem]"
            />
          </div>

          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[0.75rem] text-gray-500 px-2 py-1 rounded-md bg-gray-50">
                {selectedTags.length} selected
              </span>
              {selectedTags.length >= 2 && (
                <button
                  onClick={() => setIsMergeDialogOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.75rem] font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Merge className="w-3 h-3" />
                  Merge
                </button>
              )}
              <button
                onClick={() => setIsBulkDeleteOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.75rem] font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tags Grid */}
      <div className="glass-card rounded-2xl p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-sm font-semibold text-gray-700">
              {searchQuery ? 'No tags found' : 'No tags yet'}
            </h3>
            <p className="text-[0.78rem] text-gray-400 mb-4">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first tag to organize blog posts'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleNew}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[0.8rem] font-semibold text-white bg-[#0b6d41] hover:bg-[#085533] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Tag
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
              <Checkbox
                checked={selectedTags.length === filteredTags.length && filteredTags.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-[0.75rem] text-gray-500">
                Select all ({filteredTags.length} tags)
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className={`rounded-xl border p-3 transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'border-[#0b6d41] ring-1 ring-[#0b6d41]/30 bg-[#0b6d41]/[0.02]'
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Checkbox
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={() => toggleTagSelection(tag.id)}
                      />
                      <div
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color || '#0b6d41' }}
                      />
                      <span className="text-[0.85rem] font-semibold text-gray-800 truncate">
                        {tag.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="p-1 rounded text-gray-400 hover:text-[#0b6d41] hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setDeleteTag(tag)}
                        className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  {tag.description && (
                    <p className="text-[0.72rem] text-gray-500 line-clamp-2 mb-2">
                      {tag.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[0.7rem]">
                    <span className="text-gray-400 font-mono truncate">/{tag.slug}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-600 flex-shrink-0">
                      {tag.usage_count || 0} posts
                    </span>
                  </div>
                </div>
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
              <DialogTitle>{editingTag ? 'Edit Tag' : 'New Tag'}</DialogTitle>
              <DialogDescription>
                {editingTag ? 'Update the tag details below' : 'Create a new tag'}
              </DialogDescription>
            </DialogHeader>

            {editingTag && <input type="hidden" name="id" value={editingTag.id} />}

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
                  <p className="text-sm text-red-500">{formState.errors.name[0]}</p>
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
                  <p className="text-sm text-red-500">{formState.errors.slug[0]}</p>
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
                  placeholder="Brief description"
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
                    placeholder="#0b6d41"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0b6d41] hover:bg-[#085533]">
                {editingTag ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={!!deleteTag} onOpenChange={(open) => !open && setDeleteTag(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTag?.name}&quot;?
              {deleteTag?.usage_count && deleteTag.usage_count > 0 && (
                <span className="block mt-2 text-amber-600">
                  This tag is used in {deleteTag.usage_count} posts. It will be removed from all posts.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Tags</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedTags.length} tags? This action cannot be
              undone and will remove these tags from all associated posts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete {selectedTags.length} Tags
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Merge */}
      <Dialog open={isMergeDialogOpen} onOpenChange={setIsMergeDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Merge Tags</DialogTitle>
            <DialogDescription>
              Select a target tag to merge into. All posts using the source tags will be updated.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Selected Tags ({selectedTags.length})</Label>
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId)
                  return tag ? (
                    <span
                      key={tag.id}
                      className="px-2 py-0.5 rounded-md text-[0.72rem] bg-gray-100 text-gray-700 border"
                      style={{ borderColor: tag.color || undefined }}
                    >
                      {tag.name}
                    </span>
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
              <p className="text-xs text-gray-400">
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
              className="bg-[#0b6d41] hover:bg-[#085533]"
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
