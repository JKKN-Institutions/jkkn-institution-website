-- ============================================
-- Engineering College — Cities Nav URL Shortened
-- ============================================
-- Purpose: Update external_url for the 5 city nav children in cms_pages
--          from the old /best-engineering-college-in-{city} format to the
--          new short district-only format /{city}.
--          The display titles, slugs, sort_order, and parent linkage are
--          unchanged — only the link target changes.
-- Created: 2026-05-09
-- Category: cms_pages navigation update
-- Used by: app/actions/cms/navigation.ts → getPublicNavigation()
--          components/public/site-header.tsx (desktop dropdown)
--          components/navigation/bottom-nav/public/use-public-nav-data.ts
-- Security: Update is scoped to 5 known nav slugs; no schema change.
-- Companion code change: 301 redirects added in next.config.ts so Google's
--          link equity from old indexed URLs flows to the new ones.
-- ============================================

UPDATE public.cms_pages
SET
  external_url = CASE slug
    WHEN 'nav-cities-coimbatore' THEN '/coimbatore'
    WHEN 'nav-cities-erode'      THEN '/erode'
    WHEN 'nav-cities-namakkal'   THEN '/namakkal'
    WHEN 'nav-cities-salem'      THEN '/salem'
    WHEN 'nav-cities-tiruppur'   THEN '/tiruppur'
  END,
  updated_at = now()
WHERE slug IN (
  'nav-cities-coimbatore',
  'nav-cities-erode',
  'nav-cities-namakkal',
  'nav-cities-salem',
  'nav-cities-tiruppur'
);

-- End of Cities Nav URL Shortened
-- ============================================
