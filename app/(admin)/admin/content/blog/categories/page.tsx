'use client'

import { useActionState, useState, useEffect, useTransition } from 'react'
import { ArrowLeft, FolderOpen, Plus, Edit, Trash2, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
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
import { Switch } from '@/components/ui/switch'
import {
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  toggleBlogCategoryStatus,
  type BlogCategory,
} from '@/app/actions/cms/blog-categories'
import { toast } from 'sonner'

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<BlogCategory | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    icon: '',
    color: '#3b82f6',
    sort_order: 0,
    is_active: true,
  })

  // Form actions
  const action = editingCategory ? updateBlogCategory : createBlogCategory
  const [formState, formAction] = useActionState(action, {})

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const data = await getBlogCategories({ includeInactive: true })
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Handle form state changes
  useEffect(() => {
    if (formState.success) {
      toast.success(formState.message)
      setIsDialogOpen(false)
      setEditingCategory(null)
      resetForm()
      fetchCategories()
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
      parent_id: '',
      icon: '',
      color: '#3b82f6',
      sort_order: 0,
      is_active: true,
    })
  }

  // Open dialog for new category
  const handleNewCategory = () => {
    setEditingCategory(null)
    resetForm()
    setIsDialogOpen(true)
  }

  // Open dialog for editing
  const handleEditCategory = (category: BlogCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || '',
      icon: category.icon || '',
      color: category.color || '#3b82f6',
      sort_order: category.sort_order || 0,
      is_active: category.is_active !== false,
    })
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteCategory) return

    startTransition(async () => {
      const result = await deleteBlogCategory(deleteCategory.id)
      if (result.success) {
        toast.success(result.message)
        fetchCategories()
      } else {
        toast.error(result.message)
      }
      setDeleteCategory(null)
    })
  }

  // Handle toggle active
  const handleToggleActive = async (category: BlogCategory) => {
    startTransition(async () => {
      const result = await toggleBlogCategoryStatus(category.id)
      if (result.success) {
        toast.success(result.message)
        fetchCategories()
      } else {
        toast.error(result.message)
      }
    })
  }

  // Generate slug from name
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        !editingCategory && !prev.slug
          ? name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
          : prev.slug,
    }))
  }

  // Get parent categories (excluding current and its children)
  const getParentOptions = () => {
    if (!editingCategory) return categories.filter((c) => !c.parent_id)

    // Exclude current category and any that have it as parent
    return categories.filter(
      (c) => c.id !== editingCategory.id && c.parent_id !== editingCategory.id && !c.parent_id
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="Blog Categories"
        description="Organize your blog posts into categories"
        badge="Blog"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Link>
            </Button>
            <Button onClick={handleNewCategory} className="bg-primary hover:bg-primary/90 min-h-[44px]">
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </div>
        }
      />

      {/* Categories Grid */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No categories yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first category to organize blog posts
            </p>
            <Button onClick={handleNewCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`${!category.is_active ? 'opacity-60' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {category.color && (
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteCategory(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">/{category.slug}</span>
                    <Badge variant="outline">{category.post_count || 0} posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Switch
                      checked={category.is_active !== false}
                      onCheckedChange={() => handleToggleActive(category)}
                      disabled={isPending}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form action={formAction}>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'New Category'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? 'Update the category details below'
                  : 'Create a new category to organize your blog posts'}
              </DialogDescription>
            </DialogHeader>

            {editingCategory && (
              <input type="hidden" name="id" value={editingCategory.id} />
            )}

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Category name"
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
                  placeholder="category-slug"
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
                  placeholder="Brief description of this category"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parent_id">Parent Category</Label>
                  <Select
                    value={formData.parent_id || 'none'}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, parent_id: value === 'none' ? '' : value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {getParentOptions().map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sort_order: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, icon: e.target.value }))
                    }
                    placeholder="folder"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
                <input
                  type="hidden"
                  name="is_active"
                  value={String(formData.is_active)}
                />
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
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteCategory?.name}&quot;?
              {deleteCategory?.post_count && deleteCategory.post_count > 0 && (
                <span className="block mt-2 text-amber-600">
                  This category has {deleteCategory.post_count} posts. They will become
                  uncategorized.
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
    </div>
  )
}
