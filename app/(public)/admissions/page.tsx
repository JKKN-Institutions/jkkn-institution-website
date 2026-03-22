import type { Metadata } from 'next'
import Link from 'next/link'
import { INSTITUTIONAL_DATA } from '@/lib/constants/institutional-data'
import { AdmissionsCoursesTab } from '@/components/public/admissions/admissions-courses-tab'
import { AdmissionsFAQ } from '@/components/public/admissions/admissions-faq'
import { AdmissionEnquiryForm } from '@/components/public/admissions/admission-enquiry-form'
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Cpu,
  Building2,
  Globe,
  DollarSign,
  Award,
  Check,
  FileText,
  MessageSquare,
  Star,
  Heart,
  FlaskConical,
  Stethoscope,
  Wrench,
} from 'lucide-react'

export const metadata: Metadata = {
  title: `Admissions ${INSTITUTIONAL_DATA.admissions.nextYear} | ${INSTITUTIONAL_DATA.organization.name} – Best College in Erode`,
  description: `Apply for Admissions ${INSTITUTIONAL_DATA.admissions.nextYear} at ${INSTITUTIONAL_DATA.organization.name}. ${INSTITUTIONAL_DATA.statistics.coursesOffered} programs across 7 colleges. NAAC A Accredited. Engineering, Dental, Pharmacy, Nursing, Arts & Science and Education courses in Namakkal.`,
  openGraph: {
    title: `Admissions ${INSTITUTIONAL_DATA.admissions.nextYear} | JKKN Institutions`,
    description: `Apply now for ${INSTITUTIONAL_DATA.admissions.nextYear} admissions. ${INSTITUTIONAL_DATA.statistics.coursesOffered} programs, ${INSTITUTIONAL_DATA.statistics.placementRate} placement rate, NAAC A accredited.`,
    url: `${INSTITUTIONAL_DATA.contact.website}/admissions`,
  },
}

// ─── Data ──────────────────────────────────────────────────────────────────


const WHY_CARDS = [
  {
    icon: <GraduationCap className="w-6 h-6 text-primary" />,
    title: `${INSTITUTIONAL_DATA.organization.yearsOfExcellence}+ Years of Educational Legacy`,
    desc: `Founded in ${INSTITUTIONAL_DATA.organization.foundedYear} by Kodai Vallal Shri. J.K.K. Natarajah, we bring decades of proven excellence in shaping futures.`,
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    title: '92% Placement Success Rate',
    desc: 'Our dedicated placement cell connects you with 100+ top companies including TCS, Infosys, Wipro, Cognizant, HCL and more.',
  },
  {
    icon: <Star className="w-6 h-6 text-primary" />,
    title: 'NAAC A Accredited Quality',
    desc: 'Fully approved by AICTE, UGC, DCI, PCI, INC and affiliated with Anna University and Periyar University.',
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: `${INSTITUTIONAL_DATA.statistics.facultyCount} Expert Learning Facilitators`,
    desc: 'Industry-experienced faculty committed to practical, skill-based learning that prepares you for real-world challenges.',
  },
  {
    icon: <Building2 className="w-6 h-6 text-primary" />,
    title: 'State-of-the-Art Infrastructure',
    desc: '60+ acre campus with modern labs, digital library with 50,000+ books, high-speed Wi-Fi, sports complex and more.',
  },
  {
    icon: <Cpu className="w-6 h-6 text-primary" />,
    title: "India's First AI-Integrated Campus",
    desc: "Pioneering AI-powered education through JKKN100 initiative, preparing students for tomorrow's technology-driven careers.",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-primary" />,
    title: 'Affordable & Accessible Education',
    desc: 'Multiple scholarships covering up to 100% of tuition. Merit, sports, SC/ST/OBC, girl student and financial aid available.',
  },
  {
    icon: <Globe className="w-6 h-6 text-primary" />,
    title: `${INSTITUTIONAL_DATA.statistics.alumniCount} Alumni Network`,
    desc: 'A thriving global alumni community providing mentorship and career opportunities worldwide.',
  },
]

