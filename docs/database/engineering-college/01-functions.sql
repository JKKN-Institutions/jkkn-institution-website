-- ============================================
-- ENGINEERING COLLEGE SUPABASE FUNCTIONS
-- ============================================
-- Project: kyvfkyjmdbtyimtedkie
-- Synced from: Main Supabase (pmqodbfhsejbvfbmsfeq)
-- Last Sync: 2026-01-03
-- ============================================

-- Functions will be documented here during sync

-- ============================================
-- get_recent_activity_with_profiles
-- ============================================
-- Purpose: Fetch recent activity logs with user profile information (name, email, avatar)
-- Created: 2026-01-16
-- Modified: N/A
-- Dependencies: user_activity_logs, profiles tables
-- Used by: Recent Activity dashboard widgets, activity feeds
-- Security: SECURITY DEFINER (bypasses RLS to show all activities)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_recent_activity_with_profiles(
    activity_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    action TEXT,
    module TEXT,
    resource_type TEXT,
    created_at TIMESTAMPTZ,
    user_id UUID,
    metadata JSONB,
    user_full_name TEXT,
    user_email TEXT,
    user_avatar_url TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        ual.id,
        ual.action,
        ual.module,
        ual.resource_type,
        ual.created_at,
        ual.user_id,
        ual.metadata,
        p.full_name as user_full_name,
        p.email as user_email,
        p.avatar_url as user_avatar_url
    FROM user_activity_logs ual
    LEFT JOIN profiles p ON ual.user_id = p.id
    ORDER BY ual.created_at DESC
    LIMIT activity_limit;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_recent_activity_with_profiles(INTEGER) TO authenticated;

-- End of get_recent_activity_with_profiles
-- ============================================


-- ============================================
-- is_super_admin
-- ============================================
-- Purpose: Check if a user has the super_admin role
-- Created: 2026-01-16 (Synced from Main Supabase)
-- Modified: N/A
-- Dependencies: user_roles, roles tables
-- Used by: ALL RLS policies requiring super admin bypass
-- Security: SECURITY DEFINER (bypasses RLS to check roles)
-- CRITICAL: Required for permission system to function
-- ============================================

CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid
    AND r.name = 'super_admin'
  );
$function$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_super_admin(uuid) TO authenticated;

-- End of is_super_admin
-- ============================================


-- ============================================
-- has_permission
-- ============================================
-- Purpose: Check if a user has a specific permission (supports wildcards)
-- Created: 2026-01-16 (Synced from Main Supabase)
-- Modified: N/A
-- Dependencies: user_roles, roles, role_permissions tables
-- Used by: ALL RLS policies, middleware permission checks, Server Actions
-- Security: SECURITY DEFINER (bypasses RLS)
-- Supports: Exact match, module:*, module:resource:*, *:*:*
-- CRITICAL: Core function of RBAC permission system
-- ============================================

CREATE OR REPLACE FUNCTION public.has_permission(user_uuid uuid, required_permission text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
  required_parts := string_to_array(required_permission, ':');

  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = user_uuid
    AND (
      rp.permission = '*:*:*' OR
      (rp.permission = required_parts[1] || ':*:*') OR
      (rp.permission = required_parts[1] || ':' || required_parts[2] || ':*')
    )
  ) INTO has_perm;

  RETURN COALESCE(has_perm, false);
END;
$function$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.has_permission(uuid, text) TO authenticated;

-- End of has_permission
-- ============================================
