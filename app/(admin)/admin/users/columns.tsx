'use client'

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
import { MoreHorizontal, Eye, Edit, UserMinus, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'

export type UserRow = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  department: string | null
  designation: string | null
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

const getStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    case 'suspended':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getRoleColor = (roleName: string | null | undefined) => {
  switch (roleName) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-800'
    case 'director':
      return 'bg-blue-100 text-blue-800'
    case 'chair':
      return 'bg-indigo-100 text-indigo-800'
    case 'member':
      return 'bg-green-100 text-green-800'
    case 'guest':
      return 'bg-amber-100 text-amber-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

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
        .toUpperCase() || user.email[0].toUpperCase()

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || ''} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {user.full_name || 'No name'}
            </span>
            <span className="text-sm text-gray-500">{user.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'department',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    cell: ({ row }) => {
      const department = row.getValue('department') as string | null
      const designation = row.original.designation

      return (
        <div className="flex flex-col">
          <span className="text-gray-900">{department || '-'}</span>
          {designation && <span className="text-sm text-gray-500">{designation}</span>}
        </div>
      )
    },
  },
  {
    id: 'roles',
    header: 'Roles',
    cell: ({ row }) => {
      const userRoles = row.original.user_roles || []

      return (
        <div className="flex flex-wrap gap-1">
          {userRoles.length > 0 ? (
            userRoles.slice(0, 2).map((ur) => (
              <Badge
                key={ur.id}
                variant="secondary"
                className={getRoleColor(ur.roles?.name)}
              >
                {ur.roles?.display_name || 'Unknown'}
              </Badge>
            ))
          ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              No role
            </Badge>
          )}
          {userRoles.length > 2 && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              +{userRoles.length - 2}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const member = row.original.members?.[0]
      const status = member?.status || 'pending'

      return (
        <Badge variant="secondary" className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string | null
      if (!date) return <span className="text-gray-500">-</span>

      return (
        <span className="text-gray-600">
          {format(new Date(date), 'MMM d, yyyy')}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original
      const member = user.members?.[0]
      const isActive = member?.status === 'active'

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
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
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit user
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isActive ? (
              <DropdownMenuItem className="text-red-600">
                <UserMinus className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-green-600">
                <UserPlus className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
