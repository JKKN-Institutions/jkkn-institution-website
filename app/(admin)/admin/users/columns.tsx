'use client'

import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { MoreHorizontal, Eye, Edit, UserMinus, UserPlus, Loader2, Check, X, AlertCircle, Clock, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDistanceToNow } from 'date-fns'
import { deactivateUser, reactivateUser, deleteUser } from '@/app/actions/users'
import { toast } from 'sonner'
import { usePermission, useRole } from '@/lib/hooks/use-permissions'
import { EditUserModal } from './edit-user-modal'

export type UserRow = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  department: string | null
  designation: string | null
  last_login_at: string | null
  created_at: string | null
  members: Array<{
    id: string
    member_id: string | null
    chapter: string | null
    status: string | null
    membership_type: string | null
  }> | null
  user_roles: Array<{
    id: string
    roles: {
      id: string
      name: string
      display_name: string
    } | null
  }> | null
}

// Role badge - single green/teal color scheme for all roles (matching target design)

export const columns: ColumnDef<UserRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'full_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    cell: ({ row }) => {
      const user = row.original
      const initials = user.full_name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || user.email.slice(0, 2).toUpperCase()

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.avatar_url || undefined}
              alt={user.full_name || ''}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-foreground truncate">
              {user.full_name || 'No name'}
            </span>
            <span className="text-sm text-muted-foreground truncate">{user.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    id: 'roles',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const userRoles = row.original.user_roles || []
      const primaryRole = userRoles[0]?.roles

      if (!primaryRole) {
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            No role
          </Badge>
        )
      }

      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
        >
          {primaryRole.display_name}
        </Badge>
      )
    },
  },
  {
    id: 'institution',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Institution" />,
    cell: ({ row }) => {
      const member = row.original.members?.[0]
      const chapter = member?.chapter

      if (!chapter) {
        return <span className="text-muted-foreground">—</span>
      }

      return (
        <span className="text-foreground text-sm">{chapter}</span>
      )
    },
  },
  {
    accessorKey: 'department',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    cell: ({ row }) => {
      const department = row.getValue('department') as string | null

      if (!department) {
        return <span className="text-muted-foreground">—</span>
      }

      return (
        <span className="text-foreground text-sm">{department}</span>
      )
    },
  },
  {
    id: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const member = row.original.members?.[0]
      const status = member?.status || 'pending'

      if (status === 'active') {
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 gap-1 font-normal">
            <Check className="h-3 w-3" />
            Active
          </Badge>
        )
      }

      if (status === 'inactive') {
        return (
          <Badge variant="secondary" className="gap-1 font-normal">
            <X className="h-3 w-3" />
            Inactive
          </Badge>
        )
      }

      if (status === 'suspended') {
        return (
          <Badge variant="destructive" className="gap-1 font-normal">
            <AlertCircle className="h-3 w-3" />
            Suspended
          </Badge>
        )
      }

      return (
        <Badge variant="outline" className="gap-1 font-normal text-yellow-700 bg-yellow-50 border-yellow-200">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    },
  },
  {
    accessorKey: 'last_login_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Login" />,
    cell: ({ row }) => {
      const lastLogin = row.getValue('last_login_at') as string | null

      if (!lastLogin) {
        return <span className="text-muted-foreground">Never</span>
      }

      return (
        <span className="text-muted-foreground text-sm" suppressHydrationWarning>
          {formatDistanceToNow(new Date(lastLogin), { addSuffix: false })}
        </span>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string | null
      if (!date) return <span className="text-muted-foreground">—</span>

      return (
        <span className="text-muted-foreground text-sm" suppressHydrationWarning>
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell user={row.original} />,
  },
]

// Separate component to handle state for dialogs
function ActionCell({ user }: { user: UserRow }) {
  const router = useRouter()
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [showActivateDialog, setShowActivateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isPending, setIsPending] = useState(false)

  // Permission checks for UI hiding
  const { hasPermission: canEdit } = usePermission('users:profiles:edit')
  const { hasPermission: canManageStatusPerm } = usePermission('users:profiles:delete')
  const { hasRole: isSuperAdmin } = useRole('super_admin')

  // Super admin can always manage status, or if user has explicit permission
  const canManageStatus = isSuperAdmin || canManageStatusPerm

  const member = user.members?.[0]
  const isActive = member?.status === 'active'

  const handleDeactivate = async () => {
    setIsPending(true)
    const result = await deactivateUser(user.id)
    setIsPending(false)
    setShowDeactivateDialog(false)

    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleActivate = async () => {
    setIsPending(true)
    const result = await reactivateUser(user.id)
    setIsPending(false)
    setShowActivateDialog(false)

    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleDelete = async () => {
    setIsPending(true)
    const result = await deleteUser(user.id)
    setIsPending(false)
    setShowDeleteDialog(false)

    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${user.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </Link>
          </DropdownMenuItem>
          {canEdit && (
            <DropdownMenuItem onClick={() => setShowEditModal(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit user
            </DropdownMenuItem>
          )}
          {canManageStatus && <DropdownMenuSeparator />}
          {canManageStatus && isActive && (
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={() => setShowDeactivateDialog(true)}
            >
              <UserMinus className="mr-2 h-4 w-4" />
              Deactivate
            </DropdownMenuItem>
          )}
          {canManageStatus && !isActive && (
            <DropdownMenuItem
              className="text-green-600 cursor-pointer"
              onClick={() => setShowActivateDialog(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Activate
            </DropdownMenuItem>
          )}
          {isSuperAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Permanently
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit User Modal */}
      <EditUserModal
        user={user}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate <strong>{user.full_name || user.email}</strong>?
              They will no longer be able to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Confirmation Dialog */}
      <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate <strong>{user.full_name || user.email}</strong>?
              They will regain access to the admin panel based on their permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActivate}
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              ⚠️ Permanently Delete User
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <span className="block font-semibold text-foreground">
                Are you ABSOLUTELY sure you want to delete{' '}
                <strong>{user.full_name || user.email}</strong>?
              </span>
              <div className="space-y-2">
                <span className="block font-medium">This action will:</span>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Permanently remove the user from auth.users</li>
                  <li>Delete their profile and member records</li>
                  <li>Remove all role assignments</li>
                  <li>Cannot be undone</li>
                </ul>
              </div>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <span className="block text-destructive font-semibold text-sm">
                  ⚠️ This is IRREVERSIBLE. Consider using "Deactivate" instead.
                </span>
              </div>
            </AlertDialogDescription>          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
