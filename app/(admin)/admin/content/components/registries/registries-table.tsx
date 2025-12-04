'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  ExternalLink,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { deleteRegistry, syncRegistry } from '@/app/actions/cms/registries'
import type { Database } from '@/lib/supabase/database.types'

type Registry = Database['public']['Tables']['cms_external_registries']['Row']

interface RegistriesTableProps {
  registries: Registry[]
}

export function RegistriesTable({ registries }: RegistriesTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [registryToDelete, setRegistryToDelete] = useState<Registry | null>(null)

  const handleSync = async (registry: Registry) => {
    setSyncingId(registry.id)
    toast.loading(`Syncing ${registry.name}...`)

    const result = await syncRegistry(registry.id)

    if (result.success) {
      toast.dismiss()
      const componentCount = (result.data as { component_count?: number })?.component_count || 0
      toast.success(`Synced ${componentCount} components from ${registry.name}`)
      router.refresh()
    } else {
      toast.dismiss()
      toast.error(result.message || 'Failed to sync registry')
    }

    setSyncingId(null)
  }

  const handleDelete = async () => {
    if (!registryToDelete) return

    startTransition(async () => {
      const result = await deleteRegistry(registryToDelete.id)

      if (result.success) {
        toast.success('Registry deleted')
        setDeleteDialogOpen(false)
        setRegistryToDelete(null)
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to delete registry')
      }
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'shadcn':
        return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
      case 'reactbits':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'custom':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getSyncStatusIcon = (status: string | null) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'syncing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getCachedComponentCount = (registry: Registry) => {
    const cached = registry.cached_components as unknown[]
    return Array.isArray(cached) ? cached.length : 0
  }

  if (registries.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No registries configured</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a component registry to start installing pre-built components.
        </p>
        <Button className="mt-4" onClick={() => router.push('/admin/content/components/registries/new')}>
          Add Your First Registry
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registry</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Components</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registries.map((registry) => (
              <TableRow key={registry.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{registry.name}</span>
                    {registry.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {registry.description}
                      </span>
                    )}
                    <a
                      href={registry.registry_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                    >
                      {new URL(registry.registry_url).hostname}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getTypeColor(registry.registry_type)}>
                    {registry.registry_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{getCachedComponentCount(registry)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {registry.last_synced_at ? (
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(registry.last_synced_at), { addSuffix: true })}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Never</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getSyncStatusIcon(registry.sync_status)}
                    <span className="text-sm capitalize">{registry.sync_status || 'Not synced'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/content/components/browse/${registry.slug}`)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Browse Components
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSync(registry)}
                        disabled={syncingId === registry.id}
                      >
                        {syncingId === registry.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Sync Now
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/content/components/registries/${registry.id}/edit`)
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setRegistryToDelete(registry)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Registry?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{registryToDelete?.name}&quot;? This will not affect
              components already installed from this registry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
