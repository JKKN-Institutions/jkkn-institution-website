'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const ADMISSIONS_FAQS = [
  {
    question: 'How can I apply for admission at JKKN for 2026-27?',
    answer:
      'Admissions for 2026-27 are now open! Fill out the enquiry form above or apply online at our admissions portal. The process includes: (1) Fill online application form, (2) Submit required documents, (3) Pay application fee, (4) Attend counselling, (5) Complete admission formalities. Contact us at +91 93458 55001 or info@jkkn.ac.in.',
  },
  {
    question: 'What courses are offered at JKKN Institutions?',
    answer:
      'JKKN offers 50+ UG and PG programs: Engineering (B.E/B.Tech, M.E, MBA), Dental Sciences (BDS, MDS), Pharmacy (B.Pharm, M.Pharm, Pharm.D, Ph.D), Nursing (B.Sc, P.B.B.Sc, M.Sc), Allied Health Sciences (9 B.Sc programs), Arts & Science (16 UG + 9 PG + Ph.D), and Education (B.Ed in 14 subjects).',
  },
  {
    question: 'Is JKKN approved by AICTE, UGC, and other regulatory bodies?',
    answer:
      'Yes! JKKN is fully approved by AICTE (Engineering & Pharmacy), UGC (Arts & Science), DCI (Dental), PCI (Pharmacy), INC (Nursing), ISO 9001, and is NAAC A accredited. Our colleges are affiliated with Anna University and Periyar University.',
  },
  {
    question: 'What scholarships are available for students?',
    answer:
      'JKKN offers merit scholarships (up to 100% tuition), sports scholarships, girl student scholarships, SC/ST/OBC/Minority government scholarships, EWS financial aid, and alumni referral discounts. Scholarships can cover up to 100% of tuition fees based on eligibility.',
  },
  {
    question: 'Does JKKN offer hostel and transportation facilities?',
    answer:
      'Yes! JKKN provides separate hostels for boys and girls with 24/7 security, Wi-Fi, hygienic mess, and recreation areas. We also have a fleet of buses covering Erode, Coimbatore, Salem, Tirupur and surrounding areas. All facilities are affordable and safe.',
  },
  {
    question: "What is JKKN's placement rate?",
    answer:
      "JKKN boasts an impressive 92%+ placement rate across all programs. Our dedicated Career Development Center (CDC) partners with 100+ companies including TCS, Infosys, Wipro, Cognizant, HCL, Dell, HP, Zoho and leading healthcare organizations.",
  },
  {
    question: 'Where is JKKN campus located?',
    answer:
      'JKKN is located at Natarajapuram, NH-544 (Salem-Coimbatore Highway), Komarapalayam, Namakkal District, Tamil Nadu 638183. We are 30 km from Erode, 45 km from Salem and 70 km from Coimbatore. Contact +91 93458 55001 to schedule a campus tour.',
  },
  {
    question: 'What is NEET requirement for health science programs?',
    answer:
      'NEET (National Eligibility cum Entrance Test) score is required for admission to Dental (BDS, MDS), Pharmacy (B.Pharm, Pharm.D), Nursing (B.Sc, M.Sc) and Allied Health Sciences programs. Please contact our admissions office for current year cutoffs and eligibility criteria.',
  },
]

export function AdmissionsFAQ() {
  return (
    <Accordion type="single" collapsible className="space-y-3 max-w-3xl mx-auto">
      {ADMISSIONS_FAQS.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`faq-${index}`}
          className="bg-white border border-border rounded-xl px-6 overflow-hidden"
        >
          <AccordionTrigger className="text-left hover:no-underline py-5 text-sm font-semibold text-foreground hover:text-primary [&[data-state=open]]:text-primary">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
