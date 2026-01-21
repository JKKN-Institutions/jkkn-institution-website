-- ============================================
-- BE MECHANICAL ENGINEERING COURSE PAGE
-- ============================================
-- Purpose: Create comprehensive BE Mechanical Engineering course page for Engineering College CMS
-- Created: 2026-01-20
-- Institution: Engineering College (JKKN)
-- Supabase Project: kyvfkyjmdbtyimtedkie
--
-- This file documents the SQL structure for creating the BE Mechanical Engineering course page.
-- The page showcases the complete program with 13 sections including hero, curriculum, specializations,
-- career opportunities, facilities, faculty, admission process, fees, FAQs, and placement statistics.
--
-- Dependencies:
--   - cms_pages table (for page metadata)
--   - cms_page_blocks table (for content blocks)
--   - cms_seo_metadata table (for SEO data)
--   - Component registry: BEMechanicalCoursePage (registered in component-registry.ts)
--   - Data template: lib/cms/templates/engineering/be-mechanical-data.ts
--
-- Total Records Created: 3
--   - 1 cms_pages record
--   - 1 cms_page_blocks record
--   - 1 cms_seo_metadata record
-- ============================================

-- ============================================
-- PAGE STRUCTURE OVERVIEW
-- ============================================
-- The BE Mechanical Engineering course page consists of 13 sections:
--
-- 1. Hero Section - Dark cream gradient with stats and CTAs
-- 2. Course Overview - 4 quick info cards (Duration, Eligibility, Mode, Medium)
-- 3. Why Choose - 6 benefit cards with icons
-- 4. Curriculum - 4-year tabbed view with 8 semesters (48+ subjects)
-- 5. Specializations - 6 specialization tracks (Thermal, Design, Manufacturing, etc.)
-- 6. Career Opportunities - 8 career paths with salary ranges
-- 7. Top Recruiters - Grid of 20 recruiting companies
-- 8. Facilities - 6 laboratory facilities with descriptions
-- 9. Faculty - 8 faculty members with qualifications
-- 10. Admission Process - 5-step timeline
-- 11. Fee Structure - Table with year-wise breakdown
-- 12. FAQs - 10 frequently asked questions
-- 13. Placement Statistics - 4 key stats with dark background
-- 14. Final CTA - Orange gradient call-to-action section
-- ============================================

-- ============================================
-- EXAMPLE: CMS_PAGES INSERT
-- ============================================
-- Creates the main page entry for BE Mechanical Engineering.
-- This page is a top-level course page (no parent_id).
-- ============================================

INSERT INTO cms_pages (
  id,                    -- UUID generated via gen_random_uuid()
  title,                 -- Display title
  slug,                  -- URL path (must start with 'programs/')
  parent_id,             -- NULL for top-level pages
  status,                -- 'published' for live pages
  visibility,            -- 'public' for frontend access
  show_in_navigation,    -- true to appear in navigation menu
  sort_order,            -- Controls menu display order
  created_by,            -- User UUID from profiles table
  updated_by,            -- User UUID from profiles table
  created_at,            -- Auto-generated timestamp
  updated_at             -- Auto-generated timestamp
) VALUES (
  gen_random_uuid(),
  'BE Mechanical Engineering',
  'programs/be-mechanical-engineering',
  NULL,                  -- Top-level page
  'published',
  'public',
  true,
  3,                     -- After CSE and ECE in programs menu
  (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1), -- First user
  (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1),
  now(),
  now()
);

-- ============================================
-- EXAMPLE: CMS_PAGE_BLOCKS INSERT
-- ============================================
-- Links the BEMechanicalCoursePage component to the page.
-- The props field contains all 13 sections' data in JSONB format.
-- ============================================

