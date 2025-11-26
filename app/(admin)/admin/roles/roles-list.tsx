'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Shield, Users, Key, Edit, Trash2, Lock, Copy, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { deleteRole, duplicateRole } from '@/app/actions/roles'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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

interface RolesListProps {
  roles: Role[]
}

const getRoleColor = (roleName: string) => {
  switch (roleName) {
    case 'super_admin':
      return 'from-purple-500 to-purple-600'
    case 'director':
      return 'from-blue-500 to-blue-600'
    case 'chair':
      return 'from-indigo-500 to-indigo-600'
    case 'member':
      return 'from-primary to-primary/80'
    case 'guest':
      return 'from-secondary to-secondary/80'
    default:
      return 'from-gray-500 to-gray-600'
  }
}

export function RolesList({ roles }: RolesListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

  const handleDuplicate = async (roleId: string) => {
    setDuplicatingId(roleId)
    const result = await duplicateRole(roleId)

    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }

    setDuplicatingId(null)
  }

  const handleDelete = async (roleId: string) => {
    setDeletingId(roleId)
    const result = await deleteRole(roleId)

    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }

    setDeletingId(null)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <Card key={role.id} className="glass-card border-0 overflow-hidden hover-glow transition-all duration-300">
          {/* Color Bar */}
          <div className={`h-2 bg-gradient-to-r ${getRoleColor(role.name)}`} />

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${getRoleColor(role.name)} text-white`}
                >
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">{role.display_name}</CardTitle>
                  <Badge variant="secondary" className="mt-1 text-xs font-normal bg-muted">
                    {role.name}
                  </Badge>
                </div>
              </div>

              {role.is_system_role && (
                <Badge variant="outline" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  System
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <CardDescription className="line-clamp-2">
              {role.description || 'No description provided'}
            </CardDescription>

            {/* Stats */}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{role.user_count} users</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Key className="h-4 w-4" />
                <span>{role.permission_count} permissions</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border/50">
              <Button variant="outline" size="sm" className="flex-1 hover:border-primary/30 hover:bg-primary/5" asChild>
                <Link href={`/admin/roles/${role.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </Button>

              {/* Duplicate button - available for all roles */}
              <Button
                variant="outline"
                size="sm"
                className="hover:border-primary/30 hover:bg-primary/5"
                onClick={() => handleDuplicate(role.id)}
                disabled={duplicatingId === role.id}
                title="Duplicate role"
              >
                {duplicatingId === role.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>

              {!role.is_system_role && (
                <>
                  <Button variant="outline" size="sm" className="hover:border-primary/30 hover:bg-primary/5" asChild>
                    <Link href={`/admin/roles/${role.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        disabled={role.user_count > 0 || deletingId === role.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Role</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the &quot;{role.display_name}&quot; role?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(role.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Eye icon import was missing
import { Eye } from 'lucide-react'
