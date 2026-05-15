import type { Metadata } from 'next'
import ContactPage from '@/components/cms-blocks/content/contact-page'
import { CONTACT_INFO } from '@/lib/institutions/engineering/admissions-data'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'
import { CONTACT_FAQS } from '@/lib/seo/main-institution/page-content'

export const metadata: Metadata = {
  title: 'Contact Us | JKKN Institutions',
  description:
    'Get in touch with JKKN Institutions, Namakkal. Contact our admissions office, general enquiries, or visit our campus at Natarajapuram, Komarapalayam, Tamil Nadu.',
  alternates: {
    canonical: '/contact',
  },
}

export default function MainContactPage() {
  const contactCards = [
    {
      id: 'phone',
      type: 'phone' as const,
      title: 'Call Us',
      value: '+91 93458 55001',
      link: 'tel:+919345855001',
    },
    {
      id: 'email',
      type: 'email' as const,
      title: 'Email Us',
      value: 'info@jkkn.ac.in',
      link: 'mailto:info@jkkn.ac.in',
    },
    {
      id: 'whatsapp',
      type: 'phone' as const,
      title: 'WhatsApp',
      value: '+91 93458 55001',
      link: 'https://wa.me/919345855001',
    },
    {
      id: 'address',
      type: 'address' as const,
      title: 'Campus Address',
      value:
        'Natarajapuram, NH-544 (Salem–Coimbatore Highway), Komarapalayam (TK), Namakkal (DT), Tamil Nadu – 638183',
      link: 'https://maps.google.com/?q=JKKN+Institutions+Namakkal',
    },
  ]

  return (
    <>
      {/* JSON-LD (main only): ContactPage + LocalBusiness + BreadcrumbList + FAQ */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/contact',
          name: 'Contact JKKN Institutions',
          description:
            'Reach JKKN Institutions at +91-9345855001 or info@jkkn.ac.in. Campus: Natarajapuram, NH-544, Komarapalayam, Namakkal District, Tamil Nadu 638183. Open Monday to Saturday, 9:00 AM to 6:00 PM.',
          pageType: 'ContactPage',
          keywords: [
            'JKKN contact',
            'JKKN phone number',
            'JKKN address',
            'Komarapalayam college contact',
          ],
          speakableSelectors: ['h1', '[data-speakable="contact-details"]'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Contact', url: '/contact' },
          ],
        }}
        faqs={CONTACT_FAQS}
        includeLocalBusiness
      />
      <ContactPage
      headerTitle="Contact Us"
      headerSubtitle="Get in touch with JKKN Institutions"
      headerPart1Color="#0b6d41"
      headerPart2Color="#ffde59"
      contactIntro="We'd love to hear from you. Reach out to our team for programme enquiries, campus visits, or any general information about JKKN Institutions."
      contactCards={contactCards}
      showAdmissionSection
      admissionTitle="Ready to Apply?"
      admissionSubtitle="Start your journey with JKKN — apply online for 2026 admissions today."
      admissionButtonText="Apply Now"
      admissionButtonLink="/admissions"
      showOfficeHours
      officeHoursTitle="Office Hours"
      officeHours={[
        { day: 'Monday – Saturday', hours: '9:00 AM – 6:00 PM' },
        { day: 'Sunday', hours: 'Closed' },
      ]}
      showMap
      mapEmbedUrl="https://www.google.com/maps?q=JKKN+Institutions,Komarapalayam,Tamil+Nadu,India&output=embed"
      variant="modern-light"
      cardStyle="glass"
      showDecorations
    />
    </>
  )
}
