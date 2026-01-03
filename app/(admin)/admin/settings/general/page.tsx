import { Suspense } from 'react'
import { getSettings } from '@/app/actions/settings'
import { GeneralSettingsForm } from '@/components/admin/settings/general-settings-form'
import { Skeleton } from '@/components/ui/skeleton'

// Force dynamic rendering since this page uses cookies for auth
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'General Settings | Admin',
  description: 'Manage general site settings',
}

async function GeneralSettingsContent() {
  const { data: settings, error } = await getSettings('general')

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

  return <GeneralSettingsForm initialSettings={settingsMap} />
}

function GeneralSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export default function GeneralSettingsPage() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure basic site information and contact details
        </p>
      </div>

      <Suspense fallback={<GeneralSettingsSkeleton />}>
        <GeneralSettingsContent />
      </Suspense>
    </div>
  )
}
