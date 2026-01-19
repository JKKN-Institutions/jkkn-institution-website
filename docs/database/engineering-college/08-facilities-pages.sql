-- ============================================
-- FACILITIES PAGES CREATION
-- ============================================
-- Purpose: Create 10 facility submenu pages for Engineering College CMS
-- Created: 2026-01-17
-- Institution: Engineering College (JKKN)
-- Supabase Project: kyvfkyjmdbtyimtedkie
-- Parent Page: Facilities (ID: 96f3bbba-23e2-4753-b202-0680009f6fc7)
--
-- This file documents the SQL structure for creating 10 facilities submenu pages.
-- Actual execution is performed via TypeScript script: scripts/publish-facilities-pages.ts
--
-- Dependencies:
--   - cms_pages table (parent "Facilities" page must exist)
--   - cms_page_blocks table (for content blocks)
--   - cms_seo_metadata table (for SEO data)
--   - cms_page_fab_config table (for floating action buttons)
--   - Component registry: FacilityPage, HostelPage, TransportPage
--
-- Total Records Created: 40
--   - 10 cms_pages records
--   - 10 cms_page_blocks records
--   - 10 cms_seo_metadata records
--   - 10 cms_page_fab_config records
-- ============================================

-- ============================================
-- FACILITIES LIST
-- ============================================
-- 1. Ambulance Services (FacilityPage)
-- 2. Auditorium (FacilityPage)
-- 3. Transport (TransportPage - special component with routes grid)
-- 4. Class Room (FacilityPage)
-- 5. Food Court (FacilityPage)
-- 6. Hostel (HostelPage - special component with Boys/Girls tabs)
-- 7. Library (FacilityPage)
-- 8. Seminar Hall (FacilityPage)
-- 9. Sports (FacilityPage)
-- 10. Wi-Fi Campus (FacilityPage)
-- ============================================

-- ============================================
-- EXAMPLE: CMS_PAGES INSERT
-- ============================================
-- This is a reference example for one facility.
-- Actual inserts are performed by the TypeScript script.
-- ============================================

-- Example: Ambulance Services Page
INSERT INTO cms_pages (
  id,                    -- UUID generated via gen_random_uuid()
  title,                 -- Display title
  slug,                  -- URL path (must start with 'facilities/')
  parent_id,             -- Links to Facilities parent page
  status,                -- 'published' for live pages
  visibility,            -- 'public' for frontend access
  show_in_navigation,    -- true to appear in dropdown menu
  sort_order,            -- Controls menu display order (1-10)
  created_by,            -- User UUID from profiles table
  updated_by,            -- User UUID from profiles table
  created_at,            -- Auto-generated timestamp
  updated_at             -- Auto-generated timestamp
) VALUES (
  gen_random_uuid(),
  'Ambulance Services',
  'facilities/ambulance-services',
  '96f3bbba-23e2-4753-b202-0680009f6fc7',
  'published',
  'public',
  true,
  1,
  (SELECT id FROM profiles LIMIT 1), -- Get first available user
  (SELECT id FROM profiles LIMIT 1),
  now(),
  now()
);

-- ============================================
-- EXAMPLE: CMS_PAGE_BLOCKS INSERT
-- ============================================
-- Links the component to the page with props data.
-- ============================================

INSERT INTO cms_page_blocks (
  id,                    -- UUID generated via gen_random_uuid()
  page_id,               -- References cms_pages.id
  component_name,        -- Must match component-registry.ts
  props,                 -- JSONB object with component props
  sort_order,            -- Display order (typically 1 for single block)
  is_visible,            -- true to render on frontend
  created_at,            -- Auto-generated timestamp
  updated_at             -- Auto-generated timestamp
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM cms_pages WHERE slug = 'facilities/ambulance-services'),
  'FacilityPage',
  '{
    "facilityTitle": "AMBULANCE SERVICES",
    "introduction": "<p class=\"text-lg text-gray-700 leading-relaxed\">Our state-of-the-art ambulance services provide 24/7 emergency medical care...</p>",
    "images": [
      "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800"
    ],
    "features": [
      {
        "title": "24/7 Availability",
        "description": "Round-the-clock emergency medical services for students and staff"
      },
      {
        "title": "Advanced Equipment",
        "description": "Fully equipped with modern medical devices and life-support systems"
      },
      {
        "title": "Trained Paramedics",
        "description": "Professional medical staff with emergency care certification"
      },
      {
        "title": "Rapid Response",
        "description": "Quick response time to ensure timely medical assistance"
      }
    ]
  }'::jsonb,
  1,
  true,
  now(),
  now()
);

