import type { Metadata } from 'next'
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { OnlineFormSection } from '@/components/cms-blocks/shared/online-form-section'
import { LOCAL_MANDATORY_DISCLOSURE_PDFS } from '@/lib/data/local-mandatory-disclosure-pdfs'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'

/**
 * Online Grievance & Redressal form (Google Form).
 * A live web form — both View and Download open this URL in a new tab.
 */
const GRIEVANCE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdjib1yJxOKhU5aiLeO8_cJa6XuUJ3MzfZWZwxD8PvlQ3HEIQ/viewform'

export const metadata: Metadata = {
  title: 'Mandatory Disclosure | JKKN College of Engineering',
  description:
    'Mandatory disclosure as per AICTE and UGC requirements. Access complete institutional information, approvals, and reports.',
  keywords: [
    'mandatory disclosure',
    'AICTE disclosure',
    'UGC requirements',
    'institutional information',
    'JKKN disclosure',
  ],
}

export default function MandatoryDisclosurePage() {
  const disclosureItems = [
    ...LOCAL_MANDATORY_DISCLOSURE_PDFS.map((pdf) => ({
      name: pdf.title,
      url: `/pdfs/${pdf.pdfPath}`,
      description: pdf.description,
    })),
    {
      name: 'Online Grievance and Redressal Form',
      url: GRIEVANCE_FORM_URL,
      description:
        'Submit grievances online to the JKKN Grievance Redressal Committee.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      {/* JSON-LD (main only): CollectionPage + BreadcrumbList + ItemList */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/mandatory-disclosure',
          name: 'Mandatory Disclosure | JKKN Institutions',
          description:
            'Mandatory institutional disclosure at JKKN Institutions as per AICTE, UGC, and other regulatory requirements — approvals, governing body, faculty, fees, results, admission policy, and annual reports.',
          pageType: 'CollectionPage',
          keywords: [
            'mandatory disclosure',
            'AICTE disclosure',
            'UGC requirements',
            'JKKN disclosure',
          ],
          speakableSelectors: ['h1'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Mandatory Disclosure', url: '/mandatory-disclosure' },
          ],
        }}
        itemList={{
          name: 'JKKN Mandatory Disclosure Documents',
          items: disclosureItems,
        }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-4">
            As per AICTE/UGC Requirements
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Mandatory Disclosure
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete institutional information and regulatory compliance documents
          </p>
        </div>

        {/* PDF List */}
        <LocalPdfLinkList
          pdfs={LOCAL_MANDATORY_DISCLOSURE_PDFS}
          accentColor="#0b6d41"
          backgroundColor="#fbfbee"
          groupByCategory={true}
          showFileSize={true}
          columns={1}
        />

        {/* Online Grievance and Redressal */}
        <OnlineFormSection
          sectionTitle="Online Grievance and Redressal"
          sectionDescription="Students, parents, and staff can raise grievances online. Submissions are reviewed by the JKKN Grievance Redressal Committee."
          cardTitle="Online Grievance Redressal Form"
          cardDescription="Submit your grievance through our online form. Click View to open and fill the form, or Download to access it in a new tab."
          formUrl={GRIEVANCE_FORM_URL}
        />

        {/* Note Section */}
        <div className="mt-12 bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
          <p className="text-primary">
            <strong>Note:</strong> This document contains comprehensive information as required
            by AICTE (All India Council for Technical Education) and UGC (University Grants Commission).
            For any queries, please contact the administration office.
          </p>
        </div>
      </div>
    </div>
  )
}
