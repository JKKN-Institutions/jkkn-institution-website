'use client'

import { useActionState, useState, useEffect, useTransition } from 'react'
import { ArrowLeft, FolderOpen, Plus, Edit, Trash2, Loader2, User } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  getCareerDepartments,
  createCareerDepartment,
  updateCareerDepartment,
  deleteCareerDepartment,
  toggleCareerDepartmentStatus,
  type CareerDepartmentWithHead,
} from '@/app/actions/cms/career-departments'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface StaffMember {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
}

export default function CareerDepartmentsPage() {
  const [departments, setDepartments] = useState<CareerDepartmentWithHead[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<CareerDepartmentWithHead | null>(null)
  const [deleteDepartment, setDeleteDepartment] = useState<CareerDepartmentWithHead | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '#3b82f6',
    head_id: '',
    sort_order: 0,
    is_active: true,
  })

  // Form actions
  const action = editingDepartment ? updateCareerDepartment : createCareerDepartment
  const [formState, formAction] = useActionState(action, {})

  // Fetch departments
  const fetchDepartments = async () => {
    setIsLoading(true)
    try {
      const data = await getCareerDepartments({ includeInactive: true, includeHead: true })
      setDepartments(data)
    } catch (error) {
      console.error('Error fetching departments:', error)
      toast.error('Failed to fetch departments')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch staff members
  const fetchStaffMembers = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .order('full_name')
    setStaffMembers(data || [])
  }

  useEffect(() => {
    fetchDepartments()
    fetchStaffMembers()
  }, [])

  // Handle form state changes
  useEffect(() => {
    if (formState.success) {
      toast.success(formState.message)
      setIsDialogOpen(false)
      setEditingDepartment(null)
      resetForm()
      fetchDepartments()
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
      icon: '',
      color: '#3b82f6',
      head_id: '',
      sort_order: 0,
      is_active: true,
    })
  }

  // Open dialog for new department
  const handleNewDepartment = () => {
    setEditingDepartment(null)
    resetForm()
    setIsDialogOpen(true)
  }

  // Open dialog for editing
  const handleEditDepartment = (department: CareerDepartmentWithHead) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      slug: department.slug,
      description: department.description || '',
      icon: department.icon || '',
      color: department.color || '#3b82f6',
      head_id: department.head_id || '',
      sort_order: department.sort_order || 0,
      is_active: department.is_active !== false,
    })
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteDepartment) return

    startTransition(async () => {
      const result = await deleteCareerDepartment(deleteDepartment.id)
      if (result.success) {
        toast.success(result.message)
        fetchDepartments()
      } else {
        toast.error(result.message)
      }
      setDeleteDepartment(null)
    })
  }

  // Handle toggle active
  const handleToggleActive = async (department: CareerDepartmentWithHead) => {
    startTransition(async () => {
      const result = await toggleCareerDepartmentStatus(department.id)
      if (result.success) {
        toast.success(result.message)
        fetchDepartments()
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
        !editingDepartment && !prev.slug
          ? name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
          : prev.slug,
    }))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="Career Departments"
        description="Organize job postings into departments"
        badge="Careers"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/careers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
            <Button onClick={handleNewDepartment} className="bg-primary hover:bg-primary/90 min-h-[44px]">
              <Plus className="mr-2 h-4 w-4" />
              New Department
            </Button>
          </div>
        }
      />

      {/* Departments Grid */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : departments.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No departments yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first department to organize job postings
            </p>
            <Button onClick={handleNewDepartment}>
              <Plus className="mr-2 h-4 w-4" />
              Create Department
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
              <Card
                key={department.id}
                className={`${!department.is_active ? 'opacity-60' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {department.color && (
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: department.color }}
                        />
                      )}
                      <CardTitle className="text-base">{department.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditDepartment(department)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteDepartment(department)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {department.description || 'No description'}
                  </p>

                  {department.head && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={department.head.avatar_url || undefined} />
                        <AvatarFallback>
                          {(department.head.full_name || department.head.email)[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {department.head.full_name || department.head.email}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">/{department.slug}</span>
                    <Badge variant="outline">{department.job_count || 0} jobs</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Switch
                      checked={department.is_active !== false}
                      onCheckedChange={() => handleToggleActive(department)}
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
                {editingDepartment ? 'Edit Department' : 'New Department'}
              </DialogTitle>
              <DialogDescription>
                {editingDepartment
                  ? 'Update the department details below'
                  : 'Create a new department to organize job postings'}
              </DialogDescription>
            </DialogHeader>

            {editingDepartment && (
              <input type="hidden" name="id" value={editingDepartment.id} />
            )}

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Department name"
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
                  placeholder="department-slug"
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
                  placeholder="Brief description of this department"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="head_id">Department Head</Label>
                  <Select
                    value={formData.head_id || 'none'}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, head_id: value === 'none' ? '' : value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select head" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.full_name || staff.email}
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
                {editingDepartment ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteDepartment}
        onOpenChange={(open) => !open && setDeleteDepartment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteDepartment?.name}&quot;?
              {deleteDepartment?.job_count && deleteDepartment.job_count > 0 && (
                <span className="block mt-2 text-amber-600">
                  This department has {deleteDepartment.job_count} job(s). Please
                  reassign or delete them first.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending || (deleteDepartment?.job_count || 0) > 0}
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
