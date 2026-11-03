// The footer's "about" paragraph comes from the CMS site settings (settings.description). On
// Engineering it read "JKKN College of Engineering and Technology, recognized as one of the best
// engineering colleges in Erode Region, is committed to ..." - a ranking claim with no source,
// shown on every page. User's choice 2026-11-03 (Step 5 of the 10,300-lead plan): replace it with
// facts the college publishes itself (autonomous status, AICTE approval, Anna University
// affiliation - the footer's own status line and the Approvals page). Done here, at render time,
// so no CMS record is edited; once the CMS text is corrected this becomes a no-op.

const UNSOURCED_CLAIM = /,\s*recognized as one of the best engineering colleges in Erode Region,/i

const FACTUAL_CLAUSE =
  ', an autonomous college in Komarapalayam approved by AICTE and affiliated to Anna University, Chennai,'

export function withoutUnsourcedFooterClaim(text: string): string
export function withoutUnsourcedFooterClaim(text: string | null | undefined): string | null | undefined
export function withoutUnsourcedFooterClaim(text: string | null | undefined) {
  if (!text) return text
  return text.replace(UNSOURCED_CLAIM, FACTUAL_CLAUSE)
}
