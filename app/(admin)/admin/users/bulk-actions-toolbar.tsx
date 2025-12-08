'use client'

import { useState, useTransition } from 'react'
import { usePermission } from '@/lib/hooks/use-permissions'
import { Button } from '@/components/ui/button'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, UserMinus, Shield, X, Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { bulkAssignRole, bulkActivateUsers, bulkDeactivateUsers, exportUsersToCSV } from '@/app/actions/users'

interface BulkActionsToolbarProps {
  selectedCount: number
  selectedUserIds: string[]
  roles: Array<{ id: string; name: string; display_name: string }>
  onClearSelection: () => void
  onActionComplete: () => void
}

export function BulkActionsToolbar({
  selectedCount,
  selectedUserIds,
  roles,
  onClearSelection,
  onActionComplete,
}: BulkActionsToolbarProps) {
  const [isPending, startTransition] = useTransition()
  const [showAssignRoleDialog, setShowAssignRoleDialog] = useState(false)
  const [showActivateDialog, setShowActivateDialog] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState('')

  // Permission checks for UI hiding
  const { hasPermission: canAssignRoles } = usePermission('users:roles:assign')
  const { hasPermission: canManageStatus } = usePermission('users:profiles:delete')

  const handleAssignRole = async () => {
    if (!selectedRoleId) {
      toast.error('Please select a role')
      return
    }

    startTransition(async () => {
      const result = await bulkAssignRole(selectedUserIds, selectedRoleId)
      if (result.success) {
        toast.success(result.message)
        setShowAssignRoleDialog(false)
        setSelectedRoleId('')
        onClearSelection()
        onActionComplete()
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleActivate = async () => {
    startTransition(async () => {
      const result = await bulkActivateUsers(selectedUserIds)
      if (result.success) {
        toast.success(result.message)
        setShowActivateDialog(false)
        onClearSelection()
        onActionComplete()
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleDeactivate = async () => {
    startTransition(async () => {
      const result = await bulkDeactivateUsers(selectedUserIds)
      if (result.success) {
        toast.success(result.message)
        setShowDeactivateDialog(false)
        onClearSelection()
        onActionComplete()
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleExportSelected = async () => {
    startTransition(async () => {
      try {
        const csvContent = await exportUsersToCSV({ userIds: selectedUserIds })

        // Download the CSV
        const bom = '\uFEFF'
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success(`Exported ${selectedUserIds.length} users`)
      } catch (error) {
        toast.error('Failed to export users')
      }
    })
  }

  if (selectedCount === 0) return null

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl animate-in slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium text-primary">
            {selectedCount} selected
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 hover:bg-primary/20"
            onClick={onClearSelection}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          {canAssignRoles && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowAssignRoleDialog(true)}
              disabled={isPending}
            >
              <Shield className="h-4 w-4" />
              Assign Role
            </Button>
          )}

          {canManageStatus && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
              onClick={() => setShowActivateDialog(true)}
              disabled={isPending}
            >
              <UserPlus className="h-4 w-4" />
              Activate
            </Button>
          )}

          {canManageStatus && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={() => setShowDeactivateDialog(true)}
              disabled={isPending}
            >
              <UserMinus className="h-4 w-4" />
              Deactivate
            </Button>
          )}

          <div className="h-6 w-px bg-border" />

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportSelected}
            disabled={isPending}
          >
            <Download className="h-4 w-4" />
            Export Selected
          </Button>
        </div>
      </div>

      {/* Assign Role Dialog */}
      <Dialog open={showAssignRoleDialog} onOpenChange={setShowAssignRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role to {selectedCount} Users</DialogTitle>
            <DialogDescription>
              Select a role to assign to all selected users. Users who already have this role will be skipped.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAssignRoleDialog(false)
                setSelectedRoleId('')
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={isPending || !selectedRoleId}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Confirmation Dialog */}
      <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate {selectedCount} Users?</AlertDialogTitle>
            <AlertDialogDescription>
              This will set the status of all selected users to &quot;Active&quot;. They will be able to access their accounts and the admin panel based on their permissions.
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
              Activate Users
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate {selectedCount} Users?</AlertDialogTitle>
            <AlertDialogDescription>
              This will set the status of all selected users to &quot;Inactive&quot;. They will no longer be able to access the admin panel. This action can be reversed.
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
              Deactivate Users
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
