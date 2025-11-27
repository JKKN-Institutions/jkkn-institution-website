import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { FloatingActionButton } from '@/components/public/floating-action-button'
import { getPublicNavigation } from '@/app/actions/cms/navigation'

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Fetch navigation from CMS
  const navigation = await getPublicNavigation()

  return (
    <div className='min-h-screen bg-cream flex flex-col'>
      {/* Site Header with CMS Navigation - Fixed glassmorphic */}
      <SiteHeader navigation={navigation} />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Site Footer */}
      <SiteFooter />

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
