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
 *
 * 2026-10-29: the official-data check (AICTE EoA 2026-27, NAAC list as on 14-08-2025, TNEA 2026)
 * added rules that take out what those documents contradict - the 3000+ / 95% / 12+ hero stats,
 * the placement-rate and package counters, B.Tech AI & ML, Civil and MCA, seat counts of 120 -
 * and add the NAAC grade B+. Values come from ./official-data.ts. The 2026-10-08 "new" wording
 * is also matched, so these rules still fire if 02-homepage-autonomous-status.sql is applied.
 */

import { ENGG_OFFICIAL, NAAC_LABEL } from './official-data'

type Props = Record<string, unknown>

interface HomepageBlock {
  component_name: string
  props: Props
}

const BADGE_OLD = 'AICTE Approved | Anna University Affiliated | NAAC Accredited'
const BADGE_AUTONOMOUS = 'AICTE Approved | Autonomous | Anna University Affiliated | NAAC Accredited'
const BADGE_NEW = `AICTE Approved | Autonomous | Anna University Affiliated | ${NAAC_LABEL}`

const HERO_DESCRIPTION_OLD =
  'Join one of the leading engineering colleges with 70+ years of educational excellence. World-class senior learners, state-of-the-art infrastructure, and 95% placement record.'
const HERO_DESCRIPTION_NEW =
  'Join JKKN College of Engineering and Technology (Autonomous), Komarapalayam - AICTE approved and affiliated to Anna University, Chennai.'

interface Stat {
  label: string
  value: number
  suffix?: string
}

// Hero stats on 2026-10-08. None has a source: the NIRF 2026 filing says 607 learners and the
// AICTE EoA 2026-27 lists 7 programmes.
const HERO_STATS_OLD: Stat[] = [
  { label: 'Learners', value: 3000, suffix: '+' },
  { label: 'Placement', value: 95, suffix: '%' },
  { label: 'Top Recruiters', value: 6, suffix: '' },
  { label: 'Programs', value: 12, suffix: '+' },
]
const HERO_STATS_NEW = [
  { icon: 'graduation', label: 'AICTE-approved seats 2026-27', value: ENGG_OFFICIAL.totalSeats, suffix: '' },
  { icon: 'users', label: 'AICTE-approved courses', value: ENGG_OFFICIAL.programmeCount, suffix: '' },
  { icon: 'building', label: 'B.E. / B.Tech branches', value: ENGG_OFFICIAL.ugBranchCount, suffix: '' },
  { icon: 'trending', label: 'TNEA code', value: Number(ENGG_OFFICIAL.codes.tnea), suffix: '' },
]

// Placement counters with no published source. By the user's rule no placement figure is shown,
// so the counters go and the section keeps its title, text and recruiter logos.
const PLACEMENT_STATS_OLD: Stat[] = [
  { label: 'Placement Rate', value: 95, suffix: '%' },
  { label: 'Highest Package', value: 12, suffix: ' LPA' },
  { label: 'Average Package', value: 4.5, suffix: ' LPA' },
  { label: 'Recruiters', value: 50, suffix: '+' },
]

// AICTE EoA 2026-27 intake, keyed by the programme card's link: [seats on 2026-10-08, approved seats].
const PROGRAM_SEAT_FIXES: Record<string, [number, number]> = {
  '/courses-offered/ug/be-mechanical': [120, 60],
  '/courses-offered/pg/mba': [120, 60],
  '/courses-offered/pg/me-cse': [60, 12],
}

const ACCREDITATION_SHORT_NAMES = ['AICTE', 'Anna University', 'NAAC']
// The NAAC card carried NBA's name (National Board of Accreditation). NBA lists no programme of
// this college; NAAC lists the institution with Grade B+.
const NAAC_NAME_OLD = 'National Board of Accreditation'
const NAAC_NAME_NEW = 'National Assessment and Accreditation Council'
const NAAC_DESCRIPTION_OLD = 'Accredited'
const NAAC_DESCRIPTION_NEW = `Accredited (${ENGG_OFFICIAL.naac.grade})`
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
// NAAC accredits the institution, not programmes; the grade is from NAAC's own list.
const ABOUT_NAAC_FEATURE_OLD = 'NAAC Accredited Programs'
const ABOUT_PLACEMENT_FEATURE_OLD = '95% Placement Record'
const ABOUT_PLACEMENT_FEATURE_NEW = 'Placement Cell and Training Support'

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
const AICTE_ANSWER_AUTONOMOUS =
  'Yes. JKKN College of Engineering and Technology is approved by AICTE (All India Council for Technical Education) and affiliated to Anna University, Chennai. It is an autonomous institution, with autonomous status conferred by UGC, New Delhi and Anna University, Chennai, and it is NAAC accredited.'
const AICTE_ANSWER_NEW =
  'Yes. JKKN College of Engineering and Technology is approved by AICTE (All India Council for Technical Education) for 2026-27 and affiliated to Anna University, Chennai. It is an autonomous institution, with autonomous status conferred by UGC, New Delhi and Anna University, Chennai, and it is accredited by NAAC with Grade B+.'
