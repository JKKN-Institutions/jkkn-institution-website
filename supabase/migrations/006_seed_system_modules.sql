-- =====================================================
-- Migration 006: Seed System Modules
-- =====================================================
-- This migration seeds the initial system modules
-- for Phase 1 of the implementation plan.
-- =====================================================

-- Insert system modules
INSERT INTO system_modules (module_key, name, description, is_enabled, route_path, icon, order_index) VALUES
  (
    'dashboard',
    'Dashboard',
    'Role-based dashboard with customizable widgets and analytics',
    true,
    '/admin/dashboard',
    'LayoutDashboard',
    0
  ),
  (
    'users',
    'User Management',
    'Manage users, roles, permissions, and activity tracking',
    true,
    '/admin/users',
    'Users',
    1
  ),
  (
    'content',
    'Content Management',
    'Create and manage pages with visual page builder, SEO, and media library',
    false,  -- Enabled in Phase 2
    '/admin/content',
    'FileText',
    2
  ),
  (
    'analytics',
    'Analytics',
    'View system analytics, user statistics, and performance metrics',
    false,  -- Enabled in Phase 3
    '/admin/analytics',
    'BarChart3',
    3
  ),
  (
    'settings',
    'System Settings',
    'Configure system-wide settings and module activation',
    true,
    '/admin/settings',
    'Settings',
    99
  )
ON CONFLICT (module_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_enabled = EXCLUDED.is_enabled,
  route_path = EXCLUDED.route_path,
  icon = EXCLUDED.icon,
  order_index = EXCLUDED.order_index;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify modules were created:
-- SELECT
--   module_key,
--   name,
--   is_enabled,
--   route_path,
--   order_index
-- FROM system_modules
-- ORDER BY order_index;

-- =====================================================
-- MODULE ACTIVATION NOTES
-- =====================================================
-- Modules should be enabled in this order:
-- Phase 0 (Current):
--   ✓ dashboard   - Enabled
--   ✓ users       - Enabled
--   ✓ settings    - Enabled
--
-- Phase 1 (Week 8-12):
--   ☐ content     - Enable after CMS implementation complete
--
-- Phase 2 (Week 13-15):
--   ☐ analytics   - Enable after dashboard widgets complete
--
-- To enable a module:
-- UPDATE system_modules SET is_enabled = true WHERE module_key = 'content';
-- =====================================================
