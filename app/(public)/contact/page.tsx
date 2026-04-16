import type { Metadata } from 'next'
import ContactPage from '@/components/cms-blocks/content/contact-page'

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
        { day: 'Monday – Friday', hours: '9:00 AM – 5:00 PM' },
        { day: 'Saturday', hours: '9:00 AM – 1:00 PM' },
        { day: 'Sunday', hours: 'Closed' },
      ]}
      showMap
      mapEmbedUrl="https://www.google.com/maps?q=JKKN+Institutions,Komarapalayam,Tamil+Nadu,India&output=embed"
      variant="modern-light"
      cardStyle="glass"
      showDecorations
    />
  )
}
