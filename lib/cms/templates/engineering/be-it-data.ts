import type { BEITCoursePageProps } from '@/components/cms-blocks/content/be-it-course-page'

/**
 * Comprehensive B.Tech Information Technology Course Data
 * JKKN College of Engineering & Technology
 *
 * This data follows JKKN brand styling with cream backgrounds
 */
export const BE_IT_SAMPLE_DATA: BEITCoursePageProps = {
  // ==========================================
  // Hero Section
  // ==========================================
  heroTitle: 'B.Tech Information Technology',
  heroSubtitle: 'Transform your passion for technology into a rewarding career. Our AICTE-approved, NAAC-accredited program combines cutting-edge curriculum with industry-ready skills to shape tomorrow\'s tech leaders.',
  heroStats: [
    { icon: 'GraduationCap', label: 'Years Duration', value: '4' },
    { icon: 'Users', label: 'Seats Available', value: '60' },
    { icon: 'TrendingUp', label: 'Placement Rate', value: '95%' },
    { icon: 'DollarSign', label: 'Highest Package', value: '₹12L' },
  ],
  heroCTAs: [
    { label: 'Apply Now for 2026-27', link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8', variant: 'primary' },
    { label: 'Explore Curriculum', link: '#curriculum', variant: 'secondary' },
  ],
  affiliatedTo: 'Affiliated to Anna University, Chennai',

  // ==========================================
  // Course Overview
  // ==========================================
  overviewTitle: 'Why Choose B.Tech IT at JKKN?',
  overviewCards: [
    {
      icon: 'GraduationCap',
      title: 'Program Duration',
      value: '4 Years (8 Semesters)',
      description: 'Full-time undergraduate program with structured curriculum spanning 8 semesters of comprehensive learning and skill development.',
    },
    {
      icon: 'BarChart3',
      title: 'Total Credits',
      value: '160 Credits',
      description: 'Balanced distribution across core subjects, electives, labs, projects, and internships following Anna University curriculum.',
    },
    {
      icon: 'CheckCircle',
      title: 'Accreditation',
      value: 'AICTE & NAAC',
      description: 'Approved by AICTE and accredited by NAAC ensuring quality education standards and global recognition.',
    },
    {
      icon: 'Building2',
      title: 'Industry Connect',
      value: '50+ Partners',
      description: 'Collaborations with leading tech companies for internships, guest lectures, workshops, and placement opportunities.',
    },
  ],

  // ==========================================
  // Why Choose IT (Program Highlights)
  // ==========================================
  whyChooseTitle: 'What Sets Our Program Apart',
  benefits: [
    {
      icon: 'Target',
      title: 'Outcome-Based Education',
      description: 'Program designed with clearly defined Learning Outcomes aligned with industry requirements and global engineering standards.',
    },
    {
      icon: 'Laptop',
      title: 'Hands-on Learning',
      description: 'Extensive practical sessions, real-world projects, hackathons, and coding challenges ensure strong programming fundamentals.',
    },
    {
      icon: 'Globe',
      title: 'Industry-Ready Curriculum',
      description: 'Latest technologies including Data Science, Full Stack Development, UI/UX Design, Cloud Computing, and IoT integrated into curriculum.',
    },
    {
      icon: 'ScrollText',
      title: 'Certification Programs',
      description: 'Free industry certifications from Microsoft, AWS, Oracle, and Google integrated with the curriculum.',
    },
    {
      icon: 'Trophy',
      title: 'Experiential Learning',
      description: 'Mandatory internships, industry visits, tech fests, and participation in national-level competitions enhance practical exposure.',
    },
    {
      icon: 'GraduationCap',
      title: 'Expert Faculty',
      description: 'Learn from highly qualified faculty with Ph.D. degrees and extensive industry experience in emerging technologies.',
    },
  ],

  // ==========================================
  // Curriculum (4 Years, 8 Semesters)
  // ==========================================
  curriculumTitle: 'Comprehensive 4-Year Curriculum',
  curriculumYears: [
    {
      year: 1,
      semesters: [
        {
          semester: 1,
          credits: 20,
          subjects: [
            { code: 'MA25C01', name: 'Applied Calculus', credits: 3 },
            { code: 'EN25C01', name: 'English Essentials – I', credits: 2 },
            { code: 'UC25H01', name: 'தமிழர் பண்பாடு / Heritage of Tamils', credits: 1 },
            { code: 'PH25C01', name: 'Applied Physics – I', credits: 3 },
            { code: 'CY25C01', name: 'Applied Chemistry - I', credits: 3 },
            { code: 'CS25C01', name: 'Computer Programming: C', credits: 3 },
            { code: 'CS25C03', name: 'Essentials of Computing', credits: 3 },
            { code: 'ME25C04', name: 'Makerspace', credits: 2 },
            { code: 'UC25A01', name: 'Life Skills for Engineers – I', credits: 0 },
            { code: 'UC25A02', name: 'Physical Education – I', credits: 0 },
          ],
        },
        {
          semester: 2,
          credits: 20,
          subjects: [
            { code: 'MA25C02', name: 'Linear Algebra', credits: 3 },
            { code: 'UC25H02', name: 'தமிழரும் தொழில்நுட்பம் / Tamils and Technology', credits: 1 },
            { code: 'EE25C01', name: 'Basic Electrical and Electronics Engineering', credits: 3 },
            { code: 'PH25C03', name: 'Applied Physics (CSIE) – II', credits: 3 },
            { code: 'IT25201', name: 'Foundations of Data Science using Python', credits: 3 },
          ],
        },
      ],
    },
    {
      year: 2,
      semesters: [
        {
          semester: 3,
          credits: 21,
          subjects: [
            { code: '', name: 'Discrete Mathematics', credits: 3 },
            { code: '', name: 'Computer Organization and Architecture', credits: 3 },
            { code: '', name: 'Data Structures', credits: 3 },
            { code: '', name: 'Object Oriented Programming', credits: 3 },
            { code: '', name: 'Web Technologies', credits: 3 },
            { code: '', name: 'Skill Development Course - I', credits: 1 },
            { code: '', name: 'English Communication Skills Laboratory – II', credits: 2 },
          ],
        },
        {
          semester: 4,
          credits: 21,
          subjects: [
            { code: '', name: 'Probability and Statistics', credits: 4 },
            { code: '', name: 'Standards in Information Technology', credits: 3 },
            { code: '', name: 'Database Management Systems', credits: 3 },
            { code: '', name: 'Java Programming', credits: 3 },
            { code: '', name: 'Operating Systems', credits: 3 },
            { code: '', name: 'Skill Development Course - II', credits: 1 },
            { code: '', name: 'English Communication Skills Laboratory – III', credits: 1 },
          ],
        },
      ],
    },
    {
      year: 3,
      semesters: [
        {
          semester: 5,
          credits: 22,
          subjects: [
            { code: '', name: 'Programme Elective- I', credits: 3 },
            { code: '', name: 'Programme Elective- II', credits: 3 },
            { code: '', name: 'Machine Learning', credits: 3 },
            { code: '', name: 'Computer Networks', credits: 3 },
            { code: '', name: 'Skill Development Course - III', credits: 2 },
            { code: '', name: 'Industry Oriented Course - I', credits: 2 },
            { code: '', name: 'Theory of Computation', credits: 3 },
            { code: '', name: 'Object Oriented Software Engineering', credits: 3 },
          ],
        },
        {
          semester: 6,
          credits: 22,
          subjects: [
            { code: '', name: 'Computer Vision', credits: 3 },
            { code: '', name: 'Programme Elective - III', credits: 3 },
            { code: '', name: 'Open Elective', credits: 3 },
            { code: '', name: 'IOT Architecture and Protocols', credits: 3 },
            { code: '', name: 'UI/UX Design and Human Centered Design', credits: 3 },
            { code: '', name: 'Industry Oriented Course – II', credits: 2 },
            { code: '', name: 'Compiler Design', credits: 3 },
            { code: '', name: 'Full Stack Development Laboratory', credits: 2 },
            { code: '', name: 'Self-Learning Course', credits: 3 },
          ],
        },
      ],
    },
    {
      year: 4,
      semesters: [
        {
          semester: 7,
          credits: 18,
          subjects: [
            { code: '', name: 'Engineering Entrepreneurship Development', credits: 2 },
            { code: '', name: 'Climate Change and Sustainability', credits: 2 },
            { code: '', name: 'Programme Elective – IV', credits: 3 },
            { code: '', name: 'Programme Elective – V', credits: 3 },
            { code: '', name: 'Ethical Hacking & Penetration Testing', credits: 3 },
            { code: '', name: 'Summer Internship', credits: 5 },
          ],
        },
        {
          semester: 8,
          credits: 16,
          subjects: [
            { code: '', name: 'Project Work / Internship cum Project Work', credits: 16 },
          ],
        },
      ],
    },
  ],

  // ==========================================
  // Career Opportunities
  // ==========================================
  careerTitle: 'Career Opportunities After B.Tech IT',
  careerPaths: [
    {
      icon: 'Laptop',
      title: 'Software Developer',
      description: 'Design, develop, and maintain software applications and systems for various industries using cutting-edge technologies.',
      avgSalary: '₹4-15 LPA',
    },
    {
      icon: 'BarChart3',
      title: 'Data Scientist',
      description: 'Analyze complex data sets to derive actionable insights and drive business decisions using advanced analytics.',
      avgSalary: '₹6-20 LPA',
    },
    {
      icon: 'Bot',
      title: 'AI/ML Engineer',
      description: 'Build intelligent systems and models that can learn, predict, and automate complex tasks.',
      avgSalary: '₹8-25 LPA',
    },
    {
      icon: 'Globe',
      title: 'Full Stack Developer',
      description: 'Develop complete web applications handling both frontend and backend components with modern frameworks.',
      avgSalary: '₹5-18 LPA',
    },
    {
      icon: 'Palette',
      title: 'UI/UX Designer',
      description: 'Create intuitive and engaging user interfaces and experiences for digital products and services.',
      avgSalary: '₹5-15 LPA',
    },
    {
      icon: 'Cloud',
      title: 'Cloud Solutions Architect',
      description: 'Design and implement scalable cloud infrastructure and solutions for enterprise applications.',
      avgSalary: '₹10-30 LPA',
    },
  ],

  // ==========================================
  // Top Recruiters
  // ==========================================
  recruitersTitle: 'Our Top Recruiting Partners',
  recruiters: [
    'LGB', 'Foxconn', 'TVS Group', 'Sourcesys', 'Infinix', 'Pronoia Insurance',
  ],

  // ==========================================
  // MOUs (Memorandum of Understanding)
  // ==========================================
  mousTitle: 'MOUs 2022-23',
  mous: [
    {
      title: 'Industry-Academia Partnership',
      partner: 'Training Trains',
      location: 'Pallipalayam (Post), Erode, Tamil Nadu - 638115',
      signedDate: '27th October, 2023',
      validUntil: '27th October, 2024',
      description: 'Memorandum of Understanding (MoU) entered into at Kumarapalayam, Namakkal Dist, Tamil Nadu, between JKKN College of Engineering and Technology at Natarajapuram, NH-544, (Salem to Coimbatore), Kumarapalayam - 638 183, Namakkal Dist, Tamil Nadu being the first party and Training Trains being the second party.',
    },
  ],

  // ==========================================
  // Admission Process
  // ==========================================
  admissionTitle: 'Begin Your Engineering Journey',
  admissionSteps: [
    {
      step: 1,
      title: 'Check Eligibility',
      description: '12th Standard (10+2) with PCM, Minimum 45% aggregate (40% for reserved categories), Valid TNEA rank or equivalent entrance exam score.',
      icon: 'UserCheck',
    },
    {
      step: 2,
      title: 'Choose Admission Mode',
      description: 'Apply through TNEA Counselling (Government Quota), Management Quota (Direct Admission), NRI/PIO Quota, or Lateral Entry for Diploma Holders.',
      icon: 'FileText',
    },
    {
      step: 3,
      title: 'Submit Documents',
      description: '10th & 12th Mark Sheets, Transfer Certificate, Community & Income Certificate, Passport Photos (8 nos), Aadhaar Card, and Address Proof.',
      icon: 'Award',
    },
    {
      step: 4,
      title: 'Complete Registration',
      description: 'Pay admission fees, complete medical examination, and attend orientation session to begin your engineering journey at JKKN.',
      icon: 'Check',
    },
  ],

  // ==========================================
  // Fee Structure
  // ==========================================
  feeTitle: 'Fee Structure 2026-27',
  feeBreakdown: [
    { component: 'Tuition Fee (Annual)', amount: '₹45,000 - ₹85,000' },
    { component: 'Development Fee', amount: '₹10,000' },
    { component: 'Lab & Library Fee', amount: '₹8,000' },
    { component: 'Exam Fee (Approx.)', amount: '₹5,000' },
    { component: 'Total (Without Hostel)', amount: '₹68,000 - ₹1,08,000', isTotal: true },
    { component: 'Hostel Fee (Optional)', amount: '₹60,000' },
  ],

  // ==========================================
  // Facilities
  // ==========================================
  facilitiesTitle: 'State-of-the-Art Learning Studios & Labs',
  facilities: [
    {
      name: 'Programming Lab',
      description: 'Equipped with 100+ high-performance workstations running the latest IDEs including Visual Studio, Eclipse, PyCharm, and VS Code for comprehensive programming practice.',
        image: '/images/courses/be-cse/labs/programming-lab.png',
      },
    {
      name: 'Data Science Lab',
      description: 'Advanced analytics lab with Python, R Studio, Tableau, and Power BI for data visualization, machine learning, and statistical analysis.',
      image: '/images/courses/btech-it/JKKN B.Tech IT - Advanced Computing Laboratory.png',
    },
    {
      name: 'Web Technologies Lab',
      description: 'Modern web development lab equipped with latest frameworks and tools including React, Node.js, Angular, and Vue.js for full-stack development.',
      image: '/images/courses/btech-it/JKKN B.Tech IT - AI & Machine Learning Research Center.png',
    },

  ],

  // ==========================================
  // Faculty
  // ==========================================
  facultyTitle: 'Expert Learning Facilitators',
  faculty: [
    {
      name: 'Mrs. R. Karthika',
      designation: 'Assistant Professor',
      qualification: 'M.Tech',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. M. Santhiya',
      designation: 'Assistant Professor',
      qualification: 'M.E',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. G. Balakumuran',
      designation: 'Assistant Professor',
      qualification: 'M.Tech',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. J. Dhivya',
      designation: 'Assistant Professor',
      qualification: 'M.E',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. S. Tamilarasan',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. P. Rakupathi',
      designation: 'Assistant Professor',
      qualification: 'M.E',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Ms. S. Manipriya',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. S. Renugadevi',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Ms. G. Manimekalai',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. M. Swathi',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
  ],

  // ==========================================
  // FAQ
  // ==========================================
  faqTitle: 'Frequently Asked Questions',
  faqs: [
    {
      question: 'What is the eligibility criteria for B.Tech IT at JKKN?',
      answer: 'Candidates must have completed 12th Standard (10+2) or equivalent examination with Physics, Chemistry, and Mathematics as core subjects. A minimum aggregate of 45% marks is required for general category candidates, while reserved category candidates need a minimum of 40%. Additionally, candidates must have a valid TNEA counselling rank for government quota seats or can apply directly for management quota admission.',
    },
    {
      question: 'What is the difference between B.Tech IT and B.E. CSE?',
      answer: 'While both programs cover core computer science concepts, B.Tech IT focuses more on information systems, data science, web technologies, UI/UX design, and business applications of technology. B.E. CSE has a broader focus on computer science fundamentals, algorithms, and system-level programming. Both programs offer excellent career opportunities.',
    },
    {
      question: 'What certifications can I get during B.Tech IT at JKKN?',
      answer: 'JKKN has partnered with leading technology companies to offer industry-recognized certifications integrated with our curriculum. Students can earn certifications in AWS Cloud Practitioner, Microsoft Azure Fundamentals, Google Analytics, Python Programming, Full Stack Development, UI/UX Design, and more. These certifications significantly enhance employability.',
    },
    {
      question: 'What are the career opportunities after B.Tech IT?',
      answer: 'Graduates have diverse career opportunities including Software Developer, Data Scientist, Full Stack Developer, UI/UX Designer, Cloud Solutions Architect, Business Analyst, IT Consultant, Database Administrator, and many more. Top recruiters include TCS, Infosys, Wipro, Cognizant, Amazon, Google, Microsoft, and leading startups.',
    },
    {
      question: 'Does JKKN provide placement support for B.Tech IT students?',
      answer: 'Yes, our dedicated Training & Placement Cell provides comprehensive support including aptitude training, soft skills development, technical skill enhancement, mock interviews, resume building, and direct placement opportunities with leading companies. We maintain a 95%+ placement rate with competitive salary packages.',
    },
    {
      question: 'What is the fee structure for B.Tech IT at JKKN?',
      answer: 'The annual tuition fee ranges from ₹45,000 (Government Quota) to ₹85,000 (Management Quota). Total annual fee including development, lab, and exam fees is approximately ₹68,000 to ₹1,08,000. Merit-based scholarships ranging from 25% to 100% fee waiver are available. Hostel facility is optional at ₹60,000 per year.',
    },
  ],

  // ==========================================
  // CTA Section
  // ==========================================
  ctaTitle: 'Ready to Shape Your Future in Information Technology?',
  ctaDescription: 'Join thousands of successful alumni who launched their tech careers from JKKN. Applications for 2026-27 batch are now open!',
  ctaButtonLabel: 'Apply Now',
  ctaButtonLink: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8',

  // ==========================================
  // Styling
  // ==========================================
  primaryColor: '#0b6d41',  // JKKN Brand Green
  accentColor: '#0f8f56',   // JKKN Green Light
}
