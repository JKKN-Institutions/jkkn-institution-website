-- ============================================
-- <Object or Migration Name>
-- ============================================
-- Purpose: <one-line description of what this change does>
-- Created: <YYYY-MM-DD>
-- Modified: <YYYY-MM-DD if updated>
-- Dependencies: <tables/functions this relies on>
-- Used by: <what consumes this object/data>
-- Security: <SECURITY DEFINER / INVOKER, or RLS impact; "n/a" for data seeds>
-- Institution(s): <main | engineering-college | dental | all>
-- ============================================

<SQL CODE HERE>

-- End of <Object or Migration Name>
-- ============================================


-- ----------------------------------------------------------------------------
-- WORKED EXAMPLE (new function added to 01-functions.sql)
-- ----------------------------------------------------------------------------
-- ============================================
-- get_user_permissions
-- ============================================
-- Purpose: Returns all permissions for a given user
-- Created: 2026-01-03
-- Dependencies: user_roles, role_permissions, roles
-- Used by: Permission checking in admin panel
-- Security: SECURITY DEFINER (bypasses RLS)
-- Institution(s): all
-- ============================================
--
-- CREATE OR REPLACE FUNCTION public.get_user_permissions(user_uuid UUID)
-- RETURNS TABLE (permission TEXT)
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
-- BEGIN
--   RETURN QUERY
--   SELECT DISTINCT rp.permission
--   FROM user_roles ur
--   JOIN roles r ON ur.role_id = r.id
--   JOIN role_permissions rp ON r.id = rp.role_id
--   WHERE ur.user_id = user_uuid;
-- END;
-- $$;
--
-- End of get_user_permissions
-- ============================================
