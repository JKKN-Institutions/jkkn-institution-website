import type { InstitutionDistinctivenessPageProps } from '@/components/cms-blocks/content/institution-distinctiveness-page'

/**
 * Institution Distinctiveness Data for Engineering College
 *
 * Comprehensive documentation of JKKN College of Engineering's unique features,
 * innovative approaches, and distinctive qualities that set it apart.
 *
 * Source: NAAC documentation and institutional distinctive practices
 */

export const ENGINEERING_INSTITUTION_DISTINCTIVENESS_DATA: Partial<InstitutionDistinctivenessPageProps> = {
  heroTitle: 'Institution Distinctiveness',
  heroSubtitle: 'JKKN College of Engineering',

  showIntroduction: true,
  introductionHeading: 'Institution Distinctiveness',
  introductionContent: `This College is devoted towards introducing a Holistic Approach to education with socialized and contributing inventiveness. The institution upholds the quality education, promoting progressive thinking by embracing innovative pedagogies and technological advancements and utilizing research to promote innovation in all areas. The institute keeps up with the pace of creating an intellectual and stimulating learning atmosphere for learners from various backgrounds and helping them become globally competitive engineers and socially responsible individuals.`,

  showHighlightBox: true,
  highlightTitle: 'J.K.K.N.',
  highlightSubtitle: 'Dr. Gopura Sundara Pandian Educational Trust',
  highlightContent: `With more than 100 years of educational legacy including seven institutions namely Arts & Science, Pharmacy, Engineering, Dental, Nursing, College of Education and Polytechnic serving more than 10,000+ students per annum, with around 500+ faculty on roll. The J.K.K.N. group has been listed in Top 10 Institution in India and conferred with A++ Grade by NAAC and located in the 300-acre lush green campus with state-of-the-art infrastructure. It is the sole institution in India with eight Constituent colleges recognized by their respective statutory bodies and recognized by Bharathiar University for imparting the knowledge of Quality Higher Education to the students. It empowers all community groups by facilitating employability, entrepreneurship and service orientation.`,

  sections: [
    {
      id: 'efficiency-programmes',
      title: 'Efficiency of the Programmes',
      icon: 'GraduationCap',
      content: `In addition to the main curriculum, the college also offers numerous courses on Communication Skills and Soft Skills, aimed at the development of emotional intelligence, interpersonal aptitude and boosting self-confidence. The focus is on preparing students for the current labour market, where communication, teamwork and emotional intelligence matter more than academic knowledge. The intention is to provide students with well-rounded education, ultimately making them more job-ready and successful in their careers.

Our approach is to prepare our students not just for job hunting but for future endeavours by collaborating with innovative institutions to enhance the teaching and learning outcomes. Additionally, we train our students based on their career aspirations. To accomplish this, the Student Progression team tracks the improvement and evaluates every milestone and helps the students and industry needs. Moreover, the college collaborates to identify trends of future, thus enabling our students to be at the forefront in their fields.

To encourage our students and make them ready for the uncertainties in today's job market, we conduct career counselling workshops. Through workshops, students are explained regarding various career paths, advised on resume development, interview skills, networking strategies, and financial planning.`,
    },
    {
      id: 'harmonizing-learning',
      title: 'Harmonizing Curricular with Extracurricular Learning Experiences',
      icon: 'BookOpen',
      content: `Extracurricular activities not only enhance the job market employability but also establish the essential elements of teamwork, time and stress management and instils civic responsibility. The institution encourages 40 students' associations with 100 clubs that include departmental clubs, innovation clubs, IEEE student chapters, CSI Student Branch, YRC, NSS units, Student Council, Sports clubs, cultural clubs, hobby clubs, and event management. Further, the college and the IQAC organize various forums to promote professional development like research scholars meet, faculty development meet, guest lectures, value-added courses and webinars. All these events provide a platform for researchers and the teaching community to address current research challenges, share knowledge through research presentations and brainstorm futuristic ideas.

The NSS unit, an integral part of our institution is conducting various social outreach programs including health camps, swachatha programs, awareness campaigns. Through NSS, students are developing a sense of social responsibility, environmental responsibility, empathy for community needs and preparing them to face the future societal challenges.`,
    },
    {
      id: 'career-advancement',
      title: 'Assisting with Career Advancement Pathway',
      icon: 'TrendingUp',
      content: `This institution assists the students' advancement from their first semester, helping them to understand their career path, helping them to discover their potential, encouraging them to learn and make a significant contribution to the college, industry, and societal needs. The college arranges for industrial visits, internships, training and seminars to help students understand the working of industries, recent developments in respective fields, industry expectations and networking skills. These activities assist students to get exposed to diverse industrial environments, establish a network of professionals, understand the career opportunities, and finally, to decide the suitable career path.`,
    },
    {
      id: 'entrepreneur-ambitions',
      title: 'Enriching Entrepreneur Ambitions through IIC',
      icon: 'Lightbulb',
      content: `The Institution's Innovation Council (IIC), established by the Ministry of Education, Government of India, promotes an entrepreneurial and innovation ecosystem to nurture startup ideas. The IIC supports startup founders' activities and allows students to develop the entrepreneurial mindset by actively engaging them in innovation-related events including workshops, competitions, industry visits, hackathons and other innovation challenges to provide the needed environment for the students to succeed in their entrepreneurial ventures.`,
    },
    {
      id: 'civic-responsibility',
      title: 'Strengthening Civic Responsibility',
      icon: 'Users',
      content: `The college is focused on developing socially responsible and eco-friendly engineers who are ethically equipped to deal with civic issues. Environmental-related courses such as Environmental Science, Renewable Energy, Sustainable Development and Professional Ethics are integrated into the curriculum. Students participate in tree planting programs, water conservation activities, and waste management to raise awareness about the environmental issues, and develop an appreciation of the ecological wealth that exists within them. Such endeavours educate students on the importance of conservation and inspire them to make a definite commitment to the sustainability of the environment and instil in them a lifelong sustainability behaviour.`,
    },
    {
      id: 'social-responsibility',
      title: 'Empowering Social Responsibility',
      icon: 'Heart',
      content: `The institution promotes social responsibility through courses on empathetic behaviour, respect for diversity, and social equality. Our institution believes in creating an environment where everyone is treated with dignity and equality irrespective of differences in social structure. Students are well acquainted with the social etiquettes, the values to respect people of all diversities and different social and cultural backgrounds in order to create social harmony.

The college is proactive in promoting equity and social justice through the quality of education that students receive, the policies adopted, and the support services that it offers to all students including first-generation learners, economically weak students, or students with learning difficulties. Further, the institution promotes philanthropic spirit and service orientation by motivating students to volunteer and serve various welfare organizations. Such volunteering helps students gain leadership skills, empathy, and social responsibility which make them become skilled social activists, capable of addressing societal problems and affecting change in the community.`,
    },
  ],

  showFooter: true,
  institutionName: 'JKKN College of Engineering and Technology',
  address: 'Kumarapalayam, Namakkal District, Tamil Nadu - 638183',
  phone: '+91 94437 37373',
  email: 'principal@jkkn.ac.in',
  website: 'https://engg.jkkn.ac.in',

  backgroundColor: '#fbfbee',
  primaryColor: '#0b6d41',
  accentColor: '#ffde59',
  textColor: '#333333',
}
