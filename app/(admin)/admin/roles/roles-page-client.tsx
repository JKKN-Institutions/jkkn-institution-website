'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RolesList } from './roles-list'
import { PermissionMatrixGrid } from '@/components/admin/permission-matrix-grid'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutGrid, Table2 } from 'lucide-react'
import { togglePermission } from '@/app/actions/roles'

interface Role {
  id: string
  name: string
  display_name: string
  description: string | null
  is_system_role: boolean | null
  permission_count: number
  user_count: number
  permissions: string[]
}

interface RolesPageClientProps {
  roles: Role[]
}

export function RolesPageClient({ roles }: RolesPageClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('list')

  // Handle permission toggle from matrix grid
  const handlePermissionToggle = async (
    roleId: string,
    permission: string,
    hasPermission: boolean
  ) => {
    const result = await togglePermission(roleId, permission, hasPermission)

    // Refresh the page to get updated data
    if (result.success) {
      router.refresh()
    }

    return result
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-end">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="list" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Role List
          </TabsTrigger>
          <TabsTrigger value="matrix" className="gap-2">
            <Table2 className="h-4 w-4" />
            Permission Matrix
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Role List View */}
      <TabsContent value="list" className="m-0">
        <RolesList roles={roles} />
      </TabsContent>

      {/* Permission Matrix View */}
      <TabsContent value="matrix" className="m-0">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>
              View and manage permissions across all roles. Check or uncheck to grant or revoke permissions.
              System roles and wildcard-granted permissions cannot be modified directly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PermissionMatrixGrid
              roles={roles}
              onPermissionToggle={handlePermissionToggle}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
