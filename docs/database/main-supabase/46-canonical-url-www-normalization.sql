-- ============================================
-- ⛔ SUPERSEDED — DO NOT RUN (marked 2026-08-25)
-- ============================================
-- Replaced by: docs/database/main-supabase/47-canonical-url-cleanup.sql,
--              which has been APPLIED to Main and Engineering.
--
-- This migration was documented but never executed (all 34 apex rows were still
-- present when 47 ran). Running it now would be wrong, for two reasons:
--
--  1. WRONG DIRECTION. It rewrites apex -> www, i.e. it keeps an ABSOLUTE,
--     main-institution host in cms_seo_metadata — a table each of the six
--     tenants has its own copy of. Migration 47 instead CLEARS self-canonicals
--     so the renderer's relative fallback resolves against each deployment's
--     own metadataBase. Clearing also stops the drift recurring; rewriting the
--     host does not.
--
--  2. ONE PREMISE WAS FACTUALLY WRONG. The "Deliberately NOT touched" note
--     below calls the ~20 cross-path rows (hostel -> /facilities/hostel,
--     privacy-policy -> /more/privacy-policy, our-institutions ->
--     /about/our-institutions, …) INTENTIONAL consolidation of duplicate URLs.
--     They are not. Every one of those target paths was checked on 2026-08-25
--     against cms_pages, app/(public)/, and next.config.ts rewrites: NONE of
--     them exists. They are canonicals pointing at 404s — the most damaging
--     shape, since Google discards the canonical and may treat the declaring
--     page as a soft-404. Two were worse still: /about/our-trust 301s back to
--     the page declaring it, and /facilities/seminar-hall 301s to '/'.
--     Migration 47 clears all 21.
--
--     Root cause of those rows was NOT editors hand-typing them: the publish
--     scripts stamped them in — scripts/publish-facilities-pages.ts and
--     scripts/publish-committee-pages.ts wrote buildAbsoluteUrl(`/${slug}`),
--     and scripts/facilities-pages.sql hard-coded https://engg.jkkn.ac.in/…
--     literals. All four have since been changed to omit canonical_url.
--
-- Retained only as a record of the approach considered and rejected.
-- ============================================
--
-- Migration 46 — Normalize canonical_url to the www host (Main site)
-- ============================================
-- Purpose: Make https://www.jkkn.ac.in the single canonical host for every
--   CMS page on the Main site, eliminating a www / non-www split in
--   cms_seo_metadata.canonical_url.
--
-- Created: 2026-08-25
-- Spec: User request 2026-08-25 — "www is canonical, write the migration".
--   Follow-up to the self-canonical code fix in app/(public)/[...slug]/page.tsx
--   and app/(public)/page.tsx (same session, no migration of their own).
--
-- Background:
--   Until that code fix, alternates.canonical was emitted ONLY when an editor had
--   typed a value into the SEO panel's Canonical URL field:
--       ...(seo?.canonical_url ? { canonical: seo.canonical_url } : {})
--   33 published pages had it blank and therefore shipped NO canonical tag at all.
--   The code now falls back to a relative self-canonical, which Next.js resolves
--   against the root layout's metadataBase (app/layout.tsx:46), i.e. against
--   NEXT_PUBLIC_SITE_URL on the Main Vercel project.
--
--   That makes the host in metadataBase authoritative for the 33 repaired pages,
--   and exposes the fact that the 56 hand-entered values disagree with each other:
--       34 rows -> https://jkkn.ac.in/...        (apex, no www)
--       22 rows -> https://www.jkkn.ac.in/...    (www)
--   Mixed canonical hosts split the consolidation signal, and whichever group
--   disagrees with metadataBase points at a host that 301-redirects — a redirect
--   hop on the one hint that is supposed to be a direct answer.
--
-- Affects (DB): cms_seo_metadata.canonical_url — 35 rows, in two statements.
--
--   Statement 1 — host rewrite, 34 rows (32 published + 2 draft: faq, gallery):
--     https://jkkn.ac.in/<path>  ->  https://www.jkkn.ac.in/<path>
--     accreditation, admission-guide, ai-campus, alumni-success-stories,
--     campus-tour, careers-support, chairman-message, coimbatore,
--     community-outreach, counseling-guide, erode, events, faculty-directory,
--     faq (draft), fee-structure, gallery (draft), hospital, how-to-apply,
--     industry-partnerships, international-exchange, international-placements,
--     namakkal, news, nirf, our-colleges, recruiters, research-overview, salem,
--     scholarships, sports-activities, student-life, testimonials, tiruppur,
--     why-jkkn
--
--   Statement 2 — whitespace trim, 1 row:
--     our-management: " https://www.jkkn.ac.in/about/our-management"
--                   -> "https://www.jkkn.ac.in/about/our-management"
--     The stored value carries a LEADING SPACE, which makes it an invalid URL.
--     The code fix already calls .trim() so the rendered tag is correct today;
--     this statement fixes the stored value so the admin SEO panel stops showing
--     (and re-saving) the broken string.
--
-- Deliberately NOT touched:
--   1. Cross-canonicals — 20 rows whose canonical_url intentionally points at a
--      DIFFERENT path than their own slug (hostel -> /facilities/hostel,
--      privacy-policy -> /more/privacy-policy, our-institutions ->
--      /about/our-institutions, etc). They are already on the www host and the
--      prefix-only rewrite leaves their paths alone. These rows are the reason
--      the code fix uses `canonical_url || path` rather than an unconditional
--      self-canonical: overwriting them would un-consolidate 20 duplicate URLs.
--   2. External subdomain canonicals — 2 rows that legitimately point off-site:
--        jkkn-matriculation-higher-secondary-school -> https://school.jkkn.ac.in/
--        nattraja-vidhyalya                         -> https://nv.jkkn.ac.in/
--      The LIKE 'https://jkkn.ac.in/%' predicate cannot match these (they begin
--      'https://school.' / 'https://nv.'), so no guard clause is needed — but the
--      exclusion is intentional, not incidental.
--   3. blog_posts.canonical_url — audited, 0 rows have any value set. Nothing to
--      normalize. The blog route builds its canonical from NEXT_PUBLIC_SITE_URL
--      directly (app/(public)/blog/[slug]/page.tsx:41), so it already follows
--      whatever host metadataBase uses.
--   4. The 33 rows with canonical_url IS NULL. They are handled by the code
--      fallback and must STAY NULL — writing self-canonicals into the DB would
--      freeze today's slugs into stored absolute URLs that silently rot if a page
--      is ever moved.
--
-- Affects (code): NONE. This migration only aligns stored data with the host that
--   metadataBase already resolves to.
--
-- Prerequisite (verify before/with this migration):
--   NEXT_PUBLIC_SITE_URL on the Main Vercel project must be
--   https://www.jkkn.ac.in — NOT the apex. If it is the apex, this migration
--   inverts the problem instead of solving it: the 34 rewritten rows would then
--   disagree with the 33 code-generated canonicals. The env var is the source of
--   truth for the fallback; this migration is the data catching up to it.
--   The apex must 301 -> www at the DNS/host layer for the choice to hold.
--
-- Sync: MAIN SUPABASE ONLY. Not applied to Engineering / Dental / Pharmacy /
--   Arts / Nursing. Each institution has its own domain and its own
--   NEXT_PUBLIC_SITE_URL, and none of them use a www host — engg.jkkn.ac.in,
--   dental.jkkn.ac.in etc. are already single-host. Running this SQL against
--   those projects would be a no-op at best (no 'https://jkkn.ac.in/' values) and
--   is simply not applicable.
--
-- Rollback: see the inverse statements at the bottom of this file.
-- ============================================


