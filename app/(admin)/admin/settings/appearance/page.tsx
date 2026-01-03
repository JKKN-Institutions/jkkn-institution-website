import { Suspense } from 'react'
import { getSettings } from '@/app/actions/settings'
import { AppearanceSettingsForm } from '@/components/admin/settings/appearance-settings-form'
import { Skeleton } from '@/components/ui/skeleton'

// cacheComponents handles dynamic rendering automatically

export const metadata = {
  title: 'Appearance Settings | Admin',
  description: 'Customize site appearance and branding',
}

async function AppearanceSettingsContent() {
  const { data: settings, error } = await getSettings('appearance')

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

  return <AppearanceSettingsForm initialSettings={settingsMap} />
}

function AppearanceSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function AppearanceSettingsPage() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Appearance Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your site&apos;s logo, colors, and visual identity
        </p>
      </div>

      <Suspense fallback={<AppearanceSettingsSkeleton />}>
        <AppearanceSettingsContent />
      </Suspense>
    </div>
  )
}
