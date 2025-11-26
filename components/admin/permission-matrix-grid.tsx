'use client'

import { useState, useTransition, useMemo, Fragment } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Loader2, Lock, Info } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Role {
  id: string
  name: string
  display_name: string
  is_system_role: boolean | null
  permissions: string[]
}

interface PermissionMatrixGridProps {
  roles: Role[]
  onPermissionToggle: (roleId: string, permission: string, hasPermission: boolean) => Promise<{ success?: boolean; message?: string }>
}

// Permission definitions grouped by module
const PERMISSION_GROUPS = [
  {
    module: 'users',
    label: 'User Management',
    permissions: [
      { key: 'users:profiles:view', label: 'View Profiles' },
      { key: 'users:profiles:create', label: 'Create Users' },
      { key: 'users:profiles:edit', label: 'Edit Profiles' },
      { key: 'users:profiles:delete', label: 'Delete/Deactivate' },
      { key: 'users:roles:view', label: 'View Roles' },
      { key: 'users:roles:create', label: 'Create Roles' },
      { key: 'users:roles:edit', label: 'Edit Roles' },
      { key: 'users:roles:delete', label: 'Delete Roles' },
      { key: 'users:roles:assign', label: 'Assign Roles' },
      { key: 'users:permissions:view', label: 'View Permissions' },
      { key: 'users:permissions:edit', label: 'Edit Permissions' },
      { key: 'users:activity:view', label: 'View Activity' },
      { key: 'users:emails:view', label: 'View Approved Emails' },
      { key: 'users:emails:create', label: 'Add Approved Emails' },
      { key: 'users:emails:delete', label: 'Remove Approved Emails' },
    ],
  },
  {
    module: 'content',
    label: 'Content Management',
    permissions: [
      { key: 'content:pages:view', label: 'View Pages' },
      { key: 'content:pages:create', label: 'Create Pages' },
      { key: 'content:pages:edit', label: 'Edit Pages' },
      { key: 'content:pages:delete', label: 'Delete Pages' },
      { key: 'content:pages:publish', label: 'Publish Pages' },
      { key: 'content:media:view', label: 'View Media' },
      { key: 'content:media:upload', label: 'Upload Media' },
      { key: 'content:media:delete', label: 'Delete Media' },
      { key: 'content:templates:view', label: 'View Templates' },
      { key: 'content:templates:create', label: 'Create Templates' },
      { key: 'content:templates:edit', label: 'Edit Templates' },
      { key: 'content:templates:delete', label: 'Delete Templates' },
    ],
  },
  {
    module: 'dashboard',
    label: 'Dashboard',
    permissions: [
      { key: 'dashboard:widgets:view', label: 'View Widgets' },
      { key: 'dashboard:widgets:customize', label: 'Customize Widgets' },
      { key: 'dashboard:analytics:view', label: 'View Analytics' },
      { key: 'dashboard:reports:view', label: 'View Reports' },
      { key: 'dashboard:reports:export', label: 'Export Reports' },
    ],
  },
  {
    module: 'system',
    label: 'System',
    permissions: [
      { key: 'system:modules:view', label: 'View Modules' },
      { key: 'system:modules:toggle', label: 'Toggle Modules' },
      { key: 'system:settings:view', label: 'View Settings' },
      { key: 'system:settings:edit', label: 'Edit Settings' },
    ],
  },
]

