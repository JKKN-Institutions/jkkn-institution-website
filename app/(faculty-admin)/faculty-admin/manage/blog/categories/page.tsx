'use client'

import { useActionState, useState, useEffect, useTransition } from 'react'
import { FolderOpen, Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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

export default function FacultyBlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<BlogCategory | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    icon: '',
    color: '#0b6d41',
    sort_order: 0,
    is_active: true,
  })

  const action = editingCategory ? updateBlogCategory : createBlogCategory
  const [formState, formAction] = useActionState(action, {})

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent_id: '',
      icon: '',
      color: '#0b6d41',
      sort_order: 0,
      is_active: true,
    })
  }

  const handleNew = () => {
    setEditingCategory(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || '',
      icon: category.icon || '',
      color: category.color || '#0b6d41',
      sort_order: category.sort_order || 0,
      is_active: category.is_active !== false,
    })
    setIsDialogOpen(true)
  }

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

  const handleToggle = async (category: BlogCategory) => {
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

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        !editingCategory && !prev.slug
          ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          : prev.slug,
    }))
  }

  const getParentOptions = () => {
    if (!editingCategory) return categories.filter((c) => !c.parent_id)
    return categories.filter(
      (c) => c.id !== editingCategory.id && c.parent_id !== editingCategory.id && !c.parent_id
    )
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Blog Categories</h1>
          <p className="text-[0.78rem] text-gray-400">Organize your blog posts into categories</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[0.8rem] font-semibold text-white bg-[#0b6d41] hover:bg-[#085533] transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          New Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-sm font-semibold text-gray-700">No categories yet</h3>
            <p className="text-[0.78rem] text-gray-400 mb-4">
              Create your first category to organize blog posts
            </p>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[0.8rem] font-semibold text-white bg-[#0b6d41] hover:bg-[#085533] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Category
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all p-4 ${
                  !category.is_active ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {category.color && (
                      <div
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <h3 className="text-[0.9rem] font-semibold text-gray-800">{category.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-[#0b6d41] hover:bg-gray-50 transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCategory(category)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[0.78rem] text-gray-500 line-clamp-2 mb-3 min-h-[2rem]">
                  {category.description || 'No description'}
                </p>
                <div className="flex items-center justify-between text-[0.72rem]">
                  <span className="text-gray-400 font-mono">/{category.slug}</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-600">
                    {category.post_count || 0} posts
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="text-[0.72rem] text-gray-500">Active</span>
                  <Switch
                    checked={category.is_active !== false}
                    onCheckedChange={() => handleToggle(category)}
                    disabled={isPending}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form action={formAction}>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? 'Update the category details below'
                  : 'Create a new category to organize your blog posts'}
              </DialogDescription>
            </DialogHeader>

            {editingCategory && <input type="hidden" name="id" value={editingCategory.id} />}

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
                  placeholder="category-slug"
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
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parent_id">Parent Category</Label>
                  <Select
                    value={formData.parent_id || 'none'}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        parent_id: value === 'none' ? '' : value,
                      }))
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
                  <input type="hidden" name="parent_id" value={formData.parent_id} />
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
                      placeholder="#0b6d41"
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
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
                <input type="hidden" name="is_active" value={String(formData.is_active)} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0b6d41] hover:bg-[#085533]">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                  This category has {deleteCategory.post_count} posts. They will become uncategorized.
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
    </div>
  )
}