const AUTONOMOUS_FAQ = {
  answer:
    'Yes. JKKN College of Engineering and Technology (JKKNCET), Komarapalayam, is an autonomous institution: autonomous status has been conferred by UGC, New Delhi and Anna University, Chennai. The college remains affiliated to Anna University, Chennai, and is approved by AICTE for its B.E., B.Tech, M.E. and MBA programmes.',
  question: 'Is JKKN College of Engineering and Technology an autonomous college?',
}

const COURSES_QUESTION = 'What engineering courses are offered at JKKN Engineering College?'
const COURSES_ANSWER_OLD =
  'We offer B.E. programs in Computer Science & Engineering, Electronics & Communication, Electrical & Electronics, Mechanical Engineering, and Civil Engineering. We also offer B.Tech programs in AI & Machine Learning and Information Technology, along with postgraduate programs MBA and MCA.'
const COURSES_ANSWER_NEW =
  'For 2026-27 AICTE has approved seven programmes: B.E. Computer Science and Engineering, B.E. Electronics and Communication Engineering, B.E. Electrical and Electronics Engineering, B.E. Mechanical Engineering and B.Tech Information Technology (60 seats each), M.E. Computer Science and Engineering (12 seats) and MBA (60 seats).'

const PLACEMENT_QUESTION = 'What is the placement record at JKKN Engineering College?'
const PLACEMENT_ANSWER_OLD =
  'We maintain an excellent placement record with 95%+ placement rate. The highest package offered is 12 LPA with an average package of 4.5 LPA. Over 50 companies recruit from our campus including TCS, Infosys, Wipro, Cognizant, IBM, Amazon, Zoho, and more.'
const PLACEMENT_ANSWER_NEW =
  'JKKN College of Engineering and Technology has a Training and Placement Cell that runs placement training and organises campus recruitment drives for final-year learners. The placement data the college files with NIRF every year is published on the NIRF page of the IQAC section of this website.'

const AIML_QUESTION_OLD = 'Does JKKN offer AI and Machine Learning courses?'
const AIML_ANSWER_OLD =
  'Yes, we offer a dedicated B.Tech program in Artificial Intelligence & Machine Learning with 60 seats. The program covers Deep Learning, Neural Networks, Data Science, and cutting-edge AI technologies with hands-on projects and industry internships.'
const AIML_FAQ_NEW = {
  question: 'Does JKKN offer a B.Tech in AI & Machine Learning?',
  answer:
    'Not for 2026-27. The AICTE Extension of Approval for 2026-27 lists seven programmes: B.E. CSE, ECE, EEE and Mechanical, B.Tech IT, M.E. CSE and MBA. There is no B.Tech AI & ML intake this year. For course questions, contact the admissions office at engg@jkkn.ac.in or +91 93458 55001.',
}

const CTA_SUBTITLE_OLD =
  'Join JKKN College of Engineering and take the first step towards a successful career in technology'
const CTA_SUBTITLE_NEW =
  'Join JKKN College of Engineering and Technology (Autonomous) and take the first step towards a successful career in technology'

const META_DESCRIPTION_OLD =
  'JKKNCET — one of the best private engineering colleges in Tamilnadu. A top engineering college with NAAC accreditation, excellent placements & affordable fees.'
const META_DESCRIPTION_AUTONOMOUS =
  'JKKNCET (Autonomous) — one of the best private engineering colleges in Tamilnadu. AICTE approved, affiliated to Anna University, Chennai, and NAAC accredited.'
const META_DESCRIPTION_NEW =
  'JKKNCET (Autonomous) — one of the best private engineering colleges in Tamilnadu. AICTE approved, affiliated to Anna University, Chennai, NAAC accredited (B+).'

const LOGO_ALT_OLD = 'JKKN Engineering College'
const LOGO_ALT_NEW = 'JKKN College of Engineering and Technology (Autonomous)'

