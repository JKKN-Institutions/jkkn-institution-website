import { v4 as uuidv4 } from 'uuid'
import type { GlobalTemplate } from '../types'

/**
 * Engineering College Homepage Template V2
 *
 * A clean, professional design with JKKN brand colors:
 * - Primary: #0b6d41 (JKKN Green) - replaces Blue #003D5B
 * - Accent: #ffde59 (JKKN Yellow) - replaces Orange #FF6B35
 *
 * Structure (11 Sections):
 * 1. Hero with Stats - EngineeringHeroSection (NEW)
 * 2. Accreditations Bar - EngineeringAccreditationsBar (NEW)
 * 3. About Section - EngineeringAboutSection (NEW)
 * 4. Programs (Tabbed) - EngineeringProgramsSection (UPDATED)
 * 5. Why Choose - EngineeringWhyChooseSection (NEW)
 * 6. Placements - EngineeringPlacementsSection (UPDATED)
 * 7. Facilities - EngineeringFacilitiesSection (NEW)
 * 8. Admission Process - EngineeringAdmissionSection (EXISTING)
 * 9. FAQ - FAQAccordion (EXISTING)
 * 10. CTA Footer - EngineeringCTASection (NEW)
 */

export const engineeringModernHomeTemplate: GlobalTemplate = {
  id: '3e4a1f8c-9d2b-4c7e-a5f3-1b8d6e9c2bf2',
  name: 'Modern Engineering Homepage',
  slug: 'global-modern-engineering-home',
  description: 'Professional engineering college homepage with JKKN green/yellow brand colors, clean sections, and modern design.',
  thumbnail_url: '/cms-previews/modern-engineering-home.png',
  category: 'landing',
  tags: ['engineering', 'education', 'modern', 'professional', 'jkkn', 'green'],
  is_system: true,
  source: 'global',
  origin_institution: 'main',
  version: '2026-01-20',
  last_updated: new Date().toISOString(),
  default_blocks: [
    // ============================================
    // 1. Hero Section with Stats
    // ============================================
    {
      id: uuidv4(),
      component_name: 'EngineeringHeroSection',
      props: {
        title: 'Shape Your Future in Engineering & Technology',
        subtitle: 'AICTE Approved | Anna University Affiliated | NAAC Accredited',
        description: 'Join one of the leading engineering colleges with 100+ years of educational excellence. World-class faculty, state-of-the-art infrastructure, and 95%+ placement record.',
        badge: 'AICTE Approved | Anna University Affiliated | NAAC Accredited',
        stats: [
          { value: 3000, suffix: '+', label: 'Learners', icon: 'graduation' },
          { value: 95, suffix: '%', label: 'Placement', icon: 'trending' },
          { value: 50, suffix: '+', label: 'Recruiters', icon: 'building' },
          { value: 12, suffix: '+', label: 'Programs', icon: 'users' },
        ],
        primaryCta: { label: 'Apply Now', link: '/admissions' },
        secondaryCta: { label: 'Explore Programs', link: '/courses' },
        heroImage: 'https://images.unsplash.com/photo-1581092921461-eab62e97a783?q=80&w=1920&auto=format&fit=crop',
        primaryColor: '#0b6d41',
        accentColor: '#ffde59',
        showAnimations: true,
      },
      sort_order: 0,
      parent_block_id: null,
      is_visible: true,
    },

    // ============================================
    // 2. Accreditations Bar
    // ============================================
    {
      id: uuidv4(),
      component_name: 'EngineeringAccreditationsBar',
      props: {
        label: 'Recognized & Approved By',
        accreditations: [
          { name: 'All India Council for Technical Education', shortName: 'AICTE', description: 'Approved', icon: 'shield' },
          { name: 'Anna University', shortName: 'Anna University', description: 'Affiliated', icon: 'graduation' },
          { name: 'National Board of Accreditation', shortName: 'NAAC', description: 'Accredited', icon: 'award' },
          { name: 'National Assessment and Accreditation Council', shortName: 'NAAC', description: 'A+ Grade', icon: 'badge' },
          { name: 'International Organization for Standardization', shortName: 'ISO 9001:2015', description: 'Certified', icon: 'building' },
        ],
        primaryColor: '#0b6d41',
        backgroundColor: '#f8f9fa',
        showAnimations: true,
        paddingY: 'md',
      },
      sort_order: 1,
      parent_block_id: null,
      is_visible: true,
    },

    // ============================================
    // 3. About Section
    // ============================================
    {
      id: uuidv4(),
      component_name: 'EngineeringAboutSection',
      props: {
        badge: { text: '100 Years Legacy', position: 'top-left' },
        title: 'Welcome to JKKN College of Engineering',
        subtitle: 'About Us',
        description: 'Established as part of the prestigious JKKN Educational Institutions with over 100 years of legacy, JKKN College of Engineering is committed to producing industry-ready engineers through quality education, practical training, and holistic development. Our state-of-the-art infrastructure and experienced faculty ensure students receive world-class technical education.',
        features: [
          'AICTE Approved & Anna University Affiliated',
          'NAAC Accredited Programs',
          'Industry-Academia Partnerships',
          'State-of-the-Art Laboratories',
          '95%+ Placement Record',
          'Experienced Faculty Members',
        ],
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop',
        imageAlt: 'JKKN Engineering College Campus',
        cta: { label: 'Learn More About Us', link: '/about' },
        primaryColor: '#0b6d41',
        accentColor: '#ffde59',
        backgroundColor: '#ffffff',
        showAnimations: true,
        paddingY: 'lg',
        imagePosition: 'left',
      },
      sort_order: 2,
      parent_block_id: null,
      is_visible: true,
    },

    // ============================================
    // 4. Programs Section (Tabbed)
    // ============================================
    {
      id: uuidv4(),
      component_name: 'EngineeringProgramsSection',
      props: {
        title: 'Comprehensive Engineering & Technology Programs',
        subtitle: 'Choose from our wide range of AICTE approved programs designed for industry readiness',
        programs: [
          { name: 'B.Tech AI & Machine Learning', type: 'ug', duration: '4 Years', seats: 60, icon: 'cpu', description: 'Deep Learning, Neural Networks, Data Science', link: '/courses/aiml', tags: ['New', 'Trending'] },
          { name: 'B.E. Electronics & Communication', type: 'ug', duration: '4 Years', seats: 60, icon: 'cpu', description: 'Embedded Systems, IoT, VLSI Design', link: '/courses/ece' },
          { name: 'B.E. Mechanical Engineering', type: 'ug', duration: '4 Years', seats: 120, icon: 'settings', description: 'Robotics, CAD/CAM, Automation', link: '/courses/mech' },
          { name: 'B.E. Civil Engineering', type: 'ug', duration: '4 Years', seats: 60, icon: 'settings', description: 'Structural Design, Construction Management', link: '/courses/civil' },
          { name: 'B.E. Electrical & Electronics', type: 'ug', duration: '4 Years', seats: 60, icon: 'zap', description: 'Power Systems, Renewable Energy', link: '/courses/eee' },
          { name: 'B.Tech Information Technology', type: 'ug', duration: '4 Years', seats: 60, icon: 'wifi', description: 'Cloud Computing, Cybersecurity, DevOps', link: '/courses/it' },
          { name: 'MBA - Business Administration', type: 'pg', duration: '2 Years', seats: 120, icon: 'briefcase', description: 'Business Analytics, Marketing, Finance', link: '/courses/mba' },
          { name: 'MCA - Computer Applications', type: 'pg', duration: '2 Years', seats: 60, icon: 'graduation', description: 'Software Development, IT Management', link: '/courses/mca' },
        ],
        showTabs: true,
        primaryColor: '#0b6d41',
        accentColor: '#ffde59',
        backgroundColor: '#ffffff',
        showAnimations: true,
        paddingY: 'lg',
      },
      sort_order: 3,
      parent_block_id: null,
      is_visible: true,
    },

    // ============================================
    // 5. Why Choose JKKN Section
    // ============================================
    {
      id: uuidv4(),
      component_name: 'EngineeringWhyChooseSection',
      props: {
        title: 'Why Choose JKKN Engineering College?',
        subtitle: 'Your Gateway to a Successful Engineering Career',
        features: [
          {
            title: '100 Years Legacy',
            description: 'Part of JKKN Educational Institutions with a century of excellence in education',
            icon: 'award',
          },
          {
            title: 'Industry Connect',
            description: 'Strong partnerships with leading IT and core industry companies',
            icon: 'building',
          },
          {
            title: 'Expert Learning Facilitators',
            description: 'Highly qualified faculty with industry experience and research background',
            icon: 'graduation',
          },
          {
            title: 'Modern Labs & Infrastructure',
            description: 'State-of-the-art laboratories equipped with latest technology',
            icon: 'flask',
          },
          {
            title: '95%+ Placements',
            description: 'Consistently high placement rate with top recruiters visiting campus',
            icon: 'trending',
          },
          {
            title: 'Innovation Hub',
            description: 'Dedicated centers for AI, ML, IoT, and emerging technologies',
            icon: 'lightbulb',
          },
          {
            title: 'Global Exposure',
            description: 'International collaborations and student exchange programs',
            icon: 'globe',
          },
          {
            title: 'Excellent Hostel Facilities',
            description: 'Separate hostels for boys and girls with modern amenities',
            icon: 'home',
          },
        ],
        primaryColor: '#0b6d41',
        accentColor: '#ffde59',
        backgroundColor: '#fbfbee',
        showAnimations: true,
        paddingY: 'lg',
        columns: '4',
      },
      sort_order: 4,
      parent_block_id: null,
      is_visible: true,
    },

    // ============================================
    // 6. Placements Section
    // ============================================
    {
      id: uuidv4(),
      component_name: 'EngineeringPlacementsSection',
      props: {
        title: 'Launching Careers, Building Futures',
        subtitle: 'Our dedicated placement cell connects talented students with leading companies worldwide',
        stats: [
          { value: 95, suffix: '%+', prefix: '', label: 'Placement Rate', icon: 'trending' },
          { value: 12, suffix: ' LPA', prefix: '', label: 'Highest Package', icon: 'award' },
          { value: 4.5, suffix: ' LPA', prefix: '', label: 'Average Package', icon: 'users' },
          { value: 50, suffix: '+', prefix: '', label: 'Recruiters', icon: 'building' },
        ],
        companies: [
          { name: 'TCS', logo: 'https://logo.clearbit.com/tcs.com', category: 'it' },
          { name: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com', category: 'it' },
          { name: 'Wipro', logo: 'https://logo.clearbit.com/wipro.com', category: 'it' },
          { name: 'Cognizant', logo: 'https://logo.clearbit.com/cognizant.com', category: 'it' },
          { name: 'HCL', logo: 'https://logo.clearbit.com/hcltech.com', category: 'it' },
          { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', category: 'it' },
          { name: 'Zoho', logo: 'https://logo.clearbit.com/zoho.com', category: 'it' },
          { name: 'L&T', logo: 'https://logo.clearbit.com/larsentoubro.com', category: 'core' },
          { name: 'Capgemini', logo: 'https://logo.clearbit.com/capgemini.com', category: 'it' },
          { name: 'Tech Mahindra', logo: 'https://logo.clearbit.com/techmahindra.com', category: 'it' },
          { name: 'IBM', logo: 'https://logo.clearbit.com/ibm.com', category: 'it' },
          { name: 'Accenture', logo: 'https://logo.clearbit.com/accenture.com', category: 'service' },
        ],
        showCategoryTabs: false,
        marqueeSpeed: 15,
        showGrayscale: true,
        enableDrag: true,
        pauseOnHover: true,
        dragSensitivity: 1,
        speedPreset: 'medium',
        primaryColor: '#0b6d41',
        accentColor: '#ffde59',
        backgroundColor: '#f9fafb',
        showAnimations: true,
        paddingY: 'lg',
      },
      sort_order: 5,
      parent_block_id: null,
      is_visible: true,
    },

    // ============================================
    // 7. Facilities Section
    // ============================================
    {
      id: uuidv4(),
      component_name: 'EngineeringFacilitiesSection',
      props: {
        title: 'World-Class Infrastructure & Facilities',
        subtitle: 'Everything you need for an exceptional learning experience',
        facilities: [
          {
            title: 'Computer Centers',
            description: 'Modern computer labs with high-performance systems',
            highlight: '500+ Systems',
            icon: 'monitor',
          },
          {
            title: 'Engineering Workshops',
            description: 'Hands-on training facilities for practical learning',
            icon: 'wrench',
          },
          {
            title: 'Research Labs',
            description: 'Specialized labs for advanced research',
            highlight: 'AI/ML, IoT, Robotics',
            icon: 'flask',
          },
          {
            title: 'Digital Library',
            description: 'Extensive collection of books and digital resources',
            highlight: '50,000+ Books',
            icon: 'book',
          },
          {
            title: 'Wi-Fi Campus',
            description: 'High-speed internet connectivity across the campus',
            icon: 'wifi',
          },
          {
            title: 'Hostels',
            description: 'Comfortable accommodation with all amenities',
            highlight: 'Men & Women',
            icon: 'home',
          },
          {
            title: 'Cafeteria',
            description: 'Hygienic food court with variety of cuisines',
            icon: 'utensils',
          },
          {
            title: 'Sports Complex',
            description: 'Indoor and outdoor sports facilities',
            icon: 'trophy',
          },
          {
            title: 'Transportation',
            description: 'Fleet of buses covering major routes',
            icon: 'bus',
          },
        ],
        cta: { label: 'Explore All Facilities', link: '/facilities' },
        primaryColor: '#0b6d41',
        accentColor: '#ffde59',
        backgroundColor: '#ffffff',
        showAnimations: true,
        paddingY: 'lg',
        columns: '3',
      },
      sort_order: 6,
      parent_block_id: null,
      is_visible: true,
    },

    // ============================================
    // 8. Admission Section
    // ============================================
    {
      id: uuidv4(),
      component_name: 'EngineeringAdmissionSection',
      props: {
        title: 'Begin Your Engineering Journey at JKKN',
        subtitle: 'Simple admission process with transparent eligibility criteria',
        eligibility: [
          {
            program: 'B.E. / B.Tech Programs',
            criteria: [
              'Passed 10+2 with Physics, Chemistry, and Mathematics',
              'Minimum 45% aggregate marks (40% for reserved categories)',
              'Valid TNEA counselling rank or direct admission',
              'Age limit: Should have completed 17 years as on July 1st',
            ],
          },
          {
            program: 'MBA / MCA Programs',
            criteria: [
              "Bachelor's degree in any discipline with 50% marks",
              'Valid TANCET / CAT / MAT / XAT score',
              'Group discussion and personal interview clearance',
            ],
          },
        ],
        processSteps: [
          { step: 1, title: 'Online Application', description: 'Fill out the online application form with your details', icon: 'file' },
          { step: 2, title: 'Document Submission', description: 'Upload required academic documents and certificates', icon: 'clipboard' },
          { step: 3, title: 'Counselling', description: 'Attend TNEA counselling or apply for direct admission', icon: 'user' },
          { step: 4, title: 'Fee Payment', description: 'Complete fee payment online or at the campus office', icon: 'graduation' },
          { step: 5, title: 'Enrollment', description: 'Complete registration and begin your journey', icon: 'badge' },
        ],
        ctaButton: { label: 'Apply Now', link: '/admissions/apply' },
        secondaryCtaButton: { label: 'Download Brochure', link: '/brochure' },
        primaryColor: '#0b6d41',
        accentColor: '#ffde59',
        backgroundColor: '#fbfbee',
        showAnimations: true,
        paddingY: 'lg',
      },
      sort_order: 7,
      parent_block_id: null,
      is_visible: true,
    },

    // ============================================
    // 9. FAQ Section
    // ============================================
    {
      id: uuidv4(),
      component_name: 'FAQAccordion',
      props: {
        searchEnabled: false,
        allowMultiple: false,
        faqs: [
          {
            question: 'What engineering courses are offered at JKKN Engineering College?',
            answer: 'We offer B.E. programs in Computer Science & Engineering, Electronics & Communication, Electrical & Electronics, Mechanical Engineering, and Civil Engineering. We also offer B.Tech programs in AI & Machine Learning and Information Technology, along with postgraduate programs MBA and MCA.',
          },
          {
            question: 'Is JKKN Engineering College AICTE approved?',
            answer: 'Yes, JKKN College of Engineering & Technology is approved by AICTE (All India Council for Technical Education), affiliated with Anna University, and has NAAC accreditation for multiple programs. We are also NAAC accredited with A+ grade and ISO 9001:2015 certified.',
          },
          {
            question: 'What is the admission process for B.E./B.Tech programs?',
            answer: 'Admission to B.E./B.Tech programs is through TNEA counselling or direct admission. Eligibility requires passing 10+2 with Physics, Chemistry, and Mathematics with minimum 45% aggregate marks. Fill out the online application, submit documents, attend counselling, pay fees, and complete enrollment.',
          },
          {
            question: 'What is the placement record at JKKN Engineering College?',
            answer: 'We maintain an excellent placement record with 95%+ placement rate. The highest package offered is 12 LPA with an average package of 4.5 LPA. Over 50 companies recruit from our campus including TCS, Infosys, Wipro, Cognizant, IBM, Amazon, Zoho, and more.',
          },
          {
            question: 'What facilities are available for students?',
            answer: 'We provide state-of-the-art facilities including 500+ computer systems in modern labs, engineering workshops, research labs for AI/ML/IoT/Robotics, digital library with 50,000+ books, Wi-Fi campus, separate hostels for boys and girls, cafeteria, sports complex, and transportation services.',
          },
          {
            question: 'Does JKKN offer AI and Machine Learning courses?',
            answer: 'Yes, we offer a dedicated B.Tech program in Artificial Intelligence & Machine Learning with 60 seats. The program covers Deep Learning, Neural Networks, Data Science, and cutting-edge AI technologies with hands-on projects and industry internships.',
          },
          {
            question: 'What is the fee structure for engineering programs?',
            answer: 'The fee structure varies by program and category. Please visit our admissions page or contact the admission office for detailed fee information. We also offer scholarships for meritorious students and fee concessions for economically weaker sections.',
          },
          {
            question: 'Is hostel accommodation available?',
            answer: 'Yes, we provide separate hostel facilities for boys and girls within the campus. Hostels are equipped with furnished rooms, 24/7 security, WiFi connectivity, recreational areas, mess facilities with hygienic food, and medical support.',
          },
        ],
      },
      sort_order: 8,
      parent_block_id: null,
      is_visible: true,
    },

    // ============================================
    // 10. CTA Footer Section
    // ============================================
    {
      id: uuidv4(),
      component_name: 'EngineeringCTASection',
      props: {
        title: 'Ready to Engineer Your Future?',
        subtitle: 'Join JKKN College of Engineering and take the first step towards a successful career in technology',
        primaryCta: { label: 'Apply Now', link: '/admissions' },
        phoneNumber: '+91 98765 43210',
        showPhone: true,
        showEmail: false,
        primaryColor: '#0b6d41',
        accentColor: '#ffde59',
        showAnimations: true,
        paddingY: 'lg',
      },
      sort_order: 9,
      parent_block_id: null,
      is_visible: true,
    },
  ],
}

export default engineeringModernHomeTemplate
