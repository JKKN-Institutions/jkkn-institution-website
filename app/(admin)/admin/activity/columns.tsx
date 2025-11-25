'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

export type ActivityLogRow = {
  id: string
  user_id: string | null
  action: string
  module: string
  resource_type: string | null
  resource_id: string | null
  metadata: Record<string, any> | null
  ip_address: string | null
  created_at: string
  profiles: {
    full_name: string | null
    email: string
    avatar_url: string | null
  } | null
}

const getActionColor = (action: string) => {
  switch (action.toLowerCase()) {
    case 'create':
      return 'bg-primary/10 text-primary border-primary/20'
    case 'edit':
    case 'update':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
    case 'delete':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
    case 'view':
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800'
    case 'login':
      return 'bg-primary/10 text-primary border-primary/20'
    case 'logout':
      return 'bg-secondary/20 text-secondary-foreground border-secondary/30'
    case 'assign_role':
    case 'remove_role':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

const getModuleColor = (module: string) => {
  switch (module.toLowerCase()) {
    case 'users':
      return 'bg-primary/10 text-primary'
    case 'content':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    case 'dashboard':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    case 'system':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export const columns: ColumnDef<ActivityLogRow>[] = [
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => {
      const user = row.original.profiles
      const initials = user?.full_name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || user?.email[0].toUpperCase() || '?'

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm text-foreground">
              {user?.full_name || 'Unknown User'}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email || 'N/A'}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      const action = row.original.action
      return (
        <Badge variant="outline" className={getActionColor(action)}>
          {action.replace('_', ' ').toUpperCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'module',
    header: 'Module',
    cell: ({ row }) => {
      const module = row.original.module
      return (
        <Badge variant="secondary" className={getModuleColor(module)}>
          {module.charAt(0).toUpperCase() + module.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'resource_type',
    header: 'Resource',
    cell: ({ row }) => {
      const resourceType = row.original.resource_type
      return (
        <span className="text-sm text-muted-foreground">
          {resourceType || 'N/A'}
        </span>
      )
    },
  },
  {
    accessorKey: 'metadata',
    header: 'Details',
    cell: ({ row }) => {
      const metadata = row.original.metadata

      if (!metadata || Object.keys(metadata).length === 0) {
        return <span className="text-xs text-muted-foreground">No details</span>
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                <Info className="h-3 w-3" />
                View Details
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <pre className="text-xs">{JSON.stringify(metadata, null, 2)}</pre>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: 'ip_address',
    header: 'IP Address',
    cell: ({ row }) => {
      const ip = row.original.ip_address
      return (
        <span className="text-xs font-mono text-muted-foreground">{ip || 'N/A'}</span>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Date & Time',
    cell: ({ row }) => {
      const date = row.original.created_at
      return (
        <div className="text-xs">
          <p className="font-medium text-foreground">
            {format(new Date(date), 'MMM d, yyyy')}
          </p>
          <p className="text-muted-foreground">{format(new Date(date), 'h:mm a')}</p>
        </div>
      )
    },
  },
]
