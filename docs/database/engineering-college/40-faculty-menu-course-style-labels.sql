-- ============================================
-- Faculty menu: department labels in the course style (B.E CSE, ...)
-- ============================================
-- Purpose: The Faculty dropdown listed full department names. Use the same short
--          labels as the Courses > UG/PG menu so the two menus read alike.
--          Only cms_pages.navigation_label changes (page titles, slugs and PDFs
--          are untouched).
-- Created: 2026-10-08
-- Target:  Engineering College Supabase (kyvfkyjmdbtyimtedkie) ONLY
-- Dependencies: 37-faculty-departments-nav-and-pages.sql
-- Security: Plain DML on an existing table; RLS unchanged.
-- Rollback: set navigation_label back to the full department name:
--   faculty/cse  'Computer Science and Engineering'
--   faculty/ece  'Electronics and Communication Engineering'
--   faculty/eee  'Electrical and Electronics Engineering'
--   faculty/it   'Information Technology'
--   faculty/mech 'Mechanical Engineering'
--   faculty/mba  'Management Studies'
--   faculty/sh   'Science and Humanities'
-- ============================================

update public.cms_pages p
set navigation_label = v.label,
    updated_at = now()
from (values
  ('faculty/cse',  'B.E CSE'),
  ('faculty/ece',  'B.E ECE'),
  ('faculty/eee',  'B.E EEE'),
  ('faculty/it',   'B.TECH IT'),
  ('faculty/mech', 'B.E MECH'),
  ('faculty/mba',  'MBA'),
  ('faculty/sh',   'S&H')
) as v(slug, label)
where p.slug = v.slug;

-- End of faculty-menu-course-style-labels
-- ============================================
