import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/app/actions/cms/pages'
import { getContactInfo } from '@/app/actions/cms/contact'
import { PageRenderer } from '@/components/cms-blocks/page-renderer'
import { PrivacyPolicyContent } from '@/components/public/privacy-policy-content'
import { getCurrentInstitution } from '@/lib/config/multi-tenant'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('privacy-policy')
  const institution = getCurrentInstitution()

  if (page?.cms_seo_metadata?.[0]) {
    const seo = page.cms_seo_metadata[0]
    return {
      title: seo.meta_title || undefined,
      description: seo.meta_description || undefined,
      keywords: seo.meta_keywords || [],
      robots: seo.robots_directive || 'index, follow',
      openGraph: {
        title: seo.og_title || seo.meta_title || undefined,
        description: seo.og_description || seo.meta_description || undefined,
        type: (seo.og_type as any) || 'website',
        url: seo.canonical_url || undefined,
        images: seo.og_image ? [{ url: seo.og_image }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.twitter_title || seo.og_title || seo.meta_title || undefined,
        description:
          seo.twitter_description || seo.og_description || seo.meta_description || undefined,
        images: seo.twitter_image
          ? [seo.twitter_image]
          : seo.og_image
            ? [seo.og_image]
            : [],
      },
      alternates: {
        canonical: seo.canonical_url || undefined,
      },
    }
  }

  // Fallback metadata if no CMS page found
  return {
    title: `Privacy Policy | ${institution.name}`,
    description: `Privacy policy for ${institution.name}. Learn how we protect your personal information.`,
    keywords: ['privacy policy', 'data protection', institution.name],
    robots: 'index, follow',
  }
}

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug('privacy-policy')
  const contactInfo = await getContactInfo()

  // Extract contact details
  const primaryPhone =
    contactInfo.find((c) => c.contact_type === 'phone' && c.is_primary)?.contact_value ||
    '+919345855001'
  const primaryEmail =
    contactInfo.find((c) => c.contact_type === 'email' && c.is_primary)?.contact_value ||
    'info@jkkn.ac.in'
  const primaryAddress =
    contactInfo.find((c) => c.contact_type === 'address' && c.is_primary)?.contact_value ||
    'JKKN College of Engineering and Technology, Kumarapalayam, Namakkal District, Tamil Nadu - 638183, India'

  const privacySchema = (
    <MainInstitutionPageSchema
      webpage={{
        path: '/privacy-policy',
        name: 'Privacy Policy | JKKN Institutions',
        description:
          'The Privacy Policy of JKKN Institutions explains how we collect, use, share, and protect personal information submitted through our website, admissions forms, and communication channels.',
        keywords: ['privacy policy', 'data protection', 'JKKN privacy'],
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy-policy' },
        ],
      }}
    />
  )

  // If CMS page exists, render it
  if (page && page.cms_page_blocks && page.cms_page_blocks.length > 0) {
    // Inject contact info into block props
    const blocksWithContactInfo = page.cms_page_blocks.map((block: any) => {
      if (block.component_name === 'PrivacyPolicyPage') {
        return {
          ...block,
          props: {
            ...block.props,
            contactEmail: primaryEmail,
            contactPhone: primaryPhone,
            contactAddress: primaryAddress,
          },
        }
      }
      return block
    })

    return (
      <>
        {privacySchema}
        <PageRenderer blocks={blocksWithContactInfo} />
      </>
    )
  }

  // Fallback to static component with dynamic contact info
  return (
    <>
      {privacySchema}
      <PrivacyPolicyContent
        contactEmail={primaryEmail}
        contactPhone={primaryPhone}
        contactAddress={primaryAddress}
      />
    </>
  )
}
