'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { HelpCircle, Plus } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'What is JKKN Institutions?',
    answer:
      'JKKN Institutions (JKKN) is a premier educational group in Komarapalayam, Tamil Nadu, comprising 11 institutions (7 colleges and 4 schools). Established in 1952, JKKN offers 50+ programs in dental, pharmacy, engineering, nursing, allied and arts with 92%+ placement success.',
  },
  {
    question: 'Why is JKKN the best college in Erode region?',
    answer:
      "JKKN is recognized as Erode's best college due to 74+ years of excellence, NAAC A accreditation, 92%+ placement rate, and 50,000+ successful alumni. Top recruiters include Foxconn, Apex Pharma, Apotex, Cipla and Bosch making it the preferred choice for career-focused Learners.",
  },
  {
    question: 'Who founded JKKN Institutions?',
    answer:
      "JKKN was founded by visionary Kodai Vallal Shri. J.K.K. Natarajah, who started a school in 1965 to promote girls' education. His vision led to J.K.K. Rangammal Trust (1969), now led by Chairperson Smt. N. Sendamaraai and Director Shri. S. Ommsharravana.",
  },
  {
    question: 'How many colleges are under JKKN?',
    answer:
      'JKKN comprises 11 institutions: Dental College, Pharmacy College, Engineering College, Allied Health Sciences, Arts & Science College (Autonomous), Education College, Sresakthimayeil Institute Of Nursing And Research, Matriculation School, Nattraja Vidhyalya, Elementary School and Girls Higher Secondary School — all located on one integrated residential campus in Komarapalayam.',
  },
  {
    question: 'What courses does JKKN offer?',
    answer:
      'JKKN offers 50+ programs including BDS/MDS (Dental), B.Pharm/M.Pharm/Pharm.D (Pharmacy), B.E./B.Tech/MBA (Engineering), B.Sc/M.Sc Nursing, Allied Health Sciences, B.Ed, and various UG/PG Arts & Science degrees with industry-relevant specializations.',
  },
  {
    question: 'Which universities is JKKN affiliated with?',
    answer:
      'JKKN colleges are affiliated with Tamil Nadu Dr. M.G.R. Medical University (Dental/Nursing/Pharmacy), Anna University Chennai (Engineering), and Periyar University Salem (Arts & Science). All programs are approved by AICTE, DCI, PCI, INC, and NAAC.',
  },
  {
    question: 'How do I apply for JKKN admission 2026-27?',
    answer:
      "Apply online at jkkn.in/admission-form for 2026-27 admissions. Submit required documents, complete fee payment, and attend counseling if applicable. For Dental/Nursing, NEET scores are required; for Engineering, TNEA counseling applies. Early bird discounts available for early applicants.",
  },
  {
    question: 'What is the BDS admission process at JKKN Dental College?',
    answer:
      'BDS admission requires qualifying NEET UG and participating in Tamil Nadu DME counseling. Candidates must be 17+ years old and have completed 10+2 with Physics, Chemistry, and Biology. Admission is based on NEET scores and seat availability.',
  },
  {
    question: 'What are engineering admission requirements at JKKN?',
    answer:
      "B.E./B.Tech admission is through TNEA (Tamil Nadu Engineering Admissions) counseling. Candidates need 10+2 with Mathematics, Physics, and Chemistry from a recognized board. The college follows Anna University guidelines. MBA have separate eligibility criteria.",
  },
  {
    question: "What is JKKN's placement rate?",
    answer:
      'JKKN maintains an impressive 92%+ placement rate across institutions. The Dental College achieved 92% placements in 2024. The dedicated Placement Cell organizes campus drives, skill development programs, and mock interviews to enhance Learner employability.',
  },
  {
    question: 'How do I reach JKKN from Erode?',
    answer:
      'JKKN is located just 15 km from Erode City on NH-544 (Salem-Coimbatore Highway). Reach by bus from Erode Bus Stand (30 minutes), train to Erode Junction (18 km), or air via Salem Airport (60 km) or Coimbatore Airport (100 km).',
  },
  {
    question: "What is JKKN's address?",
    answer:
      'JKKN Institutions, Natarajapuram, NH-544 (Salem-Coimbatore Highway), Komarapalayam, Namakkal District, Tamil Nadu - 638183. Contact: +91 93458 55001 | Email: info@jkkn.ac.in. Located on the main highway for easy accessibility.',
  },
  {
    question: 'Which areas does JKKN serve?',
    answer:
      'JKKN primarily serves Learners from Erode, Salem, Namakkal, Komarapalayam, Tiruchengode, Sankagiri, Bhavani, Perundurai, and Gobichettipalayam. However, Learners from across Tamil Nadu, neighboring states locations attend due to its excellent reputation.',
  },
]

export function FAQSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-900 via-[#085032]/30 to-gray-900"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/10 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-secondary/10 to-yellow-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div
          className={cn(
            'text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/30 text-secondary text-sm font-semibold mb-4 border border-secondary/40">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Frequently Asked{' '}
            <span className="text-primary">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Everything you need to know about JKKN Institutions
          </p>
        </div>

        {/* FAQ Accordion */}
        <div
          className={cn(
            'max-w-4xl mx-auto transition-all duration-700 delay-200',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.slice(0, 10).map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={cn(
                  'bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl px-6 transition-all duration-300 hover:bg-gray-800/70 hover:border-white/20',
                  'data-[state=open]:bg-gray-800/70 data-[state=open]:border-primary/30 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/10'
                )}
              >
                <AccordionTrigger className="text-left hover:no-underline py-5 [&[data-state=open]>svg]:text-primary">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-yellow-500/20 border border-secondary/30">
                        <HelpCircle className="w-5 h-5 text-secondary" />
                      </div>
                    </div>
                    <span className="text-base sm:text-lg font-semibold text-white pr-4">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed pl-16 pr-4 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div
          className={cn(
            'text-center mt-16 transition-all duration-700 delay-400',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Can't find the answer you're looking for? Our admissions team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919345855001"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-gray-900 bg-secondary hover:bg-yellow-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Call +91 93458 55001
              </a>
              <a
                href="mailto:info@jkkn.ac.in"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-primary border-2 border-white/20 hover:bg-primary/90 hover:border-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  )
}
