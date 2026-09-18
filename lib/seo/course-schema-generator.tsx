/**
 * Course Schema Generator
 *
 * Generates Course structured data (schema.org) for individual course pages.
 * This enables course rich results in Google Search.
 */

import { getSiteUrl } from '@/lib/utils/site-url'
import { getCurrentInstitution } from '@/lib/config/multi-tenant'

export interface CourseSchemaData {
  courseName: string
  courseCode: string
  degree: string
  duration: string
  description: string
  eligibility?: string
  fees?: string
  seats?: number
  approvalBody?: string
  /** 'ug' | 'pg' - used to build the canonical course URL and @id */
  level?: 'ug' | 'pg'
}

/**
 * Generate Course schema for a course page
 *
 * @param course - Course data
 * @returns JSX element with schema.org Course JSON-LD
 */
export function generateCourseSchema(course: CourseSchemaData) {
  const siteUrl = getSiteUrl()
  const institution = getCurrentInstitution()

  // Canonical URL of the course page this schema describes. Without a @id/url the
  // Course node floats free of the page and cannot be matched to it.
  const courseUrl = course.level
    ? `${siteUrl}/courses-offered/${course.level}/${course.courseCode}`
    : siteUrl

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${courseUrl}#course`,
    url: courseUrl,
    name: `${course.degree} ${course.courseName}`,
    description: course.description,
    // Reference the one college entity by @id instead of declaring a second one.
    provider: {
      '@type': 'CollegeOrUniversity',
      '@id': `${siteUrl}/#organization`,
      name: institution.name,
      url: siteUrl,
    },
    // Google requires hasCourseInstance on Course. courseMode and location are stated
    // because they are known; no weekly workload is asserted because no published
    // source for it exists.
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite',
      location: {
        '@type': 'CollegeOrUniversity',
        '@id': `${siteUrl}/#organization`,
      },
    },
    courseCode: course.courseCode,
    educationalCredentialAwarded: course.degree,
    timeRequired: course.duration,
    ...(course.eligibility && { coursePrerequisites: course.eligibility }),
    ...(course.fees && {
      offers: {
        '@type': 'Offer',
        price: course.fees,
        priceCurrency: 'INR',
      },
    }),
    ...(course.seats && {
      maximumAttendeeCapacity: course.seats,
    }),
    ...(course.approvalBody && {
      about: `Approved by ${course.approvalBody}`,
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Predefined course schemas for JKKN Engineering College
 */

export const BECSECourseSchema = () =>
  generateCourseSchema({
    courseName: 'Computer Science and Engineering',
    courseCode: 'be-cse',
    level: 'ug',
    degree: 'B.E.',
    duration: 'PT4Y',
    description:
      'Bachelor of Engineering in Computer Science and Engineering. This program provides comprehensive knowledge in software development, algorithms, data structures, computer networks, database management, and emerging technologies like AI, Machine Learning, and Cloud Computing.',
    eligibility:
      '10+2 with Mathematics, Physics, Chemistry/Computer Science/Biology/Biotechnology with minimum 50% aggregate',
    approvalBody: 'AICTE and affiliated to Anna University',
  })

export const BEECECourseSchema = () =>
  generateCourseSchema({
    courseName: 'Electronics and Communication Engineering',
    courseCode: 'be-ece',
    level: 'ug',
    degree: 'B.E.',
    duration: 'PT4Y',
    description:
      'Bachelor of Engineering in Electronics and Communication Engineering. Covers electronic circuits, communication systems, signal processing, embedded systems, VLSI design, and wireless technologies.',
    eligibility: '10+2 with Mathematics, Physics, Chemistry with minimum 50% aggregate',
    approvalBody: 'AICTE and affiliated to Anna University',
  })

export const BEEEECourseSchema = () =>
  generateCourseSchema({
    courseName: 'Electrical and Electronics Engineering',
    courseCode: 'be-eee',
    level: 'ug',
    degree: 'B.E.',
    duration: 'PT4Y',
    description:
      'Bachelor of Engineering in Electrical and Electronics Engineering. Focuses on power systems, electrical machines, control systems, power electronics, renewable energy, and smart grid technologies.',
    eligibility: '10+2 with Mathematics, Physics, Chemistry with minimum 50% aggregate',
    approvalBody: 'AICTE and affiliated to Anna University',
  })

export const BEMechanicalCourseSchema = () =>
  generateCourseSchema({
    courseName: 'Mechanical Engineering',
    courseCode: 'be-mechanical',
    level: 'ug',
    degree: 'B.E.',
    duration: 'PT4Y',
    description:
      'Bachelor of Engineering in Mechanical Engineering. Comprehensive program covering thermodynamics, manufacturing, CAD/CAM, robotics, automobile engineering, and industrial automation.',
    eligibility: '10+2 with Mathematics, Physics, Chemistry with minimum 50% aggregate',
    approvalBody: 'AICTE and affiliated to Anna University',
  })

export const BTechITCourseSchema = () =>
  generateCourseSchema({
    courseName: 'Information Technology',
    courseCode: 'btech-it',
    level: 'ug',
    degree: 'B.Tech.',
    duration: 'PT4Y',
    description:
      'Bachelor of Technology in Information Technology. Specializes in software engineering, web technologies, mobile app development, cybersecurity, data analytics, and IT infrastructure management.',
    eligibility: '10+2 with Mathematics, Physics, Chemistry/Computer Science with minimum 50% aggregate',
    approvalBody: 'AICTE and affiliated to Anna University',
  })

export const MBACourseSchema = () =>
  generateCourseSchema({
    courseName: 'Master of Business Administration',
    courseCode: 'mba',
    level: 'pg',
    degree: 'MBA',
    duration: 'PT2Y',
    description:
      'Master of Business Administration. Two-year postgraduate program covering management principles, finance, marketing, human resources, operations management, and business strategy.',
    eligibility:
      'Bachelor\'s degree in any discipline with minimum 50% aggregate. Valid TANCET/CAT/MAT score preferred.',
    approvalBody: 'AICTE and affiliated to Anna University',
  })

export const MECSECourseSchema = () =>
  generateCourseSchema({
    courseName: 'Master of Engineering in Computer Science and Engineering',
    courseCode: 'me-cse',
    level: 'pg',
    degree: 'M.E.',
    duration: 'PT2Y',
    description:
      'Master of Engineering in Computer Science and Engineering. Advanced program focusing on research and specialization in areas like Artificial Intelligence, Machine Learning, Data Science, Cloud Computing, and Software Engineering.',
    eligibility:
      'B.E./B.Tech. in Computer Science/IT or related branches with minimum 50% aggregate. Valid GATE score preferred.',
    approvalBody: 'AICTE and affiliated to Anna University',
  })
