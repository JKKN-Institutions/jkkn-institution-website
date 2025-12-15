'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Play,
  Pause,
  XCircle,
  CheckCircle,
  Star,
  AlertCircle,
  Loader2,
  MapPin,
  Clock,
  Users,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  deleteCareerJob,
  publishCareerJob,
  pauseCareerJob,
  closeCareerJob,
  bulkDeleteCareerJobs,
  bulkUpdateCareerJobStatus,
  toggleCareerJobFeatured,
  toggleCareerJobUrgent,
  type CareerJobWithRelations,
  type JobStatus,
  type JobType,
} from '@/app/actions/cms/careers'
import { type CareerDepartment } from '@/app/actions/cms/career-departments'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface CareerJobsTableProps {
  jobs: CareerJobWithRelations[]
  departments: CareerDepartment[]
  total: number
  currentPage: number
  pageSize: number
  currentStatus: JobStatus | 'all'
  currentDepartment: string
  currentType: string
  currentSearch: string
  currentSortBy: string
  currentSortOrder: string
}

const statusLabels: Record<JobStatus, { label: string; class: string }> = {
  draft: { label: 'Draft', class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' },
  published: { label: 'Published', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  paused: { label: 'Paused', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  closed: { label: 'Closed', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  filled: { label: 'Filled', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
}

const jobTypeLabels: Record<JobType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  visiting: 'Visiting',
}

export function CareerJobsTable({
  jobs,
  departments,
  total,
  currentPage,
  pageSize,
  currentStatus,
  currentDepartment,
  currentType,
  currentSearch,
  currentSortBy,
  currentSortOrder,
}: CareerJobsTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(currentSearch)

  const totalPages = Math.ceil(total / pageSize)

  // Update URL params
  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle search
  const handleSearch = () => {
    updateParams({ search: searchValue, page: '1' })
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteJobId) return

    startTransition(async () => {
      const result = await deleteCareerJob(deleteJobId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      setDeleteJobId(null)
    })
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedJobs.length === 0) return

    startTransition(async () => {
      const result = await bulkDeleteCareerJobs(selectedJobs)
      if (result.success) {
        toast.success(result.message)
        setSelectedJobs([])
      } else {
        toast.error(result.message)
      }
      setIsBulkDeleteOpen(false)
    })
  }

  // Handle bulk status change
  const handleBulkStatusChange = async (status: JobStatus) => {
    if (selectedJobs.length === 0) return

    startTransition(async () => {
      const result = await bulkUpdateCareerJobStatus(selectedJobs, status)
      if (result.success) {
        toast.success(result.message)
        setSelectedJobs([])
      } else {
        toast.error(result.message)
      }
    })
  }

  // Handle individual status change
  const handleStatusChange = async (jobId: string, action: 'publish' | 'pause' | 'close') => {
    startTransition(async () => {
      let result
      switch (action) {
        case 'publish':
          result = await publishCareerJob(jobId)
          break
        case 'pause':
          result = await pauseCareerJob(jobId)
          break
        case 'close':
          result = await closeCareerJob(jobId)
          break
      }
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  // Handle featured toggle
  const handleToggleFeatured = async (jobId: string) => {
    startTransition(async () => {
      const result = await toggleCareerJobFeatured(jobId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  // Handle urgent toggle
  const handleToggleUrgent = async (jobId: string) => {
    startTransition(async () => {
      const result = await toggleCareerJobUrgent(jobId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  // Toggle selection
  const toggleSelection = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    )
  }

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([])
    } else {
      setSelectedJobs(jobs.map((j) => j.id))
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>

        <Select
          value={currentStatus}
          onValueChange={(v) => updateParams({ status: v, page: '1' })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="filled">Filled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentDepartment || 'all'}
          onValueChange={(v) => updateParams({ department: v === 'all' ? '' : v, page: '1' })}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentType || 'all'}
          onValueChange={(v) => updateParams({ type: v === 'all' ? '' : v, page: '1' })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full_time">Full-time</SelectItem>
            <SelectItem value="part_time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="visiting">Visiting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedJobs.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <Badge variant="secondary">{selectedJobs.length} selected</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange('published')}
            disabled={isPending}
          >
            <Play className="mr-1 h-3 w-3" />
            Publish
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange('paused')}
            disabled={isPending}
          >
            <Pause className="mr-1 h-3 w-3" />
            Pause
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange('closed')}
            disabled={isPending}
          >
            <XCircle className="mr-1 h-3 w-3" />
            Close
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsBulkDeleteOpen(true)}
            disabled={isPending}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
        </div>
      )}

      {/* Table */}
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            {currentSearch || currentStatus !== 'all' || currentDepartment || currentType
              ? 'Try adjusting your filters'
              : 'Create your first job posting'}
          </p>
          <Button asChild>
            <Link href="/admin/content/careers/new">Create Job</Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedJobs.length === jobs.length && jobs.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Positions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedJobs.includes(job.id)}
                      onCheckedChange={() => toggleSelection(job.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/content/careers/${job.id}`}
                          className="font-medium hover:underline"
                        >
                          {job.title}
                        </Link>
                        {job.is_featured && (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        )}
                        {job.is_urgent && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        /{job.slug}
                      </p>
                      {job.deadline && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {job.department ? (
                      <Badge
                        variant="outline"
                        style={{ borderColor: job.department.color || undefined }}
                      >
                        {job.department.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {jobTypeLabels[job.job_type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {job.work_mode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusLabels[job.status].class}>
                      {statusLabels[job.status].label}
                    </Badge>
                    {job.published_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(job.published_at), {
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {job.positions_filled}/{job.positions_available}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/content/careers/${job.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/content/careers/${job.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {job.status !== 'published' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(job.id, 'publish')}
                          >
                            <Play className="mr-2 h-4 w-4 text-green-600" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        {job.status === 'published' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(job.id, 'pause')}
                          >
                            <Pause className="mr-2 h-4 w-4 text-amber-600" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        {job.status !== 'closed' && job.status !== 'filled' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(job.id, 'close')}
                          >
                            <XCircle className="mr-2 h-4 w-4 text-red-600" />
                            Close
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleFeatured(job.id)}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {job.is_featured ? 'Remove Featured' : 'Mark Featured'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleUrgent(job.id)}
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          {job.is_urgent ? 'Remove Urgent' : 'Mark Urgent'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteJobId(job.id)}
                          className="text-destructive"
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
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, total)} of {total} jobs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParams({ page: String(currentPage - 1) })}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParams({ page: String(currentPage + 1) })}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteJobId}
        onOpenChange={(open) => !open && setDeleteJobId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job posting? This action cannot
              be undone and will also delete all associated applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Jobs</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedJobs.length} job postings?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete {selectedJobs.length} Jobs
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
