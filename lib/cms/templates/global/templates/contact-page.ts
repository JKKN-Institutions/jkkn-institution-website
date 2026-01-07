import type { GlobalTemplate } from '../types'

/**
 * Contact Page Template
 *
 * A comprehensive contact page template with:
 * - Contact information cards
 * - Interactive contact form
 * - Embedded Google Maps location
 * - Social media links
 * - FAQ accordion section
 *
 * Usage: Ideal for institutional contact and inquiry pages
 */
const contactPageTemplate: GlobalTemplate = {
  id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
  slug: 'global-contact-page',
  name: 'Contact Page',
  description:
    'Complete contact page template with contact form, location map, contact information cards, social links, and FAQs. Perfect for inquiry and contact pages.',
  thumbnail_url: '/templates/contact-page-preview.jpg',
  category: 'content',
  is_system: false,
  source: 'global',
  version: '2026-01-07',
  origin_institution: 'main',
  last_updated: '2026-01-07T00:00:00Z',
  author: {
    name: 'JKKN Institutions',
    email: 'admin@jkkn.ac.in',
  },
  tags: ['contact', 'form', 'inquiry', 'location', 'map'],
  usage_notes:
    'Update contact details, map coordinates, form submission endpoint, and FAQ content with institution-specific information.',
  default_blocks: [
    // Block 1: Page Header
    {
      id: '30000000-0000-0000-0000-000000000001',
      component_name: 'SectionWrapper',
      sort_order: 1,
      parent_block_id: null,
      is_visible: true,
      props: {
        heading: 'Get in Touch',
        subheading: "We'd love to hear from you. Contact us for any inquiries or assistance.",
        backgroundColor: 'primary',
        textColor: 'white',
        padding: 'large',
        textAlign: 'center',
      },
    },

    // Block 2: Contact Info Cards Section
    {
      id: '30000000-0000-0000-0000-000000000002',
      component_name: 'SectionWrapper',
      sort_order: 2,
      parent_block_id: null,
      is_visible: true,
      props: {
        backgroundColor: 'gray-50',
        padding: 'large',
      },
    },

    // Block 3: Contact Cards Grid
    {
      id: '30000000-0000-0000-0000-000000000003',
      component_name: 'GridLayout',
      sort_order: 1,
      parent_block_id: '30000000-0000-0000-0000-000000000002',
      is_visible: true,
      props: {
        columns: 4,
        gap: 'medium',
        items: [
          {
            icon: 'MapPin',
            title: 'Address',
            description: 'JKKN Institutions Campus\nKumarapalayam - Namakkal Road\nKomarapalayam, Tamil Nadu - 638183',
            iconColor: 'primary',
          },
          {
            icon: 'Phone',
            title: 'Phone',
            description: '+91-4288-272727\n+91-4288-274747\nMon-Sat: 9:00 AM - 5:00 PM',
            iconColor: 'success',
          },
          {
            icon: 'Mail',
            title: 'Email',
            description: 'info@jkkn.ac.in\nadmissions@jkkn.ac.in\nsupport@jkkn.ac.in',
            iconColor: 'warning',
          },
          {
            icon: 'Globe',
            title: 'Follow Us',
            description: 'Stay connected through our social media channels for updates and news.',
            iconColor: 'secondary',
          },
        ],
      },
      responsive_settings: {
        mobile: { columns: 1 },
        tablet: { columns: 2 },
      },
    },

    // Block 4: Main Content Section (Form + Map)
    {
      id: '30000000-0000-0000-0000-000000000004',
      component_name: 'SectionWrapper',
      sort_order: 3,
      parent_block_id: null,
      is_visible: true,
      props: {
        backgroundColor: 'white',
        padding: 'large',
      },
    },

    // Block 5: Two-Column Layout
    {
      id: '30000000-0000-0000-0000-000000000005',
      component_name: 'FlexboxLayout',
      sort_order: 1,
      parent_block_id: '30000000-0000-0000-0000-000000000004',
      is_visible: true,
      props: {
        direction: 'row',
        gap: 'large',
        wrap: true,
      },
    },

    // Block 6: Contact Form Column
    {
      id: '30000000-0000-0000-0000-000000000006',
      component_name: 'Container',
      sort_order: 1,
      parent_block_id: '30000000-0000-0000-0000-000000000005',
      is_visible: true,
      props: {
        flex: 1,
        minWidth: '400px',
      },
    },

    // Block 7: Form Heading
    {
      id: '30000000-0000-0000-0000-000000000007',
      component_name: 'Heading',
      sort_order: 1,
      parent_block_id: '30000000-0000-0000-0000-000000000006',
      is_visible: true,
      props: {
        level: 2,
        text: 'Send us a Message',
        className: 'mb-4',
      },
    },

    // Block 8: Contact Form (Placeholder - needs custom component)
    {
      id: '30000000-0000-0000-0000-000000000008',
      component_name: 'TextEditor',
      sort_order: 2,
      parent_block_id: '30000000-0000-0000-0000-000000000006',
      is_visible: true,
      props: {
        content: `
          <form class="space-y-4" action="/api/contact" method="POST">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="What is this regarding?"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              class="w-full bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
            >
              Send Message
            </button>
          </form>
        `,
      },
    },

    // Block 9: Map Column
    {
      id: '30000000-0000-0000-0000-000000000009',
      component_name: 'Container',
      sort_order: 2,
      parent_block_id: '30000000-0000-0000-0000-000000000005',
      is_visible: true,
      props: {
        flex: 1,
        minWidth: '400px',
      },
    },

    // Block 10: Map Heading
    {
      id: '30000000-0000-0000-0000-000000000010',
      component_name: 'Heading',
      sort_order: 1,
      parent_block_id: '30000000-0000-0000-0000-000000000009',
      is_visible: true,
      props: {
        level: 2,
        text: 'Find Us',
        className: 'mb-4',
      },
    },

    // Block 11: Embedded Google Map
    {
      id: '30000000-0000-0000-0000-000000000011',
      component_name: 'TextEditor',
      sort_order: 2,
      parent_block_id: '30000000-0000-0000-0000-000000000009',
      is_visible: true,
      props: {
        content: `
          <div class="w-full h-[450px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.0!2d77.7!3d11.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDE4JzAwLjAiTiA3N8KwNDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="450"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        `,
      },
    },

    // Block 12: FAQ Section
    {
      id: '30000000-0000-0000-0000-000000000012',
      component_name: 'SectionWrapper',
      sort_order: 4,
      parent_block_id: null,
      is_visible: true,
      props: {
        heading: 'Frequently Asked Questions',
        subheading: 'Quick answers to common inquiries',
        backgroundColor: 'gray-50',
        padding: 'large',
      },
    },

    // Block 13: FAQ Accordion
    {
      id: '30000000-0000-0000-0000-000000000013',
      component_name: 'FAQAccordion',
      sort_order: 1,
      parent_block_id: '30000000-0000-0000-0000-000000000012',
      is_visible: true,
      props: {
        faqs: [
          {
            question: 'What are the office hours?',
            answer:
              'Our administrative office is open Monday to Saturday from 9:00 AM to 5:00 PM. We are closed on Sundays and public holidays.',
          },
          {
            question: 'How can I schedule a campus tour?',
            answer:
              'You can schedule a campus tour by calling our admissions office at +91-4288-272727 or by filling out the contact form above. Virtual tours are also available upon request.',
          },
          {
            question: 'Who should I contact for admission inquiries?',
            answer:
              'For admission-related queries, please contact our admissions office at admissions@jkkn.ac.in or call +91-4288-274747 during office hours.',
          },
          {
            question: 'Do you provide transportation facilities?',
            answer:
              'Yes, we provide bus transportation services covering major routes in Tamil Nadu. Please contact the transportation department for route details and schedules.',
          },
          {
            question: 'Is hostel accommodation available?',
            answer:
              'Yes, we have separate hostel facilities for boys and girls with modern amenities. For hostel admission and availability, please contact the hostel warden at hostel@jkkn.ac.in.',
          },
          {
            question: 'How can I reach the campus by public transport?',
            answer:
              'JKKN Institutions is well-connected by road. Regular buses operate from Erode, Namakkal, and Salem. The nearest railway station is Erode Junction (30 km) and the nearest airport is Coimbatore International Airport (90 km).',
          },
        ],
        allowMultiple: false,
        defaultOpen: 0,
      },
    },

    // Block 14: Social Media Links Section
    {
      id: '30000000-0000-0000-0000-000000000014',
      component_name: 'SectionWrapper',
      sort_order: 5,
      parent_block_id: null,
      is_visible: true,
      props: {
        heading: 'Connect With Us',
        backgroundColor: 'white',
        padding: 'medium',
        textAlign: 'center',
      },
    },

    // Block 15: Social Media Icons
    {
      id: '30000000-0000-0000-0000-000000000015',
      component_name: 'TextEditor',
      sort_order: 1,
      parent_block_id: '30000000-0000-0000-0000-000000000014',
      is_visible: true,
      props: {
        content: `
          <div class="flex justify-center gap-6 mt-4">
            <a href="https://facebook.com/jkkninstitutions" target="_blank" class="text-3xl text-gray-600 hover:text-primary transition-colors">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com/jkkninstitutions" target="_blank" class="text-3xl text-gray-600 hover:text-primary transition-colors">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com/jkkninstitutions" target="_blank" class="text-3xl text-gray-600 hover:text-primary transition-colors">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com/company/jkkninstitutions" target="_blank" class="text-3xl text-gray-600 hover:text-primary transition-colors">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="https://youtube.com/jkkninstitutions" target="_blank" class="text-3xl text-gray-600 hover:text-primary transition-colors">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        `,
      },
    },
  ],
}

export default contactPageTemplate
