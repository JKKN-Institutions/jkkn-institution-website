'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useCallback, useEffect } from 'react'
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
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUsers } from '@/app/actions/users'
import { getRoles } from '@/app/actions/roles'

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
        <div className="flex gap-2">
          <Select value={roleValue || 'all'} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[150px] bg-background/50 border-border/50 rounded-xl">
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
            <SelectTrigger className="w-[140px] bg-background/50 border-border/50 rounded-xl">
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
      />
    </div>
  )
}