-- --------------------------------------------
-- Statement 1: apex -> www host rewrite (34 rows)
-- --------------------------------------------
-- substring(... FROM 19) drops exactly the leading 'https://jkkn.ac.in' (18
-- chars) and leaves the path byte-for-byte intact. A blanket replace() would also
-- corrupt any occurrence of the host later in the string.

UPDATE cms_seo_metadata
SET canonical_url = 'https://www.jkkn.ac.in' || substring(canonical_url FROM 19),
    updated_at    = NOW()
WHERE canonical_url LIKE 'https://jkkn.ac.in/%'
   OR canonical_url = 'https://jkkn.ac.in';


-- --------------------------------------------
-- Statement 2: strip surrounding whitespace (1 row — our-management)
-- --------------------------------------------

UPDATE cms_seo_metadata
SET canonical_url = btrim(canonical_url),
    updated_at    = NOW()
WHERE canonical_url IS NOT NULL
  AND canonical_url <> btrim(canonical_url);


-- --------------------------------------------
-- Verification (expect: non_www = 0, untrimmed = 0, www = 56, subdomain = 2)
-- --------------------------------------------
-- SELECT
--   count(*) FILTER (WHERE canonical_url LIKE 'https://jkkn.ac.in%')      AS non_www,
--   count(*) FILTER (WHERE canonical_url <> btrim(canonical_url))         AS untrimmed,
--   count(*) FILTER (WHERE canonical_url LIKE 'https://www.jkkn.ac.in%')  AS www,
--   count(*) FILTER (WHERE canonical_url LIKE 'https://school.%'
--                       OR canonical_url LIKE 'https://nv.%')             AS subdomain
-- FROM cms_seo_metadata;


-- --------------------------------------------
-- Rollback (restores the apex host on the 34 rows; the trim is NOT reverted —
-- the leading space was a data-entry defect, never intended state)
-- --------------------------------------------
-- UPDATE cms_seo_metadata
-- SET canonical_url = 'https://jkkn.ac.in' || substring(canonical_url FROM 23),
--     updated_at    = NOW()
-- WHERE canonical_url LIKE 'https://www.jkkn.ac.in/%';
--   NOTE: this inverse is BROADER than the forward statement — it would also move
--   the 22 originally-www rows to the apex. Restore from a row-level backup if an
--   exact revert is required.

-- End of Migration 46
-- ============================================
