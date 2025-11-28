'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  Shield,
  Plus,
  X,
  UserMinus,
  UserPlus,
} from 'lucide-react'
import { format } from 'date-fns'
import { assignRole, removeRole, deactivateUser, reactivateUser } from '@/app/actions/users'
import { toast } from 'sonner'

interface UserDetailViewProps {
  user: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    phone: string | null
    department: string | null
    designation: string | null
    employee_id: string | null
    date_of_joining: string | null
    created_at: string | null
    members: Array<{
      id: string
      member_id: string | null
      chapter: string | null
      status: string | null
      membership_type: string | null
      joined_at: string | null
    }> | null
    user_roles: Array<{
      id: string
      assigned_at: string | null
      roles: {
        id: string
        name: string
        display_name: string
        description: string | null
      } | null
    }> | null
  }
  roles: Array<{
    id: string
    name: string
    display_name: string
    description: string | null
  }>
}

const getRoleColor = (roleName: string | null | undefined) => {
  switch (roleName) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
    case 'director':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
    case 'chair':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800'
    case 'member':
      return 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary/90'
    case 'guest':
      return 'bg-secondary/20 text-secondary-foreground border-secondary/30'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

const getStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case 'active':
      return 'bg-primary/10 text-primary dark:bg-primary/20'
    case 'inactive':
      return 'bg-muted text-muted-foreground'
    case 'suspended':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function UserDetailView({ user, roles }: UserDetailViewProps) {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)

  const member = user.members?.[0]
  const userRoles = user.user_roles || []
  const assignedRoleIds = userRoles.map((ur) => ur.roles?.id).filter(Boolean)
  const availableRoles = roles.filter((r) => !assignedRoleIds.includes(r.id))

  const initials = user.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || user.email[0].toUpperCase()

  const handleAssignRole = async () => {
    if (!selectedRole) return

    setIsAssigning(true)
    const formData = new FormData()
    formData.append('userId', user.id)
    formData.append('roleId', selectedRole)

    const result = await assignRole({}, formData)

    if (result.success) {
      toast.success(result.message)
      setSelectedRole('')
      // Refresh server data without full page reload
      router.refresh()
    } else {
      toast.error(result.message)
    }

    setIsAssigning(false)
  }

  const handleRemoveRole = async (roleId: string) => {
    setIsRemoving(roleId)
    const formData = new FormData()
    formData.append('userId', user.id)
    formData.append('roleId', roleId)

    const result = await removeRole({}, formData)

    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }

    setIsRemoving(null)
  }

  const handleDeactivate = async () => {
    const result = await deactivateUser(user.id)
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleReactivate = async () => {
    const result = await reactivateUser(user.id)
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile Card */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Profile Information</CardTitle>
            <CardDescription>User details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">{user.full_name || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{user.phone || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium text-foreground">{user.department || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Designation</p>
                    <p className="font-medium text-foreground">{user.designation || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium text-foreground">
                      {user.created_at
                        ? format(new Date(user.created_at), 'MMMM d, yyyy')
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles Card */}
        <Card className="glass-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Assigned Roles</CardTitle>
                <CardDescription>User&apos;s roles and permissions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Current Roles */}
            <div className="space-y-3 mb-6">
              {userRoles.length > 0 ? (
                userRoles.map((ur) => (
                  <div
                    key={ur.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card/50"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Badge variant="secondary" className={getRoleColor(ur.roles?.name)}>
                          {ur.roles?.display_name}
                        </Badge>
                        {ur.roles?.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {ur.roles.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {ur.roles?.name !== 'super_admin' && userRoles.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRole(ur.roles?.id || '')}
                        disabled={isRemoving === ur.roles?.id}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No roles assigned</p>
              )}
            </div>

            {/* Add Role */}
            {availableRoles.length > 0 && (
              <div className="flex gap-2">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select role to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAssignRole} disabled={!selectedRole || isAssigning}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Status Card */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge className={getStatusColor(member?.status)}>
                {member?.status
                  ? member.status.charAt(0).toUpperCase() + member.status.slice(1)
                  : 'Pending'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Membership</span>
              <span className="font-medium text-foreground">{member?.membership_type || 'Regular'}</span>
            </div>

            {member?.member_id && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Member ID</span>
                <span className="font-medium text-foreground">{member.member_id}</span>
              </div>
            )}

            {member?.chapter && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Chapter</span>
                <span className="font-medium text-foreground">{member.chapter}</span>
              </div>
            )}

            <div className="pt-4 border-t border-border/50">
              {member?.status === 'active' ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      <UserMinus className="h-4 w-4 mr-2" />
                      Deactivate User
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will deactivate the user&apos;s account. They will not be able to
                        access the admin panel. Are you sure?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeactivate}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Deactivate
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  variant="outline"
                  className="w-full text-primary hover:text-primary/90"
                  onClick={handleReactivate}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Reactivate User
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Timestamps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Account Created</p>
              <p className="font-medium text-foreground">
                {user.created_at
                  ? format(new Date(user.created_at), 'PPpp')
                  : '-'}
              </p>
            </div>

            {member?.joined_at && (
              <div>
                <p className="text-sm text-muted-foreground">Membership Started</p>
                <p className="font-medium text-foreground">
                  {format(new Date(member.joined_at), 'PPpp')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
