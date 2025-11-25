import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { getUserById } from '@/app/actions/users'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserEditForm } from './user-edit-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCog, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface UserEditPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: UserEditPageProps) {
  const { id } = await params
  const user = await getUserById(id)

  return {
    title: `Edit ${user?.full_name || 'User'} | JKKN Admin`,
    description: 'Edit user profile information',
  }
}

async function checkAccess(userId: string) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Can edit own profile OR need users:profiles:edit permission
  const canEdit =
    user.id === userId || (await checkPermission(user.id, 'users:profiles:edit'))

  if (!canEdit) {
    redirect('/admin/unauthorized')
  }

  return user
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  const { id } = await params
  const userData = await getUserById(id)

  if (!userData) {
    notFound()
  }

  await checkAccess(id)

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/admin/users/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Details
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <UserCog className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit User Profile</h1>
            <p className="text-muted-foreground">
              Update profile information for {userData.full_name || userData.email}
            </p>
          </div>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update the user&apos;s profile details. Changes will be saved immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading form...</div>}>
            <UserEditForm user={userData} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