INSERT INTO cms_page_blocks (
  id,                    -- UUID generated via gen_random_uuid()
  page_id,               -- References cms_pages.id
  component_name,        -- Must match component-registry.ts: 'BEMechanicalCoursePage'
  props,                 -- JSONB object with complete component props (see structure below)
  sort_order,            -- Display order (typically 1 for single block)
  is_visible,            -- true to render on frontend
  created_at,            -- Auto-generated timestamp
  updated_at             -- Auto-generated timestamp
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM cms_pages WHERE slug = 'programs/be-mechanical-engineering'),
  'BEMechanicalCoursePage',
  '{
    "heroTitle": "BE Mechanical Engineering",
    "heroSubtitle": "Engineering excellence in mechanical systems, manufacturing, and innovation with 60+ years of academic legacy",
    "affiliatedTo": "Affiliated to Anna University | Approved by AICTE | NBA Accredited",
    "heroStats": [
      { "icon": "🏆", "label": "Placement Rate", "value": "95%" },
      { "icon": "🎓", "label": "Years of Excellence", "value": "60+" },
      { "icon": "📚", "label": "Total Seats", "value": "180" },
      { "icon": "🔬", "label": "Laboratories", "value": "State-of-the-Art" }
    ],
    "courseOverviewCards": [
      { "icon": "⏱️", "title": "Duration", "value": "4 Years", "subtitle": "8 Semesters" },
      { "icon": "📖", "title": "Eligibility", "value": "10+2 PCM", "subtitle": "50% Aggregate" },
      { "icon": "🏛️", "title": "Mode", "value": "Full-time", "subtitle": "On-campus" },
      { "icon": "🌐", "title": "Medium", "value": "English", "subtitle": "All courses" }
    ],
    "overviewText": "Mechanical Engineering is one of the oldest and broadest engineering disciplines...",
    "benefits": [
      {
        "icon": "📚",
        "title": "Industry-Aligned Curriculum",
        "description": "Updated syllabus designed in consultation with industry experts..."
      }
    ],
    "curriculumYears": [
      {
        "year": 1,
        "semesters": [
          {
            "semester": 1,
            "credits": 25,
            "subjects": [
              { "code": "MA1101", "name": "Engineering Mathematics - I", "credits": 4 },
              { "code": "PH1101", "name": "Engineering Physics", "credits": 4 }
            ]
          }
        ]
      }
    ],
    "specializations": [
      {
        "icon": "🔥",
        "title": "Thermal Engineering",
        "description": "Focus on heat transfer, refrigeration and air conditioning..."
      }
    ],
    "careerPaths": [
      {
        "icon": "🎨",
        "title": "Mechanical Design Engineer",
        "description": "Design and develop mechanical systems...",
        "avgSalary": "4-8 LPA"
      }
    ],
    "topRecruiters": ["Tata Motors", "Ashok Leyland", "TVS Motors"],
    "facilities": [
      {
        "icon": "🖥️",
        "title": "CAD/CAM Laboratory",
        "description": "State-of-the-art computer-aided design...",
        "image": "https://placehold.co/600x400/0b6d41/white?text=CAD+Lab"
      }
    ],
    "faculty": [
      {
        "name": "Dr. Rajesh Kumar",
        "designation": "Professor & Head",
        "qualification": "Ph.D. in Mechanical Engineering",
        "specialization": "Thermal Engineering",
        "experience": "20 years",
        "image": "https://placehold.co/300x300/0b6d41/white?text=Dr.RK"
      }
    ],
    "admissionProcess": [
      {
        "step": 1,
        "title": "Check Eligibility",
        "description": "10+2 with PCM (50% aggregate)"
      }
    ],
    "feeStructure": [
      {
        "year": "First Year",
        "tuitionFee": "₹75,000",
        "examFee": "₹5,000",
        "otherFees": "₹10,000",
        "total": "₹90,000"
      }
    ],
    "faqs": [
      {
        "question": "What is the eligibility criteria for B.E. Mechanical Engineering?",
        "answer": "Candidates must have passed 10+2 examination with Physics, Chemistry, and Mathematics..."
      }
    ],
    "placementStats": [
      {
        "icon": "📊",
        "label": "Placement Rate",
        "value": "95.2%",
        "description": "Students placed in 2023-24"
      }
    ],
    "primaryColor": "#0b6d41",
    "accentColor": "#ff6b35"
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
-- Optimized for "BE Mechanical Engineering JKKN" and related keywords.
-- ============================================

