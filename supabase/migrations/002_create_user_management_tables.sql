-- =====================================================
-- Migration 002: Create User Management Tables (USER-001)
-- =====================================================
-- This migration creates the tables required for the
-- User Management & RBAC module (Phase 1).
-- =====================================================

-- 1. ROLE_PERMISSIONS TABLE
-- Stores permissions assigned to each role
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES roles ON DELETE CASCADE NOT NULL,
  permission text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission);

-- RLS Policies for role_permissions
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view role permissions"
  ON role_permissions FOR SELECT
  USING (true);

CREATE POLICY "super_admin can manage permissions"
  ON role_permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
  );

-- 2. USER_ACTIVITY_LOGS TABLE
-- Comprehensive activity tracking for audit trail
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  action text NOT NULL,
  module text NOT NULL,
  resource_type text,
  resource_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_module ON user_activity_logs(module);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action ON user_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_resource ON user_activity_logs(resource_type, resource_id);

-- RLS Policies for user_activity_logs
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs"
  ON user_activity_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "super_admin can view all activity logs"
  ON user_activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
  );

CREATE POLICY "System can insert activity logs"
  ON user_activity_logs FOR INSERT
  WITH CHECK (true);

-- 3. SYSTEM_MODULES TABLE
-- Tracks available modules and their enabled status
CREATE TABLE IF NOT EXISTS system_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  is_enabled boolean DEFAULT false,
  route_path text,
  icon text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_system_modules_enabled ON system_modules(is_enabled);
CREATE INDEX IF NOT EXISTS idx_system_modules_order ON system_modules(order_index);

-- RLS Policies for system_modules
ALTER TABLE system_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view enabled modules"
  ON system_modules FOR SELECT
  USING (is_enabled = true);

CREATE POLICY "super_admin can view all modules"
  ON system_modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
  );

CREATE POLICY "super_admin can manage modules"
  ON system_modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
  );

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp for system_modules
DROP TRIGGER IF EXISTS update_system_modules_updated_at ON system_modules;
CREATE TRIGGER update_system_modules_updated_at
  BEFORE UPDATE ON system_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE role_permissions IS 'Permissions assigned to each role (format: module:resource:action)';
COMMENT ON TABLE user_activity_logs IS 'Comprehensive activity tracking for audit and compliance';
COMMENT ON TABLE system_modules IS 'Available system modules with enable/disable capability';

COMMENT ON COLUMN role_permissions.permission IS 'Permission string in format: module:resource:action (e.g., users:profiles:edit)';
COMMENT ON COLUMN user_activity_logs.metadata IS 'Additional context data stored as JSON';
COMMENT ON COLUMN system_modules.module_key IS 'Unique identifier for the module (e.g., users, content, dashboard)';
