import AdmissionHero from '@/components/cms-blocks/admissions/admission-hero'
import WhyChooseSection from '@/components/cms-blocks/admissions/why-choose-section'
import CollegesGrid from '@/components/cms-blocks/admissions/colleges-grid'
import EligibilityCriteriaTable from '@/components/cms-blocks/admissions/eligibility-criteria-table'
import AdmissionProcessTimeline from '@/components/cms-blocks/admissions/admission-process-timeline'
import AdmissionDatesTable from '@/components/cms-blocks/admissions/admission-dates-table'
// import FeeStructureTable from '@/components/cms-blocks/admissions/fee-structure-table' // hidden until correct data is added
import ScholarshipsSection from '@/components/cms-blocks/admissions/scholarships-section'
import DocumentsChecklist from '@/components/cms-blocks/admissions/documents-checklist'
import PlacementsHighlights from '@/components/cms-blocks/admissions/placements-highlights'
import CampusFeaturesGrid from '@/components/cms-blocks/admissions/campus-features-grid'
import { PartnersLogos } from '@/components/cms-blocks/content/partners-logos'
import { FAQSchemaAdmissionsMain } from '@/components/seo/faq-schema-admissions'
import { Compass } from 'lucide-react'
import Image from 'next/image'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'
import {
  ADMISSIONS_HOWTO_NAME,
  ADMISSIONS_HOWTO_DESCRIPTION,
  ADMISSIONS_HOWTO_STEPS,
  ADMISSIONS_SPEAKABLE_SELECTORS,
} from '@/lib/seo/main-institution/page-content'

