import { Metadata } from 'next'
import AdmissionHero from '@/components/cms-blocks/admissions/admission-hero'
import WhyChooseSection from '@/components/cms-blocks/admissions/why-choose-section'
import CollegesGrid from '@/components/cms-blocks/admissions/colleges-grid'
import EligibilityCriteriaTable from '@/components/cms-blocks/admissions/eligibility-criteria-table'
import AdmissionProcessTimeline from '@/components/cms-blocks/admissions/admission-process-timeline'
import AdmissionDatesTable from '@/components/cms-blocks/admissions/admission-dates-table'
import FeeStructureTable from '@/components/cms-blocks/admissions/fee-structure-table'
import ScholarshipsSection from '@/components/cms-blocks/admissions/scholarships-section'
import DocumentsChecklist from '@/components/cms-blocks/admissions/documents-checklist'
import PlacementsHighlights from '@/components/cms-blocks/admissions/placements-highlights'
import CampusFeaturesGrid from '@/components/cms-blocks/admissions/campus-features-grid'
import { FAQSchemaAdmissionsMain } from '@/components/seo/faq-schema-admissions'

export const metadata: Metadata = {
  title: 'Admissions 2026-27 | JKKN Institutions — Apply Now',
  description: 'Apply for JKKN Institutions admission 2026-27. NAAC A accredited, 7 colleges, 92%+ placements, scholarships available. Komarapalayam, Namakkal, Tamil Nadu.',
  keywords: [
    'JKKN admissions 2026',
    'JKKN Institutions admission',
    'JKKN college admission',
    'Komarapalayam college admission',
    'Namakkal college admission',
    'JKKN dental admission',
    'JKKN engineering admission',
    'JKKN pharmacy admission',
    'JKKN nursing admission',
    'best college Namakkal',
    'NAAC accredited college Tamil Nadu',
    'JKKN fee structure',
  ],
  alternates: {
    canonical: 'https://jkkn.ac.in/admissions',
  },
  openGraph: {
    title: 'Admissions 2026-27 | JKKN Institutions — Apply Now',
    description: 'Apply for JKKN Institutions admission 2026-27. NAAC A accredited, 7 colleges, 92%+ placements, scholarships available.',
    url: 'https://jkkn.ac.in/admissions',
    siteName: 'JKKN Institutions',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admissions 2026-27 | JKKN Institutions — Apply Now',
    description: 'Apply for JKKN Institutions admission 2026-27. NAAC A accredited, 7 colleges, 92%+ placements.',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://jkkn.ac.in/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Admissions 2026-27',
      item: 'https://jkkn.ac.in/admissions',
    },
  ],
}

