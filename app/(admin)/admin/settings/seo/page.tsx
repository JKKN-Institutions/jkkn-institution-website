import { Suspense } from 'react'
import { getSettings } from '@/app/actions/settings'
import { SEOSettingsForm } from '@/components/admin/settings/seo-settings-form'
import { Skeleton } from '@/components/ui/skeleton'

// Force dynamic rendering (uses cookies for auth)
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'SEO Settings | Admin',
  description: 'Configure SEO and analytics settings',
}

async function SEOSettingsContent() {
  const { data: settings, error } = await getSettings('seo')

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

  return <SEOSettingsForm initialSettings={settingsMap} />
}

function SEOSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
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

export default function SEOSettingsPage() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">SEO Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure search engine optimization and analytics tracking
        </p>
      </div>

      <Suspense fallback={<SEOSettingsSkeleton />}>
        <SEOSettingsContent />
      </Suspense>
    </div>
  )
}
