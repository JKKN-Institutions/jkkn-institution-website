'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Badge } from '@/components/ui/badge'
import { Loader2, User, Shield, Activity } from 'lucide-react'
import { getUserById, updateUserProfile, assignRole, removeRole, deactivateUser, reactivateUser, type FormState } from '@/app/actions/users'
import { getRoles } from '@/app/actions/roles'
import { toast } from 'sonner'
import { INSTITUTIONS, getDepartmentsByInstitution } from '@/lib/config/institutions'
import type { UserRow } from './columns'

interface EditUserModalProps {
  user: UserRow
  open: boolean
  onOpenChange: (open: boolean) => void
}

type RoleOption = {
  id: string
  name: string
  display_name: string
}

export function EditUserModal({ user, open, onOpenChange }: EditUserModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [roles, setRoles] = useState<RoleOption[]>([])

  // Profile form state
  const [fullName, setFullName] = useState(user.full_name || '')
  const [phone, setPhone] = useState('')
  const [institution, setInstitution] = useState('')
  const [department, setDepartment] = useState(user.department || '')
  const [designation, setDesignation] = useState(user.designation || '')

  // Role state
  const [selectedRoleId, setSelectedRoleId] = useState('')

  // Status state
  const currentStatus = user.members?.[0]?.status || 'pending'
  const currentRole = user.user_roles?.[0]?.roles

  // Available departments based on selected institution
  const [departments, setDepartments] = useState<string[]>([])

  // Initialize form values when user changes
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '')
      setDepartment(user.department || '')
      setDesignation(user.designation || '')
      // Find institution from chapter
      const chapter = user.members?.[0]?.chapter
      if (chapter) {
        const inst = INSTITUTIONS.find(i => i.id === chapter || i.name === chapter)
        setInstitution(inst?.id || '')
      }
    }
  }, [user])

  // Update departments when institution changes
  useEffect(() => {
    if (institution) {
      const depts = getDepartmentsByInstitution(institution)
      setDepartments(depts)
    } else {
      setDepartments([])
    }
  }, [institution])

  // Fetch roles
  useEffect(() => {
    async function fetchRoles() {
      try {
        const rolesData = await getRoles()
        setRoles(
          rolesData.map((r) => ({
            id: r.id,
            name: r.name,
            display_name: r.display_name,
          }))
        )
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }
    if (open) {
      fetchRoles()
    }
  }, [open])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.set('full_name', fullName)
      formData.set('phone', phone)
      formData.set('department', department)
      formData.set('designation', designation)

      const result = await updateUserProfile(user.id, {} as FormState, formData)

      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAssignRole = async () => {
    if (!selectedRoleId) {
      toast.error('Please select a role')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.set('userId', user.id)
      formData.set('roleId', selectedRoleId)

      const result = await assignRole({} as FormState, formData)

      if (result.success) {
        toast.success(result.message)
        setSelectedRoleId('')
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to assign role')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveRole = async (roleId: string) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.set('userId', user.id)
      formData.set('roleId', roleId)

      const result = await removeRole({} as FormState, formData)

      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to remove role')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (newStatus: 'active' | 'inactive') => {
    setIsSubmitting(true)
    try {
      const result = newStatus === 'active'
        ? await reactivateUser(user.id)
        : await deactivateUser(user.id)

      if (result.success) {
        toast.success(result.message)
        router.refresh()
        onOpenChange(false)
      } else {
        toast.error(result.message || 'Failed to update status')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
          <DialogDescription>
            Update user information, role assignment, and account status.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="role" className="gap-2">
              <Shield className="h-4 w-4" />
              Role
            </TabsTrigger>
            <TabsTrigger value="status" className="gap-2">
              <Activity className="h-4 w-4" />
              Status
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6 flex-1 overflow-y-auto">
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Email (disabled) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                />
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g., Assistant Professor"
                />
              </div>

              {/* Institution */}
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Select value={institution} onValueChange={setInstitution}>
                  <SelectTrigger id="institution" className="w-full">
                    <SelectValue placeholder="Select an institution" />
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
                    <SelectValue placeholder={institution ? "Select a department" : "Select institution first"} />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-[200px]">
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Role Tab */}
          <TabsContent value="role" className="mt-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Current Roles */}
              <div className="space-y-3">
                <Label>Current Roles</Label>
                <div className="flex flex-wrap gap-2">
                  {user.user_roles && user.user_roles.length > 0 ? (
                    user.user_roles.map((ur) => (
                      <Badge
                        key={ur.id}
                        variant="outline"
                        className="px-3 py-1.5 gap-2"
                      >
                        {ur.roles?.display_name}
                        <button
                          type="button"
                          onClick={() => ur.roles && handleRemoveRole(ur.roles.id)}
                          disabled={isSubmitting}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No roles assigned</span>
                  )}
                </div>
              </div>

              {/* Assign New Role */}
              <div className="space-y-3">
                <Label>Assign New Role</Label>
                <div className="flex gap-2">
                  <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                    <SelectTrigger className="flex-1 w-full">
                      <SelectValue placeholder="Select a role to assign" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="max-h-[200px]">
                      {roles
                        .filter((r) => !user.user_roles?.some((ur) => ur.roles?.id === r.id))
                        .map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.display_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={handleAssignRole}
                    disabled={isSubmitting || !selectedRoleId}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Assign
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status" className="mt-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Current Status */}
              <div className="space-y-3">
                <Label>Current Status</Label>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`px-3 py-1.5 capitalize ${getStatusColor(currentStatus)}`}
                  >
                    {currentStatus}
                  </Badge>
                </div>
              </div>

              {/* Change Status */}
              <div className="space-y-3">
                <Label>Change Status</Label>
                <div className="flex gap-3">
                  {currentStatus !== 'active' && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => handleStatusChange('active')}
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Activate User
                    </Button>
                  )}
                  {currentStatus === 'active' && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => handleStatusChange('inactive')}
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Deactivate User
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentStatus === 'active'
                    ? 'Deactivating will prevent the user from accessing the admin panel.'
                    : 'Activating will allow the user to access the admin panel based on their permissions.'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom padding for scrollable content */}
        <div className="h-4" />
      </DialogContent>
    </Dialog>
  )
}
