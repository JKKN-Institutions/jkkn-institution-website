import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserCreateForm } from './user-create-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus } from 'lucide-react'

export const metadata = {
  title: 'Add New User | JKKN Admin',
  description: 'Add a new user to the system',
}

async function checkAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const hasPermission = await checkPermission(user.id, 'users:emails:create')
  if (!hasPermission) {
    redirect('/admin/unauthorized')
  }

  return user
}

export default async function NewUserPage() {
  await checkAccess()

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add New User</h1>
            <p className="text-muted-foreground">
              Add an email to the approved list to allow user registration
            </p>
          </div>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Enter the user&apos;s @jkkn.ac.in email address. They will be able to sign in with
            Google OAuth once approved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading form...</div>}>
            <UserCreateForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
