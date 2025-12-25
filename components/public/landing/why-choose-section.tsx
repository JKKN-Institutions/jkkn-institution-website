'use client'

import WhyChooseJKKN from '@/components/cms-blocks/content/why-choose-jkkn'

/**
 * Why Choose JKKN Section
 *
 * Showcases the institution's unique selling points (USPs) and competitive advantages
 * using glassmorphism effects and staggered animations.
 *
 * Features:
 * - 6 main USP cards highlighting key institutional strengths
 * - 8 additional benefits in checklist format
 * - Responsive 3-column grid layout (1 col mobile, 2 col tablet, 3 col desktop)
 * - Glassmorphism styling with brand colors
 * - Staggered entrance animations
 */

// Main USP Cards - 6 Key Differentiators
const uspCards = [
  {
    icon: '🏛️',
    title: '74+ Years of Educational Legacy',
    description: 'Founded in 1951 by visionary Kodai Vallal Shri. J.K.K. Natarajah, JKKN has nurtured over 1,00,000+ Learners who are now leaders in healthcare, technology, business, and education across the globe. Our seven decades of experience means time-tested teaching methodologies, strong alumni networks, and institutional stability you can trust.',
    order: 1,
  },
  {
    icon: '💼',
    title: '95% Placement Success Rate',
    description: 'Our dedicated placement cell partners with 100+ leading recruiters including TCS, Infosys, Wipro, Zoho, Cognizant, and top healthcare organizations. With comprehensive soft skills training, mock interviews, industry internships, and on-campus recruitment drives, 95% of our eligible Learners secure placements before graduation.',
    order: 2,
  },
  {
    icon: '🏆',
    title: 'NAAC A+ Accredited Quality',
    description: 'JKKN\'s A+ accreditation from the National Assessment and Accreditation Council validates our world-class infrastructure, qualified Learning Facilitators, innovative curriculum, and Learner-centric governance. This recognition ensures your education meets national benchmarks of excellence.',
    order: 3,
  },
  {
    icon: '👨‍🏫',
    title: '500+ Expert Learning Facilitators',
    description: 'Our Learning Facilitators are industry experts, researchers, and published academicians with an average experience of 15+ years. Many hold Ph.D. qualifications and bring real-world insights into Learning Studios. The favorable 1:15 Learning Facilitator-to-Learner ratio ensures personalized attention.',
    order: 4,
  },
  {
    icon: '🏫',
    title: 'State-of-the-Art Infrastructure',
    description: 'Spread across 100+ acres, JKKN campus features smart Learning Studios, advanced research labs, 500-bed multi-specialty hospital, digital library, sports complex, separate hostels, Wi-Fi campus, auditorium, food court, and all amenities for a complete campus experience.',
    order: 5,
  },
  {
    icon: '💰',
    title: 'Affordable & Accessible Education',
    description: 'Following our Founder\'s philosophy of "Excellence without Elitism," JKKN offers quality education at competitive fee structures. Multiple scholarship schemes, government benefits, and flexible payment options ensure deserving Learners are never denied education due to financial constraints.',
    order: 6,
  },
]

// Additional USPs - Compact List (8 items)
const additionalUsps = [
  '50+ Industry-Relevant Programs across Medical, Engineering, Arts & Science',
  'Multi-Specialty Hospital for clinical training and community healthcare',
  'Industry-Integrated Curriculum with internships and live projects',
  'Research & Innovation Hub with funded projects and patent support',
  'Holistic Development through sports, cultural, and social activities',
  'Safe & Secure Campus with 24/7 security and CCTV surveillance',
  'Strong Alumni Network of 50,000+ professionals worldwide',
  'Entrepreneurship Support through incubation centers and startup mentoring',
]

/**
 * WhyChooseSection Component
 *
 * Renders the "Why Choose JKKN" section with glassmorphism effects
 * using the CMS WhyChooseJKKN component.
 */
export function WhyChooseSection() {
  return (
    <WhyChooseJKKN
      sectionTitle="Why Choose JKKN? 74+ Years of Transforming Lives Through Progressive Education"
      sectionTagline="Where Legacy Meets Innovation | Excellence Without Elitism"
      uspCards={uspCards}
      additionalUsps={additionalUsps}
      layout="grid"
      cardsPerRow={3}
      glassmorphismVariant="brand"
      animationPreset="stagger"
      showAdditionalList={true}
    />
  )
}
