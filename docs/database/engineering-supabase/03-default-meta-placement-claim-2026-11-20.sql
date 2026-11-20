-- FORWARD: engg.jkkn.ac.in default meta description ('95%+ placement rate' - refuted by NIRF 2026, see next.config.ts note).
-- ENGINEERING Supabase project (engg.jkkn.ac.in). Step 1 claims fix, 2026-11-20. Read-only check first:
--   SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('default_meta_description','site_description');
-- Read by lib/seo/site-metadata.ts:168 (default_meta_description, else site_description). Guarded by the exact old text.
BEGIN;
DO $do$
DECLARE n int;
BEGIN
  UPDATE site_settings SET setting_value = to_jsonb($t$JKKN College of Engineering and Technology, Komarapalayam: AICTE approved, autonomous, Anna University affiliated. B.E., B.Tech, M.E., MBA. NAAC B+, TNEA 2647.$t$::text)
   WHERE setting_key IN ('default_meta_description', 'site_description') AND setting_value = to_jsonb($t$JKKN College of Engineering and Technology - AICTE approved, Anna University affiliated engineering college near Erode, Tamil Nadu. B.E., B.Tech, M.E., MBA programs with 95%+ placement rate.$t$::text);
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n = 0 THEN RAISE EXCEPTION 'engineering default meta: old text not found - nothing changed'; END IF;
  RAISE NOTICE 'rows updated: %', n;
END $do$;
COMMIT;
