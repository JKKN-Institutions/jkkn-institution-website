-- FORWARD: www.jkkn.ac.in homepage title + meta description (unsourced 'Best College Near Erode', 'Top-ranked', 'open now').
-- MAIN Supabase project (www.jkkn.ac.in). Step 1 claims fix, 2026-11-20. Run in the SQL editor; read-only check first:
--   SELECT id, meta_title, meta_description FROM cms_seo_metadata WHERE meta_title = $t$Best College Near Erode | JKKN Institutions – Admissions 2026-27$t$ OR meta_description = $t$JKKN Institutions – Best College Near Erode offering Dental, Pharmacy & Engineering courses. Top-ranked for placements & academics. Admissions 2026 open now!$t$;
--   SELECT setting_key, setting_value FROM site_settings WHERE setting_value::text LIKE '%Best College Near Erode%';
-- Every UPDATE is guarded by the exact old text. If the title or the description is found nowhere, the transaction is rolled back.
BEGIN;
DO $do$
DECLARE n1 int; n2 int; m1 int; m2 int;
BEGIN
  UPDATE cms_seo_metadata SET meta_title = $t$JKKN Institutions, Komarapalayam | 7 Colleges and 2 Schools$t$,
         og_title = CASE WHEN og_title = $t$Best College Near Erode | JKKN Institutions – Admissions 2026-27$t$ THEN $t$JKKN Institutions, Komarapalayam | 7 Colleges and 2 Schools$t$ ELSE og_title END
   WHERE meta_title = $t$Best College Near Erode | JKKN Institutions – Admissions 2026-27$t$;
  GET DIAGNOSTICS n1 = ROW_COUNT;
  UPDATE site_settings SET setting_value = to_jsonb($t$JKKN Institutions, Komarapalayam | 7 Colleges and 2 Schools$t$::text) WHERE setting_value = to_jsonb($t$Best College Near Erode | JKKN Institutions – Admissions 2026-27$t$::text);
  GET DIAGNOSTICS n2 = ROW_COUNT;
  IF n1 + n2 = 0 THEN RAISE EXCEPTION 'homepage title: old text not found anywhere - nothing changed'; END IF;
  UPDATE cms_seo_metadata SET meta_description = $t$JKKN Institutions: 7 colleges and 2 schools on one 70-acre campus at Komarapalayam, Namakkal district, on NH-544 between Erode and Salem. Since 1952.$t$,
         og_description = CASE WHEN og_description = $t$JKKN Institutions – Best College Near Erode offering Dental, Pharmacy & Engineering courses. Top-ranked for placements & academics. Admissions 2026 open now!$t$ THEN $t$JKKN Institutions: 7 colleges and 2 schools on one 70-acre campus at Komarapalayam, Namakkal district, on NH-544 between Erode and Salem. Since 1952.$t$ ELSE og_description END,
         twitter_description = CASE WHEN twitter_description = $t$JKKN Institutions – Best College Near Erode offering Dental, Pharmacy & Engineering courses. Top-ranked for placements & academics. Admissions 2026 open now!$t$ THEN $t$JKKN Institutions: 7 colleges and 2 schools on one 70-acre campus at Komarapalayam, Namakkal district, on NH-544 between Erode and Salem. Since 1952.$t$ ELSE twitter_description END
   WHERE meta_description = $t$JKKN Institutions – Best College Near Erode offering Dental, Pharmacy & Engineering courses. Top-ranked for placements & academics. Admissions 2026 open now!$t$;
  GET DIAGNOSTICS m1 = ROW_COUNT;
  UPDATE site_settings SET setting_value = to_jsonb($t$JKKN Institutions: 7 colleges and 2 schools on one 70-acre campus at Komarapalayam, Namakkal district, on NH-544 between Erode and Salem. Since 1952.$t$::text) WHERE setting_value = to_jsonb($t$JKKN Institutions – Best College Near Erode offering Dental, Pharmacy & Engineering courses. Top-ranked for placements & academics. Admissions 2026 open now!$t$::text);
  GET DIAGNOSTICS m2 = ROW_COUNT;
  IF m1 + m2 = 0 THEN RAISE EXCEPTION 'homepage meta description: old text not found anywhere - nothing changed'; END IF;
  RAISE NOTICE 'title rows: cms % + settings %; description rows: cms % + settings %', n1, n2, m1, m2;
END $do$;
COMMIT;