const COLLEGES = [
  {
    icon: <Stethoscope className="w-6 h-6 text-primary" />,
    name: 'JKKN Dental College & Hospital',
    desc: 'BDS, MDS with specializations. Affiliated to Dr. MGR Medical University. Established 1987. 100+ dental chairs.',
    href: 'https://dental.jkkn.ac.in/',
    label: 'Visit College',
  },
  {
    icon: <Wrench className="w-6 h-6 text-primary" />,
    name: 'JKKN College of Engineering & Technology',
    desc: 'B.E / B.Tech / M.E / MBA. Autonomous college affiliated to Anna University. AICTE approved.',
    href: 'https://engg.jkkn.ac.in/',
    label: 'Visit College',
  },
  {
    icon: <FlaskConical className="w-6 h-6 text-primary" />,
    name: 'JKKN College of Pharmacy',
    desc: 'B.Pharm, M.Pharm, Pharm.D, Ph.D. PCI approved. Affiliated to Tamil Nadu Dr. MGR Medical University.',
    href: 'https://pharmacy.jkkn.ac.in/',
    label: 'Visit College',
  },
  {
    icon: <Heart className="w-6 h-6 text-primary" />,
    name: 'Sresakthimayeil Institute of Nursing & Research',
    desc: 'B.Sc Nursing, P.B.B.Sc Nursing, M.Sc Nursing. INC approved. Fully equipped clinical training facilities.',
    href: 'https://nursing.sresakthimayeil.jkkn.ac.in/',
    label: 'Visit College',
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    name: 'JKKN College of Allied Health Sciences',
    desc: '9 specialized B.Sc programs in healthcare technology. Hands-on clinical training with 1-year internship.',
    href: 'https://ahs.jkkn.ac.in/',
    label: 'Visit College',
  },
  {
    icon: <Star className="w-6 h-6 text-primary" />,
    name: 'JKKN College of Arts & Science (Autonomous)',
    desc: '15+ UG and 8 PG programs. BA, B.Sc, B.Com, BCA, MA, M.Sc, M.Com, MCA, Ph.D. Affiliated to Periyar University.',
    href: 'https://cas.jkkn.ac.in/',
    label: 'Visit College',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    name: 'JKKN College of Education',
    desc: 'B.Ed in 13 pedagogy subjects. Established 2016. Preparing the next generation of skilled educators.',
    href: 'https://edu.jkkn.ac.in/',
    label: 'Visit College',
  },
  {
    icon: <Building2 className="w-6 h-6 text-primary" />,
    name: 'JKKN Matriculation Higher Secondary School & Nattraja Vidhyalya',
    desc: 'Two schools offering quality school education from primary through 12th standard. CBSE & State board.',
    href: null,
    label: null,
    links: [
      { href: 'https://school.jkkn.ac.in/', label: 'JKKN Matriculation' },
      { href: 'https://nv.jkkn.ac.in/', label: 'Nattraja Vidhyalya' },
    ],
  },
]

const PROCESS_STEPS = [
  { num: 1, title: 'Fill Online Application', desc: 'Visit our admissions portal and complete the online application form with your personal and academic details.' },
  { num: 2, title: 'Upload Documents', desc: 'Submit scanned copies of your 10th & 12th mark sheets, transfer certificate, and community/caste certificate if applicable.' },
  { num: 3, title: 'Pay Application Fee', desc: 'Pay the application fee online through our secure payment gateway. Early bird discounts available for early applicants.' },
  { num: 4, title: 'Counselling / Interview', desc: 'Attend the counselling session or interview as required for your chosen program. Our team will guide you through.' },
  { num: 5, title: 'Receive Allotment', desc: 'Get your seat allotment letter confirming your admission to your preferred college and program.' },
  { num: 6, title: 'Complete Admission', desc: 'Pay the fees, submit original documents and complete all admission formalities at the respective college office.' },
]

const DOCUMENTS = [
  { title: '10th Standard Mark Sheet', desc: 'SSLC or equivalent board certificate with marks' },
  { title: '12th Standard Mark Sheet', desc: 'HSC or equivalent board certificate with marks' },
  { title: 'Transfer Certificate (TC)', desc: 'From the last attended institution' },
  { title: 'Community / Caste Certificate', desc: 'If applicable for reservation or scholarship benefits' },
  { title: 'Aadhar Card / ID Proof', desc: 'Government issued photo identity document' },
  { title: 'Passport Size Photographs', desc: 'Recent colour photographs (6–8 copies)' },
  { title: 'NEET Score Card', desc: 'Required for Dental, Pharmacy, Nursing & Allied Health Sciences' },
  { title: 'Income / EWS Certificate', desc: 'For financial assistance or scholarship eligibility' },
  { title: 'Sports / Extracurricular Certificate', desc: 'For sports quota and scholarship consideration' },
  { title: 'Migration Certificate', desc: 'For students from other state or university boards' },
  { title: 'Conduct Certificate', desc: 'Character certificate from the previous institution' },
  { title: 'Medical Fitness Certificate', desc: 'Required for health science and professional programs' },
]