// Role colors for visual distinction
const getRoleColor = (roleName: string) => {
  switch (roleName) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    case 'director':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'chair':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
    case 'member':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'guest':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

export function PermissionMatrixGrid({ roles, onPermissionToggle }: PermissionMatrixGridProps) {
  const [isPending, startTransition] = useTransition()
  const [loadingCell, setLoadingCell] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(PERMISSION_GROUPS.map((g) => g.module))
  )

  // Check if role has permission (including wildcards)
  const hasPermission = (role: Role, permission: string): boolean => {
    if (role.permissions.includes('*:*:*')) return true

    const [module, resource, action] = permission.split(':')

    // Check for module wildcard
    if (role.permissions.includes(`${module}:*:*`)) return true

    // Check for resource wildcard
    if (role.permissions.includes(`${module}:${resource}:*`)) return true

    // Check for exact permission
    return role.permissions.includes(permission)
  }

  // Check if permission is granted via wildcard (not directly)
  const isWildcardPermission = (role: Role, permission: string): boolean => {
    if (role.permissions.includes(permission)) return false

    const [module, resource] = permission.split(':')

    return (
      role.permissions.includes('*:*:*') ||
      role.permissions.includes(`${module}:*:*`) ||
      role.permissions.includes(`${module}:${resource}:*`)
    )
  }

  // Handle checkbox change
  const handleToggle = async (role: Role, permission: string, currentlyHas: boolean) => {
    // Don't allow changes to system roles or wildcard-granted permissions
    if (role.is_system_role || isWildcardPermission(role, permission)) {
      return
    }

    const cellKey = `${role.id}-${permission}`
    setLoadingCell(cellKey)

    startTransition(async () => {
      const result = await onPermissionToggle(role.id, permission, currentlyHas)

      if (result.success) {
        toast.success(result.message || `Permission ${currentlyHas ? 'removed' : 'added'}`)
      } else {
        toast.error(result.message || 'Failed to update permission')
      }

      setLoadingCell(null)
    })
  }

  // Toggle module expansion
  const toggleModule = (module: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(module)) {
        next.delete(module)
      } else {
        next.add(module)
      }
      return next
    })
  }

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 bg-card z-10 text-left p-3 min-w-[200px]">
                <span className="text-sm font-semibold text-foreground">Permission</span>
              </th>
              {roles.map((role) => (
                <th key={role.id} className="p-3 text-center min-w-[100px]">
                  <div className="flex flex-col items-center gap-1">
                    <Badge
                      variant="secondary"
                      className={cn('text-xs whitespace-nowrap', getRoleColor(role.name))}
                    >
                      {role.display_name}
                    </Badge>
                    {role.is_system_role && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>System role - cannot be modified</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSION_GROUPS.map((group) => (
              <Fragment key={group.module}>
                {/* Module Header Row */}
                <tr
                  className="bg-muted/50 cursor-pointer hover:bg-muted/70"
                  onClick={() => toggleModule(group.module)}
                >
                  <td
                    colSpan={roles.length + 1}
                    className="sticky left-0 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'transition-transform duration-200',
                        expandedModules.has(group.module) ? 'rotate-90' : ''
                      )}>
                        ▶
                      </span>
                      <span className="font-semibold text-sm text-foreground">
                        {group.label}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {group.permissions.length}
                      </Badge>
                    </div>
                  </td>
                </tr>

                {/* Permission Rows */}
                {expandedModules.has(group.module) &&
                  group.permissions.map((permission, idx) => (
                    <tr
                      key={permission.key}
                      className={cn(
                        'border-b border-border/50 hover:bg-muted/30 transition-colors',
                        idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                      )}
                    >
                      <td className="sticky left-0 bg-inherit p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">{permission.label}</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <code className="text-xs">{permission.key}</code>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>

                      {roles.map((role) => {
                        const has = hasPermission(role, permission.key)
                        const isWildcard = isWildcardPermission(role, permission.key)
                        const cellKey = `${role.id}-${permission.key}`
                        const isLoading = loadingCell === cellKey

                        return (
                          <td key={cellKey} className="p-3 text-center">
                            {isLoading ? (
                              <div className="flex justify-center">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              </div>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={has}
                                      disabled={role.is_system_role || isWildcard || isPending}
                                      onCheckedChange={() => handleToggle(role, permission.key, has)}
                                      className={cn(
                                        isWildcard && 'opacity-50 cursor-not-allowed',
                                        role.is_system_role && 'cursor-not-allowed'
                                      )}
                                    />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {role.is_system_role
                                    ? 'System role - cannot modify'
                                    : isWildcard
                                      ? 'Granted via wildcard permission'
                                      : has
                                        ? 'Click to remove permission'
                                        : 'Click to grant permission'}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Checkbox checked disabled className="opacity-50" />
          <span>Granted via wildcard</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-3 w-3" />
          <span>System role (read-only)</span>
        </div>
      </div>
    </TooltipProvider>
  )
}