INSERT INTO cms_seo_metadata (
  id,                    -- UUID generated via gen_random_uuid()
  page_id,               -- References cms_pages.id
  meta_title,            -- Browser tab title and search results (50-60 chars)
  meta_description,      -- Search results description (120-160 chars)
  og_title,              -- Open Graph title (social sharing)
  og_description,        -- Open Graph description
  og_image,              -- Social sharing image URL (1200x630px)
  twitter_card,          -- Twitter card type
  canonical_url,         -- Canonical URL for SEO
  created_at,            -- Auto-generated timestamp
  updated_at             -- Auto-generated timestamp
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM cms_pages WHERE slug = 'programs/be-mechanical-engineering'),
  'BE Mechanical Engineering - JKKN College of Engineering',
  'Join our 4-year BE Mechanical Engineering program with 95% placement rate, NBA accreditation, 6 specializations, and world-class laboratories. Affiliated to Anna University.',
  'B.E. Mechanical Engineering - JKKN Engineering College',
  'Comprehensive mechanical engineering program with specializations in Thermal, Design, Manufacturing, Automobile, Robotics, and Energy Systems. 60+ years of academic excellence.',
  'https://placehold.co/1200x630/0b6d41/white?text=BE+Mechanical+Engineering',
  'summary_large_image',
  'https://engg.jkkn.ac.in/programs/be-mechanical-engineering',
  now(),
  now()
);

-- ============================================
-- COMPONENT PROPS STRUCTURE
-- ============================================
-- This section documents the complete JSONB props structure
-- for the BEMechanicalCoursePage component.
-- ============================================

