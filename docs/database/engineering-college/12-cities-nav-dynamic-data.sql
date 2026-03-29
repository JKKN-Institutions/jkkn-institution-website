-- ============================================
-- Engineering College — Cities Navigation Seed
-- ============================================
-- Purpose: Seeds the "Cities" parent nav item and 5 city child items into
--          cms_pages so the navigation is fully managed from the admin panel
--          (/admin/content/pages/) via Engineering Supabase — no code changes needed.
-- Created: 2026-03-29
-- Category: cms_pages navigation
-- Used by: app/actions/cms/navigation.ts → getPublicNavigation()
--          components/public/site-header.tsx (desktop dropdown)
--          components/navigation/bottom-nav/public/use-public-nav-data.ts (mobile More menu)
-- Security: Readable by public (show_in_navigation + status = published)
-- Admin management: /admin/content/pages/ — reorder, add/remove cities freely
-- ============================================
-- NOTE: After running this seed, the hardcoded ENGINEERING_CITY_PAGES_GROUP
--       injection in site-header.tsx and use-public-nav-data.ts is removed.
--       Cities are now fully dynamic via cms_pages.
-- ============================================

-- ── Step 1: Upsert "Cities" parent nav item ───────────────────────────────────
-- sort_order 12 places it after all existing root nav items (max was 11)
INSERT INTO public.cms_pages (
  title, slug, status, visibility, show_in_navigation,
  navigation_label, external_url, is_homepage, sort_order,
  created_by, published_at
)
VALUES (
  'Cities',
  'nav-cities',
  'published',
  'public',
  true,
  'Cities',
  '#',
  false,
  12,
  'b92f8ccd-b811-4c5a-a93d-1eed2b5f4a60',
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  show_in_navigation = true,
  navigation_label   = 'Cities',
  external_url       = '#',
  sort_order         = 12,
  status             = 'published',
  visibility         = 'public',
  updated_at         = now();

-- ── Step 2: Upsert 5 city child nav items ────────────────────────────────────
-- Each city links to its landing page via external_url.
-- Admin can add more cities, reorder, or remove from /admin/content/pages/.
WITH parent AS (
  SELECT id FROM public.cms_pages WHERE slug = 'nav-cities'
)
INSERT INTO public.cms_pages (
  title, slug, status, visibility, show_in_navigation,
  navigation_label, external_url, is_homepage, sort_order,
  parent_id, created_by, published_at
)
SELECT
  city.title,
  city.slug,
  'published',
  'public',
  true,
  city.title,
  city.external_url,
  false,
  city.sort_order,
  parent.id,
  'b92f8ccd-b811-4c5a-a93d-1eed2b5f4a60',
  now()
FROM parent,
(VALUES
  ('Coimbatore', 'nav-cities-coimbatore', '/best-engineering-college-in-coimbatore', 1),
  ('Erode',      'nav-cities-erode',      '/best-engineering-college-in-erode',      2),
  ('Namakkal',   'nav-cities-namakkal',   '/best-engineering-college-in-namakkal',   3),
  ('Salem',      'nav-cities-salem',      '/best-engineering-college-in-salem',      4),
  ('Tiruppur',   'nav-cities-tiruppur',   '/best-engineering-college-in-tiruppur',   5)
) AS city(title, slug, external_url, sort_order)
ON CONFLICT (slug) DO UPDATE SET
  show_in_navigation = true,
  navigation_label   = EXCLUDED.navigation_label,
  external_url       = EXCLUDED.external_url,
  sort_order         = EXCLUDED.sort_order,
  parent_id          = EXCLUDED.parent_id,
  status             = 'published',
  visibility         = 'public',
  updated_at         = now();

-- End of Cities Navigation Seed
-- ============================================
