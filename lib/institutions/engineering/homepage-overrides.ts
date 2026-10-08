/**
 * Render-time text overrides for the engineering homepage (engg.jkkn.ac.in).
 *
 * The homepage is a CMS page: its wording lives in cms_page_blocks, cms_seo_metadata and
 * site_settings, so a deploy cannot change it. These rules state the college's autonomous
 * status in the homepage spots that never mentioned it, without a CMS write.
 *
 * Every rule is an exact-match swap. It fires only while the CMS still holds the old value,
 * so an edit made in the CMS always wins and turns that rule into a no-op. Once
 * docs/database/engineering-supabase/02-homepage-autonomous-status.sql has been applied,
 * every rule here is a no-op and this file, with its three call sites, can be deleted.
 *
 * Wording is the college's own ("conferred by UGC, New Delhi and Anna University, Chennai").
 * Nothing is said about curriculum, examinations or an effective year.
 */

type Props = Record<string, unknown>

interface HomepageBlock {
  component_name: string
  props: Props
}

const BADGE_OLD = 'AICTE Approved | Anna University Affiliated | NAAC Accredited'
const BADGE_NEW = 'AICTE Approved | Autonomous | Anna University Affiliated | NAAC Accredited'

const HERO_DESCRIPTION_OLD =
  'Join one of the leading engineering colleges with 70+ years of educational excellence. World-class senior learners, state-of-the-art infrastructure, and 95% placement record.'
const HERO_DESCRIPTION_NEW =
  'Join JKKN College of Engineering and Technology (Autonomous), Komarapalayam - AICTE approved and affiliated to Anna University, Chennai.'

const ACCREDITATION_SHORT_NAMES = ['AICTE', 'Anna University', 'NAAC']
const UGC_ACCREDITATION = {
  icon: 'award',
  name: 'University Grants Commission',
  shortName: 'UGC',
  description: 'Autonomous Status',
}

const ABOUT_TITLE_OLD = 'Welcome to JKKN College of Engineering'
const ABOUT_TITLE_NEW = 'Welcome to JKKN College of Engineering and Technology (Autonomous)'
const ABOUT_DESCRIPTION_OLD =
  'Established as part of the prestigious JKKN Institutions with over 70 years of legacy, JKKN College of Engineering is committed to producing industry-ready engineers through quality education, practical training, and holistic development. Our state-of-the-art infrastructure and experienced senior learners ensure learners receive world-class technical education.'
const ABOUT_DESCRIPTION_NEW = `${ABOUT_DESCRIPTION_OLD} The college is an autonomous institution: autonomous status has been conferred by UGC, New Delhi and Anna University, Chennai.`
const ABOUT_FEATURE_OLD = 'AICTE Approved & Anna University Affiliated'
const ABOUT_FEATURE_NEW = 'AICTE Approved, Autonomous & Anna University Affiliated'

const WHY_CARD_OLD = {
  title: '95% Placements',
  description: 'Consistently high placement rate with top recruiters visiting campus',
}
const WHY_CARD_NEW = {
  icon: 'award',
  title: 'Autonomous Institution',
  description: 'Autonomous status conferred by UGC, New Delhi and Anna University, Chennai',
}

const AICTE_QUESTION = 'Is JKKN Engineering College AICTE approved?'
const AICTE_ANSWER_OLD =
  'Yes, JKKN College of Engineering & Technology is approved by AICTE (All India Council for Technical Education), affiliated with Anna University, and has NAAC accreditation for multiple programs. We are also NAAC accredited with A+ grade and ISO 9001:2015 certified.'
const AICTE_ANSWER_NEW =
  'Yes. JKKN College of Engineering and Technology is approved by AICTE (All India Council for Technical Education) and affiliated to Anna University, Chennai. It is an autonomous institution, with autonomous status conferred by UGC, New Delhi and Anna University, Chennai, and it is NAAC accredited.'
const AUTONOMOUS_FAQ = {
  answer:
    'Yes. JKKN College of Engineering and Technology (JKKNCET), Komarapalayam, is an autonomous institution: autonomous status has been conferred by UGC, New Delhi and Anna University, Chennai. The college remains affiliated to Anna University, Chennai, and is approved by AICTE for its B.E., B.Tech, M.E. and MBA programmes.',
  question: 'Is JKKN College of Engineering and Technology an autonomous college?',
}

const CTA_SUBTITLE_OLD =
  'Join JKKN College of Engineering and take the first step towards a successful career in technology'
const CTA_SUBTITLE_NEW =
  'Join JKKN College of Engineering and Technology (Autonomous) and take the first step towards a successful career in technology'

const META_DESCRIPTION_OLD =
  'JKKNCET — one of the best private engineering colleges in Tamilnadu. A top engineering college with NAAC accreditation, excellent placements & affordable fees.'
