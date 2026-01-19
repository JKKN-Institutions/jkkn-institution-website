-- ============================================
-- ADD: Courses Offered Navigation Menu
-- ============================================
-- Creates the complete "COURSES OFFERED" menu structure
-- with UG/PG categories and course listings
-- Runs in a single transaction with automatic ID handling
-- ============================================

-- Begin transaction
BEGIN;

-- Insert main "COURSES OFFERED" menu item
WITH courses_main AS (
  INSERT INTO cms_nav_items (label, href, display_order, is_homepage, parent_id)
  VALUES ('COURSES OFFERED', '/courses', 3, false, NULL)
  RETURNING id
),
-- Insert UG category
ug_category AS (
  INSERT INTO cms_nav_items (label, href, display_order, is_homepage, parent_id)
  SELECT 'UG', '/courses/ug', 1, false, id FROM courses_main
  RETURNING id
),
-- Insert PG category
pg_category AS (
  INSERT INTO cms_nav_items (label, href, display_order, is_homepage, parent_id)
  SELECT 'PG', '/courses/pg', 2, false, id FROM courses_main
  RETURNING id
),
-- Insert UG courses
ug_courses AS (
  INSERT INTO cms_nav_items (label, href, display_order, is_homepage, parent_id)
  SELECT * FROM (VALUES
    ('B.E CSE', '/courses/ug/cse', 1, false, (SELECT id FROM ug_category)),
    ('B.TECH IT', '/courses/ug/it', 2, false, (SELECT id FROM ug_category)),
    ('B.E Mechanical', '/courses/ug/mechanical', 3, false, (SELECT id FROM ug_category)),
    ('B.E EEE', '/courses/ug/eee', 4, false, (SELECT id FROM ug_category)),
    ('B.E ECE', '/courses/ug/ece', 5, false, (SELECT id FROM ug_category)),
    ('S&H', '/courses/ug/sh', 6, false, (SELECT id FROM ug_category))
  ) AS t(label, href, display_order, is_homepage, parent_id)
  RETURNING id
),
-- Insert PG courses
pg_courses AS (
  INSERT INTO cms_nav_items (label, href, display_order, is_homepage, parent_id)
  SELECT * FROM (VALUES
    ('M.E CSE', '/courses/pg/cse', 1, false, (SELECT id FROM pg_category)),
    ('M.E Power Systems', '/courses/pg/power-systems', 2, false, (SELECT id FROM pg_category)),
    ('M.E Embedded Systems', '/courses/pg/embedded-systems', 3, false, (SELECT id FROM pg_category)),
    ('MBA', '/courses/pg/mba', 4, false, (SELECT id FROM pg_category))
  ) AS t(label, href, display_order, is_homepage, parent_id)
  RETURNING id
)
-- Return summary
SELECT
  (SELECT COUNT(*) FROM courses_main) AS "Main Menu Items Added",
  (SELECT COUNT(*) FROM ug_category) + (SELECT COUNT(*) FROM pg_category) AS "Categories Added",
  (SELECT COUNT(*) FROM ug_courses) + (SELECT COUNT(*) FROM pg_courses) AS "Courses Added";

-- Commit transaction
COMMIT;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this separately to view the complete menu structure:

SELECT
  CASE
    WHEN parent.label IS NULL THEN 'ROOT'
    ELSE parent.label
  END AS "Main Menu",
  child1.label AS "Category",
  child1.display_order AS "Cat Order",
  child2.label AS "Course",
  child2.href AS "Course URL",
  child2.display_order AS "Course Order"
FROM cms_nav_items parent
LEFT JOIN cms_nav_items child1 ON child1.parent_id = parent.id
LEFT JOIN cms_nav_items child2 ON child2.parent_id = child1.id
WHERE parent.label = 'COURSES OFFERED'
ORDER BY child1.display_order NULLS FIRST, child2.display_order NULLS FIRST;
