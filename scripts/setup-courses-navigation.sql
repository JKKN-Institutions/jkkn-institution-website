-- ============================================
-- SETUP: Courses Offered Navigation Menu
-- ============================================
-- Creates a multi-level navigation menu for courses
-- matching the structure from the engineering website
-- ============================================

-- First, check if "COURSES OFFERED" already exists
-- If it exists, you should delete it first to avoid duplicates

-- Delete existing courses menu if any (uncomment to run)
-- DELETE FROM cms_nav_items WHERE label = 'COURSES OFFERED';

-- ============================================
-- Insert COURSES OFFERED (Level 0)
-- ============================================
INSERT INTO cms_nav_items (label, href, display_order, is_homepage, parent_id)
VALUES ('COURSES OFFERED', '/courses', 3, false, NULL)
RETURNING id AS courses_offered_id;

-- Save the returned ID and use it in the next queries
-- For example, if the ID is 'abc-123-def', use that below

-- ============================================
-- Insert UG Category (Level 1)
-- ============================================
INSERT INTO cms_nav_items (label, href, display_order, is_homepage, parent_id)
VALUES ('UG', '/courses/ug', 1, false, 'YOUR_COURSES_OFFERED_ID_HERE')
RETURNING id AS ug_id;

-- ============================================
-- Insert PG Category (Level 1)
-- ============================================
INSERT INTO cms_nav_items (label, href, display_order, is_homepage, parent_id)
VALUES ('PG', '/courses/pg', 2, false, 'YOUR_COURSES_OFFERED_ID_HERE')
RETURNING id AS pg_id;

-- ============================================
-- Insert UG Courses (Level 2)
-- ============================================
-- Replace YOUR_UG_ID_HERE with the actual UG ID from above

INSERT INTO cms_nav_items (label, href, display_order, is_homepage, parent_id)
VALUES
  ('B.E CSE', '/courses/ug/cse', 1, false, 'YOUR_UG_ID_HERE'),
  ('B.TECH IT', '/courses/ug/it', 2, false, 'YOUR_UG_ID_HERE'),
  ('B.E Mechanical', '/courses/ug/mechanical', 3, false, 'YOUR_UG_ID_HERE'),
  ('B.E EEE', '/courses/ug/eee', 4, false, 'YOUR_UG_ID_HERE'),
  ('B.E ECE', '/courses/ug/ece', 5, false, 'YOUR_UG_ID_HERE'),
  ('S&H', '/courses/ug/sh', 6, false, 'YOUR_UG_ID_HERE');

-- ============================================
-- Insert PG Courses (Level 2)
-- ============================================
-- Replace YOUR_PG_ID_HERE with the actual PG ID from above
-- Add your PG courses here

INSERT INTO cms_nav_items (label, href, display_order, is_homepage, parent_id)
VALUES
  ('M.E CSE', '/courses/pg/cse', 1, false, 'YOUR_PG_ID_HERE'),
  ('M.E Power Systems', '/courses/pg/power-systems', 2, false, 'YOUR_PG_ID_HERE'),
  ('MBA', '/courses/pg/mba', 3, false, 'YOUR_PG_ID_HERE');

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this to see the complete menu structure:

SELECT
  parent.label AS "Level 0 (Main)",
  child1.label AS "Level 1 (Category)",
  child2.label AS "Level 2 (Course)",
  child2.href AS "Course URL",
  child2.display_order AS "Order"
FROM cms_nav_items parent
LEFT JOIN cms_nav_items child1 ON child1.parent_id = parent.id
LEFT JOIN cms_nav_items child2 ON child2.parent_id = child1.id
WHERE parent.label = 'COURSES OFFERED'
ORDER BY child1.display_order, child2.display_order;
