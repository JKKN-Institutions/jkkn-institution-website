import { Suspense } from 'react'
import { getSettings } from '@/app/actions/settings'
import { NotificationSettingsForm } from '@/components/admin/settings/notification-settings-form'
import { Skeleton } from '@/components/ui/skeleton'

// cacheComponents handles dynamic rendering automatically

export const metadata = {
  title: 'Notification Settings | Admin',
  description: 'Configure email and notification settings',
}

async function NotificationSettingsContent() {
  const { data: settings, error } = await getSettings('notifications')

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

  return <NotificationSettingsForm initialSettings={settingsMap} />
}

function NotificationSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-12" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export default function NotificationSettingsPage() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Notification Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure email notifications and SMTP settings
        </p>
      </div>

      <Suspense fallback={<NotificationSettingsSkeleton />}>
        <NotificationSettingsContent />
      </Suspense>
    </div>
  )
}
