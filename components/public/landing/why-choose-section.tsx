'use client'

import WhyChooseJKKN from '@/components/cms-blocks/content/why-choose-jkkn'

/**
 * Why Choose JKKN Section
 *
 * Showcases the institution's 6 key USPs with:
 * - Title, Subtitle, Tagline
 * - 6 USP cards (icon + title + optional stat)
 * - Additional USPs as compact checklist
 */

export function WhyChooseSection() {
  return (
    <WhyChooseJKKN
      title="Why Choose JKKN?"
      subtitle="73+ Years of Transforming Lives Through Progressive Education"
      tagline="Where Legacy Meets Innovation | Excellence Without Elitism"
      uspCards={[
        { icon: 'heritage', title: '73+ Years of Educational Legacy' },
        { icon: 'career', title: '92%+ Placement Success Rate' },
        { icon: 'excellence', title: 'NAAC A Accredited Quality' },
        { icon: 'expertise', title: '400+ Expert Learning Facilitators' },
        { icon: 'facilities', title: 'State-of-the-Art Infrastructure' },
        { icon: 'value', title: 'Affordable & Accessible Education' },
      ]}
      additionalUsps={[
        '50+ Industry-Relevant Programs across Medical, Engineering, Arts & Science',
        'Multi-Specialty Hospital for clinical training and community healthcare',
        'Industry-Integrated Curriculum with internships and live projects',
        'Research & Innovation Hub with funded projects and patent support',
        'Holistic Development through sports, cultural, and social activities',
        'Safe & Secure Campus with 24/7 security and CCTV surveillance',
        'Strong Alumni Network of 50,000+ professionals worldwide',
        'Entrepreneurship Support through incubation centers and startup mentoring',
      ]}
    />
  )
}
