import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { FloatingActionButton } from '@/components/public/floating-action-button'
import { PublicBottomNav } from '@/components/navigation/bottom-nav/public/public-bottom-nav'
import { getPublicNavigation } from '@/app/actions/cms/navigation'
import { getGlobalFabConfig } from '@/app/actions/cms/fab'
import { getLogoSizes } from '@/app/actions/cms/appearance'
import { getFooterSettings } from '@/app/actions/cms/footer'

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Fetch navigation, FAB config, logo sizes, and footer settings from CMS
  const [navigation, fabConfig, logoSizes, footerSettings] = await Promise.all([
    getPublicNavigation(),
    getGlobalFabConfig(),
    getLogoSizes(),
    getFooterSettings()
  ])

  return (
    <div className='min-h-screen bg-cream flex flex-col relative'>
      {/* Site Header with CMS Navigation and Logo Settings - Fixed glassmorphic */}
      <SiteHeader navigation={navigation} logoSizes={logoSizes} />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">{children}</main>

      {/* Site Footer with CMS Settings */}
      <SiteFooter settings={footerSettings} />

      {/* Dynamic Contact FAB - Toggle at Bottom, Options fly to Top Right */}
      <FloatingActionButton config={fabConfig} />

      {/* Mobile Bottom Navbar */}
      <PublicBottomNav navigation={navigation} />
    </div>
  );
}