export default function AdmissionsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* JSON-LD: FAQPage */}
      <FAQSchemaAdmissionsMain />

      {/* 1. Hero */}
      <AdmissionHero
        title="Admissions 2026-27"
        titleAccentWord=""
        subtitle="Begin your transformative learning journey at J.K.K. Nattraja Educational Institutions — where 5000+ Learners discover their potential across 7 specialized colleges."
        badge={{
          text: 'Admissions 2026-27',
          emoji: '🎓',
        }}
        ctaButtons={[
          { label: 'Apply Now', link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8', variant: 'primary', isExternal: true, icon: 'external' },
        ]}
        trustBadges={[
          { icon: 'check', label: 'NAAC A Accredited' },
          { icon: 'check', label: 'AICTE Approved' },
          { icon: 'check', label: 'UGC Recognized' },
          { icon: 'check', label: '74+ Years of Excellence' },
        ]}
        backgroundColor="gradient-dark"
        showAnimations={true}
        accentColor="var(--gold-on-light)"
      />

      {/* 2. Why Choose JKKN */}
      <WhyChooseSection
        badge="WHY CHOOSE JKKN?"
        title="Why Choose JKKN?"
        titleAccentWord="JKKN"
        subtitle="Discover what makes J.K.K. Nattraja Educational Institutions the preferred choice for thousands of Learners every year."
        columns="3"
        features={[
          {
            icon: 'Building2',
            title: '74+ Years of Legacy',
            description: 'Established by visionary founder J.K.K. Nataraja Chettiar, JKKN has transformed lives through accessible, progressive education for over seven decades.',
          },
          {
            icon: 'GraduationCap',
            title: '7 Specialized Colleges',
            description: 'From Dental Sciences to Engineering, Pharmacy to Nursing — choose from diverse disciplines under one trusted institution.',
          },
          {
            icon: 'Users',
            title: 'Learner-Centered Approach',
            description: 'At JKKN, you\'re an active Learner shaping your future. Our Learning Facilitators guide, mentor, and empower you.',
          },
          {
            icon: 'Factory',
            title: 'Industry-Ready Programs',
            description: 'Our curriculum integrates theory with practice. State-of-the-art Learning Labs and industry partnerships make graduates career-ready.',
          },
          {
            icon: 'Briefcase',
            title: 'Strong Placement Record',
            description: '500+ recruiting companies, competitive salary packages, and dedicated placement support ensure seamless transition from campus to career.',
          },
          {
            icon: 'Star',
            title: 'Holistic Development',
            description: 'Beyond academics, JKKN nurtures well-rounded individuals through sports, cultural activities, community service, and leadership opportunities.',
          },
        ]}
        backgroundColor="white-professional"
        showAnimations={true}
        accentColor="var(--gold-on-light)"
      />

      {/* 3. Colleges Grid */}
      <CollegesGrid
        id="colleges"
        badge="OUR COLLEGES"
        title="Our 7 Colleges"
        titleAccentWord="Colleges"
        subtitle="Choose from 7 Premier Institutions Offering 50+ Programs"
        columns="3"
        colleges={[
          {
            name: 'JKKN Dental College and Hospital',
            description: 'Premier dental education with 500-bed teaching hospital',
            headerColor: '#0b6d41',
            link: 'https://dental.jkkn.ac.in/',
          },
          {
            name: 'JKKN College of Pharmacy',
            description: 'B.Pharm, M.Pharm & Pharm.D programs with PCI approval',
            headerColor: '#1e3a8a',
            link: 'https://pharmacy.jkkn.ac.in/',
          },
          {
            name: 'JKKN College of Engineering and Technology',
            description: 'AICTE approved programs in emerging technologies',
            headerColor: '#7c2d12',
            link: 'https://engg.jkkn.ac.in/',
          },
          {
            name: 'Sresakthimayeil Institute of Nursing and Research',
            description: 'INC approved nursing programs with clinical training',
            headerColor: '#0f766e',
            link: 'https://nursing.sresakthimayeil.jkkn.ac.in/',
          },
          {
            name: 'JKKN College of Arts and Science',
            description: 'UG & PG programs in arts, science & commerce',
            headerColor: '#6b21a8',
            link: 'https://cas.jkkn.ac.in/',
          },
          {
            name: 'JKKN College of Allied Health Sciences',
            description: 'Specialized healthcare professional programs',
            headerColor: '#b91c1c',
            link: 'https://ahs.jkkn.ac.in/',
          },
          {
            name: 'JKKN College of Education',
            description: 'B.Ed programs with NCTE approved curriculum',
            headerColor: '#0369a1',
            link: 'https://edu.jkkn.ac.in/',
          },
        ]}
        backgroundColor="gradient-light"
        showAnimations={true}
        accentColor="var(--gold-on-light)"
      />

      {/* 4. Eligibility Criteria */}
      <EligibilityCriteriaTable
        badge="ELIGIBILITY"
        title="Eligibility Criteria"
        titleAccentWord="Criteria"
        subtitle="Check if you meet the requirements for your chosen program"
        groupByCategory={true}
        expandableRows={false}
        criteria={[
          { program: 'BDS', qualification: '10+2 with PCB (50%)', ageLimit: '17-25 years', category: 'medical', otherRequirements: 'NEET Qualified' },
          { program: 'MDS', qualification: 'BDS from recognized university', ageLimit: 'No limit', category: 'medical', otherRequirements: 'NEET-MDS Qualified' },
          { program: 'B.Pharm', qualification: '10+2 with PCM/PCB (45%)', ageLimit: '17-25 years', category: 'pharmacy' },
          { program: 'Pharm.D', qualification: '10+2 with PCB (50%)', ageLimit: '17-25 years', category: 'pharmacy' },
          { program: 'B.Sc Nursing', qualification: '10+2 with PCB (45%)', ageLimit: '17-35 years', category: 'nursing' },
          { program: 'GNM', qualification: '10+2 with Science (40%)', ageLimit: '17-35 years', category: 'nursing' },
          { program: 'B.E/B.Tech', qualification: '10+2 with PCM (50%)', ageLimit: '17-25 years', category: 'engineering' },
          { program: 'B.Sc/B.Com/BA', qualification: '10+2 Pass (45%)', ageLimit: 'No limit', category: 'arts-science' },
        ]}
        backgroundColor="gradient-dark"
        showAnimations={true}
        accentColor="var(--gold-on-light)"
      />

      {/* 5. Admission Process */}
      <AdmissionProcessTimeline
        title="Admission Process"
        titleAccentWord="Process"
        subtitle="Your journey to JKKN in 5 simple steps"
        badge="HOW TO APPLY"
        backgroundColor="white-professional"
        orientation="auto"
        stepColor="#0b6d41"
        activeColor="#D4AF37"
        completedColor="#22c55e"
        accentColor="var(--gold-on-light)"
        showAnimations={true}
        steps={[
          {
            number: 1,
            title: 'Choose Your Program',
            description: 'Explore 50+ programs across 7 colleges',
            icon: 'Search',
          },
          {
            number: 2,
            title: 'Apply Online',
            description: 'Fill the application form with required documents',
            icon: 'FileText',
          },
          {
            number: 3,
            title: 'Document Verification',
            description: 'Submit originals for verification',
            icon: 'ClipboardCheck',
          },
          {
            number: 4,
            title: 'Counselling',
            description: 'Attend counselling session for seat allotment',
            icon: 'Users',
          },
          {
            number: 5,
            title: 'Admission Confirmation',
            description: 'Pay fees and confirm your admission',
            icon: 'CheckCircle',
          },
        ]}
      />

      {/* 6. Key Dates */}
      {/* [UPDATE] — Dates need admin confirmation for 2026-27 */}
      <AdmissionDatesTable
        title="Admission Calendar 2026-27"
        titleAccentWord="Calendar"
        badge="IMPORTANT DATES"
        subtitle="Mark your calendar with these important admission dates"
        backgroundColor="gradient-light"
        showAnimations={true}
        alternatingRows={true}
        accentColor="var(--gold-on-light)"
        dates={[
          { event: 'Application Opens', date: 'January 15, 2026', status: 'open' },
          { event: 'Early Bird Deadline', date: 'February 28, 2026', status: 'upcoming' },
          { event: 'Regular Application Deadline', date: 'April 30, 2026', status: 'upcoming' },
          { event: 'Document Submission', date: 'May 15, 2026', status: 'upcoming' },
          { event: 'Counselling Phase 1', date: 'June 1-15, 2026', status: 'upcoming' },
          { event: 'Counselling Phase 2', date: 'June 20-30, 2026', status: 'upcoming' },
          { event: 'Classes Commence', date: 'July 15, 2026', status: 'upcoming' },
          { event: 'Application Final Deadline', date: 'August 31, 2026', status: 'upcoming' },
        ]}
      />

      {/* 7. Fee Structure */}
      {/* [UPDATE] — Fee amounts from schema defaults. Needs finance department verification. */}
      <FeeStructureTable
        badge="FEE STRUCTURE"
        title="Fee Structure Overview"
        titleAccentWord="Structure"
        subtitle="Transparent and affordable fee structure for all programs"
        groupByCategory={true}
        showHostelFee={true}
        showOtherFees={false}
        currencySymbol="₹"
        currencyLocale="en-IN"
        fees={[
          { program: 'BDS', tuitionFee: 500000, hostelFee: 75000, total: 575000, category: 'medical' },
          { program: 'B.Pharm', tuitionFee: 85000, hostelFee: 60000, total: 145000, category: 'pharmacy' },
          { program: 'B.Sc Nursing', tuitionFee: 75000, hostelFee: 55000, total: 130000, category: 'nursing' },
          { program: 'B.E/B.Tech', tuitionFee: 95000, hostelFee: 60000, total: 155000, category: 'engineering' },
          { program: 'B.Sc/B.Com/BA', tuitionFee: 35000, hostelFee: 50000, total: 85000, category: 'arts-science' },
        ]}
        footerNotes={[
          'Fees are subject to revision as per university/regulatory norms',
          'Hostel fees are optional and include mess charges',
          'Scholarships and fee concessions available for eligible students',
        ]}
        backgroundColor="gradient-dark"
        showAnimations={true}
        accentColor="var(--gold-on-light)"
      />

      {/* 8. Scholarships */}
      <ScholarshipsSection
        badge="SCHOLARSHIPS"
        title="Scholarships & Financial Aid"
        titleAccentWord="Financial Aid"
        subtitle="We believe financial constraints should never limit your dreams"
        columns="4"
        showCTA={false}
        scholarships={[
          {
            icon: 'Trophy',
            title: 'Merit Scholarships',
            description: 'Up to 100% tuition fee waiver for academic excellence',
            eligibility: ['90%+ in qualifying exam', 'Rank holders in entrance exams', 'Academic toppers in JKKN'],
            type: 'merit',
          },
          {
            icon: 'Building2',
            title: 'Government Scholarships',
            description: 'State and central government scholarship schemes',
            eligibility: ['SC/ST/OBC/MBC categories', 'EWS category students', 'Minority community students'],
            type: 'government',
          },
          {
            icon: 'Heart',
            title: 'Need-Based Aid',
            description: 'Financial support for economically disadvantaged students',
            eligibility: ['Family income below threshold', 'Single parent families', 'Orphan students'],
            type: 'need-based',
          },
          {
            icon: 'Medal',
            title: 'Sports & Cultural',
            description: 'Special quota for sports and cultural achievers',
            eligibility: ['State/National level players', 'Cultural competition winners', 'Outstanding performers'],
            type: 'sports-cultural',
          },
        ]}
        backgroundColor="gradient-dark"
        showAnimations={true}
        accentColor="var(--gold-on-light)"
      />

      {/* 9. Documents Checklist */}
      <DocumentsChecklist
        badge="DOCUMENTS"
        title="Documents Required"
        titleAccentWord="Documents"
        subtitle="Keep these documents ready for a smooth admission process"
        leftColumnTitle="For All Programs"
        leftColumnDocuments={[
          { text: '10th Mark Sheet & Certificate (Original + 2 copies)', required: true },
          { text: '12th Mark Sheet & Certificate (Original + 2 copies)', required: true },
          { text: 'Transfer Certificate from last institution', required: true },
          { text: 'Migration Certificate (if applicable)', required: false },
          { text: 'Community Certificate (for quota)', required: false },
          { text: 'Aadhar Card (Original + 2 copies)', required: true },
          { text: 'Passport Size Photos (10 nos)', required: true },
        ]}
        rightColumnTitle="Additional Documents"
        rightColumnDocuments={[
          { text: 'NEET Score Card (Medical/Dental/Pharmacy)', required: false },
          { text: 'Entrance Exam Admit Card', required: false },
          { text: 'Income Certificate (for scholarship)', required: false },
          { text: 'Caste Certificate (if applicable)', required: false },
          { text: 'Sports/Cultural Achievement Certificates', required: false },
          { text: 'Gap Certificate (if gap in education)', required: false },
          { text: 'Medical Fitness Certificate', required: true },
        ]}
        showCTA={false}
        checkIcon="checkbox"
        backgroundColor="gradient-dark"
        showAnimations={true}
        accentColor="var(--gold-on-light)"
      />

      {/* 10. Placements */}
      <PlacementsHighlights
        badge="PLACEMENTS"
        title="Placement Highlights"
        titleAccentWord="Placement"
        subtitle="From campus to career — JKKN Learners are recruited by top companies across industries."
        stats={[
          { value: '500', suffix: '+', label: 'Recruiting Companies' },
          { value: '92', suffix: '%+', label: 'Placement Rate' },
          { value: '8.5', prefix: '₹', suffix: ' LPA', label: 'Highest Package' },
          { value: '3.5', prefix: '₹', suffix: ' LPA', label: 'Average Package' },
        ]}
        recruitersText="Top Recruiters: Apollo Hospitals • Infosys • TCS • Wipro • HCL • Dr. Reddy's • Cipla • Sun Pharma • L&T • Ashok Leyland • Cognizant • Tech Mahindra • and 500+ more"
        showCTA={true}
        ctaText="View Complete Placement Records"
        ctaLink="/placements/"
        backgroundColor="gradient-light"
        showAnimations={true}
        accentColor="var(--gold-on-light)"
      />

      {/* 11. Campus Features */}
      <CampusFeaturesGrid
        badge="CAMPUS LIFE"
        title="Campus Life at JKKN"
        titleAccentWord="Campus Life"
        subtitle="Beyond academics — experience a vibrant campus life with world-class facilities."
        columns="4"
        features={[
          { emoji: '🏠', title: 'Hostels', description: 'Separate boys & girls hostels with 24/7 security, Wi-Fi, and home-like comfort.' },
          { emoji: '🍽️', title: 'Dining', description: 'Hygienic, nutritious meals. Veg & non-veg options at central canteen.' },
          { emoji: '📚', title: 'Libraries', description: '50,000+ books, journals, digital resources across all campuses.' },
          { emoji: '🔬', title: 'Learning Labs', description: 'State-of-the-art labs, simulation centers, and research facilities.' },
          { emoji: '🏃', title: 'Sports', description: 'Cricket, basketball, volleyball, indoor games, and fitness center.' },
          { emoji: '🏥', title: 'Healthcare', description: 'On-campus health center and attached hospital facilities.' },
          { emoji: '🚌', title: 'Transport', description: 'College buses covering Namakkal, Salem, Erode & surrounding areas.' },
          { emoji: '🛡️', title: 'Security', description: '24/7 CCTV surveillance, security personnel, strict visitor management.' },
        ]}
        backgroundColor="white-professional"
        showAnimations={true}
        accentColor="var(--gold-on-light)"
      />

      {/* 12. FAQ Schema — JSON-LD only, rendered above */}

    </main>
  )
}
