import { Metadata } from 'next'
import AdmissionHero from '@/components/cms-blocks/admissions/admission-hero'
import AdmissionProcessTimeline from '@/components/cms-blocks/admissions/admission-process-timeline'
import AdmissionDatesTable from '@/components/cms-blocks/admissions/admission-dates-table'
import AdmissionInquiryForm from '@/components/cms-blocks/content/admission-inquiry-form'

export const metadata: Metadata = {
  title: 'Admissions 2025-26 | JKKN Institutions',
  description: 'Apply for admission to JKKN colleges for the academic year 2025-26. Explore courses in Engineering, Dental, Pharmacy, Nursing, Arts, and more.',
}

export default function AdmissionsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <AdmissionHero 
        title="Admissions 2025-26"
        subtitle="Begin your transformative learning journey at J.K.K. Nattraja Educational Institutions — where 5000+ Learners discover their potential across 7 specialized colleges."
        badge={{
          text: "Celebrating #JKKN100 — Founder's Centenary Year",
          emoji: "🎉"
        }}
        ctaButtons={[
          { label: 'Apply Now', link: '#apply', variant: 'primary', icon: 'arrow' },
          { label: 'Download Prospectus', link: '/prospectus.pdf', variant: 'outline', icon: 'download' },
        ]}
        trustBadges={[
          { icon: 'check', label: 'NAAC Accredited' },
          { icon: 'check', label: 'AICTE Approved' },
          { icon: 'check', label: 'UGC Recognized' },
          { icon: 'check', label: 'ISO Certified' },
        ]}
        backgroundColor="gradient-dark"
        className="pb-32" // Extra padding for overlap if needed, or visual spacing
      />

      {/* Process Timeline */}
      <AdmissionProcessTimeline
        title="Your Journey to Success"
        subtitle="Follow these 5 simple steps to secure your admission at JKKN."
        badge="ADMISSION PROCESS"
        backgroundColor="transparent"
        titleAccentWord="Success"
        orientation="auto"
        stepColor="#0b6d41"
        activeColor="var(--gold-decorative)"
        completedColor="#22c55e"
        accentColor="var(--gold-on-light)"
        showAnimations={true}
        steps={[
          {
            number: 1,
            title: "Register Online",
            description: "Fill out the simple inquiry form below to start your application process.",
            icon: "FileText"
          },
          {
            number: 2,
            title: "Counselling",
            description: "Our admission experts will contact you to guide you through course selection.",
            icon: "Users"
          },
          {
            number: 3,
            title: "Document Verification",
            description: "Submit necessary academic documents for verification.",
            icon: "ClipboardCheck"
          },
          {
            number: 4,
            title: "Confirm Admission",
            description: "Pay the admission fee to confirm your seat in your preferred course.",
            icon: "CheckCircle"
          },
          {
            number: 5,
            title: "Welcome to JKKN",
            description: "Receive your admission letter and join the JKKN family.",
            icon: "GraduationCap"
          }
        ]}
        className="relative z-10 -mt-20 rounded-t-[40px] border-t border-white/50 shadow-2xl"
      />

      {/* Important Dates */}
      <AdmissionDatesTable
        title="Key Dates 2025-26"
        titleAccentWord="2025-26"
        badge="ACADEMIC CALENDAR"
        subtitle="Keep track of important deadlines and exam dates."
        backgroundColor="transparent"
        showAnimations={true}
        alternatingRows={true}
        accentColor="var(--gold-on-light)"
        dates={[
          { event: "Application Opens", date: "January 20, 2025", status: "open" },
          { event: "Entrance Exam (Phase 1)", date: "April 15, 2025", status: "upcoming" },
          { event: "Counseling Starts", date: "May 10, 2025", status: "upcoming" },
          { event: "Last Date for Phase 1", date: "May 30, 2025", status: "upcoming" },
          { event: "Academic Session Begins", date: "July 2025", status: "upcoming" },
        ]}
      />

      {/* Inquiry Form */}
      <div id="apply">
        <AdmissionInquiryForm
          sectionTitle="Secure Your Seat Today"
          sectionSubtitle="Fill out the form below and our admission counsellors will guide you through the process"
          showHeader={true}
          badge="APPLY NOW"
          variant="glass"
          backgroundColor="gradient-light"
          cardStyle="glass"
          theme="light"
          showAnimations={true}
          layout="two-column"
          showDecorations={true}
          whatsappNumber="+919345855001"
          whatsappMessage="Hi, I just submitted an admission inquiry. My reference number is: "
          collegeOptions={[
            { id: 'dental', name: 'JKKN Dental College & Hospital', courses: ['BDS', 'MDS'] },
            { id: 'pharmacy', name: 'JKKN College of Pharmacy', courses: ['B.Pharm', 'M.Pharm', 'Pharm.D'] },
            { id: 'engineering', name: 'JKKN College of Engineering & Technology', courses: ['B.E. CSE', 'B.E. ECE', 'B.E. Mechanical'] },
            { id: 'arts', name: 'JKKN College of Arts & Science', courses: ['B.Sc', 'M.Sc', 'BBA', 'BCA'] },
            { id: 'nursing', name: 'Sresakthimayeil Institute Of Nursing', courses: ['B.Sc Nursing', 'GNM'] },
          ]}
          qualificationOptions={['10th / SSLC', '12th / HSC', 'Diploma', 'Undergraduate', 'Postgraduate', 'Other']}
          contactTimeOptions={['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 3 PM)', 'Evening (3 PM - 6 PM)', 'Any Time']}
          successLinks={[
            { label: 'Download Prospectus', url: '/downloads/prospectus.pdf', icon: 'Download' },
            { label: 'Virtual Campus Tour', url: '/virtual-tour', icon: 'Video' },
          ]}
        />
      </div>
    </main>
  )
}
