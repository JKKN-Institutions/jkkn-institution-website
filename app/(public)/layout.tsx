import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { FloatingActionButton } from '@/components/public/floating-action-button'
import { getPublicNavigation } from '@/app/actions/cms/navigation'
import { getGlobalFabConfig } from '@/app/actions/cms/fab'

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Fetch navigation and FAB config from CMS
  const [navigation, fabConfig] = await Promise.all([
    getPublicNavigation(),
    getGlobalFabConfig()
  ])

  return (
    <div className='min-h-screen bg-cream flex flex-col relative'>
      {/* Site Header with CMS Navigation - Fixed glassmorphic */}
      <SiteHeader navigation={navigation} />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">{children}</main>

      {/* Site Footer */}
      <SiteFooter />

      {/* Dynamic Contact FAB - Toggle at Bottom, Options fly to Top Right */}
      <FloatingActionButton config={fabConfig} />
    </div>
  );
}
