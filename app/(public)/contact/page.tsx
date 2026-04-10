import type { Metadata } from 'next'
import ContactPage from '@/components/cms-blocks/content/contact-page'
import { CONTACT_INFO } from '@/lib/institutions/engineering/admissions-data'

export const metadata: Metadata = {
  title: 'Contact Us | JKKN College of Engineering and Technology',
  description:
    'Get in touch with JKKN College of Engineering and Technology, Namakkal. Contact our admissions office, general enquiries, or visit our campus at Natarajapuram, Komarapalayam, Tamil Nadu.',
  alternates: {
    canonical: '/contact',
  },
}

export default function EngineeringContactPage() {
  // Map the institution's CONTACT_INFO constant into the ContactPage card shape.
  // Keeping this mapping in-page (not in admissions-data.ts) because the
  // shape is specific to this UI component, not general contact data.
  const phone = CONTACT_INFO.find((c) => c.type === 'phone')
  const email = CONTACT_INFO.find((c) => c.type === 'email')
  const whatsapp = CONTACT_INFO.find((c) => c.type === 'whatsapp')

  const contactCards = [
    phone && {
      id: 'phone',
      type: 'phone' as const,
      title: 'Call Us',
      value: phone.displayValue,
      link: phone.href,
    },
    email && {
      id: 'email',
      type: 'email' as const,
      title: 'Email Us',
      value: email.displayValue,
      link: email.href,
    },
    whatsapp && {
      id: 'whatsapp',
      type: 'phone' as const,
      title: 'WhatsApp',
      value: whatsapp.displayValue,
      link: whatsapp.href,
    },
    {
      id: 'address',
      type: 'address' as const,
      title: 'Campus Address',
      value:
        'Natarajapuram, NH-544 (Salem–Coimbatore Highway), Komarapalayam (TK), Namakkal (DT), Tamil Nadu – 638183',
      link: 'https://maps.google.com/?q=JKKN+College+of+Engineering+and+Technology+Namakkal',
    },
  ].filter((card): card is NonNullable<typeof card> => Boolean(card))

  return (
    <ContactPage
      headerTitle="Contact Us"
      headerSubtitle="Get in touch with JKKN College of Engineering and Technology"
      headerPart1Color="#0b6d41"
      headerPart2Color="#ffde59"
      contactIntro="We'd love to hear from you. Reach out to our admissions team for programme enquiries, campus visits, or any general information about JKKN College of Engineering and Technology."
      contactCards={contactCards}
      showAdmissionSection
      admissionTitle="Ready to Apply?"
      admissionSubtitle="Start your engineering journey with JKKN — apply online for 2026 admissions today."
      admissionButtonText="Apply Now"
      admissionButtonLink="/admissions/engineering"
      showOfficeHours
      officeHoursTitle="Office Hours"
      officeHours={[
        { day: 'Monday – Friday', hours: '9:00 AM – 5:00 PM' },
        { day: 'Saturday', hours: '9:00 AM – 1:00 PM' },
        { day: 'Sunday', hours: 'Closed' },
      ]}
      showMap
      mapEmbedUrl="https://www.google.com/maps?q=JKKN+College+of+Engineering+and+Technology,Komarapalayam,Tamil+Nadu,India&output=embed"
      variant="modern-light"
      cardStyle="glass"
      showDecorations
    />
  )
}
