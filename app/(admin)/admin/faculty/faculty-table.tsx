'use client'

// Read-only faculty table. Faculty data is managed in MyJKKN; this admin
// shows current state + deep-links to MyJKKN for edits.

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ExternalLink, Globe, Search, Cloud, Archive } from 'lucide-react'
import type { FacultyRow } from '@/lib/schemas/faculty'

interface FacultyTableProps {
  faculty: FacultyRow[]
}

const MYJKKN_STAFF_EDIT_URL = (id: string) => `https://www.jkkn.ai/admin/staff/${id}`

export function FacultyTable({ faculty }: FacultyTableProps) {
  const [search, setSearch] = useState('')

  const filtered = faculty.filter(f =>
    f.full_name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase()) ||
    f.designation.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search faculty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Faculty data is read-only. Edits happen in MyJKKN; sync runs every 15 min.
        </p>
      </div>

      <div className="hidden sm:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {search ? 'No faculty found matching your search' : 'No faculty yet — sync from MyJKKN to populate.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((f, index) => (
                <TableRow key={f.id}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0">
                        {f.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{f.full_name}</p>
                        <p className="text-xs text-muted-foreground">{f.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{f.designation}</TableCell>
                  <TableCell className="text-sm">{f.department}</TableCell>
                  <TableCell>
                    {f.synced_from_api ? (
                      <Badge variant="default" className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100">
                        <Cloud className="w-3 h-3" /> MyJKKN
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-muted-foreground">
                        <Archive className="w-3 h-3" /> Legacy
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={f.status === 'published' ? 'default' : 'secondary'} className="w-fit">
                        {f.status}
                      </Badge>
                      {!f.is_active && (
                        <Badge variant="outline" className="w-fit text-[10px]">Inactive</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {f.status === 'published' && f.is_active && f.slug && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/faculty/${f.slug}`} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4" />
                          </Link>
                        </Button>
                      )}
                      {f.synced_from_api ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={MYJKKN_STAFF_EDIT_URL(f.id)} target="_blank" rel="noopener noreferrer">
                            Edit in MyJKKN <ExternalLink className="ml-1 w-3 h-3" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic px-2">read-only</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            {search ? 'No faculty found' : 'No faculty yet'}
          </div>
        ) : (
          filtered.map((f) => (
            <div key={f.id} className="border rounded-xl p-4 bg-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0">
                    {f.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{f.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{f.designation}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate max-w-[40%]">{f.department}</p>
                <div className="flex items-center gap-1.5">
                  {f.synced_from_api ? (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 hover:bg-blue-100">MyJKKN</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">Legacy</Badge>
                  )}
                  <Badge variant={f.status === 'published' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">{f.status}</Badge>
                </div>
              </div>
              {f.synced_from_api && (
                <div className="mt-3">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href={MYJKKN_STAFF_EDIT_URL(f.id)} target="_blank" rel="noopener noreferrer">
                      Edit in MyJKKN <ExternalLink className="ml-1 w-3 h-3" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  )
}
