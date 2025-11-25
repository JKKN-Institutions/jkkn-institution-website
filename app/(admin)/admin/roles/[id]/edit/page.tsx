import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { getRoleById, getAvailablePermissions } from '@/app/actions/roles'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { RoleEditForm } from './role-edit-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PermissionMatrix } from '@/components/admin/permission-matrix'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface RoleEditPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: RoleEditPageProps) {
  const { id } = await params
  const role = await getRoleById(id)

  return {
    title: `Edit ${role?.display_name || 'Role'} | JKKN Admin`,
    description: 'Edit role details and permissions',
  }
}

async function checkAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const hasPermission = await checkPermission(user.id, 'users:roles:edit')
  if (!hasPermission) {
    redirect('/admin/unauthorized')
  }

  return user
}

export default async function RoleEditPage({ params }: RoleEditPageProps) {
  const { id } = await params
  const [role, availablePermissions] = await Promise.all([
    getRoleById(id),
    getAvailablePermissions(),
  ])

  if (!role) {
    notFound()
  }

  await checkAccess()

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/admin/roles/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Role Details
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
            <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Role</h1>
            <p className="text-muted-foreground">
              Manage role details and permissions for {role.display_name}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs for Details and Permissions */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="glass-card border-0">
          <TabsTrigger value="details">Role Details</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Role Information</CardTitle>
              <CardDescription>
                Update the role&apos;s display name and description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading form...</div>}>
                <RoleEditForm role={role} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Configure which permissions this role has access to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading permissions...</div>}>
                <PermissionMatrix
                  roleId={role.id}
                  roleName={role.name}
                  currentPermissions={role.permissions || []}
                  availablePermissions={availablePermissions}
                  isSystemRole={role.is_system_role || false}
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