function isRecord(value: unknown): value is Props {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function swap(value: unknown, from: string | readonly string[], to: string): unknown {
  const olds = typeof from === 'string' ? [from] : from
  return typeof value === 'string' && olds.includes(value) ? to : value
}

/** True when the list holds exactly these stats (label, value, suffix), in this order. */
function sameStats(list: unknown, expected: Stat[]): boolean {
  return (
    Array.isArray(list) &&
    list.length === expected.length &&
    list.every(
      (item, index) =>
        isRecord(item) &&
        item.label === expected[index].label &&
        item.value === expected[index].value &&
        (item.suffix ?? '') === (expected[index].suffix ?? '')
    )
  )
}

function overrideHero(props: Props): Props {
  return {
    ...props,
    badge: swap(props.badge, [BADGE_OLD, BADGE_AUTONOMOUS], BADGE_NEW),
    subtitle: swap(props.subtitle, [BADGE_OLD, BADGE_AUTONOMOUS], BADGE_NEW),
    description: swap(props.description, HERO_DESCRIPTION_OLD, HERO_DESCRIPTION_NEW),
    ...(sameStats(props.stats, HERO_STATS_OLD) && { stats: HERO_STATS_NEW }),
  }
}

function overrideNaacCard(item: unknown): unknown {
  if (!isRecord(item) || item.shortName !== 'NAAC') return item
  return {
    ...item,
    name: swap(item.name, NAAC_NAME_OLD, NAAC_NAME_NEW),
    description: swap(item.description, NAAC_DESCRIPTION_OLD, NAAC_DESCRIPTION_NEW),
  }
}

function overrideAccreditations(props: Props): Props {
  if (!Array.isArray(props.accreditations)) return props
  const list = props.accreditations.map(overrideNaacCard)
  const untouched =
    list.length === ACCREDITATION_SHORT_NAMES.length &&
    list.every((item, index) => isRecord(item) && item.shortName === ACCREDITATION_SHORT_NAMES[index])
  return { ...props, accreditations: untouched ? [...list, UGC_ACCREDITATION] : list }
}

function overrideAbout(props: Props): Props {
  const features = Array.isArray(props.features)
    ? props.features.map((feature) => {
        const step = swap(feature, ABOUT_FEATURE_OLD, ABOUT_FEATURE_NEW)
        const naac = swap(step, ABOUT_NAAC_FEATURE_OLD, NAAC_LABEL)
        return swap(naac, ABOUT_PLACEMENT_FEATURE_OLD, ABOUT_PLACEMENT_FEATURE_NEW)
      })
    : props.features
  return {
    ...props,
    title: swap(props.title, ABOUT_TITLE_OLD, ABOUT_TITLE_NEW),
    description: swap(props.description, ABOUT_DESCRIPTION_OLD, ABOUT_DESCRIPTION_NEW),
    features,
  }
}

function overridePrograms(props: Props): Props {
  if (!Array.isArray(props.programs)) return props
  const programs = props.programs.map((program) => {
    if (!isRecord(program) || typeof program.link !== 'string') return program
    const fix = PROGRAM_SEAT_FIXES[program.link]
    return fix && program.seats === fix[0] ? { ...program, seats: fix[1] } : program
  })
  return { ...props, programs }
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

function overridePlacements(props: Props): Props {
  return sameStats(props.stats, PLACEMENT_STATS_OLD) ? { ...props, stats: [] } : props
}

function overrideFaq(faq: Props): Props {
  if (faq.question === AICTE_QUESTION) {
    return { ...faq, answer: swap(faq.answer, [AICTE_ANSWER_OLD, AICTE_ANSWER_AUTONOMOUS], AICTE_ANSWER_NEW) }
  }
  if (faq.question === COURSES_QUESTION) {
    return { ...faq, answer: swap(faq.answer, COURSES_ANSWER_OLD, COURSES_ANSWER_NEW) }
  }
  if (faq.question === PLACEMENT_QUESTION) {
    return { ...faq, answer: swap(faq.answer, PLACEMENT_ANSWER_OLD, PLACEMENT_ANSWER_NEW) }
  }
  if (faq.question === AIML_QUESTION_OLD && faq.answer === AIML_ANSWER_OLD) {
    return { ...faq, ...AIML_FAQ_NEW }
  }
  return faq
}

function overrideFaqs(props: Props): Props {
  if (!Array.isArray(props.faqs)) return props
  const hasAutonomousFaq = props.faqs.some(
    (faq) => isRecord(faq) && faq.question === AUTONOMOUS_FAQ.question
  )
  const faqs: unknown[] = []
  for (const faq of props.faqs) {
    if (!isRecord(faq)) {
      faqs.push(faq)
      continue
    }
    faqs.push(overrideFaq(faq))
    // The new question sits right after the approval question, and only once.
    if (faq.question === AICTE_QUESTION && !hasAutonomousFaq) faqs.push(AUTONOMOUS_FAQ)
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
  EngineeringProgramsSection: overridePrograms,
  EngineeringWhyChooseSection: overrideWhyChoose,
  EngineeringPlacementsSection: overridePlacements,
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
  const olds = [META_DESCRIPTION_OLD, META_DESCRIPTION_AUTONOMOUS]
  return {
    ...seo,
    ...('meta_description' in row && {
      meta_description: swap(row.meta_description, olds, META_DESCRIPTION_NEW),
    }),
    ...('og_description' in row && {
      og_description: swap(row.og_description, olds, META_DESCRIPTION_NEW),
    }),
    ...('twitter_description' in row && {
      twitter_description: swap(row.twitter_description, olds, META_DESCRIPTION_NEW),
    }),
  }
}

/** Header logo alt text (site_settings.logo_alt_text). */
export function applyEngineeringLogoAltOverride(alt: string): string {
  return alt === LOGO_ALT_OLD ? LOGO_ALT_NEW : alt
}
