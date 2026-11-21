/**
 * Render-time overrides for main-site (www.jkkn.ac.in) CMS pages. F5 of the engineering perception audit
 * (user's choice 2026-11-21): /rankings-and-recognitions told parents the group is "NAAC A Accredited",
 * "NBA Accredited" and "NIRF Ranked". NAAC accredits each college separately; the NBA lists (UG Tier I / II,
 * PG, Management, read 2026-11-20) hold no JKKN engineering programme; NIRF 2025 Engineering lists JKKNCET as
 * a participant only. AI engines quote this page ("the site says NBA").
 *
 * Same contract as ../engineering/cms-page-overrides.ts: exact-match swaps that fire only while the CMS still
 * holds the text read on 2026-11-21, so an edit made in the CMS always wins. No database row is edited.
 * NAAC grades: NAAC "Institutions having valid accreditation" list as on 14-08-2025 (re-read 2026-11-20).
 */

type Props = Record<string, unknown>

interface CmsBlock {
  component_name: string
  props: unknown
}

function isRecord(value: unknown): value is Props {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const RANKINGS_SLUG = 'rankings-and-recognitions'

export const NAAC_BY_COLLEGE = 'Dental A, Pharmacy A, Nursing B++, Engineering B+, Arts and Science B'

const HERO_SUBTITLE_OLD =
  'NAAC A Accredited | AICTE Approved | UGC Recognised | NBA Accredited | NIRF Ranked | 74+ Years of Excellence'
const HERO_SUBTITLE_NEW = `NAAC: ${NAAC_BY_COLLEGE} | AICTE Approved | UGC Recognised | 74+ Years of Excellence`

const NAAC_FEATURE_TITLE_OLD = 'NAAC A Grade Accreditation'
const NAAC_FEATURE_NEW = {
  title: 'NAAC Accreditation, College by College',
  description:
    "NAAC accredits each college separately. NAAC's list of valid accreditations (as on 14 August 2025) gives JKKN Dental A (CGPA 3.01), Pharmacy A (3.09), Nursing B++ (2.79), Engineering B+ (2.67) and Arts and Science B (2.37).",
}

const STATS_TAGLINE_OLD = 'Recognised by NAAC | AICTE | UGC | DCI | PCI | INC | NBA'
const STATS_TAGLINE_NEW = 'Recognised by NAAC | AICTE | UGC | DCI | PCI | INC'
const NAAC_STAT_NEW = { label: 'NAAC-Accredited Colleges', value: '5', suffix: '' }

const CTA_TITLE_OLD = 'Study at a NAAC A Accredited Institution'
const CTA_TITLE_NEW = 'Study at a NAAC-Accredited JKKN College'
const CTA_DESCRIPTION_OLD =
  'JKKN Institutions is NAAC A accredited with all colleges holding individual regulatory approvals. Admissions 2026-27 are open. Secure your seat today.'
const CTA_DESCRIPTION_NEW =
  'Five JKKN colleges are NAAC accredited, each with its own grade, and every college holds its own regulatory approval. Enquiries for 2027-28 are open.'

const META_TITLE_OLD = 'Rankings & Recognitions | JKKN Institutions — NAAC, NIRF & Awards'
export const META_TITLE_NEW = 'Recognitions and NAAC Grades | JKKN Institutions'
const META_DESCRIPTION_OLD =
  'JKKN Institutions rankings and recognitions: NAAC A Grade, NIRF rankings, NBA accreditation, government approvals and awards for academic excellence near Erode, Tamil Nadu.'
export const META_DESCRIPTION_NEW = `NAAC grades of each JKKN college from NAAC's list: ${NAAC_BY_COLLEGE}. AICTE, DCI, PCI and INC approved.`

function overrideHero(props: Props): Props {
  return props.subtitle === HERO_SUBTITLE_OLD ? { ...props, subtitle: HERO_SUBTITLE_NEW } : props
}

function overrideWhyChoose(props: Props): Props {
  if (!Array.isArray(props.features)) return props
  let changed = false
  const features = props.features.map((feature) => {
    if (isRecord(feature) && feature.title === NAAC_FEATURE_TITLE_OLD) {
      changed = true
      return { ...feature, ...NAAC_FEATURE_NEW }
    }
    return feature
  })
  return changed ? { ...props, features } : props
}

function overrideStats(props: Props): Props {
  const stats = Array.isArray(props.stats)
    ? props.stats.map((stat) =>
        isRecord(stat) && stat.label === 'NAAC Grade' && stat.value === 'A' ? { ...stat, ...NAAC_STAT_NEW } : stat
      )
    : props.stats
  return {
    ...props,
    stats,
    tagline: props.tagline === STATS_TAGLINE_OLD ? STATS_TAGLINE_NEW : props.tagline,
  }
}

function overrideCta(props: Props): Props {
  return {
    ...props,
    title: props.title === CTA_TITLE_OLD ? CTA_TITLE_NEW : props.title,
    description: props.description === CTA_DESCRIPTION_OLD ? CTA_DESCRIPTION_NEW : props.description,
  }
}

const RANKINGS_BLOCK_OVERRIDES: Partial<Record<string, (props: Props) => Props>> = {
  HeroSection: overrideHero,
  WhyChooseSection: overrideWhyChoose,
  StatsCounter: overrideStats,
  CallToAction: overrideCta,
}

/** Returns new block objects; the blocks passed in are never mutated. */
export function applyMainCmsPageOverrides<T extends CmsBlock>(slug: string, blocks: T[]): T[] {
  if (slug !== RANKINGS_SLUG) return blocks
  return blocks.map((block) => {
    const override = RANKINGS_BLOCK_OVERRIDES[block.component_name]
    return override && isRecord(block.props) ? { ...block, props: override(block.props) } : block
  })
}

/** Title and description of a main-site CMS page (cms_seo_metadata), with their share-text copies. */
export function applyMainCmsSeoOverrides<T extends object>(slug: string, seo: T | null | undefined): T | null | undefined {
  if (!seo || slug !== RANKINGS_SLUG) return seo
  const row = seo as Props
  const out: Props = { ...row }
  for (const key of ['meta_title', 'og_title', 'twitter_title']) {
    if (row[key] === META_TITLE_OLD) out[key] = META_TITLE_NEW
  }
  for (const key of ['meta_description', 'og_description', 'twitter_description']) {
    if (row[key] === META_DESCRIPTION_OLD) out[key] = META_DESCRIPTION_NEW
  }
  return out as T
}
