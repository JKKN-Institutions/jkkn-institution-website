'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Key, Plus, X, Search, Lock } from 'lucide-react'
import { addPermissionToRole, removePermissionFromRole } from '@/app/actions/roles'
import { toast } from 'sonner'

interface RoleDetailViewProps {
  role: {
    id: string
    name: string
    display_name: string
    description: string | null
    is_system_role: boolean | null
    permissions: string[]
  }
  availablePermissions: Array<{
    permission: string
    label: string
    module: string
  }>
}

export function RoleDetailView({ role, availablePermissions }: RoleDetailViewProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  // Group permissions by module
  const groupedPermissions = availablePermissions.reduce(
    (acc, perm) => {
      if (!acc[perm.module]) {
        acc[perm.module] = []
      }
      acc[perm.module].push(perm)
      return acc
    },
    {} as Record<string, typeof availablePermissions>
  )

  // Filter permissions by search
  const filteredModules = Object.entries(groupedPermissions).filter(([module, perms]) => {
    if (!search) return true
    return (
      module.toLowerCase().includes(search.toLowerCase()) ||
      perms.some(
        (p) =>
          p.permission.toLowerCase().includes(search.toLowerCase()) ||
          p.label.toLowerCase().includes(search.toLowerCase())
      )
    )
  })

  const handleAddPermission = async (permission: string) => {
    setIsUpdating(permission)
    const formData = new FormData()
    formData.append('roleId', role.id)
    formData.append('permission', permission)

    const result = await addPermissionToRole({}, formData)

    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }

    setIsUpdating(null)
  }

  const handleRemovePermission = async (permission: string) => {
    setIsUpdating(permission)
    const formData = new FormData()
    formData.append('roleId', role.id)
    formData.append('permission', permission)

    const result = await removePermissionFromRole({}, formData)

    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }

    setIsUpdating(null)
  }

  const hasPermission = (permission: string) => {
    // Check exact match
    if (role.permissions.includes(permission)) return true

    // Check if covered by wildcard
    const [module, resource, action] = permission.split(':')

    for (const perm of role.permissions) {
      const [permModule, permResource, permAction] = perm.split(':')

      if (permModule === '*' && permResource === '*' && permAction === '*') return true
      if (permModule === module && permResource === '*' && permAction === '*') return true
      if (permModule === module && permResource === resource && permAction === '*') return true
    }

    return false
  }

  const isWildcard = (permission: string) => permission.includes('*')

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Permissions Management */}
      <div className="lg:col-span-2">
        <Card className="glass-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Permissions</CardTitle>
                <CardDescription>
                  {role.is_system_role
                    ? 'System roles have limited permission editing'
                    : 'Manage permissions for this role'}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Key className="h-3 w-3 mr-1" />
                {role.permissions.length} assigned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/50 border-border/50 rounded-xl focus:border-primary/30 focus:ring-primary/20"
              />
            </div>

            {/* Permission Groups */}
            <div className="space-y-6">
              {filteredModules.map(([module, perms]) => (
                <div key={module}>
                  <h3 className="text-sm font-semibold text-foreground capitalize mb-3">
                    {module} Module
                  </h3>
                  <div className="space-y-2">
                    {perms
                      .filter((p) => {
                        if (!search) return true
                        return (
                          p.permission.toLowerCase().includes(search.toLowerCase()) ||
                          p.label.toLowerCase().includes(search.toLowerCase())
                        )
                      })
                      .map((perm, index) => {
                        const isAssigned = hasPermission(perm.permission)
                        const isWc = isWildcard(perm.permission)
                        const isDisabled =
                          isUpdating === perm.permission ||
                          (role.name === 'super_admin' && perm.permission === '*:*:*')

                        return (
                          <div
                            key={`${module}-${perm.permission}-${index}`}
                            className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`${module}-${perm.permission}-${index}`}
                                checked={isAssigned}
                                disabled={isDisabled}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleAddPermission(perm.permission)
                                  } else {
                                    handleRemovePermission(perm.permission)
                                  }
                                }}
                              />
                              <div>
                                <label
                                  htmlFor={`${module}-${perm.permission}-${index}`}
                                  className="text-sm font-medium cursor-pointer text-foreground"
                                >
                                  {perm.label}
                                </label>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {perm.permission}
                                </p>
                              </div>
                            </div>
                            {isWc && (
                              <Badge variant="secondary" className="text-xs bg-secondary/20">
                                Wildcard
                              </Badge>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>
              ))}

              {filteredModules.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No permissions found matching &quot;{search}&quot;
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Role Info */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Role Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Display Name</p>
              <p className="font-medium text-foreground">{role.display_name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">System Name</p>
              <Badge variant="secondary" className="font-mono bg-muted">
                {role.name}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant={role.is_system_role ? 'default' : 'secondary'} className={role.is_system_role ? 'bg-purple-600' : ''}>
                {role.is_system_role && <Lock className="h-3 w-3 mr-1" />}
                {role.is_system_role ? 'System Role' : 'Custom Role'}
              </Badge>
            </div>

            {role.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm text-foreground">{role.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Permissions */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Assigned Permissions</CardTitle>
            <CardDescription>Quick view of assigned permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {role.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm) => (
                  <Badge
                    key={perm}
                    variant="secondary"
                    className="text-xs font-mono flex items-center gap-1 bg-primary/10 text-primary"
                  >
                    {perm}
                    {!role.is_system_role && perm !== '*:*:*' && (
                      <button
                        onClick={() => handleRemovePermission(perm)}
                        className="ml-1 hover:text-red-500 dark:hover:text-red-400"
                        disabled={isUpdating === perm}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No permissions assigned
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
