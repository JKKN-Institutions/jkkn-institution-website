-- ============================================
-- Faculty departments: nav items and cards open the department PDF directly
-- ============================================
-- Purpose: Clicking a department in the Faculty dropdown (or a card on /faculty)
--          opens that department's faculty-list PDF in a new tab instead of the
--          intermediate /faculty/<dept> viewer page. The viewer pages stay published
--          (direct URL, SEO, fallback) but are no longer linked from the nav.
-- Created: 2026-10-08
-- Target:  Engineering College Supabase (kyvfkyjmdbtyimtedkie) ONLY
-- Dependencies: 37-faculty-departments-nav-and-pages.sql; PDFs in public/pdfs/faculty/;
--               nav-dropdown-item.tsx opens *.pdf external_url values in a new tab.
-- Security: Plain DML on existing tables; RLS unchanged.
-- Rollback:
--   update cms_pages set external_url = null where slug like 'faculty/%';
--   -- and re-run the departments block props from file 37 (hrefs '/faculty/<dept>').
-- ============================================

-- Step 1: nav items for the 7 departments link straight to their PDF.
update public.cms_pages
set external_url = '/pdfs/faculty/' || substring(slug from 'faculty/(.*)$') || '.pdf',
    updated_at = now()
where slug in ('faculty/cse','faculty/ece','faculty/eee','faculty/it','faculty/mech','faculty/mba','faculty/sh');

-- Step 2: department cards on the /faculty landing page link to the same PDFs.
update public.cms_page_blocks b
set props = jsonb_set(
      b.props,
      '{departments}',
      (
        select jsonb_agg(
                 jsonb_set(d.value, '{href}',
                   to_jsonb('/pdfs/faculty/' || lower(replace(d.value->>'shortName','&','')) || '.pdf'))
                 order by d.ord)
        from jsonb_array_elements(b.props->'departments') with ordinality as d(value, ord)
      )
    ),
    updated_at = now()
from public.cms_pages p
where p.id = b.page_id
  and p.slug = 'faculty'
  and b.component_name = 'FacultyDepartmentsIndex';

-- End of faculty-departments-link-to-pdf
-- ============================================
