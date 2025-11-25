'use client'

import { useState, useActionState, useTransition } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { addPermissionToRole, removePermissionFromRole } from '@/app/actions/roles'
import { Check, Loader2, XCircle, Shield, Lock } from 'lucide-react'
import { toast } from 'sonner'

interface PermissionMatrixProps {
  roleId: string
  roleName: string
  currentPermissions: string[]
  availablePermissions: Array<{
    permission: string
    label: string
    module: string
  }>
  isSystemRole?: boolean
}

export function PermissionMatrix({
  roleId,
  roleName,
  currentPermissions,
  availablePermissions,
  isSystemRole = false,
}: PermissionMatrixProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(currentPermissions)
  )

  // Group permissions by module
  const permissionsByModule = availablePermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = []
    }
    acc[perm.module].push(perm)
    return {}
  }, {} as Record<string, typeof availablePermissions>)

  const modules = Object.keys(permissionsByModule).sort()

  const handleTogglePermission = async (permission: string, checked: boolean) => {
    if (isSystemRole && roleName === 'super_admin') {
      toast.error('Cannot modify super_admin permissions')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append('roleId', roleId)
      formData.append('permission', permission)

      let result

      if (checked) {
        // Add permission
        setSelectedPermissions((prev) => new Set(prev).add(permission))
        result = await addPermissionToRole({}, formData)
      } else {
        // Remove permission
        setSelectedPermissions((prev) => {
          const newSet = new Set(prev)
          newSet.delete(permission)
          return newSet
        })
        result = await removePermissionFromRole({}, formData)
      }

      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
        // Revert on error
        if (checked) {
          setSelectedPermissions((prev) => {
            const newSet = new Set(prev)
            newSet.delete(permission)
            return newSet
          })
        } else {
          setSelectedPermissions((prev) => new Set(prev).add(permission))
        }
      }
    })
  }

  const isPermissionDisabled = (permission: string) => {
    return (
      isSystemRole ||
      isPending ||
      (roleName === 'super_admin' && permission === '*:*:*')
    )
  }

  if (isSystemRole) {
    return (
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
        <Lock className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-900 dark:text-amber-200">
          System roles cannot be modified. Their permissions are managed by the system.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-medium text-foreground">
            {selectedPermissions.size} permissions selected
          </span>
        </div>
        {isPending && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
          </div>
        )}
      </div>

      {/* Permission Accordion by Module */}
      <Accordion type="multiple" className="space-y-2">
        {modules.map((module) => {
          const modulePermissions = permissionsByModule[module] || []
          const moduleSelectedCount = modulePermissions.filter((p) =>
            selectedPermissions.has(p.permission)
          ).length

          return (
            <AccordionItem
              key={module}
              value={module}
              className="glass-card border-0 rounded-xl overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center justify-between flex-1 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <h4 className="font-semibold capitalize text-foreground">
                        {module} Module
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {moduleSelectedCount} of {modulePermissions.length} selected
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="grid gap-3">
                  {modulePermissions.map((perm) => {
                    const isChecked = selectedPermissions.has(perm.permission)
                    const isDisabled = isPermissionDisabled(perm.permission)

                    return (
                      <div
                        key={perm.permission}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <Checkbox
                          id={perm.permission}
                          checked={isChecked}
                          disabled={isDisabled}
                          onCheckedChange={(checked) =>
                            handleTogglePermission(perm.permission, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={perm.permission}
                          className={`flex-1 cursor-pointer ${
                            isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <span className="font-medium text-foreground block">
                            {perm.label}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {perm.permission}
                          </span>
                        </Label>
                        {isChecked && (
                          <div className="flex items-center gap-1 text-primary text-xs">
                            <Check className="h-3 w-3" />
                            Active
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {modules.length === 0 && (
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            No permissions available. Please check the permission configuration.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
