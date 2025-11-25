'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { createRole } from '@/app/actions/roles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, XCircle, Info } from 'lucide-react'
import { toast } from 'sonner'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Role...
        </>
      ) : (
        'Create Role'
      )}
    </Button>
  )
}

export function RoleCreateForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(createRole, {})

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Role created successfully!')
      setTimeout(() => {
        router.push('/admin/roles')
      }, 1500)
    }
  }, [state.success, state.message, router])

  return (
    <form action={formAction} className="space-y-6">
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
            {state.message || 'Role created successfully! Redirecting...'}
          </AlertDescription>
        </Alert>
      )}

      {/* Role Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Role Name (System Key) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="content_editor"
          required
          pattern="[a-z_]+"
          className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20 font-mono"
          aria-invalid={!!state.errors?.name}
          aria-describedby={state.errors?.name ? 'name-error' : 'name-help'}
        />
        {state.errors?.name && (
          <p id="name-error" className="text-sm text-red-600 dark:text-red-400">
            {state.errors.name[0]}
          </p>
        )}
        <p id="name-help" className="text-xs text-muted-foreground">
          Lowercase letters and underscores only (e.g., content_editor, department_head)
        </p>
      </div>

      {/* Display Name Field */}
      <div className="space-y-2">
        <Label htmlFor="display_name" className="text-foreground">
          Display Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="display_name"
          name="display_name"
          type="text"
          placeholder="Content Editor"
          required
          maxLength={100}
          className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20"
          aria-invalid={!!state.errors?.display_name}
          aria-describedby={state.errors?.display_name ? 'display-name-error' : 'display-name-help'}
        />
        {state.errors?.display_name && (
          <p id="display-name-error" className="text-sm text-red-600 dark:text-red-400">
            {state.errors.display_name[0]}
          </p>
        )}
        <p id="display-name-help" className="text-xs text-muted-foreground">
          Human-readable name shown in the UI (e.g., Content Editor, Department Head)
        </p>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the responsibilities and scope of this role..."
          rows={4}
          className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20 resize-none"
          aria-describedby="description-help"
        />
        <p id="description-help" className="text-xs text-muted-foreground">
          Explain what this role can do and who should have it
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <div className="flex-1">
          <SubmitButton />
        </div>
      </div>

      {/* Info Box */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-900 dark:text-blue-200">
          <strong className="font-semibold">Next step:</strong> After creating the role, you&apos;ll be able
          to assign permissions on the role detail page.
        </AlertDescription>
      </Alert>

      {/* Help Text */}
      <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
        <h4 className="font-medium text-sm text-foreground mb-2">Role Naming Guidelines</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Role Name:</strong> Used internally in code and database</li>
          <li>• <strong>Display Name:</strong> Shown to users in the interface</li>
          <li>• System roles (super_admin, director, etc.) cannot be modified</li>
          <li>• Choose clear, descriptive names that reflect responsibilities</li>
        </ul>
      </div>
    </form>
  )
}