-- ============================================
-- EXAMPLE: CMS_SEO_METADATA INSERT
-- ============================================
-- SEO optimization for search engines and social sharing.
-- ============================================

INSERT INTO cms_seo_metadata (
  id,                    -- UUID generated via gen_random_uuid()
  page_id,               -- References cms_pages.id
  meta_title,            -- Browser tab title and search results
  meta_description,      -- Search results description
  og_title,              -- Open Graph title (social sharing)
  og_description,        -- Open Graph description
  og_image,              -- Social sharing image URL
  twitter_card,          -- Twitter card type
  canonical_url,         -- Canonical URL for SEO
  created_at,            -- Auto-generated timestamp
  updated_at             -- Auto-generated timestamp
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM cms_pages WHERE slug = 'facilities/ambulance-services'),
  'Ambulance Services - JKKN College of Engineering',
  '24/7 emergency medical services with advanced equipment and trained paramedics. Ensuring student and staff safety at JKKN Engineering College.',
  'Ambulance Services - JKKN Engineering College',
  'Round-the-clock emergency medical care facility with modern equipment and professional paramedical staff.',
  'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=1200&h=630',
  'summary_large_image',
  'https://engg.jkkn.ac.in/facilities/ambulance-services',
  now(),
  now()
);

-- ============================================
-- EXAMPLE: CMS_PAGE_FAB_CONFIG INSERT
-- ============================================
-- Floating Action Button configuration for quick actions.
-- ============================================

INSERT INTO cms_page_fab_config (
  id,                    -- UUID generated via gen_random_uuid()
  page_id,               -- References cms_pages.id
  is_enabled,            -- true to show FAB
  primary_action,        -- Primary button action (JSON)
  secondary_actions,     -- Additional quick actions (JSONB array)
  position,              -- FAB position on screen
  created_at,            -- Auto-generated timestamp
  updated_at             -- Auto-generated timestamp
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM cms_pages WHERE slug = 'facilities/ambulance-services'),
  true,
  '{
    "label": "Emergency Contact",
    "icon": "phone",
    "action": "tel:+919876543210",
    "variant": "primary"
  }'::jsonb,
  '[
    {
      "label": "Request Ambulance",
      "icon": "ambulance",
      "action": "/contact?service=ambulance",
      "variant": "secondary"
    }
  ]'::jsonb,
  'bottom-right',
  now(),
  now()
);

-- ============================================
-- COMPONENT PROPS STRUCTURE
-- ============================================
-- This section documents the expected JSONB props structure
-- for each component type used in facilities pages.
-- ============================================

-- ---------------------------------------------
-- FacilityPage Component Props
-- ---------------------------------------------
-- Used by: Ambulance Services, Auditorium, Class Room, Food Court,
--          Library, Seminar Hall, Sports, Wi-Fi Campus (8 pages)
--
-- Props Structure:
-- {
--   "facilityTitle": string,              // ALL CAPS title
--   "introduction": string,                // HTML rich text
--   "images": string[],                    // Array of image URLs
--   "features": [                          // Array of feature objects
--     {
--       "title": string,                   // Feature heading
--       "description": string              // Feature details
--     }
--   ],
--   "conclusion": string (optional)        // Closing paragraph
-- }

-- ---------------------------------------------
-- HostelPage Component Props
-- ---------------------------------------------
-- Used by: Hostel (1 page)
--
-- Props Structure:
-- {
--   "facilityTitle": "HOSTEL FACILITIES",
--   "introduction": string,                // HTML rich text
--   "boysHostel": {                        // Boys hostel data
--     "images": string[],                  // Photo gallery
--     "features": [                        // Amenities list
--       {
--         "title": string,
--         "description": string
--       }
--     ],
--     "capacity": string,                  // "500 students"
--     "warden": {                          // Warden details
--       "name": string,
--       "contact": string
--     }
--   },
--   "girlsHostel": {                       // Girls hostel data
--     "images": string[],
--     "features": [...],
--     "capacity": string,
--     "warden": {...}
--   }
-- }

-- ---------------------------------------------
-- TransportPage Component Props
-- ---------------------------------------------
-- Used by: Transport (1 page)
--
-- Props Structure:
-- {
--   "facilityTitle": "TRANSPORT FACILITIES",
--   "introduction": string,                // HTML rich text
--   "busImages": string[],                 // Bus fleet photos
--   "routes": [                            // Bus routes grid
--     {
--       "routeNumber": string,             // "Route 1"
--       "from": string,                    // Starting location
--       "to": "JKKN Engineering College",
--       "stops": string[],                 // Intermediate stops
--       "timing": string,                  // "7:00 AM - 6:00 PM"
--       "frequency": string                // "Every 30 minutes"
--     }
--   ],
--   "features": [                          // Transport features
--     {
--       "title": string,
--       "description": string
--     }
--   ]
-- }

