-- ============================================
-- CMS Page Update: Digital Classroom (Main Institution)
-- ============================================
-- Purpose: Upgrades the archived smart-classroom page to a full
--          DigitalClassroomPage component with rich content, stats,
--          tech specs, features, and CTA.
-- Created: 2026-04-16
-- Dependencies: cms_pages, cms_page_blocks, cms_seo_metadata
-- Component used: DigitalClassroomPage (registered in lib/cms/component-registry.ts)
-- Institution scope: Main Institution (Supabase project pmqodbfhsejbvfbmsfeq)
-- ============================================

-- 1. Update the page row: rename slug, update title, publish
UPDATE public.cms_pages
SET
  slug = 'digital-classroom',
  title = 'Digital Classrooms',
  description = 'State-of-the-art digital classrooms at JKKN Educational Institutions — 60+ smart classrooms with interactive boards, 4K projectors, high-speed Wi-Fi, and integrated learning platforms.',
  status = 'published',
  visibility = 'public',
  navigation_label = 'Digital Classrooms',
  sort_order = 7,
  deleted_at = NULL
WHERE slug = 'smart-classroom';

-- 2. Replace FacilityPage block with DigitalClassroomPage block
UPDATE public.cms_page_blocks
SET
  component_name = 'DigitalClassroomPage',
  props = jsonb_build_object(
    'showHeader', true,
    'headerTitle', 'Digital Classrooms',
    'headerSubtitle', 'Modern learning spaces powered by cutting-edge technology',
    'badge', 'Smart Learning',
    'images', jsonb_build_array(
      jsonb_build_object('src', '/images/facilities/classroom-1.jpg', 'alt', 'Digital classroom with interactive smart board'),
      jsonb_build_object('src', '/images/facilities/classroom-2.jpg', 'alt', 'Students using multimedia projectors'),
      jsonb_build_object('src', '/images/facilities/classroom-3.jpg', 'alt', 'Modern classroom with ergonomic seating')
    ),
    'paragraphs', jsonb_build_array(
      jsonb_build_object('text', 'JKKN Educational Institutions prioritizes exceptional classroom facilities as a crucial aspect of a great learning environment. Our classrooms are thoughtfully designed to offer a comfortable and engaging space for students to thrive and progress in their studies.'),
      jsonb_build_object('text', 'Our facilities boast cutting-edge technology, including high-speed internet, multimedia projectors, and interactive whiteboards, providing students with access to a vast array of information at their fingertips.'),
      jsonb_build_object('text', 'With modern furnishings, proper ventilation, excellent lighting, and inspiring posters, our classrooms provide a warm and welcoming atmosphere that fosters a passion for learning.')
    ),
    'showStats', true,
    'stats', jsonb_build_array(
      jsonb_build_object('icon', 'Monitor', 'value', '60+', 'label', 'Smart Classrooms'),
      jsonb_build_object('icon', 'Wifi', 'value', '500+', 'label', 'Mbps Internet'),
      jsonb_build_object('icon', 'Projector', 'value', '4K', 'label', 'Projectors'),
      jsonb_build_object('icon', 'Users', 'value', '5,000+', 'label', 'Students Served')
    ),
    'showTechSpecs', true,
    'techSpecsTitle', 'Technology That Powers Learning',
    'techSpecs', jsonb_build_array(
      jsonb_build_object('title', 'Interactive Smart Boards', 'description', 'Touch-enabled 86-inch smart displays with multi-user collaboration, annotation tools, and wireless screen mirroring.', 'icon', 'Presentation'),
      jsonb_build_object('title', 'High-Speed Connectivity', 'description', 'Enterprise-grade 500+ Mbps fibre-optic network with seamless Wi-Fi 6 coverage across every classroom.', 'icon', 'Wifi'),
      jsonb_build_object('title', '4K Multimedia Projectors', 'description', 'Ultra-bright 4K laser projectors with crystal-clear visuals, enabling immersive presentations and video learning.', 'icon', 'Projector'),
      jsonb_build_object('title', 'Digital Learning Platform', 'description', 'Integrated LMS access from every seat, enabling real-time quizzes, resource sharing, and assignment submissions.', 'icon', 'CloudCog'),
      jsonb_build_object('title', 'Audio-Visual System', 'description', 'Professional ceiling-mounted microphone arrays and surround speakers ensure every student hears clearly.', 'icon', 'Headphones'),
      jsonb_build_object('title', 'Screen Sharing & Casting', 'description', 'Students can wirelessly cast their devices to the classroom display for collaborative presentations.', 'icon', 'ScreenShare')
    ),
    'showFeatures', true,
    'featuresTitle', 'Learning Environment',
    'features', jsonb_build_array(
      jsonb_build_object('text', 'Ergonomic seating with tablet arms', 'icon', 'Users'),
      jsonb_build_object('text', 'Climate-controlled environment', 'icon', 'Zap'),
      jsonb_build_object('text', 'Natural and LED hybrid lighting', 'icon', 'Lightbulb'),
      jsonb_build_object('text', 'Dedicated charging stations', 'icon', 'TabletSmartphone'),
      jsonb_build_object('text', 'AI-powered attendance system', 'icon', 'BrainCircuit'),
      jsonb_build_object('text', 'CCTV monitored for safety', 'icon', 'Monitor'),
      jsonb_build_object('text', 'Accessible for differently-abled', 'icon', 'CheckCircle2'),
      jsonb_build_object('text', 'Soundproof walls for focused learning', 'icon', 'Headphones')
    ),
    'showCta', true,
    'ctaTitle', 'Experience the Future of Learning',
    'ctaDescription', 'Our digital classrooms combine world-class infrastructure with innovative pedagogy to create an unmatched learning experience.',
    'variant', 'modern-light',
    'showDecorations', true
  )
WHERE page_id = (SELECT id FROM public.cms_pages WHERE slug = 'digital-classroom')
  AND component_name = 'FacilityPage';

-- 3. Add SEO metadata
INSERT INTO public.cms_seo_metadata (
  page_id, meta_title, meta_description, meta_keywords,
  og_title, og_description, og_type
)
SELECT
  p.id,
  'Digital Classrooms | JKKN Educational Institutions — Smart Learning Spaces',
  'Explore JKKN''s 60+ digital classrooms featuring interactive smart boards, 4K projectors, 500+ Mbps Wi-Fi, integrated LMS, and AI-powered attendance — designed for modern, technology-driven education.',
  ARRAY['digital classroom', 'smart classroom', 'interactive whiteboard', 'JKKN', 'smart learning', '4K projector', 'LMS', 'Wi-Fi campus', 'modern education', 'technology classroom'],
  'Digital Classrooms — JKKN Educational Institutions',
  '60+ state-of-the-art digital classrooms with interactive smart boards, 4K projectors, and integrated learning platforms at JKKN.',
  'website'
FROM public.cms_pages p
WHERE p.slug = 'digital-classroom'
ON CONFLICT (page_id) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  og_title = EXCLUDED.og_title,
  og_description = EXCLUDED.og_description;

-- End of Digital Classroom Page Seed
-- ============================================
