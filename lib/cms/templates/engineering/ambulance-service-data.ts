import { AmbulanceServicePageProps } from '@/components/cms-blocks/content/ambulance-service-page'

export const AMBULANCE_SERVICE_DATA: AmbulanceServicePageProps = {
  facilityTitle: 'AMBULANCE SERVICES',

  contact: {
    name: 'Mr. Atchuthan',
    designation: 'Emergency Services Coordinator',
    mobile: '+91 9360987848',
  },

  images: [
    {
      src: '/images/facilities/ambulance-1.jpg',
      alt: 'JKKN Ambulance Service Vehicle',
    },
  ],

  introduction: `
    <p class="mb-4">
      JKKN Educational Institutions. we prioritize delivering top-notch education to our students, staff, and
      community members. As a testament to our commitment to the community, we take great pride in offering our
      own ambulance services. With round-the-clock availability, our ambulance service cater to emergency situations
      and medical transportation needs of individuals.
    </p>
    <p>
      Our ambulance services are run by a team of certified and well-trained emergency medical technicians who are
      capable of handling various types of medical emergencies. Equipped with state-of-the-art medical equipment
      and supplies, our ambulances ensure that our patients receive the best possible care.
    </p>
  `,

  features: [],

  backgroundColor: '#f8f8f8',
  accentColor: '#10b981',
  textColor: '#1a1a1a',
}
