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
    question: 'What is JKKN Institutions and how long has it been established?',
    answer:
      'J.K.K. Nattraja Educational Institutions (JKKN) is a premier educational group established in 1969 under the J.K.K. Rangammal Trust. Founded by Kodai Vallal Shri. J.K.K. Natarajah with a vision to empower through education, JKKN has grown into a multi-disciplinary institution spanning 7 colleges and 2 schools, nurturing over 1,00,000+ Learners across 74+ years of educational excellence.',
  },
  {
    question: 'What courses are offered at JKKN Institutions?',
    answer:
      'JKKN offers 50+ programs across multiple disciplines including Dental Sciences (BDS, MDS), Pharmacy (B.Pharm, M.Pharm, Pharm.D), Engineering & Technology (B.E/B.Tech, M.E/M.Tech), Nursing (B.Sc, M.Sc, GNM), Allied Health Sciences (BPT, BMLT, B.Sc Radiology), Arts & Science (BA, B.Sc, BCA, BBA, M.A, M.Sc), and Education (B.Ed, M.Ed). Each program is designed with industry-integrated curriculum and hands-on learning experiences.',
  },
  {
    question: 'Is JKKN approved by AICTE, UGC, and other regulatory bodies?',
    answer:
      'Yes, all JKKN institutions are fully approved and recognized by respective regulatory bodies. Our colleges hold approvals from AICTE (All India Council for Technical Education), UGC (University Grants Commission), NAAC (National Assessment and Accreditation Council), NBA (National Board of Accreditation), DCI (Dental Council of India), PCI (Pharmacy Council of India), and INC (Indian Nursing Council). JKKN has achieved NAAC A+ Accreditation, reflecting our commitment to quality education.',
  },
  {
    question: 'What is the placement rate at JKKN?',
    answer:
      'JKKN maintains an impressive 95%+ placement rate across all colleges. Our dedicated placement cell has strong partnerships with 100+ industry recruiters including TCS, Infosys, Wipro, Zoho, Cognizant, HCL, Dell, and leading hospitals. Over 50,000+ alumni are successfully placed in top organizations worldwide. We offer comprehensive placement training, mock interviews, and industry internship programs.',
  },
  {
    question: 'How can I apply for admission at JKKN for 2025-26?',
    answer:
      'Admission to JKKN for the academic year 2025-26 is now open. You can apply through our online admission portal at jkkn.in/admission-form. The process includes online application, document verification, counselling (where applicable), fee payment, and admission confirmation. For direct assistance, call +91 422 266 1100 or email info@jkkn.ac.in.',
  },
  {
    question: 'Does JKKN offer hostel and transportation facilities?',
    answer:
      'Yes, JKKN provides separate hostel facilities for boys and girls with 24/7 security, Wi-Fi connectivity, hygienic mess, and recreational areas. Our fleet of 50+ buses covers 30+ routes across Erode, Namakkal, Salem, Karur, and surrounding districts. All hostels and transport are managed with Learner safety as top priority.',
  },
  {
    question: 'What scholarships are available at JKKN?',
    answer:
      'JKKN offers multiple scholarship schemes including merit scholarships for academic toppers (up to 100% tuition fee waiver), sports quota scholarships, government scholarships for SC/ST/OBC/MBC categories, economically weaker section (EWS) support, and special scholarships for single girl child and differently-abled Learners. The J.K.K. Rangammal Trust also provides need-based financial assistance.',
  },
  {
    question: 'What are the unique facilities available at JKKN campus?',
    answer:
      "JKKN's 100+ acre campus features smart Learning Studios, advanced research laboratories, digital library with 50,000+ books, 500-bed multi-specialty hospital, sports complex with indoor and outdoor facilities, auditorium (2000+ seating), food court, bank & post office, ambulance services, and complete Wi-Fi coverage. All facilities are designed to provide a holistic learning environment.",
  },
  {
    question: 'What makes JKKN different from other colleges in Tamil Nadu?',
    answer:
      'JKKN stands apart with its 74+ years of educational legacy, industry-integrated curriculum, 95% placement record, NAAC A+ accreditation, 500+ expert Learning Facilitators, affordable fee structure, and a value-based education philosophy. Our Founder\'s vision of "Excellence without Elitism" ensures quality education is accessible to all deserving Learners regardless of their economic background.',
  },
  {
    question: 'Where is JKKN located and how can I visit the campus?',
    answer:
      'JKKN Group of Institutions is located at Komarapalayam, Namakkal District, Tamil Nadu - 638183. The campus is well-connected by road and is approximately 50 km from Erode, 35 km from Salem, and 120 km from Coimbatore. Campus visits can be scheduled by contacting our admission office at +91 422 266 1100. We conduct regular open house events for prospective Learners and parents.',
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
            <span className="bg-gradient-to-r from-secondary to-yellow-500 bg-clip-text text-transparent">
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
            {faqs.map((faq, index) => (
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
                href="tel:+914222661100"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-gray-900 bg-secondary hover:bg-yellow-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Call +91 422 266 1100
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
    </section>
  )
}
