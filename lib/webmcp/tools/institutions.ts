import { INSTITUTIONS } from '@/lib/config/institutions'
import { INSTITUTION_REGISTRY } from '@/lib/config/multi-tenant'
import { INSTITUTIONAL_DATA } from '@/lib/constants/institutional-data'

// Extend navigator type for WebMCP
declare global {
  interface Navigator {
    modelContext?: {
      registerTool: (tool: {
        name: string
        description: string
        inputSchema: Record<string, unknown>
        execute: (input: unknown) => Promise<string>
      }) => void
    }
  }
}

/**
 * Register institution-related WebMCP tools.
 * Tools: get_institutions, get_courses, get_contact_info
 */
export function registerInstitutionTools() {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return

  // --- List all JKKN institutions ---
  navigator.modelContext.registerTool({
    name: 'get_institutions',
    description:
      'List all JKKN Educational Institutions with name, departments, and details. Located in Kumarapalayam, Tamil Nadu with colleges (dental, pharmacy, engineering, arts & science, allied health, nursing, physiotherapy) and schools. Returns the actual institution count dynamically.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    execute: async () => {
      // Filter out admin and umbrella entries — only individual colleges/schools
      const publicInstitutions = INSTITUTIONS.filter(
        (i) => i.id !== 'jkkn-group-admin' && i.id !== 'jkkn-educational-institutions'
      ).map((i) => ({
        id: i.id,
        name: i.name,
        shortName: i.shortName,
        departments: [...i.departments],
      }))

      return JSON.stringify({
        organization: 'JKKN Educational Institutions',
        founded: INSTITUTIONAL_DATA.organization.foundedYear,
        accreditation: INSTITUTIONAL_DATA.accreditations.displayText,
        total_institutions: publicInstitutions.length,
        colleges: INSTITUTIONAL_DATA.institutions.colleges,
        schools: INSTITUTIONAL_DATA.institutions.schools,
        institutions: publicInstitutions,
      })
    },
  })

  // --- Get courses/departments for a specific institution ---
  navigator.modelContext.registerTool({
    name: 'get_courses',
    description:
      'Get departments and courses offered by a specific JKKN institution. Use institution ID like: jkkn-dental-college, jkkn-college-pharmacy, jkkn-college-engineering, jkkn-college-arts-science, jkkn-college-nursing, jkkn-college-allied-health, jkkn-college-physiotherapy, jkkn-educational-institutions.',
    inputSchema: {
      type: 'object',
      properties: {
        institution: {
          type: 'string',
          description:
            'Institution ID (e.g., jkkn-dental-college, jkkn-college-pharmacy, jkkn-college-engineering)',
        },
      },
      required: ['institution'],
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input

      // Map institution config IDs to registry domains
      const domainMap: Record<string, string> = {
        'jkkn-dental-college': 'https://dental.jkkn.ac.in',
        'jkkn-college-pharmacy': 'https://pharmacy.jkkn.ac.in',
        'jkkn-college-engineering': 'https://engg.jkkn.ac.in',
        'jkkn-college-arts-science': 'https://arts.jkkn.ac.in',
        'jkkn-college-nursing': 'https://nursing.jkkn.ac.in',
        'jkkn-college-allied-health': 'https://ahs.jkkn.ac.in',
        'jkkn-college-physiotherapy': 'https://physio.jkkn.ac.in',
        'jkkn-school-nursing': 'https://nursing.jkkn.ac.in',
      }

      const inst = INSTITUTIONS.find((i) => i.id === d.institution)

      if (!inst) {
        // Try partial match
        const partial = INSTITUTIONS.find(
          (i) =>
            i.id.includes(d.institution) ||
            i.name.toLowerCase().includes(d.institution.toLowerCase())
        )
        if (partial) {
          return JSON.stringify({
            institution: partial.name,
            shortName: partial.shortName,
            departments: [...partial.departments],
            website: domainMap[partial.id] || 'https://jkkn.ac.in',
          })
        }

        return JSON.stringify({
          error: 'Institution not found',
          valid_ids: INSTITUTIONS.filter(
            (i) => i.id !== 'jkkn-group-admin' && i.id !== 'jkkn-educational-institutions'
          ).map((i) => ({ id: i.id, name: i.name })),
        })
      }

      return JSON.stringify({
        institution: inst.name,
        shortName: inst.shortName,
        departments: [...inst.departments],
        website: domainMap[inst.id] || 'https://jkkn.ac.in',
      })
    },
  })

  // --- Contact info per institution or main campus ---
  navigator.modelContext.registerTool({
    name: 'get_contact_info',
    description:
      'Get contact details for JKKN — address, phone, email, social links. Optionally specify an institution for its specific contact info.',
    inputSchema: {
      type: 'object',
      properties: {
        institution: {
          type: 'string',
          description:
            'Institution ID (optional). Omit or use "main" for general JKKN contact.',
        },
      },
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input
      const contact = INSTITUTIONAL_DATA.contact

      const mainContact = {
        name: 'JKKN Educational Institutions',
        address: contact.address.full,
        phone: contact.primaryPhoneFormatted,
        email: contact.email,
        website: contact.website,
        social: { ...INSTITUTIONAL_DATA.socialLinks },
      }

      if (!d.institution || d.institution === 'main') {
        return JSON.stringify(mainContact)
      }

      // Check registry for institution-specific contact
      const registry = INSTITUTION_REGISTRY.find(
        (r) => r.id === d.institution
      )
      if (registry?.contact) {
        return JSON.stringify({
          institution: registry.name,
          domain: `https://${registry.domain}`,
          phone: registry.contact.phoneFormatted,
          email: registry.contact.email,
          campus_address: mainContact.address,
        })
      }

      // Fallback to main contact with institution name
      const inst = INSTITUTIONS.find(
        (i) =>
          i.id === d.institution ||
          i.id.includes(d.institution) ||
          i.name.toLowerCase().includes(d.institution.toLowerCase())
      )

      return JSON.stringify({
        institution: inst?.name || d.institution,
        campus_address: mainContact.address,
        phone: mainContact.phone,
        email: mainContact.email,
        website: mainContact.website,
      })
    },
  })
}
