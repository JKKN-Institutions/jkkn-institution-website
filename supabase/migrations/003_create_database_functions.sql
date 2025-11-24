-- =====================================================
-- Migration 003: Create Database Functions
-- =====================================================
-- This migration creates essential database functions
-- for permission checking and user management.
-- =====================================================

-- 1. GET_USER_PERMISSIONS FUNCTION
-- Returns all permissions for a given user (from all their roles)
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_uuid uuid)
RETURNS TABLE (permission text) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT rp.permission
  FROM user_roles ur
  JOIN role_permissions rp ON ur.role_id = rp.role_id
  WHERE ur.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. HAS_PERMISSION FUNCTION
-- Checks if a user has a specific permission
-- Supports wildcard permissions (e.g., users:*:* grants all user permissions)
CREATE OR REPLACE FUNCTION public.has_permission(
  user_uuid uuid,
  required_permission text
)
RETURNS boolean AS $$
DECLARE
  has_perm boolean;
  perm_parts text[];
  required_parts text[];
BEGIN
  -- Check if user has super_admin role (has all permissions)
  IF EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid AND r.name = 'super_admin'
  ) THEN
    RETURN true;
  END IF;

  -- Check for exact permission match
  IF EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = user_uuid
    AND rp.permission = required_permission
  ) THEN
    RETURN true;
  END IF;

  -- Check for wildcard permissions
  -- Split required permission into parts (module:resource:action)
  required_parts := string_to_array(required_permission, ':');

  -- Check if user has wildcard permission that matches
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = user_uuid
    AND (
      -- Full wildcard *:*:*
      rp.permission = '*:*:*' OR
      -- Module wildcard (e.g., users:*:*)
      (rp.permission = required_parts[1] || ':*:*') OR
      -- Module + resource wildcard (e.g., users:profiles:*)
      (rp.permission = required_parts[1] || ':' || required_parts[2] || ':*')
    )
  ) INTO has_perm;

  RETURN COALESCE(has_perm, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. GET_USER_ROLES FUNCTION
-- Returns all roles for a given user with role details
CREATE OR REPLACE FUNCTION public.get_user_roles(user_uuid uuid)
RETURNS TABLE (
  role_id uuid,
  role_name text,
  role_display_name text,
  role_description text,
  assigned_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.name,
    r.display_name,
    r.description,
    ur.assigned_at
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = user_uuid
  ORDER BY ur.assigned_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. IS_USER_GUEST_ONLY FUNCTION
-- Checks if a user only has the 'guest' role
CREATE OR REPLACE FUNCTION public.is_user_guest_only(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
  role_count integer;
  has_guest boolean;
BEGIN
  -- Count total roles
  SELECT COUNT(*) INTO role_count
  FROM user_roles ur
  WHERE ur.user_id = user_uuid;

  -- Check if user has guest role
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid AND r.name = 'guest'
  ) INTO has_guest;

  -- Return true only if user has exactly 1 role and it's 'guest'
  RETURN (role_count = 1 AND has_guest);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. GET_ROLE_USERS_COUNT FUNCTION
-- Returns count of users for each role
CREATE OR REPLACE FUNCTION public.get_role_users_count(role_uuid uuid)
RETURNS integer AS $$
DECLARE
  user_count integer;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO user_count
  FROM user_roles
  WHERE role_id = role_uuid;

  RETURN COALESCE(user_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. LOG_USER_ACTIVITY FUNCTION
-- Helper function to log user activity
-- Can be called from triggers or application code
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id uuid,
  p_action text,
  p_module text,
  p_resource_type text DEFAULT NULL,
  p_resource_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO user_activity_logs (
    user_id,
    action,
    module,
    resource_type,
    resource_id,
    metadata,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    p_user_id,
    p_action,
    p_module,
    p_resource_type,
    p_resource_id,
    p_metadata,
    p_ip_address,
    p_user_agent,
    NOW()
  ) RETURNING id INTO log_id;

  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. GET_USER_ACTIVITY_STATS FUNCTION
-- Returns activity statistics for a user
CREATE OR REPLACE FUNCTION public.get_user_activity_stats(
  user_uuid uuid,
  days_back integer DEFAULT 30
)
RETURNS TABLE (
  total_activities bigint,
  activities_by_module jsonb,
  activities_by_action jsonb,
  last_activity timestamptz
) AS $$
BEGIN
  RETURN QUERY
  WITH activity_data AS (
    SELECT
      COUNT(*) as total,
      jsonb_object_agg(module, module_count) as by_module,
      jsonb_object_agg(action, action_count) as by_action,
      MAX(created_at) as last_active
    FROM (
      SELECT
        module,
        action,
        created_at,
        COUNT(*) OVER (PARTITION BY module) as module_count,
        COUNT(*) OVER (PARTITION BY action) as action_count
      FROM user_activity_logs
      WHERE user_id = user_uuid
      AND created_at >= NOW() - (days_back || ' days')::interval
    ) sub
  )
  SELECT
    total,
    by_module,
    by_action,
    last_active
  FROM activity_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. CHECK_EMAIL_APPROVED FUNCTION
-- Checks if an email is in the approved_emails whitelist
CREATE OR REPLACE FUNCTION public.check_email_approved(user_email text)
RETURNS boolean AS $$
DECLARE
  is_approved boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM approved_emails
    WHERE email = user_email
    AND status = 'active'
  ) INTO is_approved;

  RETURN COALESCE(is_approved, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GRANT EXECUTE PERMISSIONS
-- =====================================================

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_permissions(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_guest_only(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_role_users_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_activity(uuid, text, text, text, uuid, jsonb, inet, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_activity_stats(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_email_approved(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_email_approved(text) TO anon;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION public.get_user_permissions(uuid) IS 'Returns all permissions for a user from all their roles';
COMMENT ON FUNCTION public.has_permission(uuid, text) IS 'Checks if user has a specific permission, supports wildcards';
COMMENT ON FUNCTION public.get_user_roles(uuid) IS 'Returns all roles assigned to a user with details';
COMMENT ON FUNCTION public.is_user_guest_only(uuid) IS 'Checks if user only has guest role (for access restrictions)';
COMMENT ON FUNCTION public.get_role_users_count(uuid) IS 'Returns count of users assigned to a role';
COMMENT ON FUNCTION public.log_user_activity IS 'Logs user activity for audit trail';
COMMENT ON FUNCTION public.get_user_activity_stats(uuid, integer) IS 'Returns activity statistics for a user';
COMMENT ON FUNCTION public.check_email_approved(text) IS 'Checks if email is in approved whitelist';
