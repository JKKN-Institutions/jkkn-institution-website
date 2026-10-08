-- ============================================
-- Faculty department PDFs: use the short /faculty/<dept>.pdf URL
-- ============================================
-- Purpose: The department faculty-list PDFs moved from public/pdfs/faculty/<dept>.pdf
--          to public/faculty/<dept>.pdf so they are served at /faculty/<dept>.pdf.
--          Update every database reference accordingly:
--            1. nav items (cms_pages.external_url) for the 7 departments
--            2. cards on the /faculty landing page (FacultyDepartmentsIndex props)
--            3. embedded viewer pages (DepartmentFacultyPdf props.pdfUrl)
-- Created: 2026-10-08
-- Target:  Engineering College Supabase (kyvfkyjmdbtyimtedkie) ONLY
-- Dependencies: 37-, 38-faculty-departments-*.sql; code release that serves
--               /faculty/<dept>.pdf (proxy.ts pass-through + public/faculty/*.pdf).
--               APPLY ONLY AFTER THAT RELEASE IS DEPLOYED. Until then the old
--               /pdfs/faculty/<dept>.pdf URLs keep working, and afterwards they 301
--               to the new ones (next.config.ts redirect).
-- Security: Plain DML on existing tables; RLS unchanged.
-- Rollback: replace '/faculty/<dept>.pdf' back to '/pdfs/faculty/<dept>.pdf' in the same
--           three places (old URLs keep redirecting, so rollback is cosmetic).
-- ============================================

-- Step 1: nav items.
update public.cms_pages
set external_url = '/faculty/' || substring(slug from 'faculty/(.*)$') || '.pdf',
    updated_at = now()
where slug in ('faculty/cse','faculty/ece','faculty/eee','faculty/it','faculty/mech','faculty/mba','faculty/sh');

-- Step 2: landing-page cards.
update public.cms_page_blocks b
set props = jsonb_set(
      b.props,
      '{departments}',
      (
        select jsonb_agg(
                 jsonb_set(d.value, '{href}',
                   to_jsonb('/faculty/' || lower(replace(d.value->>'shortName','&','')) || '.pdf'))
                 order by d.ord)
        from jsonb_array_elements(b.props->'departments') with ordinality as d(value, ord)
      )
    ),
    updated_at = now()
from public.cms_pages p
where p.id = b.page_id
  and p.slug = 'faculty'
  and b.component_name = 'FacultyDepartmentsIndex';

-- Step 3: embedded viewer pages (/faculty/<dept>).
update public.cms_page_blocks b
set props = jsonb_set(b.props, '{pdfUrl}', to_jsonb('/faculty/' || substring(p.slug from 'faculty/(.*)$') || '.pdf')),
    updated_at = now()
from public.cms_pages p
where p.id = b.page_id
  and p.slug like 'faculty/%'
  and b.component_name = 'DepartmentFacultyPdf';

-- End of faculty-pdf-short-url
-- ============================================
