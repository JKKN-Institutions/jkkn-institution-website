import { Download, Eye, FileText } from 'lucide-react'

/**
 * OnlineFormSection
 *
 * Renders a titled section with a single card that links out to an external
 * online form (e.g. a Google Form). Visually matches the document cards used by
 * `LocalPdfLinkList` so it sits naturally alongside the mandatory-disclosure
 * documents, but points at a live form URL rather than a local PDF file.
 *
 * Because a Google Form is a live web page (not a downloadable file), both the
 * "View" and "Download" actions open the same form URL in a new tab. If a
 * printable PDF version becomes available later, pass it as `downloadUrl`.
 */
export interface OnlineFormSectionProps {
  /** Section heading shown above the card (e.g. "Online Grievance and Redressal"). */
  sectionTitle: string
  /** Optional supporting text shown under the section heading. */
  sectionDescription?: string
  /** Card title (e.g. "Online Grievance Redressal Form"). */
  cardTitle: string
  /** Optional card description. */
  cardDescription?: string
  /** URL opened by the "View" button (the live form). */
  formUrl: string
  /** URL opened by the "Download" button. Defaults to `formUrl`. */
  downloadUrl?: string
}

export function OnlineFormSection({
  sectionTitle,
  sectionDescription,
  cardTitle,
  cardDescription,
  formUrl,
  downloadUrl,
}: OnlineFormSectionProps) {
  const resolvedDownloadUrl = downloadUrl ?? formUrl

  return (
    <section className="mt-12">
      {/* Section heading — mirrors the category headings in LocalPdfLinkList */}
      <h2 className="text-2xl font-bold text-primary mb-2">{sectionTitle}</h2>
      {sectionDescription && (
        <p className="text-muted-foreground mb-6">{sectionDescription}</p>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Card — matches the LocalPdfCard markup for visual consistency */}
        <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="p-6">
            {/* Title */}
            <div className="flex items-start gap-3 mb-3">
              <FileText className="w-6 h-6 flex-shrink-0 mt-1 text-primary" />
              <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-opacity-80 transition-colors">
                {cardTitle}
              </h4>
            </div>

            {/* Description */}
            {cardDescription && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {cardDescription}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {/* View — opens the live form */}
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground transition-all duration-300 hover:scale-105"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </a>

              {/* Download — same form URL (swap for a PDF if one becomes available) */}
              <a
                href={resolvedDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-primary text-primary font-medium transition-all duration-300 hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
