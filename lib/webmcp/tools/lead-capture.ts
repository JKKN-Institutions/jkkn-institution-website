import { INSTITUTIONAL_DATA } from '@/lib/constants/institutional-data'

const CONTACT_PHONE = INSTITUTIONAL_DATA.contact.primaryPhoneFormatted
const CONTACT_WEBSITE = INSTITUTIONAL_DATA.contact.website
const FALLBACK_MSG = `Call ${CONTACT_PHONE} directly or visit ${CONTACT_WEBSITE}`

/**
 * Register lead capture WebMCP tools.
 * Tools: request_callback, start_application, subscribe_newsletter
 *
 * These tools let AI agents submit information on behalf of students.
 * Tools that submit personal data show a browser confirmation dialog first.
 * Submissions go through /api/webmcp API route → Server Action logic.
 */
export function registerLeadCaptureTools() {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return

  // --- Request callback from admissions ---
  navigator.modelContext.registerTool({
    name: 'request_callback',
    description:
      'Request a callback from JKKN admissions team for a prospective student. Submits name and phone number. The student will receive a call within 24 hours.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Student full name',
        },
        phone: {
          type: 'string',
          description: 'Phone number with country code (e.g., +919876543210)',
        },
        course_interest: {
          type: 'string',
          description: 'Course the student is interested in (optional)',
        },
        preferred_time: {
          type: 'string',
          description: 'Preferred callback time (optional, e.g., "morning", "2-4 PM")',
        },
      },
      required: ['name', 'phone'],
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input

      const confirmed = window.confirm(
        `Submit callback request to JKKN Admissions?\n\nName: ${d.name}\nPhone: ${d.phone}\nCourse: ${d.course_interest || 'Not specified'}`
      )
      if (!confirmed) {
        return JSON.stringify({ cancelled: true, reason: 'User declined to submit' })
      }

      try {
        const res = await fetch('/api/webmcp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'request_callback',
            data: {
              name: d.name,
              phone: d.phone,
              courseInterest: d.course_interest,
              preferredTime: d.preferred_time,
            },
          }),
        })
        const result = await res.json()

        if (result.success) {
          return JSON.stringify({
            success: true,
            message: result.message,
            reference_number: result.referenceNumber,
            helpline: CONTACT_PHONE,
          })
        }

        return JSON.stringify({
          success: false,
          message: result.message,
          fallback: FALLBACK_MSG,
        })
      } catch {
        return JSON.stringify({ success: false, fallback: FALLBACK_MSG })
      }
    },
  })

  // --- Start admission application ---
  navigator.modelContext.registerTool({
    name: 'start_application',
    description:
      'Get the admission application link for JKKN, optionally pre-filled with student details. Returns the URL and list of documents needed.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Student name (optional, for pre-fill)',
        },
        email: {
          type: 'string',
          description: 'Student email (optional, for pre-fill)',
        },
        course: {
          type: 'string',
          description: 'Course interested in (optional, for pre-fill)',
        },
      },
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input

      const baseUrl = 'https://jkkn.in/admission-form'
      const params = new URLSearchParams()
      if (d.name) params.set('name', d.name)
      if (d.email) params.set('email', d.email)
      if (d.course) params.set('course', d.course)

      const url = params.toString() ? `${baseUrl}?${params}` : baseUrl

      return JSON.stringify({
        application_url: url,
        instructions:
          'Fill out the online application form. The admissions team will review and contact within 48 hours.',
        helpline: CONTACT_PHONE,
        documents_needed: [
          'Mark sheets (10th and 12th)',
          'Transfer certificate',
          'Community certificate',
          'Passport size photos',
          'Aadhaar card copy',
        ],
      })
    },
  })

  // --- Subscribe to newsletter ---
  navigator.modelContext.registerTool({
    name: 'subscribe_newsletter',
    description:
      'Subscribe to the JKKN newsletter for admission updates, events, placement news, and campus announcements.',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address to subscribe',
        },
      },
      required: ['email'],
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input

      const confirmed = window.confirm(
        `Subscribe ${d.email} to JKKN newsletter?`
      )
      if (!confirmed) {
        return JSON.stringify({ cancelled: true, reason: 'User declined to subscribe' })
      }

      try {
        const res = await fetch('/api/webmcp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'subscribe_newsletter',
            data: { email: d.email },
          }),
        })
        const result = await res.json()

        if (result.success) {
          return JSON.stringify({
            success: true,
            message: result.message,
          })
        }

        return JSON.stringify({
          success: false,
          message: result.message,
          fallback: `Visit ${CONTACT_WEBSITE} and use the newsletter form at the bottom of the page`,
        })
      } catch {
        return JSON.stringify({
          success: false,
          fallback: `Visit ${CONTACT_WEBSITE} and use the newsletter form at the bottom of the page`,
        })
      }
    },
  })
}
