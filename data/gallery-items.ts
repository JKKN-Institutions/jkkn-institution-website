/**
 * Gallery Items Data
 *
 * Add your gallery images and videos here.
 * Each item needs:
 * - id: Unique identifier
 * - type: 'image' or 'video'
 * - title: Title (shows in lightbox)
 * - thumbnail: Image URL for the card
 * - thumbnailAlt: Alt text for accessibility
 * - fullSrc: Full resolution image or video URL
 * - fullSrcAlt: Alt text for full image
 * - category: Must match category name exactly
 * - description: Optional description
 * - date: Optional date string
 */

import type { GalleryItem } from '@/components/cms-blocks/content/gallery-page'

export const galleryItems: GalleryItem[] = [
  // ========================================
  // 16th Annual Day Images
  // ========================================
  {
    id: 'annual-day-1',
    type: 'image',
    title: 'Grand Opening Ceremony',
    thumbnail: 'https://placehold.co/800x600/0b6d41/white?text=Annual+Day+Opening',
    thumbnailAlt: 'Grand opening ceremony of 16th Annual Day',
    fullSrc: 'https://placehold.co/1920x1080/0b6d41/white?text=Annual+Day+Opening',
    fullSrcAlt: 'Students and faculty gathered at the grand opening ceremony',
    category: '16th Annual Day',
    description: 'The grand opening ceremony with students, faculty, and chief guest',
    date: 'Dec 15, 2024',
  },
  {
    id: 'annual-day-2',
    type: 'image',
    title: 'Cultural Performance - Classical Dance',
    thumbnail: 'https://placehold.co/800x600/0b6d41/white?text=Classical+Dance',
    thumbnailAlt: 'Classical dance performance',
    fullSrc: 'https://placehold.co/1920x1080/0b6d41/white?text=Classical+Dance',
    fullSrcAlt: 'Students performing classical dance',
    category: '16th Annual Day',
    description: 'Beautiful classical dance performance by our talented students',
    date: 'Dec 15, 2024',
  },
  {
    id: 'annual-day-3',
    type: 'image',
    title: 'Chief Guest Address',
    thumbnail: 'https://placehold.co/800x600/0b6d41/white?text=Chief+Guest',
    thumbnailAlt: 'Chief guest addressing the audience',
    fullSrc: 'https://placehold.co/1920x1080/0b6d41/white?text=Chief+Guest',
    fullSrcAlt: 'Chief guest delivering the keynote address',
    category: '16th Annual Day',
    description: 'Inspiring words from our esteemed chief guest',
    date: 'Dec 15, 2024',
  },
  {
    id: 'annual-day-4',
    type: 'image',
    title: 'Award Distribution',
    thumbnail: 'https://placehold.co/800x600/0b6d41/white?text=Awards',
    thumbnailAlt: 'Award distribution ceremony',
    fullSrc: 'https://placehold.co/1920x1080/0b6d41/white?text=Awards',
    fullSrcAlt: 'Students receiving awards for excellence',
    category: '16th Annual Day',
    description: 'Recognizing outstanding achievements of our students',
    date: 'Dec 15, 2024',
  },
  {
    id: 'annual-day-5',
    type: 'image',
    title: 'Drama Performance',
    thumbnail: 'https://placehold.co/800x600/0b6d41/white?text=Drama',
    thumbnailAlt: 'Student drama performance',
    fullSrc: 'https://placehold.co/1920x1080/0b6d41/white?text=Drama',
    fullSrcAlt: 'Students performing a drama on stage',
    category: '16th Annual Day',
    description: 'Captivating drama performance by the theater club',
    date: 'Dec 15, 2024',
  },
  {
    id: 'annual-day-6',
    type: 'image',
    title: 'Musical Band Performance',
    thumbnail: 'https://placehold.co/800x600/0b6d41/white?text=Music+Band',
    thumbnailAlt: 'Musical band performance',
    fullSrc: 'https://placehold.co/1920x1080/0b6d41/white?text=Music+Band',
    fullSrcAlt: 'Student band performing live music',
    category: '16th Annual Day',
    description: 'Energetic performance by our college band',
    date: 'Dec 15, 2024',
  },
  {
    id: 'annual-day-7',
    type: 'image',
    title: 'Group Photo - Winners',
    thumbnail: 'https://placehold.co/800x600/0b6d41/white?text=Winners',
    thumbnailAlt: 'Group photo of award winners',
    fullSrc: 'https://placehold.co/1920x1080/0b6d41/white?text=Winners',
    fullSrcAlt: 'All award winners posing together',
    category: '16th Annual Day',
    description: 'All the winners celebrating their achievements together',
    date: 'Dec 15, 2024',
  },
  {
    id: 'annual-day-8',
    type: 'video',
    title: 'Annual Day Highlights Video',
    thumbnail: 'https://placehold.co/800x600/0b6d41/white?text=Video+Highlights',
    thumbnailAlt: 'Video highlights thumbnail',
    fullSrc: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fullSrcAlt: 'Annual day highlights video',
    category: '16th Annual Day',
    description: 'Complete highlights of the 16th Annual Day celebrations',
    date: 'Dec 15, 2024',
  },
  {
    id: 'annual-day-9',
    type: 'image',
    title: 'Stage Decoration',
    thumbnail: 'https://placehold.co/800x600/0b6d41/white?text=Stage+Decor',
    thumbnailAlt: 'Beautiful stage decoration',
    fullSrc: 'https://placehold.co/1920x1080/0b6d41/white?text=Stage+Decor',
    fullSrcAlt: 'Elaborate stage decoration for annual day',
    category: '16th Annual Day',
    description: 'Stunning stage setup for the annual day event',
    date: 'Dec 15, 2024',
  },
  {
    id: 'annual-day-10',
    type: 'image',
    title: 'Closing Ceremony',
    thumbnail: 'https://placehold.co/800x600/0b6d41/white?text=Closing',
    thumbnailAlt: 'Closing ceremony',
    fullSrc: 'https://placehold.co/1920x1080/0b6d41/white?text=Closing',
    fullSrcAlt: 'Closing ceremony with fireworks',
    category: '16th Annual Day',
    description: 'Grand finale of the 16th Annual Day celebrations',
    date: 'Dec 15, 2024',
  },

  // ========================================
  // Founder's Day Images
  // ========================================
  {
    id: 'founders-day-1',
    type: 'image',
    title: 'Tribute to Founder',
    thumbnail: 'https://placehold.co/800x600/9333ea/white?text=Founders+Day',
    thumbnailAlt: 'Tribute to founder',
    fullSrc: 'https://placehold.co/1920x1080/9333ea/white?text=Founders+Day',
    fullSrcAlt: 'Students paying tribute to the founder',
    category: "Founder's Day",
    description: 'Honoring our visionary founder',
    date: 'Nov 20, 2024',
  },

  // ========================================
  // Pongal Images
  // ========================================
  {
    id: 'pongal-1',
    type: 'image',
    title: 'Pongal Celebration',
    thumbnail: 'https://placehold.co/800x600/d97706/white?text=Pongal',
    thumbnailAlt: 'Pongal celebration',
    fullSrc: 'https://placehold.co/1920x1080/d97706/white?text=Pongal',
    fullSrcAlt: 'Students celebrating Pongal festival',
    category: 'Pongal',
    description: 'Traditional Pongal celebrations on campus',
    date: 'Jan 15, 2025',
  },

  // ========================================
  // Sports Day Images
  // ========================================
  {
    id: 'sports-1',
    type: 'image',
    title: 'Sports Day Opening',
    thumbnail: 'https://placehold.co/800x600/dc2626/white?text=Sports+Day',
    thumbnailAlt: 'Sports day opening ceremony',
    fullSrc: 'https://placehold.co/1920x1080/dc2626/white?text=Sports+Day',
    fullSrcAlt: 'Students marching in sports day parade',
    category: 'Sports Day',
    description: 'Annual sports day celebrations',
    date: 'Feb 10, 2025',
  },

  // Add more images here...
  // Follow the same pattern for each category
]