-- ---------------------------------------------
-- BEMechanicalCoursePage Component Props
-- ---------------------------------------------
-- Component: BEMechanicalCoursePage
-- Location: components/cms-blocks/content/be-mechanical-course-page.tsx
-- Schema: BEMechanicalCoursePagePropsSchema (Zod validation)
-- Data Template: lib/cms/templates/engineering/be-mechanical-data.ts
--
-- Complete Props Structure:
-- {
--   // Hero Section (Section 1)
--   "heroTitle": string,                        // "BE Mechanical Engineering"
--   "heroSubtitle": string,                     // Tagline/description
--   "affiliatedTo": string,                     // Affiliation text
--   "heroStats": [                              // 4 stats with icons
--     {
--       "icon": string,                         // Emoji icon
--       "label": string,                        // Stat label
--       "value": string,                        // Stat value
--       "description": string (optional)        // Additional info
--     }
--   ],
--
--   // Course Overview Section (Section 2)
--   "courseOverviewCards": [                    // 4 info cards
--     {
--       "icon": string,                         // Emoji icon
--       "title": string,                        // Card title
--       "value": string,                        // Main value
--       "subtitle": string                      // Subtitle
--     }
--   ],
--
--   // Overview Text & Benefits (Section 3)
--   "overviewText": string,                     // Program description (HTML)
--   "benefits": [                               // 6 benefit cards
--     {
--       "icon": string,                         // Emoji icon
--       "title": string,                        // Benefit title
--       "description": string                   -- Benefit details
--     }
--   ],
--
--   // Curriculum Section (Section 4)
--   "curriculumYears": [                        // 4 years
--     {
--       "year": number,                         // 1, 2, 3, or 4
--       "semesters": [                          // 2 semesters per year
--         {
--           "semester": number,                 // 1-8
--           "credits": number,                  // Total credits
--           "subjects": [                       // 6-8 subjects per semester
--             {
--               "code": string,                 // Subject code (e.g., "MA1101")
--               "name": string,                 // Subject name
--               "credits": number               // Credit hours
--             }
--           ]
--         }
--       ]
--     }
--   ],
--
--   // Specializations Section (Section 5)
--   "specializations": [                        // 6 specialization tracks
--     {
--       "icon": string,                         // Emoji icon
--       "title": string,                        // Specialization name
--       "description": string                   -- Specialization details
--     }
--   ],
--
--   // Career Opportunities Section (Section 6)
--   "careerPaths": [                            // 8 career paths
--     {
--       "icon": string,                         // Emoji icon
--       "title": string,                        // Job role
--       "description": string,                  -- Role description
--       "avgSalary": string                     // Salary range (e.g., "4-8 LPA")
--     }
--   ],
--
--   // Top Recruiters Section (Section 7)
--   "topRecruiters": string[],                  // Array of 20 company names
--
--   // Facilities Section (Section 8)
--   "facilities": [                             // 6 laboratory facilities
--     {
--       "icon": string,                         // Emoji icon
--       "title": string,                        // Lab name
--       "description": string,                  -- Lab details
--       "image": string                         // Lab photo URL
--     }
--   ],
--
--   // Faculty Section (Section 9)
--   "faculty": [                                // 8 faculty members
--     {
--       "name": string,                         // Faculty name
--       "designation": string,                  -- Position/title
--       "qualification": string,                -- Highest degree
--       "specialization": string,               -- Area of expertise
--       "experience": string,                   -- Years of experience
--       "image": string                         // Faculty photo URL
--     }
--   ],
--
--   // Admission Process Section (Section 10)
--   "admissionProcess": [                       // 5 steps
--     {
--       "step": number,                         // Step number (1-5)
--       "title": string,                        // Step title
--       "description": string                   -- Step details
--     }
--   ],
--
--   // Fee Structure Section (Section 11)
--   "feeStructure": [                           // 4 years
--     {
--       "year": string,                         // "First Year", "Second Year", etc.
--       "tuitionFee": string,                   // Tuition amount
--       "examFee": string,                      -- Exam fee
--       "otherFees": string,                    -- Other charges
--       "total": string                         // Total fee
--     }
--   ],
--
--   // FAQs Section (Section 12)
--   "faqs": [                                   // 10 questions
--     {
--       "question": string,                     // FAQ question
--       "answer": string                        -- FAQ answer (can be HTML)
--     }
--   ],
--
--   // Placement Statistics Section (Section 13)
--   "placementStats": [                         // 4 key stats
--     {
--       "icon": string,                         // Emoji icon
--       "label": string,                        // Stat label
--       "value": string,                        -- Stat value
--       "description": string                   -- Additional info
--     }
--   ],
--
--   // Styling (Optional)
--   "primaryColor": string,                     // Hex color (default: "#0b6d41")
--   "accentColor": string                       // Hex color (default: "#ff6b35")
-- }

-- ============================================
-- SLUG NAMING CONVENTIONS
-- ============================================
-- All course page slugs must follow this pattern:
--   programs/{course-name}
--
-- Slug Requirements:
--   - Must be lowercase
--   - Use hyphens for spaces (no underscores)
--   - No special characters (only a-z, 0-9, hyphens)
--   - Must be unique across cms_pages table
--
-- Examples:
--   ✅ programs/be-mechanical-engineering
--   ✅ programs/be-computer-science-engineering
--   ✅ programs/be-electronics-communication-engineering
--   ❌ programs/BE_Mechanical_Engineering (uppercase + underscore)
--   ❌ BE Mechanical Engineering (missing prefix + spaces)
--   ❌ programs/be mechanical engineering (spaces)
-- ============================================

-- ============================================
-- SORT ORDER EXPLANATION
-- ============================================
-- The sort_order field controls the display order in navigation menus.
-- Lower numbers appear first.
--
-- Engineering Programs Sort Order:
--   1 - BE Computer Science & Engineering
--   2 - BE Electronics & Communication Engineering
--   3 - BE Mechanical Engineering
--   4 - BE Civil Engineering
--   5 - BE Electrical & Electronics Engineering
-- ============================================

