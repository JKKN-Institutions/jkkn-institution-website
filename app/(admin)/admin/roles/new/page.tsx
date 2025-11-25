import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { RoleCreateForm } from './role-create-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export const metadata = {
  title: 'Create New Role | JKKN Admin',
  description: 'Create a new role with custom permissions',
}

async function checkAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const hasPermission = await checkPermission(user.id, 'users:roles:create')
  if (!hasPermission) {
    redirect('/admin/unauthorized')
  }

  return user
}

export default async function NewRolePage() {
  await checkAccess()

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Role</h1>
            <p className="text-muted-foreground">
              Define a custom role with specific permissions
            </p>
          </div>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Role Details</CardTitle>
          <CardDescription>
            Create a custom role. You can assign permissions after creating the role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading form...</div>}>
            <RoleCreateForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