-- ============================================
-- SLUG NAMING CONVENTIONS
-- ============================================
-- All facility page slugs must follow this pattern:
--   facilities/{facility-name}
--
-- Slug Requirements:
--   - Must be lowercase
--   - Use hyphens for spaces (no underscores)
--   - No special characters (only a-z, 0-9, hyphens)
--   - Must be unique across cms_pages table
--
-- Examples:
--   ✅ facilities/ambulance-services
--   ✅ facilities/wi-fi-campus
--   ✅ facilities/class-room
--   ❌ facilities/Ambulance_Services (uppercase + underscore)
--   ❌ Ambulance Services (missing prefix)
--   ❌ facilities/ambulance services (spaces)
-- ============================================

-- ============================================
-- SORT ORDER EXPLANATION
-- ============================================
-- The sort_order field controls the display order in navigation menus.
-- Lower numbers appear first.
--
-- Facilities Sort Order:
--   1  - Ambulance Services
--   2  - Auditorium
--   3  - Transport
--   4  - Class Room
--   5  - Food Court
--   6  - Hostel
--   7  - Library
--   8  - Seminar Hall
--   9  - Sports
--   10 - Wi-Fi Campus
-- ============================================

-- ============================================
-- FOREIGN KEY RELATIONSHIPS
-- ============================================
-- cms_pages.parent_id → cms_pages.id
--   Links facility pages to "Facilities" parent page
--   Cascading delete: If parent deleted, all children deleted
--
-- cms_page_blocks.page_id → cms_pages.id
--   Links content blocks to pages
--   Cascading delete: If page deleted, all blocks deleted
--
-- cms_seo_metadata.page_id → cms_pages.id
--   Links SEO data to pages
--   Cascading delete: If page deleted, SEO data deleted
--
-- cms_page_fab_config.page_id → cms_pages.id
--   Links FAB config to pages
--   Cascading delete: If page deleted, FAB config deleted
-- ============================================

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- All CMS tables have RLS enabled with the following policies:
--
-- cms_pages:
--   - SELECT: Public access for published pages (status='published', visibility='public')
--   - INSERT/UPDATE/DELETE: Authenticated users with 'cms:pages:create/edit/delete' permissions
--
-- cms_page_blocks:
--   - SELECT: Public access for visible blocks (is_visible=true)
--   - INSERT/UPDATE/DELETE: Authenticated users with CMS permissions
--
-- cms_seo_metadata:
--   - SELECT: Public access
--   - INSERT/UPDATE/DELETE: Authenticated users with CMS permissions
--
-- cms_page_fab_config:
--   - SELECT: Public access for enabled FABs (is_enabled=true)
--   - INSERT/UPDATE/DELETE: Authenticated users with CMS permissions
-- ============================================

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these queries after script execution to verify success.
-- ============================================

-- Query 1: Verify all 10 pages created
-- Expected: 10 rows with status='published' and show_in_navigation=true
SELECT
  id,
  title,
  slug,
  status,
  show_in_navigation,
  sort_order,
  created_at
FROM cms_pages
WHERE parent_id = '96f3bbba-23e2-4753-b202-0680009f6fc7'
ORDER BY sort_order;

-- Query 2: Verify content blocks
-- Expected: 10 rows with correct component names
SELECT
  p.title AS page_title,
  b.component_name,
  b.is_visible,
  b.sort_order
FROM cms_pages p
JOIN cms_page_blocks b ON b.page_id = p.id
WHERE p.parent_id = '96f3bbba-23e2-4753-b202-0680009f6fc7'
ORDER BY p.sort_order;

-- Query 3: Verify SEO metadata
-- Expected: 10 rows with populated meta_title and meta_description
SELECT
  p.title AS page_title,
  s.meta_title,
  s.meta_description,
  s.canonical_url
FROM cms_pages p
JOIN cms_seo_metadata s ON s.page_id = p.id
WHERE p.parent_id = '96f3bbba-23e2-4753-b202-0680009f6fc7'
ORDER BY p.sort_order;

-- Query 4: Verify FAB configurations
-- Expected: 10 rows with is_enabled=true
SELECT
  p.title AS page_title,
  f.is_enabled,
  f.primary_action->>'label' AS primary_action_label,
  f.position
FROM cms_pages p
JOIN cms_page_fab_config f ON f.page_id = p.id
WHERE p.parent_id = '96f3bbba-23e2-4753-b202-0680009f6fc7'
ORDER BY p.sort_order;

