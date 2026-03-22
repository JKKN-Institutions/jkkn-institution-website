'use client'

import { useActionState, useState, useRef } from 'react'
import { submitAdmissionInquiry } from '@/app/actions/admission-inquiry'
import { CreditCard, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

// ── College → Courses Mapping (exact data from programs section) ─────────
const COLLEGE_COURSES: Record<string, string[]> = {
  // ── Dental ──────────────────────────────────────────────────────────────
  'JKKN Dental College and Hospital': [
    'Bachelor of Dental Surgery (BDS)',
    'Master of Dental Surgery (MDS)',
  ],

  // ── Engineering ─────────────────────────────────────────────────────────
  'JKKN College of Engineering and Technology': [
    // Undergraduate
    'B.E Computer Science and Engineering',
    'B.E Electrical and Electronic Engineering',
    'B.E Electronics and Communication Engineering',
    'B.E Mechanical Engineering',
    'B.Tech Information Technology',
    // Postgraduate
    'M.E Computer Science and Engineering',
    'M.B.A - Master of Business Administration',
  ],

  // ── Pharmacy ────────────────────────────────────────────────────────────
  'JKKN College of Pharmacy': [
    'Bachelor of Pharmacy (B.Pharm)',
    'Masters of Pharmacy (M.Pharm)',
    'Doctor of Pharmacy (Pharm.D)',
    'Post Baccalaureate (Pharm.D)',
    'Ph.D in Pharmaceutics',
    'Ph.D in Pharmaceutical Chemistry',
    'Ph.D in Pharmaceutical Analysis',
  ],

  // ── Nursing ─────────────────────────────────────────────────────────────
  'Sresakthimayeil Institute of Nursing and Research': [
    'Bachelor of Science in Nursing (B.Sc., Nursing)',
    'Post Basic Bachelor of Science (P.B.B.Sc., Nursing)',
    'Master of Science in Nursing (M.Sc., Nursing)',
  ],

  // ── Allied Health Sciences ──────────────────────────────────────────────
  'JKKN College of Allied Health Sciences': [
    // Undergraduate Courses
    'B.Sc. Accident and Emergency Care Technology',
    'B.Sc. Operation Theatre and Anaesthesia Technology',
    'B.Sc. Radiography and Imaging Technology',
    'B.Sc. Cardiac Technology',
    'B.Sc. Dialysis Technology',
    'B.Sc. Physician Assistant',
    'B.Sc. Respiratory Therapy',
    'B.Sc. Critical Care Technology',
    'B.Sc. Medical Record Sciences',
  ],

  // ── Arts & Science ──────────────────────────────────────────────────────
  'JKKN College of Arts and Science': [
    // Undergraduate
    'B.Sc. Computer Science',
    'B.Sc. Computer Science & Cyber Security',
    'B.Sc. Visual Communication',
    'B.C.A.',
    'B.Sc. Maths',
    'B.Sc. Physics',
    'B.Sc. Zoology',
    'B.Sc. Textile & Fashion Designing',
    'B.A. English',
    'B.B.A.',
    'B.Com',
    'B.A. History',
    'B.Sc. Microbiology',
    'B.Sc. Chemistry',
    'B.Sc. Artificial Intelligence & Data Science',
    'B.Sc. Clinical Laboratory Technology',
    // Postgraduate
    'M.A English',
    'M.A History',
    'M.Sc Data Analytics',
    'M.Sc Computer Science',
    'M.Sc Zoology',
    'M.Sc Maths',
    'M.Com',
    'M.C.A.',
    // Research Programmes
    'Ph.D in Zoology',
    'Ph.D in Tamil',
    'Ph.D in Chemistry',
  ],

  // ── Education ───────────────────────────────────────────────────────────
  'JKKN College of Education': [
    // B.Ed in Pedagogy Subjects
    'B.Ed in Tamil',
    'B.Ed in English',
    'B.Ed in Zoology',
    'B.Ed in Maths',
    'B.Ed in Chemistry',
    'B.Ed in Computer Science',
    'B.Ed in Physics',
    'B.Ed in Botany',
    'B.Ed in History',
    'B.Ed in Microbiology',
    'B.Ed in Social Science',
    'B.Ed in Commerce',
    'B.Ed in Economics',
    'B.Ed in Political Science',
  ],

  // ── Schools ─────────────────────────────────────────────────────────────
  'JKKN Matriculation Higher Secondary School': [
    'Classes 1 – 5 (Primary)',
    'Classes 6 – 8 (Middle School)',
    'Classes 9 – 10 (High School)',
    'Classes 11 – 12 Science Stream',
    'Classes 11 – 12 Commerce Stream',
    'Classes 11 – 12 Arts Stream',
  ],
  'Nattraja Vidhyalya': [
    'Classes 1 – 5 (Primary)',
    'Classes 6 – 8 (Middle School)',
    'Classes 9 – 10 (High School)',
    'Classes 11 – 12 Science Stream',
    'Classes 11 – 12 Commerce Stream',
    'Classes 11 – 12 Arts Stream',
  ],
}

const COLLEGE_NAMES = Object.keys(COLLEGE_COURSES)

const QUALIFICATIONS = [
  '10th Completed',
  '12th Completed',
  'Diploma',
  'Undergraduate (UG)',
  'Postgraduate (PG)',
  'Other',
]

const CONTACT_TIMES = [
  'Morning (9 AM – 12 PM)',
  'Afternoon (12 PM – 3 PM)',
  'Evening (3 PM – 6 PM)',
]

const inputClass =
  'w-full px-3 py-2.5 border-[1.5px] border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white'

const errorClass = 'mt-1 text-[11px] text-red-500 flex items-center gap-1'

export function AdmissionEnquiryForm() {
  const [state, action, isPending] = useActionState(submitAdmissionInquiry, null)
  const [selectedCollege, setSelectedCollege] = useState('')
  const courseRef = useRef<HTMLSelectElement>(null)

  const availableCourses = selectedCollege ? COLLEGE_COURSES[selectedCollege] ?? [] : []

  function handleCollegeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCollege(e.target.value)
    if (courseRef.current) courseRef.current.value = ''
  }

  // ── Success State ──────────────────────────────────────────────
  if (state?.success) {
    return (
      <div className="flex flex-col items-center text-center py-8 px-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-[#085032] mb-1">Enquiry Submitted Successfully!</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our admissions team will contact you within 24 hours.
        </p>
        {state.referenceNumber && (
          <div className="bg-accent rounded-xl px-6 py-3 mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Your Reference Number</p>
            <p className="text-lg font-mono font-bold text-[#085032]">{state.referenceNumber}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Save this for tracking your enquiry status</p>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          🔒 Your information is secure and will never be shared with third parties.
        </p>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────
  return (
    <form action={action} className="space-y-4">
      {/* Global error */}
      {state?.success === false && state.message && !state.errors && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Full Name */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-foreground" htmlFor="fullName">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            required
            className={inputClass}
          />
          {state?.errors?.fullName && (
            <p className={errorClass}>
              <AlertCircle className="w-3 h-3" />
              {state.errors.fullName[0]}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="email">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            required
            className={inputClass}
          />
          {state?.errors?.email && (
            <p className={errorClass}>
              <AlertCircle className="w-3 h-3" />
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="mobileNumber">
            Mobile Number *
          </label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            placeholder="10-digit mobile number"
            maxLength={10}
            required
            className={inputClass}
          />
          {state?.errors?.mobileNumber && (
            <p className={errorClass}>
              <AlertCircle className="w-3 h-3" />
              {state.errors.mobileNumber[0]}
            </p>
          )}
        </div>

        {/* College — drives course dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="collegeName">
            College / Institution *
          </label>
          <select
            id="collegeName"
            name="collegeName"
            required
            className={inputClass}
            value={selectedCollege}
            onChange={handleCollegeChange}
          >
            <option value="" disabled>Select College</option>
            {COLLEGE_NAMES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {state?.errors?.collegeName && (
            <p className={errorClass}>
              <AlertCircle className="w-3 h-3" />
              {state.errors.collegeName[0]}
            </p>
          )}
        </div>

        {/* Course — filtered by selected college */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="courseInterested">
            Course Interested *
          </label>
          <select
            id="courseInterested"
            name="courseInterested"
            required
            ref={courseRef}
            disabled={!selectedCollege}
            className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            defaultValue=""
          >
            <option value="" disabled>
              {selectedCollege ? 'Select Course' : 'Select college first'}
            </option>
            {availableCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          {state?.errors?.courseInterested && (
            <p className={errorClass}>
              <AlertCircle className="w-3 h-3" />
              {state.errors.courseInterested[0]}
            </p>
          )}
        </div>

        {/* Current Qualification */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="currentQualification">
            Current Qualification *
          </label>
          <select
            id="currentQualification"
            name="currentQualification"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="" disabled>Select Qualification</option>
            {QUALIFICATIONS.map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
          {state?.errors?.currentQualification && (
            <p className={errorClass}>
              <AlertCircle className="w-3 h-3" />
              {state.errors.currentQualification[0]}
            </p>
          )}
        </div>

        {/* District / City */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="districtCity">
            City / District *
          </label>
          <input
            type="text"
            id="districtCity"
            name="districtCity"
            placeholder="Your city or district"
            required
            className={inputClass}
          />
          {state?.errors?.districtCity && (
            <p className={errorClass}>
              <AlertCircle className="w-3 h-3" />
              {state.errors.districtCity[0]}
            </p>
          )}
        </div>

        {/* Preferred Contact Time */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="preferredContactTime">
            Preferred Contact Time
          </label>
          <select
            id="preferredContactTime"
            name="preferredContactTime"
            className={inputClass}
            defaultValue=""
          >
            <option value="">Any time</option>
            {CONTACT_TIMES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-3 pt-1">
        <input
          type="checkbox"
          id="consentGiven"
          name="consentGiven"
          required
          className="w-4 h-4 mt-0.5 accent-primary flex-shrink-0"
        />
        <label htmlFor="consentGiven" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
          I agree to receive communication from JKKN Institutions via phone, SMS, email, or WhatsApp
          regarding admissions, courses, and related information. *
        </label>
      </div>
      {state?.errors?.consentGiven && (
        <p className={errorClass}>
          <AlertCircle className="w-3 h-3" />
          {state.errors.consentGiven[0]}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 py-3.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-[#085032] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Submit Enquiry
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        🔒 Your information is secure. We will never share your data with third parties.
      </p>
    </form>
  )
}
