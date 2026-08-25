-- ============================================
-- CMS canonical_url cleanup + drift prevention
-- ============================================
-- Purpose: Remove hand-typed canonical_url drift from cms_seo_metadata and
--          prevent it recurring. The correct state is canonical_url IS NULL for
--          every page whose canonical is its own URL; a stored value is reserved
--          for deliberate cross-path or cross-domain consolidation ONLY.
-- Created: 2026-08-25
-- Dependencies: cms_seo_metadata, cms_pages
-- Used by: app/(public)/[...slug]/page.tsx (generateMetadata -> alternates.canonical)
--          app/actions/cms/pages.ts (updatePageSeo)
--          components/page-builder/panels/seo-panel.tsx
-- Security: trigger is SECURITY INVOKER (default) - it only normalizes its own row
-- ============================================
--
-- BACKGROUND
-- ----------
-- app/(public)/[...slug]/page.tsx line ~108 already implements the fallback:
--     canonical: seo?.canonical_url?.trim() || path
-- `path` is RELATIVE, so Next resolves it against the root layout's metadataBase
-- and each institution deployment emits its own host automatically. That makes a
-- NULL canonical_url the multi-tenant-correct default, and any absolute URL on
-- the institution's own host a liability: it hard-codes a host into a per-tenant
-- shared table.
--
-- next.config.ts line ~531 301-redirects jkkn.ac.in/* -> www.jkkn.ac.in/*, so a
-- stored non-www canonical points at a redirect hop (Search Console: "Alternate
-- page with proper canonical").
--
-- AUDIT FINDINGS (Main Supabase, 2026-08-25) - 62 rows carried a value:
--   Class A (35): canonical == the page's own URL, on either host. Redundant at
--                 best, redirect-hop at worst. -> NULL
--   Class B (21): canonical points to a path that exists in NEITHER cms_pages
--                 NOR app/(public)/ NOR next.config.ts rewrites -> a 404.
--                 This is the severe class: Google discards a canonical that
--                 404s and may treat the page as a soft-404. -> NULL
--   Class C  (1): slug 'home' -> 'https://www.jkkn.ac.in/'. INTENTIONAL and
--                 load-bearing: it stops /home duplicating /. Pairs with
--                 RESERVED_CMS_SLUGS in app/sitemap-pages.xml/route.ts. -> KEEP
--   Class D  (5): cross-domain canonicals to sibling institution sites
--                 (ahs/edu/nv/pharmacy/school .jkkn.ac.in). Editorial decision,
--                 not drift. -> KEEP
--
-- ROOT CAUSE
-- ----------
-- canonical_url is plain `text`, nullable, no default, no CHECK, and
-- updatePageSeo() passes it through unvalidated while AWARDING +5 seo_score for
-- filling it in. The seo-panel placeholder literally reads "https://jkkn.ac.in/..."
-- - teaching editors the wrong host. Three hosts in one column is the predictable
-- outcome. Sections 5-7 below close all three gaps.
-- ============================================


-- ============================================
-- SECTION 1: Pre-flight audit
-- ============================================
-- Run before and after. After cleanup, the same-host absolute count must be 0.

SELECT
  CASE
    WHEN s.canonical_url IS NULL OR btrim(s.canonical_url) = '' THEN 'null_or_empty'
    WHEN btrim(s.canonical_url) IN ('https://jkkn.ac.in/'  || p.slug,
                                    'https://www.jkkn.ac.in/' || p.slug) THEN 'A_self_canonical'
    WHEN btrim(s.canonical_url) LIKE 'https://jkkn.ac.in/%'
      OR btrim(s.canonical_url) LIKE 'https://www.jkkn.ac.in/%'        THEN 'B_or_C_same_host_cross_path'
    ELSE 'D_cross_domain'
  END AS class,
  count(*) AS rows
FROM cms_seo_metadata s
JOIN cms_pages p ON p.id = s.page_id
GROUP BY 1
ORDER BY 2 DESC;


-- ============================================
-- SECTION 2: Backup (MANDATORY - run first)
-- ============================================
-- The only way to reverse an editorial decision cleared by mistake.

CREATE TABLE IF NOT EXISTS cms_seo_metadata_canonical_backup_20260825 AS
SELECT s.id, s.page_id, p.slug, s.canonical_url, now() AS backed_up_at
FROM cms_seo_metadata s
JOIN cms_pages p ON p.id = s.page_id
WHERE s.canonical_url IS NOT NULL AND btrim(s.canonical_url) <> '';


-- ============================================
-- SECTION 3: Class A - clear self-canonicals (35 rows)
-- ============================================
-- Scoped by EQUALITY to the computed self URL, never by a host LIKE, so a
-- cross-path row (Class B/C) can never be swept up by accident.

UPDATE cms_seo_metadata s
SET canonical_url = NULL,
    updated_at    = now()
FROM cms_pages p
WHERE p.id = s.page_id
  AND btrim(s.canonical_url) IN (
        'https://jkkn.ac.in/'     || p.slug,
        'https://www.jkkn.ac.in/' || p.slug
      );


-- ============================================
-- SECTION 4: Class B - clear canonicals pointing at 404s (21 rows)
-- ============================================
-- Every target below was verified on 2026-08-25 to exist in NEITHER cms_pages
-- NOR app/(public)/ NOR next.config.ts rewrites (the project has no root
-- middleware.ts). Each affected page is therefore served at its own flat slug
-- while declaring a canonical that 404s. Clearing restores self-canonical.
--
-- Notable individual cases:
--   our-trust      -> /about/our-trust 301s BACK to /our-trust (canonical loop
--                     through a redirect) - next.config.ts line ~408
--   seminar-hall   -> /facilities/seminar-hall 301s to '/' - next.config.ts ~823
--   our-management -> value had a LEADING SPACE (masked at render by .trim())
--   courses-offered/allied-health-sciences-courses
--                  -> target says "science" (singular), a typo
--   facilities/food-court-stationery-shop -> /facilities/food-court, never existed
--
-- Class C ('home' -> https://www.jkkn.ac.in/) and Class D (cross-domain) are
-- deliberately EXCLUDED by the explicit target list below.

UPDATE cms_seo_metadata s
SET canonical_url = NULL,
    updated_at    = now()
FROM cms_pages p
WHERE p.id = s.page_id
  AND s.canonical_url IS NOT NULL
  AND regexp_replace(btrim(s.canonical_url),
                     '^https://(www[.])?jkkn[.]ac[.]in/', '') IN (
        'facilities/ambulance-services',
        'facilities/auditorium',
        'facilities/emergency-care',
        'facilities/food-court',
        'facilities/hostel',
        'facilities/seminar-hall',
        'facilities/sports',
        'facilities/transport',
        'facilities/wi-fi-campus',
        'about/our-institutions',
        'about/our-management',
        'about/our-trust',
        'more/privacy-policy',
        'more/terms-and-conditions',
        'courses-offered/allied-health-science-courses',
        'courses-offered/arts-and-science-courses',
        'courses-offered/dental-courses',
        'courses-offered/education-courses',
        'courses-offered/engineering-courses',
        'courses-offered/nursing-courses',
        'courses-offered/pharmacy-courses'
      );


-- ============================================
-- SECTION 4b: Class C - normalize the one intentional canonical (1 row)
-- ============================================
-- slug 'home' stored 'https://www.jkkn.ac.in/'. The INTENT (canonicalize /home
-- to the site root, so it does not duplicate /) is correct and must be kept,
-- but the absolute form hard-codes the main institution's host into a column
-- that six tenants share, and it would fail the Section 6 CHECK constraint.
-- Storing '/' is semantically identical and resolves against each deployment's
-- own metadataBase. This is exactly what the Section 5 trigger now does
-- automatically for any same-host absolute value.

UPDATE cms_seo_metadata s
SET canonical_url = '/',
    updated_at    = now()
FROM cms_pages p
WHERE p.id = s.page_id
  AND btrim(s.canonical_url) IN ('https://www.jkkn.ac.in/', 'https://jkkn.ac.in/');


-- ============================================
-- SECTION 5: normalize_canonical_url (trigger function)
-- ============================================
-- Purpose: Repair rather than reject. Editors pasting a full URL out of the
--          address bar is normal behaviour, not user error - so a bare CHECK
--          that rejects would just move the friction. This trims whitespace,
--          collapses empty strings to NULL, and rewrites a same-host absolute
--          URL to its relative path so it stays host-agnostic across the six
--          institution deployments.
-- Created: 2026-08-25
-- Used by: cms_seo_metadata BEFORE INSERT OR UPDATE OF canonical_url
-- Security: SECURITY INVOKER (default) - touches only NEW on its own row
-- ============================================

CREATE OR REPLACE FUNCTION public.normalize_canonical_url()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.canonical_url IS NULL THEN
    RETURN NEW;
  END IF;

  NEW.canonical_url := btrim(NEW.canonical_url);

  IF NEW.canonical_url = '' THEN
    NEW.canonical_url := NULL;
    RETURN NEW;
  END IF;

  -- Any absolute URL on a jkkn.ac.in apex/www host becomes a relative path.
  -- Institution subdomains (dental./engg./pharmacy. ...) are intentionally NOT
  -- matched: a cross-domain canonical is a legitimate editorial choice.
  NEW.canonical_url := regexp_replace(
    NEW.canonical_url,
    '^https?://(www[.])?jkkn[.]ac[.]in',
    ''
  );

  -- A bare host with no path normalizes to the site root.
  IF NEW.canonical_url = '' THEN
    NEW.canonical_url := '/';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_canonical_url ON cms_seo_metadata;

CREATE TRIGGER trg_normalize_canonical_url
  BEFORE INSERT OR UPDATE OF canonical_url ON cms_seo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_canonical_url();

-- End of normalize_canonical_url
-- ============================================


-- ============================================
-- SECTION 6: CHECK constraint (backstop)
-- ============================================
-- The trigger does the repair; this guarantees no untrimmed or same-host
-- absolute value can survive even if the trigger is ever dropped.

ALTER TABLE cms_seo_metadata
  DROP CONSTRAINT IF EXISTS cms_seo_metadata_canonical_url_check;

ALTER TABLE cms_seo_metadata
  ADD CONSTRAINT cms_seo_metadata_canonical_url_check
  CHECK (
    canonical_url IS NULL
    OR (
      canonical_url = btrim(canonical_url)
      AND canonical_url <> ''
      AND canonical_url !~* '^https?://(www[.])?jkkn[.]ac[.]in(/|$)'
    )
  );


-- ============================================
-- SECTION 7: Post-flight verification
-- ============================================
-- Expect: zero rows.

SELECT p.slug, s.canonical_url
FROM cms_seo_metadata s
JOIN cms_pages p ON p.id = s.page_id
WHERE s.canonical_url IS NOT NULL
  AND (s.canonical_url ~* '^https?://(www[.])?jkkn[.]ac[.]in'
    OR s.canonical_url <> btrim(s.canonical_url));

-- Expect: only 'home' (-> /) and the 5 cross-domain institution rows.
SELECT p.slug, p.status, s.canonical_url
FROM cms_seo_metadata s
JOIN cms_pages p ON p.id = s.page_id
WHERE s.canonical_url IS NOT NULL
ORDER BY p.slug;


-- ============================================
-- SECTION 8: Rollback
-- ============================================
-- Restores every pre-cleanup value. Drop the trigger and constraint FIRST,
-- otherwise the same-host values are normalized/rejected on the way back in.

-- DROP TRIGGER IF EXISTS trg_normalize_canonical_url ON cms_seo_metadata;
-- ALTER TABLE cms_seo_metadata DROP CONSTRAINT IF EXISTS cms_seo_metadata_canonical_url_check;
--
-- UPDATE cms_seo_metadata s
-- SET canonical_url = b.canonical_url
-- FROM cms_seo_metadata_canonical_backup_20260825 b
-- WHERE b.id = s.id;

-- End of CMS canonical_url cleanup + drift prevention
-- ============================================
