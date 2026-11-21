// F1 + F11 of the engineering perception audit (2026-11-21): the /admissions FAQ must carry the college's own
// NIRF 2026 placement figures, the fee page's tuition, the bus fee and no unsourced percentage.
import { describe, expect, it } from 'vitest'
import {
  COST_ANSWER,
  NIRF_PLACEMENT_ANSWER,
  SCHOLARSHIP_ANSWER,
  withHonestAdmissionsFaqs,
} from '@/lib/institutions/engineering/admissions-faq-override'
import { FAQS, type FAQItem } from '@/lib/institutions/engineering/admissions-data'

// The live site_settings rows, as served on engg.jkkn.ac.in/admissions on 2026-11-21 (answers shortened
// only where the rule does not depend on them).
const LIVE_ROWS: FAQItem[] = [
  {
    question: 'What is the application fee for engineering programmes?',
    answer: 'There is no application fee.',
    audience: 'student',
  },
  {
    question: 'How does TNEA counselling work for engineering seats?',
    answer: 'TNEA is conducted by Anna University.',
    audience: 'student',
  },
  {
    question: 'What is the total cost of education including hostel?',
    answer:
      'For B.E / B.Tech programs, annual tuition is ₹95,000. Hostel accommodation (optional, all-inclusive with meals and utilities) is ₹60,000 per year — total ₹1,55,000 per year.',
    audience: 'parent',
  },
  {
    question: 'What percentage of students get placed after graduation?',
    answer:
      'JKKN College of Engineering maintains a 92%+ placement rate (verified 2025). Top recruiters include TCS, Infosys, Wipro, Cognizant, HCL, and 500+ companies. Average package: ₹3.5L per annum; highest: ₹8.5L+.',
    audience: 'parent',
  },
  {
    question: 'Is the campus safe? What are the hostel facilities?',
    answer: 'The campus has 24/7 CCTV surveillance.',
    audience: 'parent',
  },
  {
    question: 'Are there scholarships for financially weaker families?',
    answer:
      'Yes. Need-Based Financial Aid is available for families with annual income below ₹2.5L — up to 50% tuition reduction. Around 75% of students receive some form of financial aid.',
    audience: 'parent',
  },
]

const UNSOURCED = [/92%/, /500\+ companies/, /₹95,000/, /₹60,000/, /1,55,000/, /75% of/, /up to 50%/i, /8\.5L/]

describe('withHonestAdmissionsFaqs', () => {
  const out = withHonestAdmissionsFaqs(LIVE_ROWS)
  const text = out.map((faq) => `${faq.question} ${faq.answer}`).join('\n')

  it('removes every unsourced figure from the live rows', () => {
    for (const pattern of UNSOURCED) expect(text).not.toMatch(pattern)
  })

  it('answers the placement question with the NIRF 2026 figures', () => {
    const placement = out.find((faq) => /placed after graduation/i.test(faq.question))
    expect(placement?.answer).toBe(NIRF_PLACEMENT_ANSWER)
    expect(NIRF_PLACEMENT_ANSWER).toContain('23 of the 53')
    expect(NIRF_PLACEMENT_ANSWER).toContain('₹2,40,000')
  })

  it('gives the fee page tuition, the ₹5,500 bus fee and sends the hostel fee to the office', () => {
    const cost = out.find((faq) => /total cost of education/i.test(faq.question))
    expect(cost?.answer).toBe(COST_ANSWER)
    expect(COST_ANSWER).toContain('₹80,000')
    expect(COST_ANSWER).toContain('₹45,000')
    expect(COST_ANSWER).toContain('₹5,500 a year on every route')
    expect(COST_ANSWER).toContain('+91 93458 55001')
  })

  it('replaces the scholarship answer with sourced text', () => {
    const scholarship = out.find((faq) => /financially weaker/i.test(faq.question))
    expect(scholarship?.answer).toBe(SCHOLARSHIP_ANSWER)
  })

  it('appends the autonomous, NAAC and counselling-code questions once', () => {
    expect(out).toHaveLength(LIVE_ROWS.length + 3)
    expect(text).toMatch(/S\.No\. 1239/)
    expect(text).toMatch(/Grade B\+ \(CGPA 2\.67\)/)
    expect(text).toMatch(/counselling code is 2647/)
    expect(withHonestAdmissionsFaqs(out)).toHaveLength(out.length)
  })

  it('leaves untouched questions and the input list as they were', () => {
    expect(out[0]).toBe(LIVE_ROWS[0])
    expect(LIVE_ROWS[3].answer).toMatch(/92%/)
  })

  it('also cleans the static fallback list', () => {
    const fallback = withHonestAdmissionsFaqs(FAQS).map((faq) => faq.answer).join('\n')
    for (const pattern of UNSOURCED) expect(fallback).not.toMatch(pattern)
  })
})
