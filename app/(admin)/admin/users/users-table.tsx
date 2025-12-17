'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useCallback, useEffect, useMemo, useRef } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { columns, type UserRow } from './columns'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Search, X, Download, Loader2, PlusCircle, SlidersHorizontal, FileSpreadsheet, FileJson, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUsers, exportUsersToCSV } from '@/app/actions/users'
import { getRoles } from '@/app/actions/roles'
import { BulkActionsToolbar } from './bulk-actions-toolbar'
import type { RowSelectionState } from '@tanstack/react-table'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'

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

  // Search input ref for focus on icon click
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    roles: true,
    institution: true,
    department: true,
    status: true,
    last_login_at: true,
    created_at: true,
  })

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

  // Export handlers
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'json' | null>(null)

  const handleExport = async (format: 'csv' | 'excel' | 'json') => {
    setIsExporting(true)
    setExportFormat(format)
    try {
      const csvContent = await exportUsersToCSV({
        search: searchValue,
        roleId: roleValue || undefined,
        status: statusValue || undefined,
      })

      const dateStr = new Date().toISOString().split('T')[0]

      if (format === 'csv') {
        const bom = '\uFEFF'
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
        downloadBlob(blob, `users-export-${dateStr}.csv`)
        toast.success('Exported as CSV successfully')
      } else if (format === 'excel') {
        // For Excel, we'll use CSV with .xlsx extension (basic Excel support)
        // For full Excel support, you would use a library like xlsx
        const bom = '\uFEFF'
        const blob = new Blob([bom + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' })
        downloadBlob(blob, `users-export-${dateStr}.xls`)
        toast.success('Exported as Excel successfully')
      } else if (format === 'json') {
        // Convert CSV to JSON
        const lines = csvContent.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        const jsonData = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',')
          const obj: Record<string, string> = {}
          headers.forEach((header, i) => {
            obj[header] = values[i]?.replace(/^"|"$/g, '') || ''
          })
          return obj
        })
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json;charset=utf-8;' })
        downloadBlob(blob, `users-export-${dateStr}.json`)
        toast.success('Exported as JSON successfully')
      }
    } catch (error) {
      toast.error('Failed to export users')
    } finally {
      setIsExporting(false)
      setExportFormat(null)
    }
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Column visibility toggle
  const toggleColumn = (columnId: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }))
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

  // Real-time subscription state
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false)

  // Real-time subscription for live updates
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('users-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          // Refetch data when profiles change
          fetchData()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members',
        },
        () => {
          // Refetch data when member status changes
          fetchData()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
        },
        () => {
          // Refetch data when roles change
          fetchData()
        }
      )
      .subscribe((status) => {
        setIsRealtimeConnected(status === 'SUBSCRIBED')
      })

    return () => {
      channel.unsubscribe()
    }
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
  const handleRoleChange = (roleId: string, checked: boolean) => {
    const newValue = checked ? roleId : ''
    setRoleValue(newValue)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ role: newValue, page: 1 })
    })
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    const newValue = checked ? status : ''
    setStatusValue(newValue)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ status: newValue, page: 1 })
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

  // Get selected role name for badge display
  const selectedRoleName = roles.find((r) => r.id === roleValue)?.display_name

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Left side - Search and Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative w-full sm:w-auto sm:min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => searchInputRef.current?.focus()}
            />
            <Input
              ref={searchInputRef}
              id="users-search"
              name="users-search"
              placeholder="Search by email..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9 bg-background border-border rounded-lg h-9"
            />
          </div>

          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 border-dashed">
                <PlusCircle className="h-3.5 w-3.5" />
                Role
                {roleValue && (
                  <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                    {selectedRoleName}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {roles.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role.id}
                  checked={roleValue === role.id}
                  onCheckedChange={(checked) => handleRoleChange(role.id, checked)}
                >
                  {role.display_name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 border-dashed">
                <PlusCircle className="h-3.5 w-3.5" />
                Status
                {statusValue && (
                  <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal capitalize">
                    {statusValue}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[150px]">
              <DropdownMenuCheckboxItem
                checked={statusValue === 'active'}
                onCheckedChange={(checked) => handleStatusChange('active', checked)}
              >
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusValue === 'inactive'}
                onCheckedChange={(checked) => handleStatusChange('inactive', checked)}
              >
                Inactive
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusValue === 'suspended'}
                onCheckedChange={(checked) => handleStatusChange('suspended', checked)}
              >
                Suspended
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Right side - Export and View dropdowns */}
        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2"
                disabled={isExporting || isLoading}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleExport('csv')}
                disabled={isExporting}
              >
                <FileText className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport('excel')}
                disabled={isExporting}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport('json')}
                disabled={isExporting}
              >
                <FileJson className="mr-2 h-4 w-4" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View/Column Visibility Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={columnVisibility.roles}
                onCheckedChange={() => toggleColumn('roles')}
              >
                Role
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.institution}
                onCheckedChange={() => toggleColumn('institution')}
              >
                Institution
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.department}
                onCheckedChange={() => toggleColumn('department')}
              >
                Department
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.status}
                onCheckedChange={() => toggleColumn('status')}
              >
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.last_login_at}
                onCheckedChange={() => toggleColumn('last_login_at')}
              >
                Last Login
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.created_at}
                onCheckedChange={() => toggleColumn('created_at')}
              >
                Created
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
    </div>
  )
}
