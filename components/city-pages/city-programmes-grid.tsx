// components/city-pages/city-programmes-grid.tsx
// Server Component — props: cityConfig

import {
  Monitor,
  Radio,
  Wrench,
  Zap,
  Cpu,
  Briefcase,
  GraduationCap,
} from 'lucide-react'
import type { CityPageConfig } from '@/lib/config/city-pages'
import type { LucideIcon } from 'lucide-react'

interface CityProgrammesGridProps {
  cityConfig: CityPageConfig
}

interface Course {
  icon: LucideIcon
  name: string
  intake: number
  duration: string
  level: 'UG' | 'PG'
  annualFee: string
  eligibility: string
}

const COURSES: Course[] = [
  {
    icon: Monitor,
    name: 'B.E. Computer Science & Engineering',
    intake: 60,
    duration: '4 Years',
    level: 'UG',
    annualFee: '₹85,000 – ₹95,000',
    eligibility: '10+2 with Maths, Physics; TNEA counselling',
  },
  {
    icon: Radio,
    name: 'B.E. Electronics & Communication Engineering',
    intake: 60,
    duration: '4 Years',
    level: 'UG',
    annualFee: '₹95,000',
    eligibility: '10+2 with Maths, Physics; TNEA counselling',
  },
  {
    icon: Wrench,
    name: 'B.E. Mechanical Engineering',
    intake: 120,
    duration: '4 Years',
    level: 'UG',
    annualFee: '₹95,000',
    eligibility: '10+2 with Maths, Physics; TNEA counselling',
  },
  {
    icon: Zap,
    name: 'B.E. Electrical & Electronics Engineering',
    intake: 60,
    duration: '4 Years',
    level: 'UG',
    annualFee: '₹95,000',
    eligibility: '10+2 with Maths, Physics; TNEA counselling',
  },
  {
    icon: Cpu,
    name: 'B.Tech Information Technology',
    intake: 60,
    duration: '4 Years',
    level: 'UG',
    annualFee: '₹95,000',
    eligibility: '10+2 with Maths, Physics; TNEA counselling',
  },
  {
    icon: GraduationCap,
    name: 'M.E. Computer Science & Engineering',
    intake: 60,
    duration: '2 Years',
    level: 'PG',
    annualFee: '₹85,000',
    eligibility: 'B.E./B.Tech in relevant discipline; TANCET/GATE',
  },
  {
    icon: Briefcase,
    name: 'M.B.A (Master of Business Administration)',
    intake: 120,
    duration: '2 Years',
    level: 'PG',
    annualFee: '₹80,000',
    eligibility: 'Any degree; TANCET/MAT/CAT',
  },
]

export default function CityProgrammesGrid({ cityConfig }: CityProgrammesGridProps) {
  const whatsappUrl = `https://wa.me/919345855001?text=${cityConfig.whatsappMessage}`

  return (
    <section id="programmes" className="section">
      <div className="section-inner">
        <h2 className="section-title">Programmes Offered</h2>
        <p className="section-subtitle">
          Choose the right programme for your career goals — all AICTE approved, Anna University affiliated
        </p>
        <span className="section-accent" aria-hidden="true" />
        <div className="section-spacer" />

        <div className="course-grid">
          {COURSES.map((course) => (
            <div key={course.name} className="course-card">
              <div className="course-icon" aria-hidden="true">
                <course.icon size={28} />
              </div>
              <h3 className="course-name">{course.name}</h3>

              <div className="course-details">
                <div className="course-detail">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{course.duration}</span>
                </div>
                <div className="course-detail">
                  <span className="detail-label">Level</span>
                  <span className="detail-value">{course.level}</span>
                </div>
                <div className="course-detail">
                  <span className="detail-label">Intake</span>
                  <span className="detail-value">{course.intake} seats</span>
                </div>
                <div className="course-detail">
                  <span className="detail-label">Annual Fee</span>
                  <span className="detail-value">{course.annualFee}</span>
                </div>
              </div>

              <p className="course-eligibility">{course.eligibility}</p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="course-enquire"
                aria-label={`Enquire about ${course.name} via WhatsApp`}
              >
                Enquire About This Course
              </a>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginTop: '16px' }}>
          * Hostel accommodation (optional, all-inclusive): ₹60,000 per year. Fees subject to revision per TN Govt &amp; AICTE norms.
        </p>
      </div>
    </section>
  )
}
