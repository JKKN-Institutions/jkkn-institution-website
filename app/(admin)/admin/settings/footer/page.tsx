import { Suspense } from 'react'
import { getFooterSettings } from '@/app/actions/cms/footer'
import { FooterSettingsForm } from '@/components/admin/settings/footer-settings-form'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Footer Settings | Admin',
  description: 'Manage footer content, links, and contact information',
}

async function FooterSettingsContent() {
  const settings = await getFooterSettings()

  if (!settings) {
    return (
      <div className="p-6 text-center text-destructive">
        <p>Failed to load footer settings</p>
      </div>
    )
  }

  return <FooterSettingsForm initialSettings={settings} />
}

function FooterSettingsSkeleton() {
  return (
    <div className="space-y-8">
      {/* About Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Links Sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ))}

      {/* Contact Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function FooterSettingsPage() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Footer Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage footer content, navigation links, contact information, and social media
        </p>
      </div>

      <Suspense fallback={<FooterSettingsSkeleton />}>
        <FooterSettingsContent />
      </Suspense>
    </div>
  )
}
