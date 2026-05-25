-- ============================================
-- Migration 31: Engineering Footer Map — Point to the Correct Campus
-- ============================================
-- Purpose:
--   The engineering site's footer was rendering the *generic* JKKN
--   Educational Institutions location (parent trust complex at
--   @11.26611,77.58373) instead of the J.K.K. Nattraja College of
--   Engineering and Technology campus.
--
--   Root cause: `site_settings.footer_map` was stored as
--   { "linkUrl": "", "embedUrl": "" } — both empty strings.
--   The footer reads `settings.map?.embedUrl || <hardcoded fallback>`
--   in components/public/site-footer.tsx; because empty strings are
--   falsy in JS, the `||` fell through to the parent-trust fallback
--   URL on every render.
--
--   Fix: populate footer_map with Google Maps search-query URLs that
--   resolve to the engineering college's verified place page. Using
--   search-query format (?q=…) rather than hardcoded coordinates so
--   Google's geocoder resolves the place at view time — robust to any
--   future Place-ID changes.
--
-- Before:
--   { "linkUrl": "", "embedUrl": "" }
--
-- After:
--   {
--     "embedUrl": "https://www.google.com/maps?q=J.K.K.Nattraja+College+of+Engineering+and+Technology,+Komarapalayam,+Tamil+Nadu&output=embed",
--     "linkUrl":  "https://www.google.com/maps/search/?api=1&query=J.K.K.Nattraja+College+of+Engineering+and+Technology+Komarapalayam"
--   }
--
-- Created: 2026-05-22
-- Target DB: Engineering College Supabase (kyvfkyjmdbtyimtedkie)
-- Affects:
--   - Footer "Our Location" iframe (embedUrl → iframe src; "Open in Maps"
--     control in the iframe header now opens the engineering campus)
--   - "View on Google Maps" link beneath the iframe (linkUrl)
--
-- Dependencies: site_settings table; setting_key = 'footer_map'
-- Used by: components/public/site-footer.tsx → LazyFooterMap → FooterMapEmbed
-- Security: standard UPDATE on site_settings; no RLS bypass
-- Reversible: re-run with previous value (the empty-string object)
-- ============================================

UPDATE public.site_settings
SET    setting_value = jsonb_build_object(
         'embedUrl', 'https://www.google.com/maps?q=J.K.K.Nattraja+College+of+Engineering+and+Technology,+Komarapalayam,+Tamil+Nadu&output=embed',
         'linkUrl',  'https://www.google.com/maps/search/?api=1&query=J.K.K.Nattraja+College+of+Engineering+and+Technology+Komarapalayam'
       ),
       updated_at    = now()
WHERE  setting_key = 'footer_map';

-- Verification:
--   SELECT setting_value FROM public.site_settings WHERE setting_key = 'footer_map';

-- End of Migration 31
-- ============================================
