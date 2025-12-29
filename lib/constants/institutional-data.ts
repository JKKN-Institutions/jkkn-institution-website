/**
 * Centralized Institutional Data
 * Single source of truth for all JKKN institutional information
 *
 * IMPORTANT: Update these values here to reflect across the entire website
 */

export const INSTITUTIONAL_DATA = {
  organization: {
    name: 'JKKN Group of Institutions',
    shortName: 'JKKN',
    foundedYear: 1952,
    /** Auto-calculated years of excellence */
    get yearsOfExcellence() {
      return new Date().getFullYear() - this.foundedYear
    },
    trustName: 'J.K.K. Rangammal Charitable Trust',
    trustRegistrationNumber: '33',
    founderName: 'SHRI. J.K.K. NATARAJAH',
    founderTitle: 'Founder of J.K.K. Rangammal Charitable Trust',
  },

  accreditations: {
    naacGrade: 'A',
    displayText: 'NAAC A Accredited',
    shortText: 'NAAC A',
  },

  statistics: {
    placementRate: '92%+',
    placementRateNumeric: 92,
    facultyCount: '400+',
    facultyCountNumeric: 400,
    alumniCount: '50,000+',
    alumniCountNumeric: 50000,
    currentStudents: '5,000+',
    currentStudentsNumeric: 5000,
    coursesOffered: '50+',
    coursesOfferedNumeric: 50,
    recruiters: '100+',
    recruitersNumeric: 100,
    institutionCount: 11,
    collegeCount: 7,
    schoolCount: 4,
  },

  contact: {
    primaryPhone: '+91 93458 55001',
    primaryPhoneFormatted: '+91 93458 55001',
    primaryPhoneLink: 'tel:+919345855001',
    email: 'info@jkkn.ac.in',
    emailLink: 'mailto:info@jkkn.ac.in',
    website: 'https://jkkn.ac.in',
    address: {
      line1: 'Natarajapuram',
      line2: 'NH-544 (Salem To Coimbatore National Highway)',
      city: 'Kumarapalayam (TK), Namakkal (DT)',
      state: 'Tamil Nadu',
      pincode: '638183',
      country: 'India',
      /** Full formatted address */
      get full() {
        return `${this.line1}, ${this.line2}, ${this.city}, ${this.state} - ${this.pincode}`
      },
    },
  },

  socialLinks: {
    facebook: 'https://facebook.com/myjkkn',
    x: 'https://x.com/jkkninstitution',
    instagram: 'https://instagram.com/jkkninstitutions',
    linkedin: 'https://linkedin.com/school/jkkninstitutions/',
    youtube: 'https://youtube.com/@JKKNINSTITUTIONS',
  },

  admissions: {
    currentYear: '2025-26',
    nextYear: '2026-27',
  },

  /** All institutions under JKKN (7 colleges + 4 schools = 11 total) */
  institutions: {
    colleges: [
      'JKKN Dental College',
      'JKKN College of Pharmacy',
      'JKKN College of Engineering',
      'JKKN College of Allied Health Sciences',
      'JKKN College of Arts & Science (Autonomous)',
      'JKKN College of Education',
      'Sresakthimayeil Institute Of Nursing And Research',
    ],
    schools: [
      'JKKN Matriculation School',
      'Nattraja Vidhyalya',
      'JKKN Elementary School',
      'JKKN Girls Higher Secondary School',
    ],
    /** All institutions combined */
    get all() {
      return [...this.colleges, ...this.schools]
    },
  },

  /** Terminology standards */
  terminology: {
    student: 'Learner',
    students: 'Learners',
    teacher: 'Learning Facilitator',
    teachers: 'Learning Facilitators',
    faculty: 'Expert Learning Facilitators',
  },
} as const

/** Type for the institutional data */
export type InstitutionalData = typeof INSTITUTIONAL_DATA
