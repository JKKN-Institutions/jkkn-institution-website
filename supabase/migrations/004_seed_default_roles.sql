-- =====================================================
-- Migration 004: Seed Default Roles
-- =====================================================
-- This migration seeds the 5 default system roles:
-- 1. super_admin - Full system access
-- 2. director - Chapter-level management
-- 3. chair - Vertical/department leadership
-- 4. member - Standard user access
-- 5. guest - Default role with limited access
-- =====================================================

-- Insert default roles (using ON CONFLICT to handle re-runs)
INSERT INTO roles (name, display_name, description, is_system_role) VALUES
  (
    'super_admin',
    'Super Administrator',
    'Full system access with all permissions. Can manage users, roles, permissions, and all modules.',
    true
  ),
  (
    'director',
    'Director',
    'Chapter-level management with access to user management, content management, and analytics.',
    true
  ),
  (
    'chair',
    'Chair',
    'Vertical or department leadership with access to content management and basic analytics.',
    true
  ),
  (
    'member',
    'Member',
    'Standard user with access to view content and basic dashboard features.',
    true
  ),
  (
    'guest',
    'Guest',
    'Default role assigned to new users. Limited access pending approval from Super Admin.',
    true
  )
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  is_system_role = EXCLUDED.is_system_role;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify roles were created:
-- SELECT * FROM roles ORDER BY name;
