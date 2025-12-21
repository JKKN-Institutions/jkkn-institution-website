import { createServerSupabaseClient } from '@/lib/supabase/server'
import { InquiriesTable } from './inquiries-table'
import { Card } from '@/components/ui/card'
import { MessageSquare, Mail, CheckCircle2, Archive } from 'lucide-react'

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
    info: 'bg-blue-500',
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

  // Fetch stats
  const { data: allInquiries } = await supabase
    .from('contact_submissions')
    .select('id, status')

  const stats = {
    total: allInquiries?.length || 0,
    new: allInquiries?.filter(i => i.status === 'new').length || 0,
    read: allInquiries?.filter(i => i.status === 'read').length || 0,
    replied: allInquiries?.filter(i => i.status === 'replied').length || 0,
    archived: allInquiries?.filter(i => i.status === 'archived').length || 0
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground mt-1">
          Manage and respond to contact form submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatsCard label="Total" value={stats.total} variant="default" icon={MessageSquare} />
        <StatsCard label="New" value={stats.new} variant="warning" icon={Mail} />
        <StatsCard label="Read" value={stats.read} variant="info" icon={Mail} />
        <StatsCard label="Replied" value={stats.replied} variant="success" icon={CheckCircle2} />
        <StatsCard label="Archived" value={stats.archived} variant="secondary" icon={Archive} />
      </div>

      {/* Data Table */}
      <InquiriesTable />
    </div>
  )
}