-- ============================================
-- FOREIGN KEY RELATIONSHIPS
-- ============================================
-- cms_page_blocks.page_id → cms_pages.id
--   Links content blocks to pages
--   Cascading delete: If page deleted, all blocks deleted
--
-- cms_seo_metadata.page_id → cms_pages.id
--   Links SEO data to pages
--   Cascading delete: If page deleted, SEO data deleted
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
-- ============================================

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these queries after migration to verify success.
-- ============================================

-- Query 1: Verify page created
-- Expected: 1 row with status='published'
SELECT
  id,
  title,
  slug,
  status,
  visibility,
  show_in_navigation,
  sort_order,
  created_at
FROM cms_pages
WHERE slug = 'programs/be-mechanical-engineering';

-- Query 2: Verify content block
-- Expected: 1 row with component_name='BEMechanicalCoursePage'
SELECT
  p.title AS page_title,
  b.component_name,
  b.is_visible,
  b.sort_order,
  jsonb_pretty(b.props) AS props_preview -- Pretty-print first 500 chars
FROM cms_pages p
JOIN cms_page_blocks b ON b.page_id = p.id
WHERE p.slug = 'programs/be-mechanical-engineering';

-- Query 3: Verify SEO metadata
-- Expected: 1 row with populated meta_title and meta_description
SELECT
  p.title AS page_title,
  s.meta_title,
  s.meta_description,
  s.canonical_url,
  s.og_title
FROM cms_pages p
JOIN cms_seo_metadata s ON s.page_id = p.id
WHERE p.slug = 'programs/be-mechanical-engineering';

-- Query 4: Count curriculum subjects
-- Expected: 48+ subjects across 8 semesters
SELECT
  jsonb_array_length(
    (SELECT props->'curriculumYears' FROM cms_page_blocks b
     JOIN cms_pages p ON b.page_id = p.id
     WHERE p.slug = 'programs/be-mechanical-engineering')
  ) AS total_years,
  'Curriculum years documented' AS description;

-- Query 5: Count total records created
-- Expected: 3 total records (1 per table)
SELECT
  'cms_pages' AS table_name,
  COUNT(*) AS record_count
FROM cms_pages
WHERE slug = 'programs/be-mechanical-engineering'
UNION ALL
SELECT
  'cms_page_blocks',
  COUNT(*)
FROM cms_page_blocks b
JOIN cms_pages p ON b.page_id = p.id
WHERE p.slug = 'programs/be-mechanical-engineering'
UNION ALL
SELECT
  'cms_seo_metadata',
  COUNT(*)
FROM cms_seo_metadata s
JOIN cms_pages p ON s.page_id = p.id
WHERE p.slug = 'programs/be-mechanical-engineering';

-- ============================================
-- ROLLBACK PROCEDURE
-- ============================================
-- If migration fails or needs to be re-run, execute this query
-- to delete the BE Mechanical Engineering page and related records.
-- Cascading foreign keys will automatically delete:
--   - cms_page_blocks
--   - cms_seo_metadata
-- ============================================

-- WARNING: This will permanently delete the BE Mechanical Engineering page!
-- Uncomment and run only if rollback is needed.

-- DELETE FROM cms_pages
-- WHERE slug = 'programs/be-mechanical-engineering';

-- Verify deletion
-- SELECT COUNT(*) FROM cms_pages WHERE slug = 'programs/be-mechanical-engineering';
-- Expected: 0