export default function MainAdmissionsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* JSON-LD: FAQPage (existing — admissions-specific FAQs) */}
      <FAQSchemaAdmissionsMain />

      {/* JSON-LD: @graph — WebPage + BreadcrumbList + HowTo + Offer (fee) */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/admissions',
          name: 'Admissions 2026-27 | JKKN Institutions',
          description:
            'Apply for JKKN Institutions admission 2026-27 — NAAC accredited, 7 colleges, 92%+ placements, scholarships available. Komarapalayam, Namakkal, Tamil Nadu.',
          keywords: [
            'JKKN admissions 2026',
            'JKKN Institutions admission',
            'Komarapalayam college admission',
            'Namakkal college admission',
            'NAAC accredited college Tamil Nadu',
          ],
          speakableSelectors: ADMISSIONS_SPEAKABLE_SELECTORS,
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Admissions', url: '/admissions' },
          ],
        }}
        howTo={{
          name: ADMISSIONS_HOWTO_NAME,
          description: ADMISSIONS_HOWTO_DESCRIPTION,
          steps: ADMISSIONS_HOWTO_STEPS,
        }}
        offers={[
          {
            name: 'Admission 2026-27 Application',
            description:
              'Online admission application to UG and PG programmes across JKKN Institutions 7 colleges. Scholarships and education loans available for eligible students.',
            url: 'https://www.jkkn.ai/apply/jkkn-admission-2026',
            priceCurrency: 'INR',
            priceValidUntil: '2027-06-30',
            availability: 'https://schema.org/InStock',
            category: 'EducationalApplication',
          },
        ]}
      />

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
          { label: 'Apply Now', link: 'https://www.jkkn.ai/apply/jkkn-admission-2026', variant: 'primary', isExternal: true, icon: 'external' },
        ]}
        trustBadges={[
          { icon: 'check', label: 'NAAC A Accredited' },
          { icon: 'check', label: 'AICTE Approved' },
          { icon: 'check', label: 'UGC Recognized' },
          { icon: 'check', label: '74+ Years of Excellence' },
        ]}
        backgroundColor="gradient-dark"
        showAnimations={true}
        accentColor="#ffde59"
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
            description: "At JKKN, you're an active Learner shaping your future. Our Learning Facilitators guide, mentor, and empower you.",
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
        accentColor="#0b6d41"
      />

      {/* AI-Empowered Institution Hero — INDIA's First */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[#085032] via-[#0b6d41] to-[#073a25]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 35%, #ffde59 0%, transparent 35%), radial-gradient(circle at 75% 65%, #ffffff 0%, transparent 30%)',
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 bg-[#ffde59] text-[#085032] px-5 py-2 rounded-full text-xs font-bold tracking-[0.25em] uppercase">
                <span className="w-2 h-2 bg-[#085032] rounded-full animate-pulse" />
                INDIA&apos;s First
              </span>
            </div>
            <h2 className="font-serif-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              AI-Empowered <span className="text-[#ffde59]">Institution</span>
            </h2>
            <p className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto mb-12 leading-relaxed">
              JKKN is pioneering the next era of higher education in India — every program in every college is being redesigned around an AI-integrated learning workflow. Critical thinking is the foundation. AI is the amplifier.
            </p>
            <blockquote className="relative max-w-3xl mx-auto mb-16 px-8">
              <span className="absolute -top-4 left-0 text-[#ffde59]/30 text-7xl md:text-8xl font-serif leading-none select-none" aria-hidden="true">&ldquo;</span>
              <p className="text-xl md:text-2xl lg:text-3xl text-white italic font-light leading-relaxed">
                Every program develops critical thinking first — then introduces AI as a tool that amplifies human judgement.
              </p>
              <span className="absolute -bottom-12 right-0 text-[#ffde59]/30 text-7xl md:text-8xl font-serif leading-none select-none" aria-hidden="true">&rdquo;</span>
            </blockquote>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
              {[
                {
                  number: '01',
                  title: 'Critical Thinking First',
                  desc: 'Foundational reasoning, ethics, and problem framing precede any tool. Learners build the judgement that makes AI productive — not hazardous.',
                },
                {
                  number: '02',
                  title: 'AI as Amplifier',
                  desc: 'Every discipline learns the AI workflow that fits its work. Industry-grade tools become extensions of human capability, never replacements.',
                },
                {
                  number: '03',
                  title: 'AI-Integrated Campus',
                  desc: 'Classrooms, labs, libraries, and learner workflows are designed for AI-augmented learning from day one — native, not retrofitted.',
                },
              ].map((pillar) => (
                <div
                  key={pillar.number}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 text-left transition-transform hover:-translate-y-1"
                >
                  <div className="text-[#ffde59] text-3xl font-bold mb-3 font-serif-heading">{pillar.number}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{pillar.title}</h3>
                  <p className="text-white/75 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Our Learners Master */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block bg-[#0b6d41]/10 text-[#0b6d41] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              AI Toolkit
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0b6d41] mb-4">
              AI Tools Our Learners <span className="text-[#D4AF37]">Master</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              From research and reasoning to design and code — JKKN learners graduate fluent in the AI tools that define modern work.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              { name: 'Claude', logo: '/images/ai-tools/claude.png', color: '#D97757', tag: 'Deep Reasoning', use: 'Long-form analysis, writing, and extended thinking.' },
              { name: 'Perplexity', logo: null, color: '#20808D', tag: 'Web Research', use: 'Real-time answers with cited sources.' },
              { name: 'ChatGPT', logo: '/images/ai-tools/chatgpt.png', color: '#10A37F', tag: 'Conversational AI', use: 'Ideation, learning support, and tutoring.' },
              { name: 'Gemini', logo: '/images/ai-tools/gemini.png', color: '#1F6FEB', tag: 'Multimodal', use: 'Reasoning across text, image, audio, and video.' },
              { name: 'Lovable', logo: '/images/ai-tools/lovable.jpg', color: '#FF6B6B', tag: 'AI Apps', use: 'Idea-to-software prototyping for learners.' },
              { name: 'NotebookLM', logo: '/images/ai-tools/notebooklm.png', color: '#4285F4', tag: 'Study Notebooks', use: 'Source-grounded notes from course material.' },
              { name: 'Midjourney', logo: '/images/ai-tools/midjourney.png', color: '#7C3AED', tag: 'Generative Imagery', use: 'Design, storytelling, and concept visuals.' },
            ].map((tool) => (
              <div
                key={tool.name}
                className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                style={{ borderTop: `3px solid ${tool.color}` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-white border border-gray-100">
                  {tool.logo ? (
                    <Image
                      src={tool.logo}
                      alt={`${tool.name} logo`}
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  ) : (
                    <Compass className="w-6 h-6" style={{ color: tool.color }} />
                  )}
                </div>
                <h3 className="font-bold text-base text-gray-900 mb-1">{tool.name}</h3>
                <span
                  className="inline-block text-[10px] font-semibold uppercase tracking-wider mb-2"
                  style={{ color: tool.color }}
                >
                  {tool.tag}
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">{tool.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            link: 'https://dental.jkkn.ac.in/admission',
          },
          {
            name: 'JKKN College of Pharmacy',
            description: 'B.Pharm, M.Pharm & Pharm.D programs with PCI approval',
            headerColor: '#0b6d41',
            link: 'https://pharmacy.jkkn.ac.in/admissions',
          },
          {
            name: 'JKKN College of Engineering and Technology (Autonomous)',
            description: 'AICTE approved programs in emerging technologies',
            headerColor: '#0b6d41',
            link: 'https://engg.jkkn.ac.in/admissions',
          },
          {
            name: 'Sresakthimayeil Institute of Nursing and Research',
            description: 'INC approved nursing programs with clinical training',
            headerColor: '#0b6d41',
            link: 'https://nursing.sresakthimayeil.jkkn.ac.in/admissions',
          },
          {
            name: 'JKKN College of Arts and Science (Autonomous)',
            description: 'UG & PG programs in arts, science & commerce',
            headerColor: '#0b6d41',
            link: 'https://cas.jkkn.ac.in/admissions',
          },
          {
            name: 'JKKN College of Allied Health Sciences',
            description: 'Specialized healthcare professional programs',
            headerColor: '#0b6d41',
            link: 'https://ahs.jkkn.ac.in/admissions',
          },
          {
            name: 'JKKN College of Education',
            description: 'B.Ed programs with NCTE approved curriculum',
            headerColor: '#0b6d41',
            link: 'https://edu.jkkn.ac.in/admissions',
          },
        ]}
        backgroundColor="gradient-light"
        showAnimations={true}
        accentColor="#0b6d41"
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
        backgroundColor="white-professional"
        showAnimations={true}
        accentColor="#0b6d41"
      />

      {/* 5. Admission Process */}
      <AdmissionProcessTimeline
        title="Admission Process"
        titleAccentWord="Process"
        subtitle="Your journey to JKKN in 6 simple steps"
        badge="HOW TO APPLY"
        backgroundColor="gradient-light"
        orientation="auto"
        stepColor="#0b6d41"
        activeColor="#ffde59"
        completedColor="#0b6d41"
        accentColor="#0b6d41"
        showAnimations={true}
        steps={[
          { number: 1, title: "Learner's Registration", description: 'Register online to start your admission journey. Create your profile with basic details and your chosen college.', icon: 'UserPlus', link: 'https://www.jkkn.ai/apply/jkkn-admission-2026' },
          { number: 2, title: 'Online Application Submission', description: 'Complete the application form with personal, academic, and program details.', icon: 'FileText' },
          { number: 3, title: 'Payment Process', description: 'Pay the application fee securely online to lock your submission.', icon: 'CreditCard' },
          { number: 4, title: 'Admission Confirmation', description: 'Receive your provisional admission letter after document screening.', icon: 'CheckCircle' },
          { number: 5, title: 'Certificate Submission', description: 'Submit originals — 10th, 12th, transfer, community certificates — to the admissions office.', icon: 'FileCheck' },
          { number: 6, title: 'Final Enrollment', description: 'Pay tuition, collect ID card, and join orientation to complete enrollment.', icon: 'GraduationCap' },
        ]}
      />

      {/* 6. Key Dates */}
      <AdmissionDatesTable
        title="Admission Calendar 2026-27"
        titleAccentWord="Calendar"
        badge="IMPORTANT DATES"
        subtitle="Mark your calendar with these important admission dates"
        backgroundColor="white-professional"
        showAnimations={true}
        alternatingRows={true}
        accentColor="#0b6d41"
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

      {/* 7. Fee Structure — hidden until correct fee data is confirmed and ready to publish */}
      {/* <FeeStructureTable
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
        backgroundColor="gradient-light"
        showAnimations={true}
        accentColor="#0b6d41"
      /> */}

      {/* 8. Scholarships */}
      <ScholarshipsSection
        badge="SCHOLARSHIPS"
        title="Scholarships & Financial Aid"
        titleAccentWord="Financial Aid"
        subtitle="We believe financial constraints should never limit your dreams"
        columns="4"
        showCTA={false}
        ctaText=""
        ctaLink=""
        scholarships={[
          {
            icon: 'Building2',
            title: 'PMSS Community Scholarship',
            description: 'Post Matric Scholarship Scheme for SC/SCA/ST/BC-CC category students (GQ)',
            eligibility: ['BE/BTech: ₹50,000/Year', 'MBA: ₹35,000/Year', 'ME: ₹50,000/Year'],
            type: 'government',
          },
          {
            icon: 'Trophy',
            title: 'Trust Scholarship (Merit-Based)',
            description: 'JKKN Trust merit scholarship for academically outstanding students (MQ/GQ)',
            eligibility: ['BE/BTech: ₹5,000 to 100% fee waiver/Year', 'Based on academic performance', 'Available for Management & Government quota'],
            type: 'merit',
          },
          {
            icon: 'Award',
            title: 'First Graduate Scholarship',
            description: 'Government scholarship for first-generation college graduates (GQ)',
            eligibility: ['BE/BTech: ₹25,000/Year', 'First in family to attend college', 'Government quota students only'],
            type: 'government',
          },
          {
            icon: 'Heart',
            title: 'Community Scholarship',
            description: 'Financial support for BC/MBC/DNC/BCM category students (GQ)',
            eligibility: ['BE/BTech: ₹5,000–₹10,000/Year', 'MBA: ₹5,000–₹10,000/Year', 'ME: ₹5,000–₹10,000/Year'],
            type: 'need-based',
          },
          {
            icon: 'Medal',
            title: 'Maintenance Scholarship',
            description: 'Sustenance support for all eligible engineering students (GQ)',
            eligibility: ['BE/BTech: ₹5,000–₹10,000/Year', 'MBA: ₹5,000–₹10,000/Year', 'ME: ₹5,000–₹10,000/Year'],
            type: 'need-based',
          },
          {
            icon: 'Award',
            title: 'Naan Mudhalvan Scholarship',
            description: 'Tamil Nadu Government initiative for engineering students',
            eligibility: ['BE/BTech: ₹1,000/month', 'Available for boys & girls', 'Govt/Govt-aided school (6–12) Tamil medium students'],
            type: 'sports-cultural',
          },
        ]}
        backgroundColor="white-professional"
        showAnimations={true}
        accentColor="#0b6d41"
      />

      {/* 9. Documents Checklist */}
      <DocumentsChecklist
        badge="DOCUMENTS"
        title="Documents Required"
        titleAccentWord="Documents"
        subtitle="Keep these documents ready for a smooth admission process"
        leftColumnTitle="For All Programs"
        leftColumnDocuments={[
          { text: 'Mark Sheets', note: 'Qualifying examination mark sheet / provisional certificate (attested by School Headmaster)', required: true },
          { text: 'Transfer Certificate', note: 'Original TC from the last institution attended', required: true },
          { text: 'Community Certificate', note: 'If applicable (for SC/ST/OBC/MBC candidates)', required: false },
          { text: 'Eligibility Certificate', note: 'For students from other states/universities', required: false },
          { text: 'Special Quota Proof', note: 'Differently Abled, Sports, NCC, Ex-Servicemen certificates (if applicable)', required: false },
          { text: 'Passport Photos', note: 'Recent passport-size photographs (6 copies)', required: true },
          { text: 'Conduct Certificate', note: 'From the last institution attended', required: true },
          { text: 'Income Certificate', note: 'For scholarship applications (if applicable)', required: false },
        ]}
        rightColumnTitle="Additional Documents"
        rightColumnDocuments={[
          { text: 'Aadhar Card', note: 'Original + 2 attested photocopies', required: true },
          { text: 'NEET Score Card', note: 'For Medical / Dental / Pharmacy / Nursing programs', required: false },
          { text: 'Entrance Exam Admit Card', note: 'Original admit card of qualifying entrance exam', required: false },
          { text: 'Sports / Cultural Certificates', note: 'State or National level achievement certificates', required: false },
          { text: 'Gap Certificate', note: 'Self-declaration if gap year exists after qualifying exam', required: false },
          { text: 'Medical Fitness Certificate', note: 'From a registered medical practitioner', required: true },
          { text: 'Migration Certificate', note: 'If migrating from another university / board', required: false },
        ]}
        showCTA={false}
        ctaText=""
        ctaLink=""
        checkIcon="checkbox"
        backgroundColor="gradient-light"
        showAnimations={true}
        accentColor="#0b6d41"
      />

      {/* 10. Placements */}
      <PlacementsHighlights
        badge="PLACEMENTS"
        title="Placement Highlights"
        titleAccentWord="Placement"
        subtitle="Our learners don't just get jobs — they get careers. From campus to career, JKKN Learners are recruited by top companies across industries."
        stats={[
          { value: '92', suffix: '%', label: 'Placement Rate' },
          { value: '100', suffix: '+', label: 'Recruiting Partners' },
          { value: '50,000', suffix: '+', label: 'Alumni Network' },
          { value: '74', suffix: '+', label: 'Years Legacy' },
        ]}
        recruitersText=""
        showCTA={true}
        ctaText="View Complete Placement Records"
        ctaLink="https://placements.jkkn.ac.in/"
        backgroundColor="white-professional"
        showAnimations={true}
        accentColor="#0b6d41"
      />

      {/* Recruiter Marquee — moving logos as a continuation of the placement section above */}
      <PartnersLogos
        layout="marquee"
        columns="6"
        headerPart1="Top"
        headerPart2="Recruiters"
        headerPart1Color="#0b6d41"
        headerPart2Color="#0b6d41"
        subtitle=""
        partners={[
          { name: '', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/ff36b75e-dcb9-457e-b12f-d473368f4153.png' },
          { name: '', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/2b36977d-4104-425d-bcc0-caa4b66be4fd.png' },
          { name: '', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/6f89223e-6f69-4975-950f-e5e6d842a4e5.jpg' },
          { name: '', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/691d4c99-e18a-4bd8-9194-b5e331e2e225.jpg' },
          { name: '', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/f0640fdd-293d-4a16-9f93-24578fca41a0.png' },
          { name: '', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/7fda1909-191e-406c-83a5-864d8ea5b651.jpg' },
          { name: '', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/5038322f-5d3f-42b6-8804-172236ffb71e.png' },
          { name: '', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/168ea8c9-74d8-475c-86cd-3c5947bd723b.png' },
          { name: 'HCL', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/e3afef79-adc6-45c9-91e7-0ed5601ee01c.png' },
          { name: 'TATA Consultancy Services', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/089ad387-05a5-4004-b25f-25f7e15c4799.png' },
          { name: 'BOSCH', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/32f2a003-5955-481c-845e-4a189e6bdb38.jpg' },
          { name: 'Ivy mobility', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/5d1b520f-9bab-4319-be8b-61cee8dcc587.png' },
          { name: 'Buddi.ai', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/5c227ba7-9254-42b0-b821-7b3107d78226.png' },
          { name: 'TECH MAHINDRA', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/8bed5615-ad87-44ab-bef7-ee1d06adcb7b.png' },
          { name: 'TVS', logo: 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/c4daea95-90d0-41e9-a693-bad13eeed614.png' },
        ]}
        variant="modern-light"
        cardStyle="bordered"
        showDecorations
        grayscale={false}
        autoplay
        autoplaySpeed={2500}
        mobileAutoplaySpeed={3500}
        enableSwipe
        showNavigationDots={false}
        showNavigationArrows={false}
      />

      {/* 11. Campus Features */}
      <CampusFeaturesGrid
        badge="CAMPUS LIFE"
        title="Campus Life at JKKN"
        titleAccentWord="Campus Life"
        subtitle="Beyond academics — experience a vibrant campus life with world-class facilities."
        columns="4"
        features={[
          { emoji: '', icon: 'Home', title: 'Hostels', description: 'Separate boys & girls hostels with 24/7 security, Wi-Fi, and home-like comfort.' },
          { emoji: '', icon: 'UtensilsCrossed', title: 'Dining', description: 'Hygienic, nutritious meals. Veg & non-veg options at central canteen.' },
          { emoji: '', icon: 'BookOpen', title: 'Libraries', description: '50,000+ books, journals, digital resources across all campuses.' },
          { emoji: '', icon: 'FlaskConical', title: 'Learning Labs', description: 'State-of-the-art labs, simulation centers, and research facilities.' },
          { emoji: '', icon: 'Trophy', title: 'Sports', description: 'Cricket, basketball, volleyball, indoor games, and fitness center.' },
          { emoji: '', icon: 'HeartPulse', title: 'Healthcare', description: 'On-campus health center and attached hospital facilities.' },
          { emoji: '', icon: 'Bus', title: 'Transport', description: 'College buses covering Namakkal, Salem, Erode & surrounding areas.' },
          { emoji: '', icon: 'ShieldCheck', title: 'Security', description: '24/7 CCTV surveillance, security personnel, strict visitor management.' },
        ]}
        backgroundColor="gradient-light"
        showAnimations={true}
        accentColor="#0b6d41"
      />
    </main>
  )
}
