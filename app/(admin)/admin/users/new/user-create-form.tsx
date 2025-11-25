'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { addApprovedEmail } from '@/app/actions/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding User...
        </>
      ) : (
        'Add User to Approved List'
      )}
    </Button>
  )
}

export function UserCreateForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(addApprovedEmail, {})

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'User added successfully!')
      setTimeout(() => {
        router.push('/admin/users')
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
            {state.message || 'User added successfully! Redirecting...'}
          </AlertDescription>
        </Alert>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="user@jkkn.ac.in"
          required
          autoComplete="email"
          className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20"
          aria-invalid={!!state.errors?.email}
          aria-describedby={state.errors?.email ? 'email-error' : undefined}
        />
        {state.errors?.email && (
          <p id="email-error" className="text-sm text-red-600 dark:text-red-400">
            {state.errors.email[0]}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Must be a valid @jkkn.ac.in email address
        </p>
      </div>

      {/* Notes Field */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-foreground">
          Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Add any notes about this user (e.g., department, role, etc.)"
          rows={4}
          className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20 resize-none"
          aria-describedby="notes-help"
        />
        <p id="notes-help" className="text-xs text-muted-foreground">
          Internal notes visible only to administrators
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

      {/* Help Text */}
      <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
        <h4 className="font-medium text-sm text-foreground mb-2">What happens next?</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• The email will be added to the approved list</li>
          <li>• User can sign in with Google OAuth using this email</li>
          <li>• User will be assigned the &quot;Guest&quot; role by default</li>
          <li>• You can assign additional roles from the user detail page</li>
        </ul>
      </div>
    </form>
  )
}
