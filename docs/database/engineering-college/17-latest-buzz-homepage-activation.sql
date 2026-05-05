-- ============================================
-- 17 — Latest Buzz Homepage Activation
-- ============================================
-- Purpose: Activate the LatestBuzz CMS block on the engineering
--   homepage and seed 4 placeholder blog posts so the carousel
--   renders content from day one. Mirrors main institution site
--   styling (light cream background, simple cards, gold-italic
--   header) with an engineering-specific subtitle.
-- Created: 2026-04-27
-- Spec: docs/superpowers/specs/2026-04-27-engineering-latest-buzz-activation-design.md
-- Plan: docs/superpowers/plans/2026-04-27-engineering-latest-buzz-activation.md
-- Dependencies:
--   - cms_pages row for engineering homepage (id = 2e6304f1-2940-4e8d-8347-ee845a9aa309)
--   - blog_categories row 'latest-buzz' (id = 48e5c55d-196b-43ed-8d5c-9d905106d553, is_active=true)
--   - Existing cms_page_blocks row (id = 27031ffb-a3b6-41fb-b3f7-b619f16c2a73, sort_order=5, currently is_visible=false)
--   - blog_posts.content is jsonb with default '{}', so content column is omitted from INSERTs
-- Idempotency: blog_posts inserts use ON CONFLICT (slug) DO NOTHING.
--   cms_page_blocks UPDATE is id-scoped and idempotent.
-- Rollback: see end of file (commented out for safety).
-- ============================================

BEGIN;

-- 1) Activate the LatestBuzz block and replace its props with main-site-mirror config
UPDATE cms_page_blocks
SET is_visible = true,
    props = jsonb_build_object(
      'layout',              'carousel',
      'columns',             '3',
      'maxItems',            6,
      'subtitle',            'What''s trending at JKKN Engineering',
      'buzzItems',           '[]'::jsonb,
      'cardStyle',           'simple',
      'accentColor',         '#0b6d41',
      'headerPart1',         'Latest',
      'headerPart2',         'Buzz',
      'viewAllLink',         '/blog/category/latest-buzz',
      'categorySlug',        'latest-buzz',
      'autoplaySpeed',       3000,
      'useDynamicData',      true,
      'backgroundColor',     '#f9f9f9',
      'headerPart1Color',    '#ffde59',
      'headerPart2Color',    '#ffde59',
      'headerPart2Italic',   true,
      'showViewAllButton',   false
    ),
    updated_at = NOW()
WHERE id = '27031ffb-a3b6-41fb-b3f7-b619f16c2a73';

-- 2) Seed 4 placeholder blog posts under the 'latest-buzz' category
-- Editors will replace titles, excerpts, and featured_image via /admin/blog after upload.
-- Note: content column omitted (it is jsonb with default '{}'::jsonb).

INSERT INTO blog_posts (
  title, slug, excerpt, featured_image,
  category_id, author_id,
  status, visibility, published_at,
  is_pinned
)
VALUES
  (
    'Campus Recruitment Drive 2026 — TCS, Infosys & Wipro Onsite',
    'campus-recruitment-drive-2026',
    'Final-year students secured offers as top IT firms visited campus this placement season.',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    '48e5c55d-196b-43ed-8d5c-9d905106d553',
    'b92f8ccd-b811-4c5a-a93d-1eed2b5f4a60',
    'published', 'public', NOW(),
    false
  ),
  (
    'AICTE Innovation Cell Hackathon — Engineering Team Wins Regional Round',
    'aicte-hackathon-regional-winners',
    'Our students claimed first place at the regional AICTE Innovation Cell hackathon, advancing to nationals.',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    '48e5c55d-196b-43ed-8d5c-9d905106d553',
    'b92f8ccd-b811-4c5a-a93d-1eed2b5f4a60',
    'published', 'public', NOW(),
    false
  ),
  (
    'Industry Visit to L&T Construction Site',
    'industry-visit-lt-construction',
    'Civil and Mechanical students gained on-site exposure to large-scale infrastructure execution.',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    '48e5c55d-196b-43ed-8d5c-9d905106d553',
    'b92f8ccd-b811-4c5a-a93d-1eed2b5f4a60',
    'published', 'public', NOW(),
    false
  ),
  (
    'NIRF Engineering Ranking 2026 — JKKN in Top Tier of Tamil Nadu Colleges',
    'nirf-engineering-ranking-2026',
    'National rankings recognise consistent academic and research performance across departments.',
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    '48e5c55d-196b-43ed-8d5c-9d905106d553',
    'b92f8ccd-b811-4c5a-a93d-1eed2b5f4a60',
    'published', 'public', NOW(),
    false
  )
ON CONFLICT (slug) DO NOTHING;

COMMIT;

-- ============================================
-- ROLLBACK (run only if you need to revert)
-- ============================================
-- BEGIN;
-- UPDATE cms_page_blocks SET is_visible = false, updated_at = NOW()
-- WHERE id = '27031ffb-a3b6-41fb-b3f7-b619f16c2a73';
--
-- DELETE FROM blog_posts
-- WHERE category_id = '48e5c55d-196b-43ed-8d5c-9d905106d553'
--   AND slug IN (
--     'campus-recruitment-drive-2026',
--     'aicte-hackathon-regional-winners',
--     'industry-visit-lt-construction',
--     'nirf-engineering-ranking-2026'
--   );
-- COMMIT;
-- ============================================
-- End of 17 — Latest Buzz Homepage Activation
-- ============================================
