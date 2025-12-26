import { createServerSupabaseClient } from '@/lib/supabase/server'
import { InquiriesTable } from './inquiries-table'
import { Card } from '@/components/ui/card'
import { GraduationCap, Clock, PhoneCall, CheckCircle2, XCircle } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: number
  variant?: 'default' | 'warning' | 'info' | 'success' | 'secondary'
  icon: React.ElementType
}

function StatsCard({ label, value, variant = 'default', icon: Icon }: StatsCardProps) {
  const variantStyles = {
    default: 'bg-blue-500',
    warning: 'bg-yellow-500',
    info: 'bg-cyan-500',
    success: 'bg-green-500',
    secondary: 'bg-gray-500'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${variantStyles[variant]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  )
}

export default async function InquiriesPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch stats from admission_inquiries
  const { data: allInquiries } = await supabase
    .from('admission_inquiries')
    .select('id, status')

  const stats = {
    total: allInquiries?.length || 0,
    new: allInquiries?.filter(i => i.status === 'new').length || 0,
    contacted: allInquiries?.filter(i => i.status === 'contacted').length || 0,
    followUp: allInquiries?.filter(i => i.status === 'follow_up').length || 0,
    converted: allInquiries?.filter(i => i.status === 'converted').length || 0,
    closed: allInquiries?.filter(i => i.status === 'closed').length || 0
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admission Inquiries</h1>
        <p className="text-muted-foreground mt-1">
          Manage and respond to admission inquiry form submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard label="Total" value={stats.total} variant="default" icon={GraduationCap} />
        <StatsCard label="New" value={stats.new} variant="warning" icon={Clock} />
        <StatsCard label="Contacted" value={stats.contacted} variant="info" icon={PhoneCall} />
        <StatsCard label="Follow Up" value={stats.followUp} variant="info" icon={Clock} />
        <StatsCard label="Converted" value={stats.converted} variant="success" icon={CheckCircle2} />
        <StatsCard label="Closed" value={stats.closed} variant="secondary" icon={XCircle} />
      </div>

      {/* Data Table */}
      <InquiriesTable />
    </div>
  )
}