const META_DESCRIPTION_NEW =
  'JKKNCET (Autonomous) — one of the best private engineering colleges in Tamilnadu. AICTE approved, affiliated to Anna University, Chennai, and NAAC accredited.'

const LOGO_ALT_OLD = 'JKKN Engineering College'
const LOGO_ALT_NEW = 'JKKN College of Engineering and Technology (Autonomous)'

function isRecord(value: unknown): value is Props {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function swap(value: unknown, from: string, to: string): unknown {
  return value === from ? to : value
}

function overrideHero(props: Props): Props {
  return {
    ...props,
    badge: swap(props.badge, BADGE_OLD, BADGE_NEW),
    subtitle: swap(props.subtitle, BADGE_OLD, BADGE_NEW),
    description: swap(props.description, HERO_DESCRIPTION_OLD, HERO_DESCRIPTION_NEW),
  }
}

function overrideAccreditations(props: Props): Props {
  const list = props.accreditations
  if (!Array.isArray(list) || list.length !== ACCREDITATION_SHORT_NAMES.length) return props
  const untouched = list.every(
    (item, index) => isRecord(item) && item.shortName === ACCREDITATION_SHORT_NAMES[index]
  )
  return untouched ? { ...props, accreditations: [...list, UGC_ACCREDITATION] } : props
}

function overrideAbout(props: Props): Props {
  const features = Array.isArray(props.features)
    ? props.features.map((feature) => swap(feature, ABOUT_FEATURE_OLD, ABOUT_FEATURE_NEW))
    : props.features
  return {
    ...props,
    title: swap(props.title, ABOUT_TITLE_OLD, ABOUT_TITLE_NEW),
    description: swap(props.description, ABOUT_DESCRIPTION_OLD, ABOUT_DESCRIPTION_NEW),
    features,
  }
}

function overrideWhyChoose(props: Props): Props {
  if (!Array.isArray(props.features)) return props
  const features = props.features.map((card) =>
    isRecord(card) && card.title === WHY_CARD_OLD.title && card.description === WHY_CARD_OLD.description
      ? WHY_CARD_NEW
      : card
  )
  return { ...props, features }
}

function overrideFaqs(props: Props): Props {
  if (!Array.isArray(props.faqs)) return props
  const hasAutonomousFaq = props.faqs.some(
    (faq) => isRecord(faq) && faq.question === AUTONOMOUS_FAQ.question
  )
  const faqs: unknown[] = []
  for (const faq of props.faqs) {
    if (!isRecord(faq) || faq.question !== AICTE_QUESTION) {
      faqs.push(faq)
      continue
    }
    faqs.push({ ...faq, answer: swap(faq.answer, AICTE_ANSWER_OLD, AICTE_ANSWER_NEW) })
    // The new question sits right after the approval question, and only once.
    if (!hasAutonomousFaq) faqs.push(AUTONOMOUS_FAQ)
  }
  return { ...props, faqs }
}

function overrideCta(props: Props): Props {
  return { ...props, subtitle: swap(props.subtitle, CTA_SUBTITLE_OLD, CTA_SUBTITLE_NEW) }
}

const BLOCK_OVERRIDES: Partial<Record<string, (props: Props) => Props>> = {
  EngineeringHeroSection: overrideHero,
  EngineeringAccreditationsBar: overrideAccreditations,
  EngineeringAboutSection: overrideAbout,
  EngineeringWhyChooseSection: overrideWhyChoose,
  FAQAccordion: overrideFaqs,
  EngineeringCTASection: overrideCta,
}

/** Returns new block objects; the blocks passed in are never mutated. */
export function applyEngineeringHomepageOverrides<T extends HomepageBlock>(blocks: T[]): T[] {
  return blocks.map((block) => {
    const override = BLOCK_OVERRIDES[block.component_name]
    return override && isRecord(block.props) ? { ...block, props: override(block.props) } : block
  })
}

/** Homepage meta description and its share-text copies (cms_seo_metadata). */
export function applyEngineeringHomepageSeoOverrides<T extends object>(
  seo: T | null | undefined
): T | null | undefined {
  if (!seo) return seo
  const row = seo as Props
  return {
    ...seo,
    ...('meta_description' in row && {
      meta_description: swap(row.meta_description, META_DESCRIPTION_OLD, META_DESCRIPTION_NEW),
    }),
    ...('og_description' in row && {
      og_description: swap(row.og_description, META_DESCRIPTION_OLD, META_DESCRIPTION_NEW),
    }),
    ...('twitter_description' in row && {
      twitter_description: swap(row.twitter_description, META_DESCRIPTION_OLD, META_DESCRIPTION_NEW),
    }),
  }
}

/** Header logo alt text (site_settings.logo_alt_text). */
export function applyEngineeringLogoAltOverride(alt: string): string {
  return alt === LOGO_ALT_OLD ? LOGO_ALT_NEW : alt
}
