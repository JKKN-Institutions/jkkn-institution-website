-- =====================================================
-- Migration 005: Seed Default Permissions
-- =====================================================
-- This migration assigns default permissions to each role.
-- Permission format: module:resource:action
-- Wildcard support: * can be used for module, resource, or action
-- =====================================================

-- First, get the role IDs (we'll use these in the INSERT)
DO $$
DECLARE
  super_admin_id uuid;
  director_id uuid;
  chair_id uuid;
  member_id uuid;
  guest_id uuid;
BEGIN
  -- Get role IDs
  SELECT id INTO super_admin_id FROM roles WHERE name = 'super_admin';
  SELECT id INTO director_id FROM roles WHERE name = 'director';
  SELECT id INTO chair_id FROM roles WHERE name = 'chair';
  SELECT id INTO member_id FROM roles WHERE name = 'member';
  SELECT id INTO guest_id FROM roles WHERE name = 'guest';

  -- ===================================
  -- SUPER_ADMIN PERMISSIONS (All Access)
  -- ===================================
  INSERT INTO role_permissions (role_id, permission) VALUES
    (super_admin_id, '*:*:*')
  ON CONFLICT (role_id, permission) DO NOTHING;

  -- ===================================
  -- DIRECTOR PERMISSIONS
  -- ===================================
  INSERT INTO role_permissions (role_id, permission) VALUES
    -- User Management
    (director_id, 'users:profiles:view'),
    (director_id, 'users:profiles:create'),
    (director_id, 'users:profiles:edit'),
    (director_id, 'users:roles:view'),
    (director_id, 'users:roles:assign'),
    (director_id, 'users:activity:view'),

    -- Content Management
    (director_id, 'content:pages:view'),
    (director_id, 'content:pages:create'),
    (director_id, 'content:pages:edit'),
    (director_id, 'content:pages:publish'),
    (director_id, 'content:media:view'),
    (director_id, 'content:media:upload'),
    (director_id, 'content:seo:edit'),

    -- Dashboard & Analytics
    (director_id, 'dashboard:view'),
    (director_id, 'dashboard:widgets:manage'),
    (director_id, 'analytics:view'),
    (director_id, 'analytics:export'),

    -- System
    (director_id, 'system:modules:view')
  ON CONFLICT (role_id, permission) DO NOTHING;

  -- ===================================
  -- CHAIR PERMISSIONS
  -- ===================================
  INSERT INTO role_permissions (role_id, permission) VALUES
    -- User Management (View Only)
    (chair_id, 'users:profiles:view'),

    -- Content Management
    (chair_id, 'content:pages:view'),
    (chair_id, 'content:pages:create'),
    (chair_id, 'content:pages:edit'),
    (chair_id, 'content:media:view'),
    (chair_id, 'content:media:upload'),

    -- Dashboard & Analytics (Limited)
    (chair_id, 'dashboard:view'),
    (chair_id, 'analytics:view'),

    -- System
    (chair_id, 'system:modules:view')
  ON CONFLICT (role_id, permission) DO NOTHING;

  -- ===================================
  -- MEMBER PERMISSIONS
  -- ===================================
  INSERT INTO role_permissions (role_id, permission) VALUES
    -- User Management (Own Profile Only)
    (member_id, 'users:profiles:view'),

    -- Content Management (View Only)
    (member_id, 'content:pages:view'),
    (member_id, 'content:media:view'),

    -- Dashboard (Basic Access)
    (member_id, 'dashboard:view'),

    -- System
    (member_id, 'system:modules:view')
  ON CONFLICT (role_id, permission) DO NOTHING;

  -- ===================================
  -- GUEST PERMISSIONS (Minimal)
  -- ===================================
  INSERT INTO role_permissions (role_id, permission) VALUES
    -- Dashboard (Read-Only)
    (guest_id, 'dashboard:view')
  ON CONFLICT (role_id, permission) DO NOTHING;

END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify permissions were created:

-- 1. Count permissions per role
-- SELECT
--   r.name,
--   r.display_name,
--   COUNT(rp.id) as permission_count
-- FROM roles r
-- LEFT JOIN role_permissions rp ON r.id = rp.role_id
-- GROUP BY r.id, r.name, r.display_name
-- ORDER BY r.name;

-- 2. View all permissions for a specific role
-- SELECT
--   r.name as role_name,
--   rp.permission
-- FROM roles r
-- JOIN role_permissions rp ON r.id = rp.role_id
-- WHERE r.name = 'director'
-- ORDER BY rp.permission;

-- 3. Test permission check function
-- SELECT has_permission(
--   (SELECT id FROM auth.users LIMIT 1),  -- Replace with actual user ID
--   'users:profiles:view'
-- );

-- =====================================================
-- PERMISSION CATALOG
-- =====================================================
-- Complete list of available permissions in the system:
--
-- USER MANAGEMENT MODULE (users:)
-- - users:profiles:view      - View user profiles
-- - users:profiles:create    - Create new users
-- - users:profiles:edit      - Edit user profiles
-- - users:profiles:delete    - Delete users
-- - users:roles:view         - View roles
-- - users:roles:create       - Create custom roles
-- - users:roles:edit         - Edit roles
-- - users:roles:delete       - Delete custom roles
-- - users:roles:assign       - Assign roles to users
-- - users:permissions:manage - Manage role permissions
-- - users:activity:view      - View user activity logs
-- - users:*:*                - All user management permissions
--
-- CONTENT MANAGEMENT MODULE (content:)
-- - content:pages:view       - View pages
-- - content:pages:create     - Create pages
-- - content:pages:edit       - Edit pages
-- - content:pages:delete     - Delete pages
-- - content:pages:publish    - Publish/unpublish pages
-- - content:media:view       - View media library
-- - content:media:upload     - Upload media files
-- - content:media:delete     - Delete media files
-- - content:seo:edit         - Edit SEO metadata
-- - content:templates:manage - Manage page templates
-- - content:*:*              - All content management permissions
--
-- DASHBOARD MODULE (dashboard:)
-- - dashboard:view           - View dashboard
-- - dashboard:widgets:add    - Add widgets
-- - dashboard:widgets:remove - Remove widgets
-- - dashboard:widgets:manage - Manage widget settings
-- - dashboard:layouts:save   - Save custom layouts
-- - dashboard:*:*            - All dashboard permissions
--
-- ANALYTICS MODULE (analytics:)
-- - analytics:view           - View analytics
-- - analytics:export         - Export analytics data
-- - analytics:*:*            - All analytics permissions
--
-- SYSTEM MODULE (system:)
-- - system:modules:view      - View system modules
-- - system:modules:enable    - Enable/disable modules
-- - system:settings:view     - View system settings
-- - system:settings:edit     - Edit system settings
-- - system:*:*               - All system permissions
--
-- WILDCARD PERMISSIONS:
-- - *:*:*                    - All permissions (super admin)
-- - module:*:*               - All permissions in a module
-- - module:resource:*        - All actions on a resource
-- =====================================================
