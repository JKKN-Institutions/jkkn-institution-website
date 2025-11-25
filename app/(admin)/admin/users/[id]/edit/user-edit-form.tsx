'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { updateUserProfile } from '@/app/actions/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface UserEditFormProps {
  user: {
    id: string
    email: string
    full_name: string | null
    phone: string | null
    department: string | null
    designation: string | null
    employee_id: string | null
    date_of_joining: string | null
  }
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
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

export function UserEditForm({ user }: UserEditFormProps) {
  const router = useRouter()
  const updateUserWithId = updateUserProfile.bind(null, user.id)
  const [state, formAction] = useActionState(updateUserWithId, {})

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Profile updated successfully!')
      setTimeout(() => {
        router.push(`/admin/users/${user.id}`)
      }, 1500)
    }
  }, [state.success, state.message, router, user.id])

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
            {state.message || 'Profile updated successfully! Redirecting...'}
          </AlertDescription>
        </Alert>
      )}

      {/* Email (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={user.email}
          disabled
          className="bg-muted/50 cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-foreground">
          Full Name
        </Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={user.full_name || ''}
          placeholder="Enter full name"
          className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20"
          aria-invalid={!!state.errors?.full_name}
          aria-describedby={state.errors?.full_name ? 'full-name-error' : undefined}
        />
        {state.errors?.full_name && (
          <p id="full-name-error" className="text-sm text-red-600 dark:text-red-400">
            {state.errors.full_name[0]}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground">
          Phone Number
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={user.phone || ''}
          placeholder="+91 1234567890"
          className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20"
          aria-invalid={!!state.errors?.phone}
        />
        {state.errors?.phone && (
          <p className="text-sm text-red-600 dark:text-red-400">{state.errors.phone[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department" className="text-foreground">
            Department
          </Label>
          <Input
            id="department"
            name="department"
            type="text"
            defaultValue={user.department || ''}
            placeholder="e.g., Computer Science"
            className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20"
          />
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label htmlFor="designation" className="text-foreground">
            Designation
          </Label>
          <Input
            id="designation"
            name="designation"
            type="text"
            defaultValue={user.designation || ''}
            placeholder="e.g., Professor"
            className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee ID */}
        <div className="space-y-2">
          <Label htmlFor="employee_id" className="text-foreground">
            Employee ID
          </Label>
          <Input
            id="employee_id"
            name="employee_id"
            type="text"
            defaultValue={user.employee_id || ''}
            placeholder="e.g., EMP001"
            className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20"
          />
        </div>

        {/* Date of Joining */}
        <div className="space-y-2">
          <Label htmlFor="date_of_joining" className="text-foreground">
            Date of Joining
          </Label>
          <Input
            id="date_of_joining"
            name="date_of_joining"
            type="date"
            defaultValue={user.date_of_joining || ''}
            className="bg-background/50 border-border/50 focus:border-primary/30 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="pt-4 flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/users/${user.id}`)}
          className="flex-1"
        >
          Cancel
        </Button>
        <div className="flex-1">
          <SubmitButton />
        </div>
      </div>
    </form>
  )
}
