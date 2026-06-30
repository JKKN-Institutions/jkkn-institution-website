import type { Metadata } from 'next'
import { OnlineFormSection } from '@/components/cms-blocks/shared/online-form-section'
import { getCurrentInstitution } from '@/lib/config/multi-tenant'

/**
 * Online Grievance & Redressal — first-party page surfacing the institution's
 * Google grievance form through the shared OnlineFormSection card (View /
 * Download), the same component used in the Mandatory Disclosure page.
 *
 * View/Download open the form in a new tab (Google's own context), which avoids
 * the cross-origin sign-in wall that appears when the form is embedded in an
 * iframe.
 *
 * This is a STATIC app route that intentionally shadows the cms_pages catch-all
 * at the same slug; the top-level main-menu item links here.
 */

/** Live Google Form for grievance submissions. */
const GRIEVANCE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdjib1yJxOKhU5aiLeO8_cJa6XuUJ3MzfZWZwxD8PvlQ3HEIQ/viewform'

export async function generateMetadata(): Promise<Metadata> {
  const institution = getCurrentInstitution()
  return {
    title: `Online Grievance & Redressal | ${institution.name}`,
    description:
      'Raise an academic, administrative, or campus-related grievance online with the Grievance Redressal Committee through our official online form.',
    keywords: [
      'grievance redressal',
      'online grievance form',
      'learner grievance',
      'grievance committee',
      institution.name,
    ],
    alternates: { canonical: '/online-grievance-and-redressal' },
  }
}

export default function OnlineGrievanceRedressalPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Online Grievance and Redressal — card with View / Download buttons */}
        <OnlineFormSection
          sectionTitle="Online Grievance and Redressal"
          sectionDescription="Learners, parents, and team members can raise grievances online. Submissions are reviewed by the JKKN Grievance Redressal Committee."
          cardTitle="Online Grievance Redressal Form"
          cardDescription="Submit your grievance through our online form. Click View to open and fill the form, or Download to access it in a new tab."
          formUrl={GRIEVANCE_FORM_URL}
        />

        {/* Note */}
        <div className="mt-12 rounded-r-lg border-l-4 border-primary bg-primary/5 p-6">
          <p className="text-sm text-primary">
            <strong>Note:</strong> This channel is for genuine grievances and feedback.
            Submissions are treated confidentially. For any queries or matters requiring
            immediate attention, please contact the administration office.
          </p>
        </div>
      </div>
    </div>
  )
}
