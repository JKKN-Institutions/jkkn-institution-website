'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Globe, Search } from 'lucide-react'
import { deleteFaculty, toggleFacultyStatus, toggleFacultyActive } from '@/app/actions/faculty'
import type { FacultyRow } from '@/lib/schemas/faculty'

interface Props {
  faculty: FacultyRow[]
}

export function FacultyManageTable({ faculty }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = faculty.filter(f =>
    f.full_name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase()) ||
    f.designation.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deleteId) return
    startTransition(async () => {
      await deleteFaculty(deleteId)
      setDeleteId(null)
      router.refresh()
    })
  }

  const handleToggleStatus = (id: string, currentStatus: string) => {
    startTransition(async () => {
      await toggleFacultyStatus(id, currentStatus === 'published' ? 'draft' : 'published')
      router.refresh()
    })
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    startTransition(async () => {
      await toggleFacultyActive(id, !isActive)
      router.refresh()
    })
  }

  const ActionMenu = ({ f }: { f: FacultyRow }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/faculty-admin/manage/${f.id}`}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Link>
        </DropdownMenuItem>
        {f.status === 'published' && f.is_active && (
          <DropdownMenuItem asChild>
            <Link href={`/faculty/${f.slug}`} target="_blank">
              <Globe className="mr-2 h-4 w-4" /> View Live
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleToggleStatus(f.id, f.status)}>
          {f.status === 'published' ? (
            <><EyeOff className="mr-2 h-4 w-4" /> Unpublish</>
          ) : (
            <><Eye className="mr-2 h-4 w-4" /> Publish</>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleToggleActive(f.id, f.is_active)}>
          {f.is_active ? (
            <><EyeOff className="mr-2 h-4 w-4" /> Deactivate</>
          ) : (
            <><Eye className="mr-2 h-4 w-4" /> Activate</>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(f.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      {/* Search */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search faculty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Desktop Table — hidden on mobile */}
      <div className="hidden sm:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                  {search ? 'No faculty found matching your search' : 'No faculty added yet. Click "Add Faculty" to get started.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((f, index) => (
                <TableRow key={f.id} className={isPending ? 'opacity-50' : ''}>
                  <TableCell className="text-gray-400">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0">
                        {f.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{f.full_name}</p>
                        <p className="text-xs text-gray-400">{f.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{f.designation}</TableCell>
                  <TableCell className="text-sm text-gray-600">{f.department}</TableCell>
                  <TableCell>
                    <Badge variant={f.status === 'published' ? 'default' : 'secondary'}>
                      {f.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={f.is_active ? 'default' : 'outline'} className={f.is_active ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                      {f.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ActionMenu f={f} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List — visible only on mobile */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            {search ? 'No faculty found' : 'No faculty added yet'}
          </div>
        ) : (
          filtered.map((f) => (
            <div key={f.id} className={`border border-gray-100 rounded-xl p-4 bg-white ${isPending ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                {/* Left — Avatar + Info */}
                <Link href={`/faculty-admin/manage/${f.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0">
                    {f.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{f.full_name}</p>
                    <p className="text-xs text-gray-400 truncate">{f.designation}</p>
                  </div>
                </Link>

                {/* Right — Actions */}
                <ActionMenu f={f} />
              </div>

              {/* Bottom row — Department + Badges */}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-gray-400 truncate max-w-[50%]">{f.department}</p>
                <div className="flex items-center gap-1.5">
                  <Badge variant={f.status === 'published' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                    {f.status}
                  </Badge>
                  <Badge variant={f.is_active ? 'default' : 'outline'} className={`text-[10px] px-1.5 py-0 ${f.is_active ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}`}>
                    {f.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Faculty Member</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this faculty member. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
