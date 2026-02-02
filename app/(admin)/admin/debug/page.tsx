import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DebugPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user roles and permissions
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('roles(name, display_name)')
    .eq('user_id', user.id)

  const roles = userRoles?.map(ur => (ur as any).roles) || []
  const roleIds = roles.map((r: any) => r?.id).filter(Boolean)

  const { data: permissions } = await supabase
    .from('role_permissions')
    .select('permission')
    .in('role_id', roleIds)

  const permissionList = permissions?.map(p => p.permission) || []

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug Info</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h2 className="font-semibold mb-2">User Info:</h2>
        <p>Email: {user.email}</p>
        <p>ID: {user.id}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h2 className="font-semibold mb-2">Roles:</h2>
        <pre>{JSON.stringify(roles, null, 2)}</pre>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold mb-2">Permissions ({permissionList.length}):</h2>
        <div className="space-y-1">
          {permissionList.map((perm, i) => (
            <div key={i} className={perm.includes('cms:') ? 'text-green-600 font-medium' : ''}>
              {perm}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <a href="/admin/content/courses" className="text-blue-600 hover:underline">
          → Go to Courses Page
        </a>
      </div>
    </div>
  )
}
