import { Suspense } from 'react'
import { getSettings } from '@/app/actions/settings'
import { SystemSettingsForm } from '@/components/admin/settings/system-settings-form'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'System Settings | Admin',
  description: 'Configure system and security settings',
}

async function SystemSettingsContent() {
  const { data: settings, error } = await getSettings('system')

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        <p>Failed to load settings: {error}</p>
      </div>
    )
  }

  // Convert settings array to object
  const settingsMap: Record<string, unknown> = {}
  settings?.forEach((s) => {
    settingsMap[s.setting_key] = s.setting_value
  })

  return <SystemSettingsForm initialSettings={settingsMap} />
}

function SystemSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="p-4 border rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export default function SystemSettingsPage() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">System Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure maintenance mode, registration, and system options
        </p>
      </div>

      <Suspense fallback={<SystemSettingsSkeleton />}>
        <SystemSettingsContent />
      </Suspense>
    </div>
  )
}
