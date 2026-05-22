-- ============================================
-- Migration 30: Engineering Contact Page — Office Hours Consolidation
-- ============================================
-- Purpose:
--   Collapse the Engineering site's contact page office hours from THREE rows
--   (Mon-Fri / Saturday / Sunday) into TWO rows (Mon-Sat / Sunday) so the
--   working-week display matches the institution's stated business hours.
--
-- Before:
--   [
--     { "day": "Monday - Friday", "hours": "9:00 AM - 6:00 PM" },
--     { "day": "Saturday",        "hours": "9:00 AM - 6:00 PM" },
--     { "day": "Sunday",          "hours": "Closed" }
--   ]
--
-- After:
--   [
--     { "day": "Monday - Saturday", "hours": "9:00 AM - 6:00 PM" },
--     { "day": "Sunday",            "hours": "Closed" }
--   ]
--
-- Created: 2026-05-22
-- Target DB: Engineering College Supabase (kyvfkyjmdbtyimtedkie)
-- Target page slug: /contact  (page_id = 93842ed6-1cc2-4bd1-911e-5849a8156d26)
-- Target block: ContactPage   (block_id = b7430b62-8367-4030-9313-162280b3eb05)
--
-- Dependencies: cms_page_blocks.props (jsonb), cms_pages
-- Used by: components/cms-blocks/content/contact-page.tsx → officeHours prop
-- Security: standard UPDATE; runs under the migration role, no RLS bypass needed
-- Reversible: re-run with the previous 3-row payload restored in the VALUES clause
-- ============================================

UPDATE public.cms_page_blocks
SET    props      = jsonb_set(
                      props,
                      '{officeHours}',
                      '[
                        { "day": "Monday - Saturday", "hours": "9:00 AM - 6:00 PM" },
                        { "day": "Sunday",            "hours": "Closed" }
                      ]'::jsonb,
                      false  -- do not create key if missing; key already exists
                    ),
       updated_at = now()
WHERE  id             = 'b7430b62-8367-4030-9313-162280b3eb05'::uuid
  AND  page_id        = '93842ed6-1cc2-4bd1-911e-5849a8156d26'::uuid
  AND  component_name = 'ContactPage';

-- Verification query (run after migration):
--   SELECT props->'officeHours'
--   FROM   public.cms_page_blocks
--   WHERE  id = 'b7430b62-8367-4030-9313-162280b3eb05';

-- End of Migration 30
-- ============================================