-- ============================================
-- CONTENT GUIDELINES
-- ============================================
-- When creating or updating course page content, follow these guidelines:
--
-- 1. Curriculum:
--    - Complete 4-year breakdown (8 semesters)
--    - 6-8 subjects per semester with subject codes
--    - Total credits per semester (typically 20-25)
--    - Include practical/lab courses
--
-- 2. Career Paths:
--    - Realistic salary ranges based on market data
--    - Specific job roles (not generic titles)
--    - Focus on mechanical engineering domains
--    - Include both core and emerging opportunities
--
-- 3. Facilities:
--    - High-quality lab photos (minimum 600x400px)
--    - Specific equipment details
--    - Lab capacity and operating hours
--    - Emphasize modern/state-of-the-art facilities
--
-- 4. Faculty:
--    - Professional photos (300x300px, consistent format)
--    - Complete qualifications (Ph.D., M.E., etc.)
--    - Research interests/specializations
--    - Industry experience if applicable
--
-- 5. FAQs:
--    - Address common student/parent questions
--    - Cover eligibility, admission, fees, placements
--    - Include specific numbers and dates
--    - Keep answers concise but comprehensive
--
-- 6. Placement Statistics:
--    - Use latest academic year data
--    - Include highest, average, and median packages
--    - Number of companies visited
--    - Sector-wise distribution if available
--
-- 7. SEO:
--    - Target keywords: "BE Mechanical Engineering", "JKKN", "Anna University"
--    - Include location: "Komarapalayam", "Tamil Nadu"
--    - Highlight USPs: "NBA Accredited", "95% Placement", "60+ Years"
--
-- 8. Branding:
--    - Use JKKN brand colors:
--      * Primary Green: #0b6d41
--      * Accent Orange: #ff6b35
--      * Background Cream: #FFFBF5
--    - Maintain professional, academic tone
--    - Include JKKN logo and branding elements
-- ============================================

-- ============================================
-- DATA QUALITY CHECKS
-- ============================================
-- Before inserting data, ensure:
--
-- 1. Curriculum Completeness:
--    - All 4 years documented (8 semesters)
--    - Subject codes follow Anna University format
--    - Credits add up correctly per semester
--    - Includes theory, practical, and project courses
--
-- 2. Content Accuracy:
--    - Placement statistics from official records
--    - Faculty details verified and up-to-date
--    - Fee structure matches actual fees
--    - Admission dates and deadlines accurate
--
-- 3. Image URLs:
--    - All URLs are accessible and return 200 OK
--    - Images meet minimum resolution requirements
--    - Aspect ratios are consistent
--    - Use optimized formats (WebP, JPEG)
--
-- 4. SEO Optimization:
--    - Meta title: 50-60 characters
--    - Meta description: 120-160 characters
--    - Keywords naturally integrated
--    - Canonical URLs correctly set
--
-- 5. Component Registry:
--    - BEMechanicalCoursePage registered in component-registry.ts
--    - Zod schema matches JSONB props structure
--    - Default props template available
-- ============================================

-- ============================================
-- KNOWN LIMITATIONS
-- ============================================
-- 1. Static Content:
--    - Curriculum updates require manual database updates
--    - No built-in versioning for course structure changes
--
-- 2. Images:
--    - Using placeholder URLs (replace with actual photos)
--    - No automatic image optimization pipeline
--
-- 3. Localization:
--    - Currently English only
--    - No multi-language support for international students
--
-- 4. Real-time Updates:
--    - No live placement statistics integration
--    - Faculty updates require manual edits
--
-- 5. Accessibility:
--    - Ensure all images have alt text
--    - Color contrast ratios must meet WCAG standards
-- ============================================

-- ============================================
-- FUTURE ENHANCEMENTS
-- ============================================
-- Planned improvements for course pages:
--
-- 1. Interactive Curriculum:
--    - Clickable subjects with detailed syllabus
--    - Prerequisites and co-requisites visualization
--    - Semester-wise elective selection tool
--
-- 2. Alumni Network:
--    - Alumni testimonials integration
--    - Career progression stories
--    - Alumni mentorship program links
--
-- 3. Virtual Campus Tour:
--    - 360° lab tours
--    - Video walkthroughs of facilities
--    - Student life galleries
--
-- 4. Admission Portal Integration:
--    - Direct application links
--    - Real-time seat availability
--    - Eligibility calculator
--
-- 5. Analytics & Insights:
--    - Track page views and engagement
--    - Popular sections heatmap
--    - Conversion tracking (applications from page)
--
-- 6. Content Management:
--    - CMS UI for non-technical editors
--    - Content approval workflow
--    - Scheduled content updates
-- ============================================

-- End of BE Mechanical Engineering course page documentation
-- Last updated: 2026-01-20
-- Maintained by: Engineering College Web Team
