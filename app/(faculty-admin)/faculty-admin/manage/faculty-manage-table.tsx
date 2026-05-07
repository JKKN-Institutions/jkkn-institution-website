'use client'

// Read-only self-service portal table. Faculty data is managed in MyJKKN.
// Each row deep-links to the corresponding profile in MyJKKN (for synced
// rows) or to the public live page (for legacy rows still active).

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ExternalLink, Globe, Search, Cloud, Archive } from 'lucide-react'
import type { FacultyRow } from '@/lib/schemas/faculty'

interface Props {
  faculty: FacultyRow[]
}

const MYJKKN_PROFILE_URL = (id: string) => `https://www.jkkn.ai/profile/${id}`

export function FacultyManageTable({ faculty }: Props) {
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search faculty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {search ? 'No faculty found.' : 'No faculty here yet — sync from MyJKKN to populate.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(f => (
                <TableRow key={f.id}>
                  <TableCell>
                    <p className="font-medium">{f.full_name}</p>
                    <p className="text-xs text-muted-foreground">{f.email}</p>
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
                    <Badge variant={f.status === 'published' ? 'default' : 'secondary'}>
                      {f.status}
                    </Badge>
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
                          <a href={MYJKKN_PROFILE_URL(f.id)} target="_blank" rel="noopener noreferrer">
                            View in MyJKKN <ExternalLink className="ml-1 w-3 h-3" />
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
    </>
  )
}
