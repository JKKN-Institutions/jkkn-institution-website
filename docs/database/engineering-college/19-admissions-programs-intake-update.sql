-- ============================================
-- Engineering Admissions — Programme Intake Correction (2026-05-06)
-- ============================================
-- Purpose: Correct the intake (seat counts) for three programmes shown on
--          /admissions and /admissions/engineering on engg.jkkn.ac.in.
-- Project: Engineering College Supabase (kyvfkyjmdbtyimtedkie)
-- Table:   site_settings  (category = 'admissions', setting_key = 'admissions_programs')
-- Read by: lib/institutions/engineering/fetch-admissions.ts
-- Renders: PROGRAMS_TABLE column on the admissions page (UG/PG sections, INTAKE column)
-- Cache:   Page is statically rendered with ISR (revalidate = 86400s); a redeploy
--          forces immediate propagation, otherwise visible within 24h.
-- ============================================
-- Change Set
--   B.E Mechanical Engineering          : intake 120 → 60
--   M.E Computer Science & Engineering  : intake 60  → 12
--   M.B.A — Master of Business Admin    : intake 120 → 60
-- All other rows (CSE, EEE, ECE, B.Tech IT) remain unchanged.
-- annualFee values are preserved exactly as previously stored.
-- ============================================
-- Note: The hardcoded fallback in lib/institutions/engineering/admissions-data.ts
-- (PROGRAMS_TABLE and PROGRAMS arrays) was already updated in commit ba43f17.
-- This script brings the Supabase override row into agreement with that fallback.
-- ============================================

UPDATE site_settings
SET
  setting_value = '[
    {"level":"UG","intake":60,"duration":"4 Years","annualFee":95000,"programme":"B.E Computer Science & Engineering"},
    {"level":"UG","intake":60,"duration":"4 Years","annualFee":95000,"programme":"B.E Electrical & Electronics Engineering"},
    {"level":"UG","intake":60,"duration":"4 Years","annualFee":95000,"programme":"B.E Electronics & Communication Engineering"},
    {"level":"UG","intake":60,"duration":"4 Years","annualFee":95000,"programme":"B.E Mechanical Engineering"},
    {"level":"UG","intake":60,"duration":"4 Years","annualFee":95000,"programme":"B.Tech Information Technology"},
    {"level":"PG","intake":12,"duration":"2 Years","annualFee":85000,"programme":"M.E Computer Science & Engineering"},
    {"level":"PG","intake":60,"duration":"2 Years","annualFee":80000,"programme":"M.B.A — Master of Business Administration"}
  ]'::jsonb,
  updated_at = NOW()
WHERE category = 'admissions'
  AND setting_key = 'admissions_programs';

-- End of admissions programmes intake correction
-- ============================================