const SCHOLARSHIPS = [
  { icon: '🏆', title: 'Merit Scholarship', desc: 'For students who score exceptionally high in board examinations (10th & 12th).', amt: 'Up to 100% Tuition Fee' },
  { icon: '⚽', title: 'Sports Scholarship', desc: 'Awarded to national and state-level sports achievers and athletes.', amt: 'Up to 75% Tuition Fee' },
  { icon: '🎓', title: 'Girl Student Scholarship', desc: 'Special financial support for girl students to promote women\'s education.', amt: 'Up to 50% Tuition Fee' },
  { icon: '👨‍👩‍👧', title: 'Government Scholarship', desc: 'SC/ST/OBC/Minority community scholarships as per Tamil Nadu Government norms.', amt: 'As per Govt. Norms' },
  { icon: '💰', title: 'EWS / Financial Aid', desc: 'For economically weaker sections to ensure no student is left behind.', amt: 'Based on Eligibility' },
  { icon: '🌟', title: 'Alumni Referral Scholarship', desc: `Benefit from our ${INSTITUTIONAL_DATA.statistics.alumniCount} alumni network referral program.`, amt: 'Special Discount' },
]

// ─── Page ────────────────────────────────────────────────────────────────

export default function AdmissionsPage() {
  const { nextYear } = INSTITUTIONAL_DATA.admissions
  const { primaryPhone, primaryPhoneLink, email, emailLink, address } = INSTITUTIONAL_DATA.contact

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-[#085032] via-[#0b6d41] to-[#0f8f56] pt-24 pb-16 px-6 text-center overflow-hidden">
        {/* Decorative circles */}
        <span className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <span className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-white/4 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-secondary/20 text-secondary text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-secondary/40 mb-5">
            🎓 Admissions Open {nextYear}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Begin Your Journey at<br />
            <span className="text-secondary">JKKN Institutions</span>
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto mb-8">
            India&apos;s First AI-Integrated Campus | NAAC A Accredited | {INSTITUTIONAL_DATA.statistics.coursesOffered} Programs across 7 Colleges & 2 Schools | {INSTITUTIONAL_DATA.statistics.placementRate} Placement Success
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-secondary text-[#1a1a1a] font-bold text-sm px-10 py-4 rounded-full hover:bg-[#e6c64d] transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              Apply Online Now
            </Link>
            <Link
              href={primaryPhoneLink}
              className="inline-flex items-center gap-2.5 bg-transparent text-white font-semibold text-sm px-10 py-4 rounded-full border-2 border-white/60 hover:border-white hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              Call Admissions: {primaryPhone}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHY JKKN
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Centered header */}
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              Why JKKN is the <span className="text-primary">Best College in Erode Region</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              {INSTITUTIONAL_DATA.organization.yearsOfExcellence}+ Years of Transforming Lives Through Progressive Education — Where Legacy Meets Innovation
            </p>
          </div>
          {/* Cards — centered content, consistent padding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CARDS.map(card => (
              <div
                key={card.title}
                className="bg-white border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-[0_8px_28px_rgba(11,109,65,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  {card.icon}
                </div>
                <h3 className="text-sm font-bold text-[#085032] mb-2 leading-snug">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          OUR COLLEGES
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Our Institutions</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
              Our <span className="text-primary">7 Colleges & 2 Schools</span>
            </h2>
            <p className="text-muted-foreground text-sm">The Most Comprehensive Educational Campus in Namakkal District</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLEGES.map(college => (
              <div
                key={college.name}
                className="bg-white border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-[0_8px_28px_rgba(11,109,65,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  {college.icon}
                </div>
                <h3 className="text-sm font-bold text-[#085032] mb-2 leading-snug">{college.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{college.desc}</p>
                {'links' in college && college.links ? (
                  <div className="flex flex-col gap-2 mt-auto w-full">
                    {college.links.map(l => (
                      <Link
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-primary bg-accent px-4 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors"
                      >
                        {l.label} →
                      </Link>
                    ))}
                  </div>
                ) : college.href ? (
                  <Link
                    href={college.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-accent px-4 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors mt-auto"
                  >
                    {college.label} →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COURSES OFFERED — CLIENT (tabs)
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Programs</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
              Explore Our <span className="text-primary">{INSTITUTIONAL_DATA.statistics.coursesOffered} Courses Offered</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              Choose from a wide range of UG, PG and Research programs designed for your dream career
            </p>
          </div>
          <AdmissionsCoursesTab />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ADMISSION PROCESS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#085032] to-[#0b6d41]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">How to Apply</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
              Simple <span className="text-secondary">Admission Process</span>
            </h2>
            <p className="text-white/75 text-sm">Follow these easy steps to start your journey at JKKN Institutions</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROCESS_STEPS.map(step => (
              <div
                key={step.num}
                className="text-center px-6 py-8 bg-white/8 border border-white/15 rounded-2xl"
              >
                <div className="w-12 h-12 bg-secondary text-[#1a1a1a] rounded-full flex items-center justify-center text-xl font-extrabold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-white/72 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-secondary text-[#1a1a1a] font-bold px-8 py-3.5 rounded-full hover:bg-[#e6c64d] transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Start Your Application Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          DOCUMENTS REQUIRED
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Checklist</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
              Documents <span className="text-primary">Required for Admission</span>
            </h2>
            <p className="text-muted-foreground text-sm">Keep these documents ready before starting your application</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCUMENTS.map(doc => (
              <div
                key={doc.title}
                className="flex items-start gap-3 bg-white border border-border rounded-xl px-5 py-4 hover:shadow-[0_4px_16px_rgba(11,109,65,0.1)] transition-shadow"
              >
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{doc.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SCHOLARSHIPS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Financial Aid</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
              Scholarships & <span className="text-primary">Financial Assistance</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              JKKN believes in making quality education accessible to all. Multiple scholarship opportunities available.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCHOLARSHIPS.map(sch => (
              <div
                key={sch.title}
                className="relative bg-white border border-border rounded-2xl p-7 text-center overflow-hidden hover:shadow-[0_8px_24px_rgba(11,109,65,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <span className="absolute top-0 left-0 right-0 h-1 bg-primary" />
                <div className="text-4xl mb-3">{sch.icon}</div>
                <h3 className="text-sm font-bold text-[#085032] mb-2">{sch.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{sch.desc}</p>
                <span className="inline-block bg-accent text-[#085032] font-bold text-xs px-3 py-1 rounded-full">
                  {sch.amt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          APPLICATION FORM
      ═══════════════════════════════════════════════════════════ */}
      <section id="apply" className="py-20 px-6 bg-gradient-to-br from-[#032816] to-[#085032]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2 inline-block">Get Started</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Apply for <span className="text-secondary">Admissions {nextYear}</span>
            </h2>
            <p className="text-white/75 text-sm">Fill in your details and our admissions team will get in touch with you shortly</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
            <h3 className="text-xl font-bold text-[#085032] mb-1">Admission Enquiry Form</h3>
            <p className="text-sm text-muted-foreground mb-7">* All fields marked are required. We will contact you within 24 hours.</p>

            <AdmissionEnquiryForm />

            {/* Divider */}
            <div className="relative text-center text-xs text-muted-foreground my-5">
              <span className="relative z-10 bg-white px-3">or apply directly</span>
              <span className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />
            </div>

            <Link
              href="https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-secondary text-[#1a1a1a] text-sm font-bold rounded-xl hover:bg-[#e6c64d] transition-all hover:-translate-y-0.5"
            >
              🎓 Apply on Official Admissions Portal →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ — CLIENT (accordion)
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">FAQs</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-muted-foreground text-sm">Everything you need to know about admissions at JKKN Institutions</p>
          </div>
          <AdmissionsFAQ />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CONTACT STRIP
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-accent border-y border-primary/15 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-7">
            <h3 className="text-xl font-bold text-[#085032]">
              Still have questions? <span className="text-primary">We&apos;re here to help!</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Our admissions team is available Monday–Saturday, 9 AM – 5:30 PM</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Call */}
            <Link
              href={primaryPhoneLink}
              className="flex items-center gap-3 bg-white border border-primary/15 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-shadow min-w-[200px]"
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Call Us</p>
                <p className="text-sm font-semibold text-[#085032]">{primaryPhone}</p>
              </div>
            </Link>

            {/* Email */}
            <Link
              href={emailLink}
              className="flex items-center gap-3 bg-white border border-primary/15 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-shadow min-w-[200px]"
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email Us</p>
                <p className="text-sm font-semibold text-[#085032]">{email}</p>
              </div>
            </Link>

            {/* Visit */}
            <div className="flex items-center gap-3 bg-white border border-primary/15 rounded-2xl px-6 py-4 shadow-sm min-w-[200px]">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Visit Us</p>
                <p className="text-sm font-semibold text-[#085032]">{address.city}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-3 bg-white border border-primary/15 rounded-2xl px-6 py-4 shadow-sm min-w-[200px]">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Office Hours</p>
                <p className="text-sm font-semibold text-[#085032]">Mon–Sat: 9AM – 5:30PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
