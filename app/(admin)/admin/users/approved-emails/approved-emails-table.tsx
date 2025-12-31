'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useCallback, useEffect } from 'react'
import {
  getApprovedEmails,
  revokeApprovedEmail,
  reactivateApprovedEmail,
  deleteApprovedEmail,
} from '@/app/actions/users'
import { DataTable } from '@/components/data-table/data-table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
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
import { Badge } from '@/components/ui/badge'
import { Search, X, MoreHorizontal, Mail, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ColumnDef, VisibilityState } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { useIsMobile } from '@/lib/hooks/use-mobile'

interface ApprovedEmail {
  id: string
  email: string
  status: string
  notes: string | null
  added_at: string
  added_by_profile: {
    full_name: string | null
    email: string | null
  } | null
}

interface ApprovedEmailsTableProps {
  page: number
  limit: number
  searchFilter: string
  statusFilter: string
}

export function ApprovedEmailsTable({
  page: initialPage,
  limit: initialLimit,
  searchFilter: initialSearchFilter,
  statusFilter: initialStatusFilter,
}: ApprovedEmailsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State
  const [data, setData] = useState<ApprovedEmail[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [searchValue, setSearchValue] = useState(initialSearchFilter)
  const [statusValue, setStatusValue] = useState(initialStatusFilter)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  // Mobile detection for responsive columns
  const isMobile = useIsMobile()

  // Dialog states
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<ApprovedEmail | null>(null)

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

      router.push(`/admin/users/approved-emails?${newParams.toString()}`)
    },
    [router, searchParams]
  )

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getApprovedEmails({
        page,
        limit,
        search: searchValue || undefined,
        status: statusValue || undefined,
      })

      setData(result.data as ApprovedEmail[])
      setTotal(result.total)
      setPageCount(result.totalPages)
    } catch (error) {
      console.error('Error fetching approved emails:', error)
      toast.error('Failed to load approved emails')
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, searchValue, statusValue])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== initialSearchFilter) {
        setPage(1)
        startTransition(() => {
          updateUrlParams({ search: searchValue, page: 1 })
        })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, initialSearchFilter, updateUrlParams])

  // Handle filter changes
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
    setStatusValue('')
    setPage(1)
    router.push('/admin/users/approved-emails')
  }

  // Actions
  const handleRevoke = async () => {
    if (!selectedEmail) return

    const result = await revokeApprovedEmail(selectedEmail.id)
    if (result.success) {
      toast.success(result.message)
      fetchData()
    } else {
      toast.error(result.message)
    }
    setRevokeDialogOpen(false)
    setSelectedEmail(null)
  }

  const handleReactivate = async () => {
    if (!selectedEmail) return

    const result = await reactivateApprovedEmail(selectedEmail.id)
    if (result.success) {
      toast.success(result.message)
      fetchData()
    } else {
      toast.error(result.message)
    }
    setReactivateDialogOpen(false)
    setSelectedEmail(null)
  }

  const handleDelete = async () => {
    if (!selectedEmail) return

    const result = await deleteApprovedEmail(selectedEmail.id)
    if (result.success) {
      toast.success(result.message)
      fetchData()
    } else {
      toast.error(result.message)
    }
    setDeleteDialogOpen(false)
    setSelectedEmail(null)
  }

  const hasFilters = searchValue || statusValue

  // Responsive column visibility - hide extra columns on mobile
  const columnVisibility: VisibilityState = isMobile
    ? {
        added_by_profile: false,
        added_at: false,
        notes: false,
      }
    : {}

  // Column definitions
  const columns: ColumnDef<ApprovedEmail>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant={status === 'active' ? 'default' : 'secondary'}
            className={
              status === 'active'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }
          >
            {status === 'active' ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {status === 'active' ? 'Active' : 'Revoked'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'added_by_profile',
      header: 'Added By',
      cell: ({ row }) => {
        const profile = row.original.added_by_profile
        return (
          <span className="text-muted-foreground">
            {profile?.full_name || profile?.email || 'System'}
          </span>
        )
      },
    },
    {
      accessorKey: 'added_at',
      header: 'Added',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.added_at), { addSuffix: true })}
        </span>
      ),
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm truncate max-w-[200px] block">
          {row.original.notes || '-'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const email = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {email.status === 'active' ? (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedEmail(email)
                    setRevokeDialogOpen(true)
                  }}
                  className="text-orange-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Revoke Access
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedEmail(email)
                    setReactivateDialogOpen(true)
                  }}
                  className="text-green-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Reactivate
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedEmail(email)
                  setDeleteDialogOpen(true)
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Permanently
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 bg-background/50 border-border/50 rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={statusValue || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[130px] bg-background/50 border-border/50 rounded-xl">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
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
        columnVisibility={columnVisibility}
      />

      {/* Revoke Dialog */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Email Access</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke access for{' '}
              <strong>{selectedEmail?.email}</strong>? Users with this email will no
              longer be able to register or login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reactivate Dialog */}
      <AlertDialog open={reactivateDialogOpen} onOpenChange={setReactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Email Access</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reactivate access for{' '}
              <strong>{selectedEmail?.email}</strong>? Users with this email will be
              able to register and login again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReactivate}
              className="bg-green-600 hover:bg-green-700"
            >
              Reactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Email Permanently</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{' '}
              <strong>{selectedEmail?.email}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
