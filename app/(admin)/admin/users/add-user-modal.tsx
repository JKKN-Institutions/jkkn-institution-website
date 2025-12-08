'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, Loader2 } from 'lucide-react'
import { createUser } from '@/app/actions/users'
import { getRoles } from '@/app/actions/roles'
import { toast } from 'sonner'
import { INSTITUTIONS, getDepartmentsByInstitution } from '@/lib/config/institutions'

interface AddUserModalProps {
  trigger?: React.ReactNode
}

type RoleOption = {
  id: string
  name: string
  display_name: string
  description: string | null
}

export function AddUserModal({ trigger }: AddUserModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [institution, setInstitution] = useState('')
  const [department, setDepartment] = useState('')
  const [designation, setDesignation] = useState('')
  const [roleId, setRoleId] = useState('')

  // Available departments based on selected institution
  const [departments, setDepartments] = useState<string[]>([])

  // Available roles
  const [roles, setRoles] = useState<RoleOption[]>([])

  // Fetch roles when modal opens
  useEffect(() => {
    if (open) {
      getRoles().then((rolesData) => {
        setRoles(
          rolesData.map((r) => ({
            id: r.id,
            name: r.name,
            display_name: r.display_name,
            description: r.description || null,
          }))
        )
      })
    }
  }, [open])

  // Update departments when institution changes
  useEffect(() => {
    if (institution) {
      const depts = getDepartmentsByInstitution(institution)
      setDepartments(depts)
      // Reset department if the new institution doesn't have it
      if (!depts.includes(department)) {
        setDepartment('')
      }
    } else {
      setDepartments([])
      setDepartment('')
    }
  }, [institution])

  const resetForm = () => {
    setEmail('')
    setFullName('')
    setPhone('')
    setInstitution('')
    setDepartment('')
    setDesignation('')
    setRoleId('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createUser({
        email,
        full_name: fullName,
        phone: phone || undefined,
        institution: institution || undefined,
        department: department || undefined,
        designation: designation || undefined,
        role_id: roleId || undefined,
      })

      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        resetForm()
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to create user')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account. They can sign in using Google OAuth with their @jkkn.ac.in email.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6">
          <form id="add-user-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@jkkn.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10 digits"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Organization Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Organization Details</h3>

              {/* Institution */}
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Select value={institution} onValueChange={setInstitution}>
                  <SelectTrigger id="institution" className="w-full">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-[200px]">
                    {INSTITUTIONS.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={department}
                  onValueChange={setDepartment}
                  disabled={!institution || departments.length === 0}
                >
                  <SelectTrigger id="department" className="w-full">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-[200px]">
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!institution && (
                  <p className="text-sm text-muted-foreground">
                    Please select an institution first to load departments
                  </p>
                )}
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  placeholder="e.g., Professor, HOD, Lecturer"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
            </div>

            {/* Role & Permissions Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Role & Permissions</h3>

              <div className="space-y-2">
                <Label htmlFor="role">Assign Role</Label>
                <Select value={roleId} onValueChange={setRoleId}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="User">
                      {roleId && roles.find((r) => r.id === roleId)?.display_name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-[200px]">
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex flex-col">
                          <span>{role.display_name}</span>
                          {role.description && (
                            <span className="text-xs text-muted-foreground">
                              {role.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed footer with buttons */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="add-user-form" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
