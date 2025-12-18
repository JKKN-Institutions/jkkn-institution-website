'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Trash2, Loader2 } from 'lucide-react'
import { deleteUser } from '@/app/actions/users'
import { toast } from 'sonner'
import { useRole } from '@/lib/hooks/use-permissions'

interface DeleteUserButtonProps {
  userId: string
  userEmail: string
  userName: string | null
  currentUserId: string
}

export function DeleteUserButton({
  userId,
  userEmail,
  userName,
  currentUserId,
}: DeleteUserButtonProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const { hasRole: isSuperAdmin, isLoading } = useRole('super_admin')

  // Don't show button if not super admin or if trying to delete yourself
  if (isLoading || !isSuperAdmin || userId === currentUserId) {
    return null
  }

  const handleDelete = async () => {
    setIsPending(true)
    const result = await deleteUser(userId)
    setIsPending(false)
    setShowDeleteDialog(false)

    if (result.success) {
      toast.success(result.message)
      // Redirect to users list after deletion
      router.push('/admin/users')
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setShowDeleteDialog(true)}
        className="shadow-sm"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete User
      </Button>

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
                <strong>{userName || userEmail}</strong>?
              </span>
              <div className="space-y-2">
                <span className="block font-medium">This action will:</span>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Permanently remove the user from auth.users</li>
                  <li>Delete their profile and member records</li>
                  <li>Remove all role assignments</li>
                  <li>Delete all associated data</li>
                  <li>Cannot be undone</li>
                </ul>
              </div>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <span className="block text-destructive font-semibold text-sm">
                  ⚠️ This is IRREVERSIBLE. The user data will be archived but cannot be restored.
                </span>
                <span className="block text-destructive text-sm mt-1">
                  Consider using "Deactivate" in the users list instead if you might need to reactivate this user.
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
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