-- Query 5: Count total records created
-- Expected: 40 total records (10 per table)
SELECT
  'cms_pages' AS table_name,
  COUNT(*) AS record_count
FROM cms_pages
WHERE parent_id = '96f3bbba-23e2-4753-b202-0680009f6fc7'
UNION ALL
SELECT
  'cms_page_blocks',
  COUNT(*)
FROM cms_page_blocks b
JOIN cms_pages p ON b.page_id = p.id
WHERE p.parent_id = '96f3bbba-23e2-4753-b202-0680009f6fc7'
UNION ALL
SELECT
  'cms_seo_metadata',
  COUNT(*)
FROM cms_seo_metadata s
JOIN cms_pages p ON s.page_id = p.id
WHERE p.parent_id = '96f3bbba-23e2-4753-b202-0680009f6fc7'
UNION ALL
SELECT
  'cms_page_fab_config',
  COUNT(*)
FROM cms_page_fab_config f
JOIN cms_pages p ON f.page_id = p.id
WHERE p.parent_id = '96f3bbba-23e2-4753-b202-0680009f6fc7';

-- ============================================
-- ROLLBACK PROCEDURE
-- ============================================
-- If script fails or needs to be re-run, execute this query
-- to delete all facility pages and related records.
-- Cascading foreign keys will automatically delete:
--   - cms_page_blocks
--   - cms_seo_metadata
--   - cms_page_fab_config
-- ============================================

-- WARNING: This will permanently delete all facility pages!
-- Uncomment and run only if rollback is needed.

-- DELETE FROM cms_pages
-- WHERE parent_id = '96f3bbba-23e2-4753-b202-0680009f6fc7';

-- Verify deletion
-- SELECT COUNT(*) FROM cms_pages WHERE parent_id = '96f3bbba-23e2-4753-b202-0680009f6fc7';
-- Expected: 0

-- ============================================
-- CONTENT GUIDELINES
-- ============================================
-- When creating facility page content, follow these guidelines:
--
-- 1. Images:
--    - Use 3 high-quality images per facility
--    - Minimum resolution: 800x600px
--    - Aspect ratio: 16:9 or 4:3
--    - Format: JPEG or WebP for performance
--    - Placeholder: Unsplash URLs acceptable for initial launch
--
-- 2. Introduction:
--    - 2-3 paragraphs (150-250 words)
--    - Use HTML <p> tags with Tailwind classes
--    - Highlight key benefits and unique features
--    - Professional tone, student-focused
--
-- 3. Features:
--    - 4-6 features per facility
--    - Each feature: title (3-5 words) + description (20-40 words)
--    - Focus on tangible benefits
--    - Use action-oriented language
--
-- 4. SEO:
--    - Meta title: 50-60 characters
--    - Meta description: 120-160 characters
--    - Include target keywords: "JKKN", "Engineering College", facility name
--    - OG image: 1200x630px for optimal social sharing
--
-- 5. Branding:
--    - Use JKKN brand colors:
--      * Primary Green: #0b6d41
--      * Accent Yellow: #ffde59
--    - Maintain consistent tone across all pages
--    - Include JKKN logo/branding where appropriate
-- ============================================

-- ============================================
-- KNOWN LIMITATIONS
-- ============================================
-- 1. Images are placeholders (Unsplash URLs)
--    - Replace with actual facility photos post-launch
--    - Store in Supabase Storage for better performance
--
-- 2. Content is generic template text
--    - Customize with facility-specific details
--    - Add contact information (phone, email)
--    - Include operating hours/schedules
--
-- 3. FAB actions are example links
--    - Configure actual contact numbers
--    - Set up booking/request forms
--
-- 4. No localization support
--    - Currently English only
--    - Add multi-language support in future
-- ============================================

-- ============================================
-- FUTURE ENHANCEMENTS
-- ============================================
-- Planned improvements for facilities pages:
--
-- 1. Photo Galleries:
--    - Add lightbox/modal for image viewing
--    - Support multiple image uploads per facility
--    - Video tour integration
--
-- 2. Booking System:
--    - Auditorium/Seminar Hall booking
--    - Bus seat reservation for Transport
--    - Hostel room allocation
--
-- 3. Real-time Updates:
--    - Live ambulance availability status
--    - Library seat occupancy
--    - Food Court menu updates
--
-- 4. Contact Integration:
--    - In-charge faculty details
--    - Direct messaging/inquiry forms
--    - Emergency contact quick-dial
--
-- 5. Analytics:
--    - Track facility page views
--    - Measure user engagement
--    - Identify popular facilities
-- ============================================

-- End of facilities pages documentation
-- Last updated: 2026-01-17
-- Maintained by: Engineering College Web Team
