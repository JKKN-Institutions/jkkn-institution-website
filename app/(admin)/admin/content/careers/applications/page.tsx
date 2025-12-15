'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  Mail,
  Phone,
  FileText,
  Star,
  Loader2,
  ArrowLeft,
  Calendar,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
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
  getApplications,
  getApplicationStats,
  updateApplicationStatus,
  bulkUpdateApplicationStatus,
  deleteApplication,
  bulkDeleteApplications,
  type CareerApplicationWithRelations,
  type ApplicationStatus,
} from '@/app/actions/cms/career-applications'
import { getCareerJobs } from '@/app/actions/cms/careers'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

const statusLabels: Record<ApplicationStatus, { label: string; class: string }> = {
  new: { label: 'New', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  reviewing: { label: 'Reviewing', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  shortlisted: { label: 'Shortlisted', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  interview: { label: 'Interview', class: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' },
  offered: { label: 'Offered', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  hired: { label: 'Hired', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  withdrawn: { label: 'Withdrawn', class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' },
}

export default function ApplicationsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State
  const [applications, setApplications] = useState<CareerApplicationWithRelations[]>([])
  const [jobs, setJobs] = useState<Array<{ id: string; title: string }>>([])
  const [stats, setStats] = useState<Record<ApplicationStatus, number>>({
    new: 0,
    reviewing: 0,
    shortlisted: 0,
    interview: 0,
    offered: 0,
    hired: 0,
    rejected: 0,
    withdrawn: 0,
  })
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [deleteAppId, setDeleteAppId] = useState<string | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  // URL params
  const page = parseInt(searchParams.get('page') || '1')
  const status = (searchParams.get('status') || 'all') as ApplicationStatus | 'all'
  const jobId = searchParams.get('job') || ''
  const search = searchParams.get('search') || ''
  const pageSize = 20

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [appsData, statsData, jobsData] = await Promise.all([
        getApplications({
          status,
          job_id: jobId || undefined,
          search: search || undefined,
          page,
          pageSize,
        }),
        getApplicationStats(),
        getCareerJobs({ status: 'all', pageSize: 100 }),
      ])
      setApplications(appsData.applications)
      setTotal(appsData.total)
      setStats(statsData)
      setJobs(jobsData.jobs.map((j) => ({ id: j.id, title: j.title })))
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch applications')
    } finally {
      setIsLoading(false)
    }
  }, [status, jobId, search, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  // Handle status change
  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    startTransition(async () => {
      const result = await updateApplicationStatus(appId, newStatus)
      if (result.success) {
        toast.success(result.message)
        fetchData()
      } else {
        toast.error(result.message)
      }
    })
  }

  // Handle bulk status change
  const handleBulkStatusChange = async (newStatus: ApplicationStatus) => {
    if (selectedApps.length === 0) return

    startTransition(async () => {
      const result = await bulkUpdateApplicationStatus(selectedApps, newStatus)
      if (result.success) {
        toast.success(result.message)
        setSelectedApps([])
        fetchData()
      } else {
        toast.error(result.message)
      }
    })
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteAppId) return

    startTransition(async () => {
      const result = await deleteApplication(deleteAppId)
      if (result.success) {
        toast.success(result.message)
        fetchData()
      } else {
        toast.error(result.message)
      }
      setDeleteAppId(null)
    })
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedApps.length === 0) return

    startTransition(async () => {
      const result = await bulkDeleteApplications(selectedApps)
      if (result.success) {
        toast.success(result.message)
        setSelectedApps([])
        fetchData()
      } else {
        toast.error(result.message)
      }
      setIsBulkDeleteOpen(false)
    })
  }

  // Toggle selection
  const toggleSelection = (appId: string) => {
    setSelectedApps((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    )
  }

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedApps.length === applications.length) {
      setSelectedApps([])
    } else {
      setSelectedApps(applications.map((a) => a.id))
    }
  }

  const totalPages = Math.ceil(total / pageSize)
  const totalApplications = Object.values(stats).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="Applications"
        description="Review and manage job applications"
        badge="Careers"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/careers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/careers/applications/pipeline">
                <Briefcase className="mr-2 h-4 w-4" />
                Pipeline View
              </Link>
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {Object.entries(statusLabels).map(([key, { label, class: cls }]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-colors ${
              status === key ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => updateParams({ status: key, page: '1' })}
          >
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold">{stats[key as ApplicationStatus]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applicants..."
              defaultValue={search}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateParams({ search: e.currentTarget.value, page: '1' })
                }
              }}
              className="pl-9"
            />
          </div>

          <Select
            value={status}
            onValueChange={(v) => updateParams({ status: v, page: '1' })}
          >
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusLabels).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={jobId || 'all'}
            onValueChange={(v) => updateParams({ job: v === 'all' ? '' : v, page: '1' })}
          >
            <SelectTrigger className="w-full sm:w-60">
              <SelectValue placeholder="All Jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedApps.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
            <Badge variant="secondary">{selectedApps.length} selected</Badge>
            <Select onValueChange={(v) => handleBulkStatusChange(v as ApplicationStatus)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusLabels).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      </div>

      {/* Applications Table */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No applications found</h3>
            <p className="text-muted-foreground">
              {search || status !== 'all' || jobId
                ? 'Try adjusting your filters'
                : 'Applications will appear here when candidates apply'}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedApps.length === applications.length && applications.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedApps.includes(app.id)}
                        onCheckedChange={() => toggleSelection(app.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {app.applicant_name[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{app.applicant_name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {app.applicant_email}
                            {app.applicant_phone && (
                              <>
                                <Phone className="h-3 w-3 ml-2" />
                                {app.applicant_phone}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/content/careers/${app.job?.id}`}
                        className="hover:underline font-medium"
                      >
                        {app.job?.title || 'Unknown'}
                      </Link>
                      {app.job?.department && (
                        <p className="text-xs text-muted-foreground">
                          {app.job.department.name}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusLabels[app.status].class}>
                        {statusLabels[app.status].label}
                      </Badge>
                      {app.interview_date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(app.interview_date).toLocaleDateString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {app.rating ? (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < app.rating!
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(app.created_at), {
                          addSuffix: true,
                        })}
                      </span>
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
                            <Link href={`/admin/content/careers/applications/${app.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {app.resume_url && (
                            <DropdownMenuItem asChild>
                              <a href={app.resume_url} target="_blank" rel="noopener">
                                <FileText className="mr-2 h-4 w-4" />
                                View Resume
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {Object.entries(statusLabels)
                            .filter(([key]) => key !== app.status)
                            .map(([key, { label }]) => (
                              <DropdownMenuItem
                                key={key}
                                onClick={() => handleStatusChange(app.id, key as ApplicationStatus)}
                              >
                                Mark as {label}
                              </DropdownMenuItem>
                            ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteAppId(app.id)}
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
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, total)} of {total} applications
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateParams({ page: String(page - 1) })}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateParams({ page: String(page + 1) })}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteAppId}
        onOpenChange={(open) => !open && setDeleteAppId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this application? This action cannot
              be undone.
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
            <AlertDialogTitle>Delete Selected Applications</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedApps.length} applications?
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
              Delete {selectedApps.length} Applications
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
