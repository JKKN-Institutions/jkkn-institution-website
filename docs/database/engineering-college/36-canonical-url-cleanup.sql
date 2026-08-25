-- ============================================
-- CMS canonical_url cleanup + drift prevention (Engineering College)
-- ============================================
-- Purpose: Engineering-college counterpart of
--          docs/database/main-supabase/47-canonical-url-cleanup.sql.
--          Same defect classes, same fix, different own-host.
-- Created: 2026-08-25
-- Dependencies: cms_seo_metadata, cms_pages
-- Used by: app/(public)/[...slug]/page.tsx (generateMetadata -> alternates.canonical)
--          app/actions/cms/pages.ts (updatePageSeo)
-- Security: trigger is SECURITY INVOKER (default) - it only normalizes its own row
-- ============================================
--
-- WHY THIS FILE IS NOT A VERBATIM COPY OF THE MAIN ONE
-- ----------------------------------------------------
-- The trigger and CHECK constraint must strip / forbid THE INSTITUTION'S OWN
-- host, and that host differs per Supabase project:
--
--     Main         -> jkkn.ac.in / www.jkkn.ac.in
--     Engineering  -> engg.jkkn.ac.in
--
-- The host cannot be derived inside Postgres, so it is baked into each
-- project's copy. Deliberately NOT generalised to "any *.jkkn.ac.in host",
-- because a canonical pointing at a SIBLING institution's site is a legitimate
-- editorial choice (Class D) and must survive untouched. When adding a new
-- institution, copy this file and change the two host regexes only.
--
-- AUDIT FINDINGS (Engineering Supabase, 2026-08-25) - 22 rows carried a value:
--   Class A (12): canonical == 'https://engg.jkkn.ac.in/' || slug. Redundant,
--                 and hard-codes a host into a per-tenant column. -> NULL
--   Class B  (9): canonical points to a path that exists in NEITHER cms_pages
--                 NOR app/(public)/. -> NULL
--                 8 committee pages store '/committee/<slug>' (SINGULAR) while
--                 scripts/publish-committee-pages.ts publishes them under
--                 'committees/<slug>' (PLURAL) - and neither prefix currently
--                 has a single row in cms_pages. Two of the slugs also disagree
--                 ('internal-compliant-committee' vs the script's
--                 'internal-complaint-committee'). Every one of these canonicals
--                 therefore resolves to a 404, which is the failure mode Google
--                 punishes hardest: it discards the canonical and may treat the
--                 declaring page as a soft-404.
--                 'hostel' -> '/facilities/hostel' likewise has no cms_pages row
--                 (the sibling facilities/* pages exist; this one does not).
--   Class C  (1): the homepage row (slug '') stores 'https://engg.jkkn.ac.in'.
--                 Intent is correct; the absolute form is not. -> '/'
--   Class D  (0): none in this project.
-- ============================================


-- ============================================
-- SECTION 1: Pre-flight audit
-- ============================================

SELECT
  CASE
    WHEN s.canonical_url IS NULL OR btrim(s.canonical_url) = '' THEN 'null_or_empty'
    WHEN btrim(s.canonical_url) IN ('https://engg.jkkn.ac.in/' || p.slug,
                                    '/' || p.slug)                THEN 'A_self_canonical'
    WHEN btrim(s.canonical_url) ~* '^https?://engg[.]jkkn[.]ac[.]in' THEN 'B_same_host_cross_path'
    WHEN btrim(s.canonical_url) LIKE '/%'                          THEN 'B_relative_cross_path'
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

CREATE TABLE IF NOT EXISTS cms_seo_metadata_canonical_backup_20260825 AS
SELECT s.id, s.page_id, p.slug, s.canonical_url, now() AS backed_up_at
FROM cms_seo_metadata s
JOIN cms_pages p ON p.id = s.page_id
WHERE s.canonical_url IS NOT NULL AND btrim(s.canonical_url) <> '';


-- ============================================
-- SECTION 3: Class A - clear self-canonicals (12 rows)
-- ============================================
-- Scoped by EQUALITY to the computed self URL, never by a host LIKE, so a
-- cross-path row can never be swept up by accident.

UPDATE cms_seo_metadata s
SET canonical_url = NULL,
    updated_at    = now()
FROM cms_pages p
WHERE p.id = s.page_id
  AND p.slug <> ''
  AND btrim(s.canonical_url) IN (
        'https://engg.jkkn.ac.in/' || p.slug,
        '/' || p.slug
      );


-- ============================================
-- SECTION 4: Class B - clear canonicals pointing at 404s (9 rows)
-- ============================================
-- Targets verified absent from cms_pages and app/(public)/ on 2026-08-25.
-- Clearing restores each page's self-canonical at the slug it is served from.
--
-- NOTE: this only fixes the canonical. It does NOT create the committee pages
-- the canonicals were reaching for - see the follow-up note at the end of this
-- file.

UPDATE cms_seo_metadata s
SET canonical_url = NULL,
    updated_at    = now()
FROM cms_pages p
WHERE p.id = s.page_id
  AND s.canonical_url IS NOT NULL
  AND regexp_replace(btrim(s.canonical_url),
                     '^https?://engg[.]jkkn[.]ac[.]in', '') IN (
        '/committee/anti-drug-club',
        '/committee/anti-drug-committee',
        '/committee/anti-ragging-squad',
        '/committee/grievance-and-redressal',
        '/committee/internal-compliant-committee',
        '/committee/library-advisory-committee',
        '/committee/library-committee',
        '/committee/sc-st-committee',
        '/facilities/hostel'
      );


-- ============================================
-- SECTION 4b: Class C - normalize the homepage canonical (1 row)
-- ============================================
-- Homepage row (slug '') stored the bare absolute host. '/' is semantically
-- identical, host-agnostic, and passes the Section 6 constraint.

UPDATE cms_seo_metadata s
SET canonical_url = '/',
    updated_at    = now()
FROM cms_pages p
WHERE p.id = s.page_id
  AND btrim(s.canonical_url) IN ('https://engg.jkkn.ac.in', 'https://engg.jkkn.ac.in/');


-- ============================================
-- SECTION 5: normalize_canonical_url (trigger function)
-- ============================================
-- Purpose: Repair rather than reject. Editors pasting a full URL out of the
--          address bar is normal behaviour, not user error - a bare CHECK that
--          rejects would just move the friction. Trims whitespace, collapses
--          empty to NULL, and rewrites an own-host absolute URL to a relative
--          path.
-- Created: 2026-08-25
-- Used by: cms_seo_metadata BEFORE INSERT OR UPDATE OF canonical_url
-- Security: SECURITY INVOKER (default) - touches only NEW on its own row
-- Mirrors: lib/utils/site-url.ts -> normalizeCanonicalUrl() (keep in sync)
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

  -- Own host only. Sibling institution hosts are left intact on purpose.
  NEW.canonical_url := regexp_replace(
    NEW.canonical_url,
    '^https?://engg[.]jkkn[.]ac[.]in',
    ''
  );

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

ALTER TABLE cms_seo_metadata
  DROP CONSTRAINT IF EXISTS cms_seo_metadata_canonical_url_check;

ALTER TABLE cms_seo_metadata
  ADD CONSTRAINT cms_seo_metadata_canonical_url_check
  CHECK (
    canonical_url IS NULL
    OR (
      canonical_url = btrim(canonical_url)
      AND canonical_url <> ''
      AND canonical_url !~* '^https?://engg[.]jkkn[.]ac[.]in(/|$)'
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
  AND (s.canonical_url ~* '^https?://engg[.]jkkn[.]ac[.]in'
    OR s.canonical_url <> btrim(s.canonical_url));

-- Expect: only the homepage row, '' -> '/'.
SELECT p.slug, p.status, s.canonical_url
FROM cms_seo_metadata s
JOIN cms_pages p ON p.id = s.page_id
WHERE s.canonical_url IS NOT NULL
ORDER BY p.slug;


-- ============================================
-- SECTION 8: Rollback
-- ============================================
-- Drop the trigger and constraint FIRST, otherwise own-host values are
-- normalized / rejected on the way back in.

-- DROP TRIGGER IF EXISTS trg_normalize_canonical_url ON cms_seo_metadata;
-- ALTER TABLE cms_seo_metadata DROP CONSTRAINT IF EXISTS cms_seo_metadata_canonical_url_check;
--
-- UPDATE cms_seo_metadata s
-- SET canonical_url = b.canonical_url
-- FROM cms_seo_metadata_canonical_backup_20260825 b
-- WHERE b.id = s.id;


-- ============================================
-- FOLLOW-UP (not fixed here - needs a content decision)
-- ============================================
-- The 8 committee pages are published at FLAT slugs (anti-drug-club, ...) while
-- scripts/publish-committee-pages.ts defines them under 'committees/<slug>'.
-- Clearing the canonicals makes each page correctly self-canonical at the flat
-- slug it actually serves from, which is the safe state. But the intended
-- information architecture was evidently 'committees/*'. Whoever owns that
-- decides whether to re-run the publish script and 301 the flat slugs, or keep
-- the flat slugs. Do NOT re-introduce a canonical pointing at 'committee/*'
-- (singular) either way - that prefix has never existed.

-- End of CMS canonical_url cleanup + drift prevention (Engineering College)
-- ============================================
