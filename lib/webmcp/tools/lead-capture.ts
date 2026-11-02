import { INSTITUTIONAL_DATA } from '@/lib/constants/institutional-data'
import { campaignTagsSnapshot, parseCampaignTags, tagApplyHref } from '@/lib/enquiry/campaign-tags'
import { currentEnquirySite, fullApplicationHref, sourcePageFromPath } from '@/lib/enquiry/site'

const CONTACT_PHONE = INSTITUTIONAL_DATA.contact.primaryPhoneFormatted
const CONTACT_WEBSITE = INSTITUTIONAL_DATA.contact.website
const APPLY_BASE = 'https://www.jkkn.ai/apply/jkkn-admission-2026'

/**
 * Register lead capture WebMCP tools.
 * Tools: start_application, subscribe_newsletter
 *
 * There is no request_callback tool any more (removed 2026-11-02). It saved the student's name and
 * phone in this site's own Supabase table (admission_inquiries), which the admission CRM (jkkn.ai)
 * never reads, so counsellors never saw those requests. A student who wants a call back now gets the
 * CRM enquiry link from start_application: one form, one lead record, and the team calls from there.
 * Tools that submit personal data show a browser confirmation dialog first.
 */
export function registerLeadCaptureTools() {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return

  // --- Start admission application (also the way to ask for a call back) ---
  navigator.modelContext.registerTool({
    name: 'start_application',
    description:
      'Get the JKKN admission enquiry link. Use this when a student wants to apply or wants a call back from the admissions team: the student enters name, WhatsApp number and course on the form, and the team contacts them from there. Returns the URL and the list of documents needed.',
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

      // Tagged like every other apply link on the site (enquiry-modal.tsx): the visit's own campaign
      // tags when it arrived with some, else this site and page - so the CRM lead is not untagged.
      const site = currentEnquirySite()
      const page = `webmcp-${sourcePageFromPath(window.location.pathname)}`
      const tagged = site
        ? tagApplyHref(fullApplicationHref(site, page), parseCampaignTags(campaignTagsSnapshot()), {
            utmSource: site.host,
            utmCampaign: `${site.campaignPrefix}-${page}`,
          })
        : APPLY_BASE
      const url = new URL(tagged)
      if (d.name) url.searchParams.set('name', d.name)
      if (d.email) url.searchParams.set('email', d.email)
      if (d.course) url.searchParams.set('course', d.course)

      return JSON.stringify({
        application_url: url.toString(),
        instructions:
          'Open the link and fill in the enquiry form (name, WhatsApp number, course). The JKKN admissions team contacts the student from there.',
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
