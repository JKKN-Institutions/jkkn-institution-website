'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { updateRole } from '@/app/actions/roles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, XCircle, Lock } from 'lucide-react'
import { toast } from 'sonner'

interface RoleEditFormProps {
  role: {
    id: string
    name: string
    display_name: string
    description: string | null
    is_system_role: boolean | null
  }
}

function SubmitButton({ isSystemRole }: { isSystemRole: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending || isSystemRole} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving Changes...
        </>
      ) : (
        'Save Changes'
      )}
    </Button>
  )
}

export function RoleEditForm({ role }: RoleEditFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(updateRole, {})

  const isSystemRole = role.is_system_role || false

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Role updated successfully!')
      setTimeout(() => {
        router.push(`/admin/roles/${role.id}`)
      }, 1500)
    }
  }, [state.success, state.message, router, role.id])

  if (isSystemRole) {
    return (
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
        <Lock className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-900 dark:text-amber-200">
          This is a system role and cannot be modified. System roles are essential for the
          application&apos;s security and functionality.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden ID */}
      <input type="hidden" name="id" value={role.id} />

      {/* Status Messages */}
      {state.message && !state.success && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/10">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.success && (
        <Alert className="border-primary/50 bg-primary/5">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            {state.message || 'Role updated successfully! Redirecting...'}
          </AlertDescription>
        </Alert>
      )}

      {/* Role Name (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Role Name (System Key)
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={role.name}
          disabled
          className="bg-muted/50 cursor-not-allowed font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Role name cannot be changed after creation
        </p>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="display_name" className="text-foreground">
          Display Name
        </Label>
        <Input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={role.display_name}
          placeholder="Content Editor"
          required
          maxLength={100}
          className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20"
          aria-invalid={!!state.errors?.display_name}
          aria-describedby={state.errors?.display_name ? 'display-name-error' : undefined}
        />
        {state.errors?.display_name && (
          <p id="display-name-error" className="text-sm text-red-600 dark:text-red-400">
            {state.errors.display_name[0]}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={role.description || ''}
          placeholder="Describe the responsibilities and scope of this role..."
          rows={4}
          className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Submit Buttons */}
      <div className="pt-4 flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/roles/${role.id}`)}
          className="flex-1"
        >
          Cancel
        </Button>
        <div className="flex-1">
          <SubmitButton isSystemRole={isSystemRole} />
        </div>
      </div>
    </form>
  )
}
