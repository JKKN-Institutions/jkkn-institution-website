import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { FloatingActionButton } from '@/components/public/floating-action-button'
import { PublicBottomNav } from '@/components/navigation/bottom-nav/public/public-bottom-nav'
import { PageTracker } from '@/components/analytics/page-tracker'
import { MetaPixel } from '@/components/analytics/meta-pixel'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { getPublicNavigation } from '@/app/actions/cms/navigation'
import { getGlobalFabConfig } from '@/app/actions/cms/fab'
import { getLogoSizes, getLogoUrl, getLogoAltText } from '@/app/actions/cms/appearance'
import { getFooterSettings } from '@/app/actions/cms/footer'
import { getContactInfo } from '@/app/actions/cms/contact'
import { getSocialLinks } from '@/app/actions/cms/social'
import { PublicThemeProvider } from '@/components/providers/public-theme-provider'
import { getCurrentInstitution } from '@/lib/config/multi-tenant'
import { filterNavigationByFeatures } from '@/lib/utils/navigation-filter'

/**
 * Cache Components handles revalidation automatically
 * Navigation and CMS content freshness managed by Next.js 16 caching
 */

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Fetch all data in parallel for optimal performance
  const [
    rawNavigation,
    fabConfig,
    logoSizes,
    logoUrl,
    logoAltText,
    footerSettings,
    contactInfo,
    socialLinks
  ] = await Promise.all([
    getPublicNavigation(),
    getGlobalFabConfig(),
    getLogoSizes(),
    getLogoUrl(),
    getLogoAltText(),
    getFooterSettings(),
    getContactInfo(),
    getSocialLinks()
  ])

  // Get institution info for fallbacks
  const institution = getCurrentInstitution()

  // Filter navigation by feature flags
  const navigation = filterNavigationByFeatures(rawNavigation)

  // Extract primary contact info
  const primaryPhone = contactInfo.find(c => c.contact_type === 'phone' && c.is_primary)
  const primaryEmail = contactInfo.find(c => c.contact_type === 'email' && c.is_primary)

  return (
    <PublicThemeProvider>
      <div className='min-h-screen bg-cream flex flex-col relative'>
        {/* Site Header with CMS Navigation and Logo Settings - Fixed glassmorphic */}
        <SiteHeader
          navigation={navigation}
          logoSizes={logoSizes}
          logoUrl={logoUrl}
          logoAltText={logoAltText || institution.name}
          contactInfo={{
            phone: primaryPhone?.contact_value || null,
            email: primaryEmail?.contact_value || null
          }}
          socialLinks={socialLinks}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden min-h-0">{children}</main>

        {/* Analytics Page Tracker */}
        <PageTracker />

        {/* Meta Pixel for Facebook Ads */}
        <MetaPixel />

        {/* Google Analytics 4 */}
        <GoogleAnalytics />

        {/* Site Footer with CMS Settings */}
        <SiteFooter settings={footerSettings} />

        {/* Dynamic Contact FAB - Toggle at Bottom, Options fly to Top Right */}
        <FloatingActionButton config={fabConfig} />

        {/* Mobile Bottom Navbar */}
        <PublicBottomNav navigation={navigation as any} />
      </div>
    </PublicThemeProvider>
  );
}
