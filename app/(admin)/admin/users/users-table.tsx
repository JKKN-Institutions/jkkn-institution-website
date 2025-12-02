'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useCallback, useEffect, useMemo } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { columns, type UserRow } from './columns'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUsers, exportUsersToCSV } from '@/app/actions/users'
import { getRoles } from '@/app/actions/roles'
import { BulkActionsToolbar } from './bulk-actions-toolbar'
import type { RowSelectionState } from '@tanstack/react-table'
import { toast } from 'sonner'

interface UsersTableProps {
  page: number
  limit: number
  search: string
  roleFilter: string
  statusFilter: string
}

type RoleOption = {
  id: string
  name: string
  display_name: string
}

export function UsersTable({
  page: initialPage,
  limit: initialLimit,
  search: initialSearch,
  roleFilter: initialRoleFilter,
  statusFilter: initialStatusFilter,
}: UsersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State
  const [data, setData] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [roles, setRoles] = useState<RoleOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [roleValue, setRoleValue] = useState(initialRoleFilter)
  const [statusValue, setStatusValue] = useState(initialStatusFilter)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  // Row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Get selected user IDs from row selection
  const selectedUserIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((index) => data[parseInt(index)]?.id)
      .filter(Boolean)
  }, [rowSelection, data])

  const handleClearSelection = useCallback(() => {
    setRowSelection({})
  }, [])

  const handleRowSelectionChange = useCallback((selection: RowSelectionState) => {
    setRowSelection(selection)
  }, [])

  // Export all users
  const [isExporting, setIsExporting] = useState(false)
  const handleExportAll = async () => {
    setIsExporting(true)
    try {
      const csvContent = await exportUsersToCSV({
        search: searchValue,
        roleId: roleValue,
        status: statusValue,
      })

      // Download the CSV
      const bom = '\uFEFF'
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Users exported successfully')
    } catch (error) {
      toast.error('Failed to export users')
    } finally {
      setIsExporting(false)
    }
  }

  // Update URL params
  const updateUrlParams = useCallback(
    (params: Record<string, string | number>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, String(value))
        } else {
          newParams.delete(key)
        }
      })

      router.push(`/admin/users?${newParams.toString()}`)
    },
    [router, searchParams]
  )

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getUsers({
        page,
        limit,
        search: searchValue,
        roleId: roleValue,
        status: statusValue,
      })

      setData(result.data as UserRow[])
      setTotal(result.total)
      setPageCount(result.totalPages)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, searchValue, roleValue, statusValue])

  // Fetch roles for filter
  useEffect(() => {
    async function fetchRoles() {
      try {
        const rolesData = await getRoles()
        setRoles(
          rolesData.map((r) => ({
            id: r.id,
            name: r.name,
            display_name: r.display_name,
          }))
        )
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }
    fetchRoles()
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== initialSearch) {
        startTransition(() => {
          setPage(1)
          updateUrlParams({ search: searchValue, page: 1 })
        })
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchValue, initialSearch, updateUrlParams])

  // Handle filter changes
  const handleRoleChange = (value: string) => {
    setRoleValue(value === 'all' ? '' : value)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ role: value === 'all' ? '' : value, page: 1 })
    })
  }

  const handleStatusChange = (value: string) => {
    setStatusValue(value === 'all' ? '' : value)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ status: value === 'all' ? '' : value, page: 1 })
    })
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    startTransition(() => {
      updateUrlParams({ page: newPage })
    })
  }

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ limit: newLimit, page: 1 })
    })
  }

  const clearFilters = () => {
    setSearchValue('')
    setRoleValue('')
    setStatusValue('')
    setPage(1)
    router.push('/admin/users')
  }

  const hasFilters = searchValue || roleValue || statusValue

  return (
    <div className="space-y-4">
      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selectedUserIds.length}
        selectedUserIds={selectedUserIds}
        roles={roles}
        onClearSelection={handleClearSelection}
        onActionComplete={fetchData}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or department..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 bg-background/50 border-border/50 rounded-xl focus:border-primary/30 focus:ring-primary/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={roleValue || 'all'} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[120px] sm:w-[150px] bg-background/50 border-border/50 rounded-xl">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusValue || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[110px] sm:w-[140px] bg-background/50 border-border/50 rounded-xl">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}

          <div className="h-8 w-px bg-border hidden sm:block" />

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportAll}
            disabled={isExporting || isLoading}
            title="Export All"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Export All</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading || isPending}
        enableRowSelection={true}
        onRowSelectionChange={handleRowSelectionChange}
      />
    </div>
  )
}
