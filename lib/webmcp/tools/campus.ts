import { INSTITUTIONAL_DATA } from '@/lib/constants/institutional-data'

/**
 * Register campus-related WebMCP tools.
 * Tools: get_facilities, get_placement_stats, check_eligibility
 */
export function registerCampusTools() {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return

  // --- Campus facilities ---
  navigator.modelContext.registerTool({
    name: 'get_facilities',
    description:
      'Get campus facilities available at JKKN institutions including hostels, labs, library, sports, transport, and hospital',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    execute: async () => {
      return JSON.stringify({
        campus: `JKKN Educational Institutions, ${INSTITUTIONAL_DATA.contact.address.city}, ${INSTITUTIONAL_DATA.contact.address.state}`,
        facilities: [
          { name: 'Hostel', details: 'Separate hostels for boys and girls with mess facility' },
          { name: 'Library', details: 'Central library with digital resources and journal access' },
          { name: 'Laboratories', details: 'State-of-the-art labs for each department' },
          { name: 'Sports', details: 'Indoor and outdoor sports facilities' },
          { name: 'Transport', details: 'Bus facility covering major towns in the region' },
          { name: 'Wi-Fi Campus', details: 'Campus-wide internet connectivity' },
          { name: 'Cafeteria', details: 'Multi-cuisine cafeteria' },
          { name: 'Auditorium', details: 'AC auditorium for events and seminars' },
          { name: 'Hospital', details: 'JKKN Dental Hospital (teaching hospital)' },
        ],
      })
    },
  })

  // --- Placement statistics ---
  navigator.modelContext.registerTool({
    name: 'get_placement_stats',
    description:
      'Get JKKN placement statistics including placement rate, top recruiters, number of faculty, alumni count, and courses offered',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    execute: async () => {
      const stats = INSTITUTIONAL_DATA.statistics
      return JSON.stringify({
        placement_rate: stats.placementRate,
        faculty_count: stats.facultyCount,
        alumni_count: stats.alumniCount,
        current_students: stats.currentStudents,
        courses_offered: stats.coursesOffered,
        recruiters_count: stats.recruiters,
        top_recruiters: [
          'Apollo Hospitals', 'Fortis Healthcare', 'Dr. Reddys',
          'Cipla', 'Sun Pharma', 'Infosys', 'TCS', 'Wipro',
          'HCL Technologies', 'Cognizant',
        ],
        placement_support: [
          'Dedicated placement cell per institution',
          'Industry internship programs',
          'Soft skills and interview training',
          'Campus recruitment drives',
        ],
        contact: INSTITUTIONAL_DATA.contact.email,
      })
    },
  })

  // --- Eligibility checker ---
  navigator.modelContext.registerTool({
    name: 'check_eligibility',
    description:
      'Check eligibility for a JKKN course based on marks and qualification. Supports BDS, B.Pharm, D.Pharm, B.Sc Nursing, B.E., B.Sc, MBA, M.Pharm, MDS, BPT, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        course: {
          type: 'string',
          description: 'Course name (e.g., BDS, B.Pharm, B.E. CSE, B.Sc Nursing, MBA, BPT)',
        },
        marks_percentage: {
          type: 'number',
          description: 'Percentage scored in qualifying exam',
        },
        qualification: {
          type: 'string',
          description: 'Qualifying exam (e.g., +2, 10th, Degree, PG)',
        },
      },
      required: ['course'],
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input

      const thresholds: Record<string, { min_marks: number; qualification: string }> = {
        'BDS': { min_marks: 50, qualification: '+2 with Physics, Chemistry, Biology' },
        'B.Pharm': { min_marks: 45, qualification: '+2 with Physics, Chemistry, Mathematics/Biology' },
        'D.Pharm': { min_marks: 40, qualification: '+2 with Physics, Chemistry' },
        'B.Sc Nursing': { min_marks: 45, qualification: '+2 with Physics, Chemistry, Biology' },
        'B.E.': { min_marks: 45, qualification: '+2 with Physics, Chemistry, Mathematics' },
        'B.Sc': { min_marks: 40, qualification: '+2 in relevant stream' },
        'BPT': { min_marks: 50, qualification: '+2 with Physics, Chemistry, Biology' },
        'MBA': { min_marks: 50, qualification: 'Any Degree' },
        'M.Pharm': { min_marks: 55, qualification: 'B.Pharm' },
        'MDS': { min_marks: 50, qualification: 'BDS' },
      }

      // Partial match on course name
      const courseKey = Object.keys(thresholds).find(
        (k) =>
          d.course.toUpperCase().includes(k.toUpperCase().replace('.', '')) ||
          k.toUpperCase().includes(d.course.toUpperCase())
      )

      const threshold = courseKey
        ? thresholds[courseKey]
        : { min_marks: 45, qualification: 'Varies by course' }

      const marksProvided = d.marks_percentage !== undefined && d.marks_percentage !== null
      const eligible = marksProvided ? d.marks_percentage >= threshold.min_marks : null

      return JSON.stringify({
        course: d.course,
        minimum_marks_percentage: threshold.min_marks,
        required_qualification: threshold.qualification,
        marks_provided: marksProvided ? d.marks_percentage : 'Not provided',
        eligible: eligible === null ? 'Provide marks_percentage to check' : eligible,
        apply_url: `${INSTITUTIONAL_DATA.contact.website}`,
        helpline: INSTITUTIONAL_DATA.contact.primaryPhoneFormatted,
        note: 'Final eligibility subject to university norms and entrance exam scores where applicable',
      })
    },
  })
}
