-- ============================================
-- CMS Page Seed: Placement Page (Engineering)
-- ============================================
-- Purpose: Seeds cms_pages, cms_page_blocks, and cms_seo_metadata rows
--          for the /placement public route on the Engineering site.
-- Created: 2026-04-14
-- Dependencies: cms_pages, cms_page_blocks, cms_seo_metadata (all in public schema)
-- Component used: PlacementPage (registered in lib/cms/component-registry.ts)
-- Institution scope: Engineering College (Supabase project kyvfkyjmdbtyimtedkie)
-- Created via: cms-page-creation skill
-- ============================================

-- 1. Create the page row
INSERT INTO public.cms_pages (
  slug, title, description, status, visibility,
  show_in_navigation, navigation_label, sort_order, created_by
) VALUES (
  'placement',
  'Placements | JKKN College of Engineering & Technology',
  'Placement cell, recruiters, training programmes, year-wise placement record, and alumni success stories at JKKN College of Engineering.',
  'published',
  'public',
  true,
  'Placements',
  80,
  '2af31fa6-012c-4293-98ac-6ffd8ad2f4cc' -- engg@jkkn.ac.in
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Attach PlacementPage block with default placement data
INSERT INTO public.cms_page_blocks (page_id, component_name, props, sort_order, is_visible)
SELECT
  p.id,
  'PlacementPage',
  jsonb_build_object(
    'hero', jsonb_build_object(
      'eyebrow', 'Career & Placement',
      'title', 'Launching Careers, Building Futures',
      'subtitle', 'Our Placement Cell connects students with leading recruiters across technology, core engineering, and research — backed by rigorous training and a thriving alumni network.',
      'backgroundImage', '/images/engineering/placement-hero.jpg'
    ),
    'stats', jsonb_build_array(
      jsonb_build_object('label', 'Placement Rate', 'value', '95%', 'icon', 'Target'),
      jsonb_build_object('label', 'Highest Package', 'value', '₹24 LPA', 'icon', 'TrendingUp'),
      jsonb_build_object('label', 'Average Package', 'value', '₹6.2 LPA', 'icon', 'Briefcase'),
      jsonb_build_object('label', 'Recruiters', 'value', '150+', 'icon', 'Users')
    ),
    'trainingTitle', 'Training & Preparation',
    'trainingSubtitle', 'A structured, multi-year programme that prepares every student for competitive recruitment.',
    'training', jsonb_build_array(
      jsonb_build_object('title', 'Aptitude & Reasoning', 'description', 'Quantitative, logical, and verbal aptitude drills modelled on real recruiter assessments.', 'icon', 'Target'),
      jsonb_build_object('title', 'Technical Bootcamps', 'description', 'Core CS, data structures, and domain-specific coding practice across languages.', 'icon', 'Code2'),
      jsonb_build_object('title', 'Mock Interviews', 'description', 'HR and technical mock panels with feedback from industry mentors and alumni.', 'icon', 'MessageSquare'),
      jsonb_build_object('title', 'Soft Skills & Communication', 'description', 'Group discussions, presentations, and business communication workshops.', 'icon', 'Mic2')
    ),
    'recruitersTitle', 'Top Recruiters',
    'recruiters', jsonb_build_array(),
    'recordTitle', 'Year-wise Placement Record',
    'record', jsonb_build_array(
      jsonb_build_object('year', '2024-25', 'offers', '520+', 'highest', '₹24 LPA', 'average', '₹6.2 LPA'),
      jsonb_build_object('year', '2023-24', 'offers', '480+', 'highest', '₹19 LPA', 'average', '₹5.8 LPA'),
      jsonb_build_object('year', '2022-23', 'offers', '440+', 'highest', '₹17 LPA', 'average', '₹5.4 LPA')
    ),
    'testimonialsTitle', 'Success Stories',
    'testimonials', jsonb_build_array(),
    'placementCell', jsonb_build_object(
      'title', 'Placement Cell',
      'head', 'Head of Placements',
      'phone', '+91 98765 43210',
      'email', 'placements@jkkn.ac.in',
      'address', 'JKKN College of Engineering & Technology, Kumarapalayam, Tamil Nadu'
    ),
    'recruiterCta', jsonb_build_object(
      'title', 'Hire from JKKN Engineering',
      'description', 'Partner with us to access a trained, industry-ready talent pool.',
      'buttonLabel', 'Contact Placement Cell',
      'buttonHref', 'mailto:placements@jkkn.ac.in'
    )
  ),
  0,
  true
FROM public.cms_pages p
WHERE p.slug = 'placement'
  AND NOT EXISTS (
    SELECT 1 FROM public.cms_page_blocks b
    WHERE b.page_id = p.id AND b.component_name = 'PlacementPage'
  );

-- 3. SEO metadata
INSERT INTO public.cms_seo_metadata (
  page_id, meta_title, meta_description, meta_keywords,
  og_title, og_description, og_image, og_type,
  twitter_card, twitter_title, twitter_description, twitter_image,
  robots_directive
)
SELECT
  p.id,
  'Placements | JKKN College of Engineering & Technology',
  '95% placement rate, 150+ recruiters, ₹24 LPA highest package. Explore training programmes, recruiter network, and alumni success stories at JKKN Engineering.',
  ARRAY['engineering placements', 'JKKN placement cell', 'engineering recruitment Tamil Nadu', 'campus placement', 'BE placement', 'engineering jobs']::text[],
  'Placements — JKKN College of Engineering & Technology',
  'Launch your career with JKKN Engineering: 95% placement rate, 150+ recruiters, comprehensive training, and proven alumni outcomes.',
  '/images/engineering/placement-hero.jpg',
  'website',
  'summary_large_image',
  'Placements | JKKN Engineering',
  '95% placement rate · 150+ recruiters · ₹24 LPA highest package',
  '/images/engineering/placement-hero.jpg',
  'index, follow'
FROM public.cms_pages p
WHERE p.slug = 'placement'
  AND NOT EXISTS (
    SELECT 1 FROM public.cms_seo_metadata s WHERE s.page_id = p.id
  );

-- End of Placement Page seed
-- ============================================
