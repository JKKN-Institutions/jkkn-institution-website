'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InquiryDetailModal } from './inquiry-detail-modal'
import { Search, ChevronLeft, ChevronRight, Download, FileSpreadsheet } from 'lucide-react'
import { generateCSV, downloadCSV, formatDateTimeForCSV } from '@/lib/utils/csv-export'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export interface AdmissionInquiry {
  id: string
  reference_number: string
  full_name: string
  email: string
  mobile_number: string
  district_city: string
  college_name: string
  course_interested: string
  current_qualification: string
  preferred_contact_time: string | null
  status: 'new' | 'contacted' | 'follow_up' | 'converted' | 'closed'
  priority: string | null
  reply_message: string | null
  replied_at: string | null
  replied_by: string | null
  created_at: string
}

const statusColors = {
  new: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  follow_up: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  converted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
}

const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  follow_up: 'Follow Up',
  converted: 'Converted',
  closed: 'Closed'
}

export function InquiriesTable() {
  const [data, setData] = useState<AdmissionInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<AdmissionInquiry | null>(null)
  const [exporting, setExporting] = useState(false)
  const supabase = createClient()

  // Export to Excel/CSV function
  const handleExportToExcel = () => {
    if (data.length === 0) {
      toast.error('No data to export', {
        description: 'There are no inquiries matching the current filter.',
      })
      return
    }

    setExporting(true)
    try {
      const columns: Array<{ key: string; header: string; accessor?: (row: Record<string, unknown>) => unknown }> = [
        { key: 'reference_number', header: 'Reference Number' },
        { key: 'full_name', header: 'Full Name' },
        { key: 'mobile_number', header: 'Mobile Number' },
        { key: 'email', header: 'Email' },
        { key: 'district_city', header: 'District/City' },
        { key: 'college_name', header: 'College Name' },
        { key: 'course_interested', header: 'Course Interested' },
        { key: 'current_qualification', header: 'Current Qualification' },
        { key: 'preferred_contact_time', header: 'Preferred Contact Time' },
        { key: 'status', header: 'Status' },
        {
          key: 'created_at',
          header: 'Submitted Date',
          accessor: (row) => formatDateTimeForCSV(row.created_at as string)
        },
        { key: 'reply_message', header: 'Admin Notes' },
        {
          key: 'replied_at',
          header: 'Notes Added Date',
          accessor: (row) => formatDateTimeForCSV(row.replied_at as string | null)
        },
      ]

      const csvContent = generateCSV(data as unknown as Record<string, unknown>[], columns)
      const timestamp = new Date().toISOString().split('T')[0]
      const statusSuffix = statusFilter !== 'all' ? `-${statusFilter}` : ''
      downloadCSV(csvContent, `admission-inquiries${statusSuffix}-${timestamp}`)

      toast.success('Export successful', {
        description: `${data.length} inquiries exported to Excel/CSV file.`,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed', {
        description: 'An error occurred while exporting data.',
      })
    } finally {
      setExporting(false)
    }
  }

  // Fetch inquiries
  useEffect(() => {
    async function fetchInquiries() {
      setLoading(true)
      let query = supabase
        .from('admission_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data: inquiries, error } = await query

      if (error) {
        console.error('Error fetching inquiries:', error)
      } else {
        setData(inquiries || [])
      }
      setLoading(false)
    }

    fetchInquiries()
  }, [statusFilter])

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('admission-inquiries-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'admission_inquiries'
      }, () => {
        // Refetch data when changes occur
        fetchData()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [statusFilter])

  async function fetchData() {
    let query = supabase
      .from('admission_inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data: inquiries } = await query
    if (inquiries) {
      setData(inquiries)
    }
  }

  const columns: ColumnDef<AdmissionInquiry>[] = [
    {
      accessorKey: 'reference_number',
      header: 'Ref #',
      cell: ({ row }) => (
        <div className="font-mono text-xs text-muted-foreground">{row.getValue('reference_number')}</div>
      ),
    },
    {
      accessorKey: 'full_name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('full_name')}</div>
      ),
    },
    {
      accessorKey: 'mobile_number',
      header: 'Mobile',
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue('mobile_number')}</div>
      ),
    },
    {
      accessorKey: 'college_name',
      header: 'College',
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-sm" title={row.getValue('college_name')}>
          {row.getValue('college_name')}
        </div>
      ),
    },
    {
      accessorKey: 'course_interested',
      header: 'Course',
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue('course_interested')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof statusColors
        return (
          <Badge className={statusColors[status]} variant="outline">
            {statusLabels[status]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'))
        return <div className="text-sm">{date.toLocaleDateString()}</div>
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedInquiry(row.original)
          }}
        >
          View
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, mobile, college..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="follow_up">Follow Up</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={handleExportToExcel}
          disabled={exporting || data.length === 0}
          className="gap-2"
        >
          {exporting ? (
            <>
              <Download className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-4 w-4" />
              Export to Excel
            </>
          )}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedInquiry(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No admission inquiries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{' '}
          {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <InquiryDetailModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onUpdate={fetchData}
        />
      )}
    </div>
  )
}
