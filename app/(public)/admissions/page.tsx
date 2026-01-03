import { Metadata } from 'next'
import AdmissionInquiryForm from '@/components/cms-blocks/content/admission-inquiry-form'

export const metadata: Metadata = {
  title: 'Admissions | JKKN Institutions',
  description: 'Apply for admission to JKKN colleges. Start your educational journey today.',
}

export default function AdmissionsPage() {
  return (
    <main>
      <AdmissionInquiryForm
        sectionTitle="Start Your Journey with JKKN"
        sectionSubtitle="Fill out the form below and our admission counsellors will guide you through the process"
        showHeader={true}
        badge="Admissions Open"
        collegeOptions={[]}
        qualificationOptions={[]}
        contactTimeOptions={[]}
        successLinks={[]}
        variant="glass"
        backgroundColor="white-professional"
        cardStyle="glass"
        theme="light"
        showAnimations={true}
        layout="two-column"
        showDecorations={false}
        whatsappNumber="+919345855001"
        whatsappMessage="Hi, I just submitted an admission inquiry. My reference number is: "
      />
    </main>
  )
}
