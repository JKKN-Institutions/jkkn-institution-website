'use client'

// Read-only faculty table. Faculty data is managed in MyJKKN; this admin
// shows current state + deep-links to MyJKKN for edits.

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { ExternalLink, Globe, Search, Cloud, Archive } from 'lucide-react'
import type { FacultyRow } from '@/lib/schemas/faculty'

interface FacultyTableProps {
  faculty: FacultyRow[]
}

const MYJKKN_STAFF_EDIT_URL = (id: string) => `https://www.jkkn.ai/admin/staff/${id}`

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export function FacultyTable({ faculty }: FacultyTableProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return faculty
    return faculty.filter(
      (f) =>
        f.full_name.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        (f.email ?? '').toLowerCase().includes(q),
    )
  }, [faculty, search])

  // Client-side pagination slice (DataTable runs in manualPagination mode)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const paged = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  )

  const columns = useMemo<ColumnDef<FacultyRow>[]>(
    () => [
      {
        id: 'index',
        header: '#',
        size: 50,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {(safePage - 1) * pageSize + row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: 'full_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => {
          const f = row.original
          return (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0">
                {getInitials(f.full_name)}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate max-w-[220px]">{f.full_name}</p>
                {f.email && (
                  <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                    {f.email}
                  </p>
                )}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'designation',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Designation" />
        ),
        cell: ({ getValue }) => (
          <span className="text-sm truncate block max-w-[180px]" title={String(getValue() ?? '')}>
            {String(getValue() ?? '')}
          </span>
        ),
      },
      {
        accessorKey: 'department',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Department" />
        ),
        cell: ({ getValue }) => (
          <span className="text-sm truncate block max-w-[260px]" title={String(getValue() ?? '')}>
            {String(getValue() ?? '')}
          </span>
        ),
      },
      {
        accessorKey: 'synced_from_api',
        header: 'Source',
        cell: ({ getValue }) =>
          getValue() ? (
            <Badge
              variant="default"
              className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100"
            >
              <Cloud className="w-3 h-3" /> MyJKKN
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-muted-foreground">
              <Archive className="w-3 h-3" /> Legacy
            </Badge>
          ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const f = row.original
          return (
            <div className="flex flex-col gap-1">
              <Badge
                variant={f.status === 'published' ? 'default' : 'secondary'}
                className="w-fit capitalize"
              >
                {f.status}
              </Badge>
              {!f.is_active && (
                <Badge variant="outline" className="w-fit text-[10px]">
                  Inactive
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        id: 'actions',
        header: () => <span className="block text-right">Actions</span>,
        cell: ({ row }) => {
          const f = row.original
          return (
            <div className="flex items-center justify-end gap-1">
              {f.status === 'published' && f.is_active && f.slug && (
                <Button variant="ghost" size="sm" asChild title="View public page">
                  <Link
                    href={`/faculty/${f.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-4 h-4" />
                  </Link>
                </Button>
              )}
              {f.synced_from_api ? (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={MYJKKN_STAFF_EDIT_URL(f.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="hidden md:inline">Edit in MyJKKN</span>
                    <span className="md:hidden">Edit</span>
                    <ExternalLink className="ml-1 w-3 h-3" />
                  </a>
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground italic px-2">
                  read-only
                </span>
              )}
            </div>
          )
        },
      },
    ],
    [safePage, pageSize],
  )

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search faculty..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Faculty data is read-only. Edits happen in MyJKKN; sync runs every 15 min.
        </p>
      </div>

      {/* Desktop / tablet: TanStack DataTable */}
      <div className="hidden sm:block">
        <DataTable
          columns={columns}
          data={paged}
          page={safePage}
          pageSize={pageSize}
          pageCount={pageCount}
          total={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {paged.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            {search ? 'No faculty found' : 'No faculty yet'}
          </div>
        ) : (
          paged.map((f) => (
            <div key={f.id} className="border rounded-xl p-4 bg-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0">
                    {getInitials(f.full_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{f.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{f.designation}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate max-w-[40%]">
                  {f.department}
                </p>
                <div className="flex items-center gap-1.5">
                  {f.synced_from_api ? (
                    <Badge
                      variant="default"
                      className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 hover:bg-blue-100"
                    >
                      MyJKKN
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      Legacy
                    </Badge>
                  )}
                  <Badge
                    variant={f.status === 'published' ? 'default' : 'secondary'}
                    className="text-[10px] px-1.5 py-0 capitalize"
                  >
                    {f.status}
                  </Badge>
                </div>
              </div>
              {f.synced_from_api && (
                <div className="mt-3">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a
                      href={MYJKKN_STAFF_EDIT_URL(f.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
