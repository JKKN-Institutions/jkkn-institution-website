/**
 * Render-time overrides for engineering CMS pages other than the homepage (engg.jkkn.ac.in).
 *
 * Same contract as ./homepage-overrides.ts: every rule is an exact-match swap that fires only
 * while the CMS still holds the value read on 2026-10-29, so an edit made in the CMS always wins.
 * The facts come from ./official-data.ts (AICTE EoA 2026-27, NAAC list, UGC lists, DoTE).
 *
 * - /approvals-and-affiliation: the "AICTE EOA 2008-2023" button opened the Anna University
 *   affiliation order, and the EoA letters for 2025-26 and 2026-27 were not linked at all.
 * - Every page with an AdmissionHero that keeps the component's default trust badges: the
 *   defaults read "UGC Recognized" (UGC lists the college under Section 2(f)) and repeat NAAC.
 */

import { APPROVALS_DIRECT_ANSWER, NAAC_LABEL, UGC_SECTION_LABEL } from './official-data'

type Props = Record<string, unknown>

interface CmsBlock {
  component_name: string
  props: unknown
}

function isRecord(value: unknown): value is Props {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const APPROVALS_SLUG = 'approvals-and-affiliation'

const APPROVALS_TITLE_OLD = 'APPROVALS AND AFFILIATION'
const APPROVALS_TITLE_NEW = 'Approvals, Affiliation and Official Data'

const EOA_DOCUMENTS_OLD = [
  { id: '1-1', pdfUrl: '/pdfs/approvals/Anna-University-Affiliation-order-2008-2023.pdf', buttonLabel: 'AICTE EOA 2008-2023' },
  { id: '1-2', pdfUrl: '/pdfs/approvals/EOA-Report-2024-2025.pdf', buttonLabel: 'AICTE EOA 2024-2025' },
]
// The 2026-27 and 2025-26 letters are pages 11-14 and 15-18 of the Mandatory Disclosure PDF,
// copied unchanged into their own files. The Anna University order stays in its own section.
const EOA_DOCUMENTS_NEW = [
  { id: '1-2026', pdfUrl: '/pdfs/approvals/EOA-Report-2026-2027.pdf', buttonLabel: 'AICTE EOA 2026-2027' },
  { id: '1-2025', pdfUrl: '/pdfs/approvals/EOA-Report-2025-2026.pdf', buttonLabel: 'AICTE EOA 2025-2026' },
  { id: '1-2', pdfUrl: '/pdfs/approvals/EOA-Report-2024-2025.pdf', buttonLabel: 'AICTE EOA 2024-2025' },
  {
    id: '1-md',
    pdfUrl: '/pdfs/mandatory-disclosure/Mandatory-Disclosure.pdf',
    buttonLabel: 'Older EOA letters',
  },
]
const AFFILIATION_SECTION_TITLE_OLD = 'Anna University Affiliation order 2008-2023'
const AFFILIATION_SECTION_TITLE_NEW = 'Anna University Affiliation Orders'

const APPROVALS_META_TITLE_OLD = 'Approvals & Affiliation — JKKN Engineering | AICTE, Anna University'
const APPROVALS_META_TITLE_NEW = 'Approvals, NAAC and Official Codes | JKKN Engineering'
const APPROVALS_META_DESCRIPTION_OLD =
  'JKKN College of Engineering is AICTE approved, Anna University affiliated, and NAAC accredited. View all regulatory approvals, affiliations, and compliance certificates.'
const APPROVALS_META_DESCRIPTION_NEW =
  'AICTE approval 2026-27 for 372 seats, Anna University affiliation, UGC autonomous listing, NAAC B+, TNEA code 2647 and AISHE C-37096 of JKKN Engineering.'

const ENGG_TRUST_BADGES = [
  { icon: 'check', label: 'AICTE Approved' },
  { icon: 'check', label: 'Anna University Affiliated' },
  { icon: 'check', label: NAAC_LABEL },
  { icon: 'check', label: UGC_SECTION_LABEL },
]

function sameDocuments(list: unknown, expected: typeof EOA_DOCUMENTS_OLD): boolean {
  return (
    Array.isArray(list) &&
    list.length === expected.length &&
    list.every(
      (doc, index) =>
        isRecord(doc) &&
        doc.id === expected[index].id &&
        doc.pdfUrl === expected[index].pdfUrl &&
        doc.buttonLabel === expected[index].buttonLabel
    )
  )
}

function overrideApprovalsSection(props: Props): Props {
  const sections = Array.isArray(props.sections)
    ? props.sections.map((section) => {
        if (!isRecord(section)) return section
        if (section.id === '1' && sameDocuments(section.documents, EOA_DOCUMENTS_OLD)) {
          return { ...section, documents: EOA_DOCUMENTS_NEW }
        }
        if (section.id === '2' && section.title === AFFILIATION_SECTION_TITLE_OLD) {
          return { ...section, title: AFFILIATION_SECTION_TITLE_NEW }
        }
        return section
      })
    : props.sections
  const hasSubtitle = typeof props.pageSubtitle === 'string' && props.pageSubtitle.trim() !== ''
  return {
    ...props,
    pageTitle: props.pageTitle === APPROVALS_TITLE_OLD ? APPROVALS_TITLE_NEW : props.pageTitle,
    // The 47-word direct answer sits right under the H1.
    ...(!hasSubtitle && { pageSubtitle: APPROVALS_DIRECT_ANSWER }),
    sections,
  }
}

function overrideAdmissionHero(props: Props): Props {
  return props.trustBadges === undefined ? { ...props, trustBadges: ENGG_TRUST_BADGES } : props
}

function overrideBlock(slug: string, block: CmsBlock): Props | null {
  if (!isRecord(block.props)) return null
  if (block.component_name === 'ApprovalsAffiliationSection' && slug === APPROVALS_SLUG) {
    return overrideApprovalsSection(block.props)
  }
  if (block.component_name === 'AdmissionHero') return overrideAdmissionHero(block.props)
  return null
}

/** Returns new block objects; the blocks passed in are never mutated. */
export function applyEngineeringCmsPageOverrides<T extends CmsBlock>(slug: string, blocks: T[]): T[] {
  return blocks.map((block) => {
    const props = overrideBlock(slug, block)
    return props ? { ...block, props } : block
  })
}

/** Title and description of a CMS page (cms_seo_metadata), with their share-text copies. */
export function applyEngineeringCmsSeoOverrides<T extends object>(
  slug: string,
  seo: T | null | undefined
): T | null | undefined {
  if (!seo || slug !== APPROVALS_SLUG) return seo
  const row = seo as Props
  const out: Props = { ...row }
  for (const key of ['meta_title', 'og_title', 'twitter_title']) {
    if (row[key] === APPROVALS_META_TITLE_OLD) out[key] = APPROVALS_META_TITLE_NEW
  }
  for (const key of ['meta_description', 'og_description', 'twitter_description']) {
    if (row[key] === APPROVALS_META_DESCRIPTION_OLD) out[key] = APPROVALS_META_DESCRIPTION_NEW
  }
  return out as T
}
