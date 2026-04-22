-- ============================================
-- CMS Page Seed: {Page Name}
-- ============================================
-- Purpose: Seeds cms_pages, cms_page_blocks, and cms_seo_metadata rows
--          for the public route /{slug}
-- Created: YYYY-MM-DD
-- Dependencies: cms_pages, cms_page_blocks, cms_seo_metadata
-- Component used: {PageName} (registered in lib/cms/component-registry.ts)
-- Institution scope: Main (apply to other institutions only if applicable)
-- ============================================

-- 1. Create the page row
INSERT INTO public.cms_pages (slug, title, status)
VALUES ('{slug}', '{Title}', 'draft')
ON CONFLICT (slug) DO NOTHING;

-- 2. Attach block(s) — props JSON must satisfy the block's Zod schema
INSERT INTO public.cms_page_blocks (page_id, component_name, props, "order")
SELECT
  p.id,
  '{PageName}',
  jsonb_build_object(
    'hero', jsonb_build_object(
      'eyebrow', '{Optional eyebrow}',
      'title', '{Main heading}',
      'subtitle', '{Supporting paragraph}',
      'backgroundImage', '{/images/hero.jpg}',
      'ctas', jsonb_build_array(
        jsonb_build_object('label', 'Primary CTA', 'href', '/admissions', 'variant', 'primary')
      )
    ),
    'intro', '{Introduction paragraph}',
    'features', jsonb_build_array(),
    'gallery', jsonb_build_array()
  ),
  1
FROM public.cms_pages p
WHERE p.slug = '{slug}';

-- 3. SEO metadata
INSERT INTO public.cms_seo_metadata (
  page_id,
  title,
  description,
  og_title,
  og_description,
  og_image,
  canonical_url,
  robots
)
SELECT
  p.id,
  '{SEO Title — 50–60 chars}',
  '{Meta description — 140–160 chars}',
  '{OG Title}',
  '{OG Description}',
  '{https://.../og-image.jpg}',
  '{https://jkkn.ac.in/{slug}}',
  'index,follow'
FROM public.cms_pages p
WHERE p.slug = '{slug}';

-- 4. (Optional) JSON-LD schema.org structured data
-- UPDATE public.cms_seo_metadata
-- SET schema_jsonld = jsonb_build_object(
--   '@context', 'https://schema.org',
--   '@type', 'WebPage',
--   'name', '{Title}',
--   'description', '{Description}'
-- )
-- WHERE page_id = (SELECT id FROM public.cms_pages WHERE slug = '{slug}');

-- End of {Page Name} seed
-- ============================================
