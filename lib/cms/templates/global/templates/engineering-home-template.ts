import { v4 as uuidv4 } from 'uuid'
import type { GlobalTemplate } from '../types'
import { getCurrentVersion } from '../types'

const templateId = '3e4a1f8c-9d2b-4c7e-a5f3-1b8d6e9c2a4f' // Static UUID for Engineering Home Page template
const timestamp = new Date().toISOString()
const version = getCurrentVersion()

// Block IDs (static for consistency during dev, but should typically be unique)
const heroId = uuidv4()
const educationStoriesId = uuidv4()
const aboutId = uuidv4()
const newsId = uuidv4()
const blogId = uuidv4()
const valueOfDegreeId = uuidv4()
const educationVideosId = uuidv4()
const partnersId = uuidv4()
const recruitersId = uuidv4()
const lifeId = uuidv4()

const engineeringHomeTemplate: GlobalTemplate = {
  id: templateId,
  name: 'Engineering Home Page',
  slug: 'global-engineering-home',
  description: 'Premium engineering college home page with Hero, Stories, About, News, Blog, Value, Videos, Partners, Recruiters, and Life sections.',
  thumbnail_url: null,
  category: 'landing',
  is_system: false,
  version: version,
  source: 'global',
  origin_institution: 'main',
  last_updated: timestamp,
  author: {
    name: 'Antigravity AI',
  },
  tags: ['engineering', 'home', 'professional', 'premium'],
  default_blocks: [
    {
      id: heroId,
      component_name: 'HeroSection',
      props: {
        title: 'ENGINEERING THE FUTURE',
        subtitle: 'Empowering Innovators and Problem Solvers Since 2001. Join the top-ranked engineering institution with 95% placement record and global industry partnerships.',
        alignment: 'center',
        backgroundType: 'image',
        backgroundImage: 'https://images.unsplash.com/photo-1581092921461-eab62e97a783?q=80&w=1920&auto=format&fit=crop',
        backgroundImageAlt: 'JKKN Engineering Hero',
        overlay: true,
        overlayOpacity: 0.6,
        ctaButtons: [
          { label: 'Apply for 2025-26', link: '/admissions', variant: 'primary' },
          { label: 'Explore Programs', link: '/programs', variant: 'outline' }
        ],
        showTrustBadges: true,
        trustBadge1Text: 'NAAC A+ Accredited',
        trustBadge2Text: '95%+ Placements',
        trustBadge3Text: '100+ Recuriters',
        trustBadge4Text: '23+ Years Legacy',
        titleFontSize: '6xl',
        titleFontWeight: 'extrabold',
        subtitleFontSize: 24,
        showAiBadge: true
      },
      sort_order: 0,
      parent_block_id: null,
      is_visible: true
    },
    {
      id: educationStoriesId,
      component_name: 'EducationStories',
      props: {
        headerPart1: 'Education',
        headerPart2: 'Stories',
        headerPart1Color: '#ffffff',
        headerPart2Color: '#D4AF37',
        subtitle: 'Inspiring journeys of our students and alumni who are making a difference in the world of technology.',
        stories: [
          {
            title: 'From Campus to Silicon Valley',
            studentName: 'Rahul Kumar',
            batch: 'Class of 2018',
            image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
            content: 'My time at JKKN Engineering provided the foundation for my career at Google. The hands-on projects and faculty mentorship were invaluable.',
            link: '/stories/rahul-kumar'
          },
          {
            title: 'Innovating for Social Impact',
            studentName: 'Priya Sharma',
            batch: 'Class of 2021',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
            content: 'The Innovation Hub at JKKN allowed me to develop a low-cost water purification system that is now used in over 10 villages.',
            link: '/stories/priya-sharma'
          }
        ],
        backgroundColor: '#052e16' // Dark Forest Green
      },
      sort_order: 1,
      parent_block_id: null,
      is_visible: true
    },
    {
      id: aboutId,
      component_name: 'AboutSection',
      props: {
        layoutMode: 'two-column',
        badge: 'Est. 2001',
        headerPart1: 'About',
        headerPart2: 'JKKN Engineering',
        headerPart1Color: '#ffffff',
        headerPart2Color: '#D4AF37',
        sectionTitle: 'A Legacy of Excellence in Engineering',
        paragraph1: 'JKKN College of Engineering and Technology is a premier institution dedicated to providing world-class technical education. We foster an environment of innovation, research, and holistic development.',
        paragraph2: 'With over two decades of experience, state-of-the-art laboratories, and a commitment to AI-empowered education, we prepare our students to lead in the digital era.',
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop',
        imageAlt: 'JKKN Engineering Campus',
        imageBadge: '23+ Years',
        variant: 'modern-dark',
        backgroundColor: '#022c22', // Deeper Dark Green
        showStats: true,
        stats: [
          { value: '50+', label: 'Modern Labs' },
          { value: '150+', label: 'Faculty' }
        ]
      },
      sort_order: 2,
      parent_block_id: null,
      is_visible: true
    },
    {
      id: newsId,
      component_name: 'CollegeNews',
      props: {
        headerPart1: 'College',
        headerPart2: 'News',
        headerPart1Color: '#ffffff',
        headerPart2Color: '#D4AF37',
        subtitle: 'Stay updated with the latest achievements, events, and announcements from our engineering departments.',
        layout: 'carousel',
        columns: '3',
        newsItems: [
          {
            title: 'JKKN Students Win National Robotics Hackathon',
            date: 'May 15, 2024',
            image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?q=80&w=800&auto=format&fit=crop',
            link: '/news/robotics-win'
          },
          {
            title: 'New AI & Data Science Lab Inaugurated',
            date: 'April 20, 2024',
            image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=800&auto=format&fit=crop',
            link: '/news/ai-lab-opening'
          },
          {
            title: 'International Conference on Sustainable Engineering',
            date: 'March 10, 2024',
            image: 'https://images.unsplash.com/photo-1505373633959-236e6c0770d1?q=80&w=800&auto=format&fit=crop',
            link: '/news/conference-2024'
          }
        ],
        backgroundColor: '#052e16',
        variant: 'modern-dark'
      },
      sort_order: 3,
      parent_block_id: null,
      is_visible: true
    },
    {
      id: blogId,
      component_name: 'BlogPostsGrid',
      props: {
        title: 'Student Blog',
        titleColor: '#ffffff',
        subtitle: 'Insights, experiences, and technical articles written by our talented engineering students.',
        subtitleColor: '#d1d5db',
        layout: 'grid',
        columns: 3,
        maxItems: 6,
        posts: [
          {
            title: 'My Internship Experience at Amazon',
            author: 'Ananya S.',
            date: 'May 1, 2024',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
            link: '/blog/internship-amazon'
          },
          {
            title: 'The Future of Quantum Computing',
            author: 'Kevin M.',
            date: 'April 15, 2024',
            image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&auto=format&fit=crop',
            link: '/blog/quantum-computing'
          },
          {
            title: 'Campus Life: A Day in the Life of an Engineer',
            author: 'Siddharth R.',
            date: 'March 25, 2024',
            image: 'https://images.unsplash.com/photo-1523580494863-6f303122469a?q=80&w=600&auto=format&fit=crop',
            link: '/blog/campus-life'
          }
        ],
        backgroundColor: '#022c22'
      },
      sort_order: 4,
      parent_block_id: null,
      is_visible: true
    },
    {
      id: valueOfDegreeId,
      component_name: 'BentoGrid',
      props: {
        title: 'Value of Your Degree',
        subtitle: 'Why a JKKN Engineering degree is a powerful catalyst for your career.',
        columns: 3,
        items: [
          {
            title: 'Global Recognition',
            description: 'Accredited by NAAC with A+ grade, recognized internationally.',
            icon: 'Globe',
            size: '1x1',
            variant: 'gradient'
          },
          {
            title: 'Industry Ready',
            description: 'Curriculum designed with industry experts to ensure you are job-ready.',
            icon: 'Briefcase',
            size: '2x1',
            variant: 'default'
          },
          {
            title: 'Expert Faculty',
            description: 'Learn from PhD holders and researchers with deep domain expertise.',
            icon: 'GraduationCap',
            size: '1x1',
            variant: 'glass'
          },
          {
            title: 'Success Rate',
            description: '95% placement rate with top MNCs worldwide.',
            icon: 'TrendingUp',
            size: '1x1',
            variant: 'gradient'
          }
        ],
        backgroundColor: '#052e16',
        variant: 'glass'
      },
      sort_order: 5,
      parent_block_id: null,
      is_visible: true
    },
    {
      id: educationVideosId,
      component_name: 'EducationVideos',
      props: {
        title: 'Education Videos',
        titleAccentWord: 'Videos',
        tagline: 'Expert lecures, lab demonstrations, and student webinars.',
        showHeader: true,
        currentlyPlayingText: 'Engineering Spotlight',
        videos: [
          {
            title: 'Introduction to Robotics',
            thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          },
          {
            title: 'Modern Architecture Patterns',
            thumbnail: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=1000&auto=format&fit=crop',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        ],
        backgroundColor: '#022c22',
        variant: 'modern-dark'
      },
      sort_order: 6,
      parent_block_id: null,
      is_visible: true
    },
    {
      id: partnersId,
      component_name: 'PartnersLogos',
      props: {
        headerPart1: 'Supporting',
        headerPart2: 'Partners',
        headerPart1Color: '#ffffff',
        headerPart2Color: '#D4AF37',
        subtitle: 'Collaborating with industry leaders to provide student internships and projects.',
        layout: 'marquee',
        partners: [
          { name: 'IBM', logo: 'https://cdn.worldvectorlogo.com/logos/ibm.svg' },
          { name: 'TCS', logo: 'https://cdn.worldvectorlogo.com/logos/tata-consultancy-services.svg' },
          { name: 'Infosys', logo: 'https://cdn.worldvectorlogo.com/logos/infosys.svg' },
          { name: 'Oracle', logo: 'https://cdn.worldvectorlogo.com/logos/oracle-6.svg' }
        ],
        backgroundColor: '#052e16'
      },
      sort_order: 7,
      parent_block_id: null,
      is_visible: true
    },
    {
      id: recruitersId,
      component_name: 'PlacementsHighlights',
      props: {
        title: 'Our College Recruiters',
        subtitle: 'Over 100+ top companies recruit our engineering graduates every year.',
        stats: [
          { value: '500', suffix: '+', label: 'Offer Letters' },
          { value: '95', suffix: '%', label: 'Placement Rate' },
          { value: '12', suffix: ' LPA', label: 'Highest Package' }
        ],
        recruitersText: 'Top recruiters include Amazon, Google, Microsoft, IBM, TCS, Wipro, and many more.',
        backgroundColor: '#022c22'
      },
      sort_order: 8,
      parent_block_id: null,
      is_visible: true
    },
    {
      id: lifeId,
      component_name: 'LifeAtJKKN',
      props: {
        headerPart1: 'Life@',
        headerPart2: 'JKKN',
        headerPart1Color: '#ffffff',
        headerPart2Color: '#D4AF37',
        subtitle: 'Experience a vibrant campus life with cultural events, sports, and technical clubs.',
        images: [
          { src: 'https://images.unsplash.com/photo-1523580494863-6f303122469a?q=80&w=800&auto=format&fit=crop', alt: 'Cultural Fest' },
          { src: 'https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?q=80&w=800&auto=format&fit=crop', alt: 'Graduation Day' },
          { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop', alt: 'Library Study' }
        ],
        variant: 'grid',
        backgroundColor: '#052e16'
      },
      sort_order: 9,
      parent_block_id: null,
      is_visible: true
    }
  ]
}

export default engineeringHomeTemplate
