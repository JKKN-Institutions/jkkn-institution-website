-- ================================================================
-- MAIN SUPABASE DATABASE FUNCTIONS
-- ================================================================
-- Project: JKKN Institution Website
-- Supabase Project ID: pmqodbfhsejbvfbmsfeq
-- Total Functions: 51
-- Last Updated: 2026-01-03
-- ================================================================
--
-- IMPORTANT: Document changes here BEFORE applying migrations!
--
-- ================================================================


-- ============================================
-- is_super_admin
-- ============================================
-- Purpose: Check if a user has the super_admin role
-- Created: Initial setup
-- Dependencies: user_roles, roles tables
-- Used by: All RLS policies that need super admin access
-- Security: SECURITY DEFINER (bypasses RLS)
-- CRITICAL: This function is essential for permission system
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

-- End of is_super_admin
-- ============================================


-- ============================================
-- has_permission
-- ============================================
-- Purpose: Check if a user has a specific permission (supports wildcards)
-- Created: Initial setup
-- Dependencies: user_roles, roles, role_permissions tables
-- Used by: Permission checks throughout the application
-- Security: SECURITY DEFINER (bypasses RLS)
-- Supports: Exact match, module:*, module:resource:*, *:*:*
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

-- End of has_permission
-- ============================================


-- ============================================
-- get_user_roles
-- ============================================
-- Purpose: Get all roles assigned to a user
-- Created: Initial setup
-- Dependencies: user_roles, roles tables
-- Used by: User profile, role management UI
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_roles(user_uuid uuid)
RETURNS TABLE(role_id uuid, role_name text, role_display_name text, role_description text, assigned_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- End of get_user_roles
-- ============================================


-- ============================================
-- get_user_permissions
-- ============================================
-- Purpose: Get all permissions for a user (via their roles)
-- Created: Initial setup
-- Dependencies: user_roles, role_permissions tables
-- Used by: Permission checks, admin UI
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_permissions(user_uuid uuid)
RETURNS TABLE(permission text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT rp.permission
  FROM user_roles ur
  JOIN role_permissions rp ON ur.role_id = rp.role_id
  WHERE ur.user_id = user_uuid;
END;
$function$;

-- End of get_user_permissions
-- ============================================


-- ============================================
-- get_dashboard_stats
-- ============================================
-- Purpose: Get dashboard statistics for admin panel
-- Created: Initial setup
-- Dependencies: cms_pages, profiles, user_activity_logs, contact_submissions
-- Used by: Admin dashboard
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
DECLARE
  result json;
  now_ts timestamptz := NOW();
  thirty_days_ago timestamptz := NOW() - interval '30 days';
  sixty_days_ago timestamptz := NOW() - interval '60 days';
  total_pages_now integer;
  total_pages_last_month integer;
  total_users_now integer;
  total_users_last_month integer;
  active_users_this_month integer;
  active_users_last_month integer;
  pending_inquiries integer;
  new_inquiries_this_month integer;
  new_inquiries_last_month integer;
BEGIN
  -- Total pages
  SELECT COUNT(*) INTO total_pages_now FROM cms_pages;
  SELECT COUNT(*) INTO total_pages_last_month FROM cms_pages WHERE created_at < thirty_days_ago;

  -- Total users
  SELECT COUNT(*) INTO total_users_now FROM profiles;
  SELECT COUNT(*) INTO total_users_last_month FROM profiles WHERE created_at < thirty_days_ago;

  -- Active users (distinct users with any activity)
  SELECT COUNT(DISTINCT user_id) INTO active_users_this_month
  FROM user_activity_logs
  WHERE created_at >= thirty_days_ago;

  SELECT COUNT(DISTINCT user_id) INTO active_users_last_month
  FROM user_activity_logs
  WHERE created_at >= sixty_days_ago AND created_at < thirty_days_ago;

  -- Pending inquiries
  SELECT COUNT(*) INTO pending_inquiries FROM contact_submissions WHERE status = 'new';
  SELECT COUNT(*) INTO new_inquiries_this_month FROM contact_submissions WHERE created_at >= thirty_days_ago;
  SELECT COUNT(*) INTO new_inquiries_last_month FROM contact_submissions WHERE created_at >= sixty_days_ago AND created_at < thirty_days_ago;

  result := json_build_object(
    'totalPages', total_pages_now,
    'totalPagesLastMonth', total_pages_last_month,
    'totalUsers', total_users_now,
    'totalUsersLastMonth', total_users_last_month,
    'activeUsers', active_users_this_month,
    'activeUsersLastMonth', active_users_last_month,
    'pendingInquiries', pending_inquiries,
    'newInquiriesThisMonth', new_inquiries_this_month,
    'newInquiriesLastMonth', new_inquiries_last_month
  );

  RETURN result;
END;
$function$;

-- End of get_dashboard_stats
-- ============================================


-- ============================================
-- get_recent_activity_with_profiles
-- ============================================
-- Purpose: Get recent user activity with profile information
-- Created: Initial setup
-- Dependencies: user_activity_logs, profiles tables
-- Used by: Admin dashboard activity feed
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_recent_activity_with_profiles(activity_limit integer DEFAULT 5)
RETURNS TABLE(id uuid, action text, module text, resource_type text, created_at timestamp with time zone, user_id uuid, metadata jsonb, user_full_name text, user_email text, user_avatar_url text)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
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
$function$;

-- End of get_recent_activity_with_profiles
-- ============================================


-- ============================================
-- check_email_approved
-- ============================================
-- Purpose: Check if an email is in the approved_emails whitelist
-- Created: Initial setup
-- Dependencies: approved_emails table
-- Used by: Authentication flow
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.check_email_approved(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- End of check_email_approved
-- ============================================


-- ============================================
-- handle_new_user
-- ============================================
-- Purpose: Trigger function to create profile and member on user signup
-- Created: Initial setup
-- Dependencies: profiles, members, user_roles, roles tables
-- Used by: auth.users INSERT trigger
-- Security: SECURITY DEFINER (bypasses RLS)
-- Note: Only assigns guest role if user has NO existing roles
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  existing_roles_count INT;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create member record
  INSERT INTO public.members (user_id, profile_id, member_id)
  VALUES (
    NEW.id,
    NEW.id,
    'MEM' || to_char(NOW(), 'YYYYMMDD') || substring(NEW.id::text from 1 for 6)
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Check if user already has roles
  SELECT COUNT(*) INTO existing_roles_count
  FROM public.user_roles
  WHERE user_id = NEW.id;

  -- Only assign default 'guest' role if user has NO roles yet
  IF existing_roles_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role_id, assigned_by)
    SELECT
      NEW.id,
      r.id,
      NEW.id
    FROM public.roles r
    WHERE r.name = 'guest'
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- End of handle_new_user
-- ============================================


-- ============================================
-- handle_user_update
-- ============================================
-- Purpose: Update profile with latest OAuth data on each login
-- Created: Initial setup
-- Dependencies: profiles table
-- Used by: auth.users UPDATE trigger
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  UPDATE public.profiles
  SET
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', full_name),
    avatar_url = COALESCE(NEW.raw_user_meta_data->>'picture', NEW.raw_user_meta_data->>'avatar_url', avatar_url),
    last_login_at = NOW(),
    updated_at = NOW()
  WHERE id = NEW.id;

  RETURN NEW;
END;
$function$;

-- End of handle_user_update
-- ============================================


-- ============================================
-- is_user_guest_only
-- ============================================
-- Purpose: Check if user only has the guest role
-- Created: Initial setup
-- Dependencies: user_roles, roles tables
-- Used by: Permission checks, UI display
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.is_user_guest_only(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  role_count integer;
  has_guest boolean;
BEGIN
  SELECT COUNT(*) INTO role_count
  FROM user_roles ur
  WHERE ur.user_id = user_uuid;

  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid AND r.name = 'guest'
  ) INTO has_guest;

  RETURN (role_count = 1 AND has_guest);
END;
$function$;

-- End of is_user_guest_only
-- ============================================


-- ============================================
-- get_role_users_count
-- ============================================
-- Purpose: Count users assigned to a specific role
-- Created: Initial setup
-- Dependencies: user_roles table
-- Used by: Role management UI
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_role_users_count(role_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  user_count integer;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO user_count
  FROM user_roles
  WHERE role_id = role_uuid;

  RETURN COALESCE(user_count, 0);
END;
$function$;

-- End of get_role_users_count
-- ============================================


-- ============================================
-- get_role_distribution
-- ============================================
-- Purpose: Get user distribution across roles
-- Created: Initial setup
-- Dependencies: roles, user_roles tables
-- Used by: Admin analytics
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_role_distribution()
RETURNS TABLE(role_id uuid, role_name text, display_name text, user_count bigint, percentage numeric)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  WITH role_counts AS (
    SELECT
      r.id AS r_role_id,
      r.name AS r_role_name,
      r.display_name AS r_display_name,
      COUNT(DISTINCT ur.user_id) AS r_user_count
    FROM roles r
    LEFT JOIN user_roles ur ON r.id = ur.role_id
    GROUP BY r.id, r.name, r.display_name
  ),
  total AS (
    SELECT NULLIF(SUM(r_user_count), 0) AS total_count FROM role_counts
  )
  SELECT
    rc.r_role_id,
    rc.r_role_name,
    rc.r_display_name,
    rc.r_user_count,
    COALESCE(ROUND((rc.r_user_count::numeric / t.total_count) * 100, 2), 0)
  FROM role_counts rc
  CROSS JOIN total t
  WHERE rc.r_user_count > 0
  ORDER BY rc.r_user_count DESC;
END;
$function$;

-- End of get_role_distribution
-- ============================================


-- ============================================
-- get_active_users_count
-- ============================================
-- Purpose: Count users active within specified days
-- Created: Initial setup
-- Dependencies: user_activity_logs table
-- Used by: Dashboard statistics
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_active_users_count(days integer DEFAULT 30)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT COALESCE(COUNT(DISTINCT user_id)::integer, 0)
  FROM user_activity_logs
  WHERE created_at >= NOW() - (days || ' days')::interval;
$function$;

-- End of get_active_users_count
-- ============================================


-- ============================================
-- log_user_activity
-- ============================================
-- Purpose: Insert a user activity log entry
-- Created: Initial setup
-- Dependencies: user_activity_logs table
-- Used by: Activity logging throughout the application
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.log_user_activity(p_user_id uuid, p_action text, p_module text, p_resource_type text DEFAULT NULL::text, p_resource_id uuid DEFAULT NULL::uuid, p_metadata jsonb DEFAULT '{}'::jsonb, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- End of log_user_activity
-- ============================================


-- ============================================
-- log_role_change
-- ============================================
-- Purpose: Log role assignment/removal changes
-- Created: Initial setup
-- Dependencies: user_role_changes table
-- Used by: user_roles table trigger
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.user_role_changes (user_id, role_id, action, changed_by)
    VALUES (NEW.user_id, NEW.role_id, 'assigned', auth.uid());
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.user_role_changes (user_id, role_id, action, changed_by)
    VALUES (OLD.user_id, OLD.role_id, 'removed', auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- End of log_role_change
-- ============================================


-- ============================================
-- get_user_stats
-- ============================================
-- Purpose: Get user statistics (total, active, inactive, blocked)
-- Created: Initial setup
-- Dependencies: profiles, members tables
-- Used by: Admin dashboard
-- Security: SECURITY INVOKER
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_stats()
RETURNS json
LANGUAGE sql
STABLE
SET search_path TO ''
AS $function$
  SELECT json_build_object(
    'total', (SELECT COUNT(*) FROM public.profiles),
    'active', (SELECT COUNT(*) FROM public.members WHERE status = 'active'),
    'inactive', (SELECT COUNT(*) FROM public.members WHERE status = 'inactive'),
    'blocked', (SELECT COUNT(*) FROM public.members WHERE status = 'suspended')
  );
$function$;

-- End of get_user_stats
-- ============================================


-- ============================================
-- get_user_growth_data
-- ============================================
-- Purpose: Get user growth data for charts
-- Created: Initial setup
-- Dependencies: profiles, user_activity_logs tables
-- Used by: Admin analytics
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_growth_data(p_start_date timestamp with time zone, p_end_date timestamp with time zone, p_group_by text DEFAULT 'day'::text)
RETURNS TABLE(period_date date, new_users bigint, active_users bigint, cumulative_total bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      date_trunc(p_group_by, p_start_date)::date,
      date_trunc(p_group_by, p_end_date)::date,
      CASE p_group_by
        WHEN 'day' THEN '1 day'::interval
        WHEN 'week' THEN '1 week'::interval
        WHEN 'month' THEN '1 month'::interval
        ELSE '1 day'::interval
      END
    )::date AS period_date
  ),
  new_users_per_period AS (
    SELECT
      date_trunc(p_group_by, created_at)::date AS period_date,
      COUNT(*) AS new_count
    FROM profiles
    WHERE created_at BETWEEN p_start_date AND p_end_date
    GROUP BY 1
  ),
  active_users_per_period AS (
    SELECT
      date_trunc(p_group_by, created_at)::date AS period_date,
      COUNT(DISTINCT user_id) AS active_count
    FROM user_activity_logs
    WHERE created_at BETWEEN p_start_date AND p_end_date
    GROUP BY 1
  ),
  base_count AS (
    SELECT COUNT(*) AS cnt FROM profiles WHERE created_at < p_start_date
  )
  SELECT
    ds.period_date,
    COALESCE(nu.new_count, 0)::bigint AS new_users,
    COALESCE(au.active_count, 0)::bigint AS active_users,
    (bc.cnt + COALESCE(SUM(nu.new_count) OVER (ORDER BY ds.period_date), 0))::bigint AS cumulative_total
  FROM date_series ds
  CROSS JOIN base_count bc
  LEFT JOIN new_users_per_period nu ON ds.period_date = nu.period_date
  LEFT JOIN active_users_per_period au ON ds.period_date = au.period_date
  ORDER BY ds.period_date;
END;
$function$;

-- End of get_user_growth_data
-- ============================================


-- ============================================
-- get_user_activity_stats
-- ============================================
-- Purpose: Get activity statistics for a specific user
-- Created: Initial setup
-- Dependencies: user_activity_logs table
-- Used by: User profile, activity tracking
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_activity_stats(user_uuid uuid, days_back integer DEFAULT 30)
RETURNS TABLE(total_activities bigint, activities_by_module jsonb, activities_by_action jsonb, last_activity timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- End of get_user_activity_stats
-- ============================================


-- ============================================
-- get_activity_by_module
-- ============================================
-- Purpose: Get activity counts grouped by module
-- Created: Initial setup
-- Dependencies: user_activity_logs table
-- Used by: Admin analytics
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_activity_by_module(p_start_date timestamp with time zone, p_end_date timestamp with time zone)
RETURNS TABLE(module text, activity_count bigint, percentage numeric)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  WITH module_counts AS (
    SELECT
      ual.module,
      COUNT(*) AS activity_count
    FROM user_activity_logs ual
    WHERE created_at BETWEEN p_start_date AND p_end_date
    GROUP BY ual.module
  ),
  total AS (
    SELECT NULLIF(SUM(activity_count), 0) AS total_count FROM module_counts
  )
  SELECT
    mc.module,
    mc.activity_count,
    COALESCE(ROUND((mc.activity_count::numeric / t.total_count) * 100, 2), 0) AS percentage
  FROM module_counts mc
  CROSS JOIN total t
  ORDER BY mc.activity_count DESC;
END;
$function$;

-- End of get_activity_by_module
-- ============================================


-- ============================================
-- get_activity_heatmap_data
-- ============================================
-- Purpose: Get activity data for heatmap visualization
-- Created: Initial setup
-- Dependencies: user_activity_logs table
-- Used by: Admin analytics
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_activity_heatmap_data(p_start_date timestamp with time zone, p_end_date timestamp with time zone, p_module text DEFAULT NULL::text)
RETURNS TABLE(activity_date date, activity_count bigint, day_of_week integer)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      p_start_date::date,
      p_end_date::date,
      '1 day'::interval
    )::date AS activity_date
  ),
  activity_counts AS (
    SELECT
      created_at::date AS activity_date,
      COUNT(*) AS activity_count
    FROM user_activity_logs
    WHERE created_at BETWEEN p_start_date AND p_end_date
      AND (p_module IS NULL OR module = p_module)
    GROUP BY 1
  )
  SELECT
    ds.activity_date,
    COALESCE(ac.activity_count, 0)::bigint AS activity_count,
    EXTRACT(DOW FROM ds.activity_date)::integer AS day_of_week
  FROM date_series ds
  LEFT JOIN activity_counts ac ON ds.activity_date = ac.activity_date
  ORDER BY ds.activity_date;
END;
$function$;

-- End of get_activity_heatmap_data
-- ============================================


-- ============================================
-- get_content_stats
-- ============================================
-- Purpose: Get CMS content statistics
-- Created: Initial setup
-- Dependencies: cms_pages table
-- Used by: Admin dashboard, CMS analytics
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_content_stats(p_start_date timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_date timestamp with time zone DEFAULT NULL::timestamp with time zone)
RETURNS TABLE(total_pages bigint, published_pages bigint, draft_pages bigint, archived_pages bigint, scheduled_pages bigint, pages_created_in_period bigint, pages_published_in_period bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint AS total_pages,
    COUNT(*) FILTER (WHERE status = 'published')::bigint AS published_pages,
    COUNT(*) FILTER (WHERE status = 'draft')::bigint AS draft_pages,
    COUNT(*) FILTER (WHERE status = 'archived')::bigint AS archived_pages,
    COUNT(*) FILTER (WHERE status = 'scheduled')::bigint AS scheduled_pages,
    COUNT(*) FILTER (WHERE p_start_date IS NOT NULL AND created_at BETWEEN p_start_date AND COALESCE(p_end_date, NOW()))::bigint AS pages_created_in_period,
    COUNT(*) FILTER (WHERE p_start_date IS NOT NULL AND published_at BETWEEN p_start_date AND COALESCE(p_end_date, NOW()))::bigint AS pages_published_in_period
  FROM cms_pages;
END;
$function$;

-- End of get_content_stats
-- ============================================


-- ============================================
-- get_next_page_version_number
-- ============================================
-- Purpose: Get the next version number for a CMS page
-- Created: Initial setup
-- Dependencies: cms_page_versions table
-- Used by: CMS page versioning
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_next_page_version_number(p_page_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM public.cms_page_versions
  WHERE page_id = p_page_id;

  RETURN next_version;
END;
$function$;

-- End of get_next_page_version_number
-- ============================================


-- ============================================
-- get_pageview_stats
-- ============================================
-- Purpose: Get page view statistics for analytics
-- Created: Initial setup
-- Dependencies: page_views table
-- Used by: Public site analytics
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_pageview_stats(p_start_date date, p_end_date date)
RETURNS TABLE(view_date date, total_views bigint, unique_visitors bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    (pv.created_at AT TIME ZONE 'UTC')::DATE as view_date,
    COUNT(*)::BIGINT as total_views,
    COUNT(DISTINCT pv.visitor_id)::BIGINT as unique_visitors
  FROM page_views pv
  WHERE pv.created_at >= p_start_date::TIMESTAMPTZ
    AND pv.created_at < (p_end_date + 1)::TIMESTAMPTZ
  GROUP BY (pv.created_at AT TIME ZONE 'UTC')::DATE
  ORDER BY view_date ASC;
END;
$function$;

-- End of get_pageview_stats
-- ============================================


-- ============================================
-- get_top_public_pages
-- ============================================
-- Purpose: Get most viewed public pages
-- Created: Initial setup
-- Dependencies: page_views table
-- Used by: Public site analytics
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_top_public_pages(p_start_date date, p_end_date date, p_limit integer DEFAULT 10)
RETURNS TABLE(page_path text, page_title text, view_count bigint, unique_visitors bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    pv.page_path,
    MAX(pv.page_title) as page_title,
    COUNT(*)::BIGINT as view_count,
    COUNT(DISTINCT pv.visitor_id)::BIGINT as unique_visitors
  FROM page_views pv
  WHERE pv.created_at >= p_start_date::TIMESTAMPTZ
    AND pv.created_at < (p_end_date + 1)::TIMESTAMPTZ
  GROUP BY pv.page_path
  ORDER BY view_count DESC
  LIMIT p_limit;
END;
$function$;

-- End of get_top_public_pages
-- ============================================


-- ============================================
-- get_traffic_sources
-- ============================================
-- Purpose: Get traffic sources for analytics
-- Created: Initial setup
-- Dependencies: page_views table
-- Used by: Public site analytics
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_traffic_sources(p_start_date date, p_end_date date, p_limit integer DEFAULT 10)
RETURNS TABLE(referrer_domain text, visit_count bigint, percentage numeric)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  total_count BIGINT;
BEGIN
  SELECT COUNT(*) INTO total_count
  FROM page_views pv
  WHERE pv.created_at >= p_start_date::TIMESTAMPTZ
    AND pv.created_at < (p_end_date + 1)::TIMESTAMPTZ;

  RETURN QUERY
  SELECT
    CASE
      WHEN pv.referrer IS NULL OR pv.referrer = '' THEN 'Direct'
      ELSE COALESCE(
        SUBSTRING(pv.referrer FROM 'https?://([^/]+)'),
        pv.referrer
      )
    END as referrer_domain,
    COUNT(*)::BIGINT as visit_count,
    CASE
      WHEN total_count > 0 THEN ROUND((COUNT(*)::NUMERIC / total_count) * 100, 2)
      ELSE 0
    END as percentage
  FROM page_views pv
  WHERE pv.created_at >= p_start_date::TIMESTAMPTZ
    AND pv.created_at < (p_end_date + 1)::TIMESTAMPTZ
  GROUP BY
    CASE
      WHEN pv.referrer IS NULL OR pv.referrer = '' THEN 'Direct'
      ELSE COALESCE(
        SUBSTRING(pv.referrer FROM 'https?://([^/]+)'),
        pv.referrer
      )
    END
  ORDER BY visit_count DESC
  LIMIT p_limit;
END;
$function$;

-- End of get_traffic_sources
-- ============================================


-- ============================================
-- get_visitor_overview
-- ============================================
-- Purpose: Get visitor overview statistics
-- Created: Initial setup
-- Dependencies: page_views table
-- Used by: Public site analytics dashboard
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_visitor_overview(p_start_date date, p_end_date date)
RETURNS TABLE(total_pageviews bigint, unique_visitors bigint, avg_views_per_day numeric, top_page text, top_referrer text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  days_count INT;
BEGIN
  days_count := p_end_date - p_start_date + 1;

  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_pageviews,
    COUNT(DISTINCT pv.visitor_id)::BIGINT as unique_visitors,
    ROUND(COUNT(*)::NUMERIC / GREATEST(days_count, 1), 2) as avg_views_per_day,
    (
      SELECT sub.page_path
      FROM page_views sub
      WHERE sub.created_at >= p_start_date::TIMESTAMPTZ
        AND sub.created_at < (p_end_date + 1)::TIMESTAMPTZ
      GROUP BY sub.page_path
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as top_page,
    (
      SELECT COALESCE(
        SUBSTRING(sub.referrer FROM 'https?://([^/]+)'),
        'Direct'
      )
      FROM page_views sub
      WHERE sub.created_at >= p_start_date::TIMESTAMPTZ
        AND sub.created_at < (p_end_date + 1)::TIMESTAMPTZ
        AND sub.referrer IS NOT NULL AND sub.referrer != ''
      GROUP BY sub.referrer
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as top_referrer
  FROM page_views pv
  WHERE pv.created_at >= p_start_date::TIMESTAMPTZ
    AND pv.created_at < (p_end_date + 1)::TIMESTAMPTZ;
END;
$function$;

-- End of get_visitor_overview
-- ============================================


-- ============================================
-- check_duplicate_admission_inquiry
-- ============================================
-- Purpose: Check for duplicate admission inquiries
-- Created: Initial setup
-- Dependencies: admission_inquiries table
-- Used by: Admission form submission
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.check_duplicate_admission_inquiry(p_email text, p_mobile text, p_college text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admission_inquiries
    WHERE email = p_email
    AND mobile_number = p_mobile
    AND college_name = p_college
    AND created_at > now() - interval '30 days'
  );
END;
$function$;

-- End of check_duplicate_admission_inquiry
-- ============================================


-- ============================================
-- generate_admission_reference_number
-- ============================================
-- Purpose: Generate unique reference number for admission inquiries
-- Created: Initial setup
-- Dependencies: admission_inquiries table
-- Used by: Admission form submission trigger
-- Security: SECURITY INVOKER
-- ============================================

CREATE OR REPLACE FUNCTION public.generate_admission_reference_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;

  SELECT COALESCE(MAX(SUBSTRING(reference_number FROM 15)::INTEGER), 0) + 1
  INTO sequence_num
  FROM admission_inquiries
  WHERE reference_number LIKE 'JKKN-ADM-' || year_part || '-%';

  NEW.reference_number := 'JKKN-ADM-' || year_part || '-' || LPAD(sequence_num::TEXT, 5, '0');
  RETURN NEW;
END;
$function$;

-- End of generate_admission_reference_number
-- ============================================


-- ============================================
-- get_admission_inquiry_stats_by_college
-- ============================================
-- Purpose: Get admission inquiry statistics grouped by college
-- Created: Initial setup
-- Dependencies: admission_inquiries table
-- Used by: Admin analytics
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_admission_inquiry_stats_by_college()
RETURNS TABLE(college_name text, total_count bigint, new_count bigint, contacted_count bigint, admitted_count bigint, rejected_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    ai.college_name,
    COUNT(*)::bigint as total_count,
    COUNT(*) FILTER (WHERE ai.status = 'new')::bigint as new_count,
    COUNT(*) FILTER (WHERE ai.status = 'contacted')::bigint as contacted_count,
    COUNT(*) FILTER (WHERE ai.status = 'admitted')::bigint as admitted_count,
    COUNT(*) FILTER (WHERE ai.status = 'rejected')::bigint as rejected_count
  FROM admission_inquiries ai
  GROUP BY ai.college_name
  ORDER BY total_count DESC;
END;
$function$;

-- End of get_admission_inquiry_stats_by_college
-- ============================================


-- ============================================
-- Blog and Comment Functions
-- ============================================

CREATE OR REPLACE FUNCTION public.get_next_blog_post_version_number(p_post_id uuid)
RETURNS integer
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
DECLARE
  v_next_version INT;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_next_version
  FROM public.blog_post_versions
  WHERE post_id = p_post_id;

  RETURN v_next_version;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_comment_likes(comment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE blog_comments
  SET likes_count = likes_count + 1
  WHERE id = comment_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrement_comment_likes(comment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE blog_comments
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = comment_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_comment_replies(comment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE blog_comments
  SET replies_count = replies_count + 1
  WHERE id = comment_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrement_comment_replies(comment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE blog_comments
  SET replies_count = GREATEST(0, replies_count - 1)
  WHERE id = comment_id;
END;
$function$;

-- End of Blog and Comment Functions
-- ============================================


-- ============================================
-- Career Functions
-- ============================================

CREATE OR REPLACE FUNCTION public.increment_department_jobs(dept_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE career_departments
  SET job_count = job_count + 1
  WHERE id = dept_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrement_department_jobs(dept_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE career_departments
  SET job_count = GREATEST(0, job_count - 1)
  WHERE id = dept_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_positions_filled(application_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_job_id UUID;
BEGIN
  SELECT job_id INTO v_job_id FROM career_applications WHERE id = application_id;

  IF v_job_id IS NOT NULL THEN
    UPDATE career_jobs
    SET positions_filled = positions_filled + 1,
        updated_at = NOW()
    WHERE id = v_job_id;

    UPDATE career_jobs
    SET status = 'filled',
        updated_at = NOW()
    WHERE id = v_job_id
      AND positions_filled >= positions_available
      AND status = 'published';
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrement_positions_filled(application_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_job_id UUID;
BEGIN
  SELECT job_id INTO v_job_id FROM career_applications WHERE id = application_id;

  IF v_job_id IS NOT NULL THEN
    UPDATE career_jobs
    SET positions_filled = GREATEST(0, positions_filled - 1),
        updated_at = NOW()
    WHERE id = v_job_id;

    UPDATE career_jobs
    SET status = 'published',
        updated_at = NOW()
    WHERE id = v_job_id
      AND positions_filled < positions_available
      AND status = 'filled';
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.track_career_application_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.career_application_history (
      application_id,
      previous_status,
      new_status,
      changed_by
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      NEW.status_changed_by
    );

    NEW.status_changed_at := NOW();
  END IF;

  RETURN NEW;
END;
$function$;

-- End of Career Functions
-- ============================================


-- ============================================
-- Trigger Functions for Updated At
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_blog_career_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_cms_folders_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_contact_submissions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_education_videos_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_site_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  UPDATE public.profiles
  SET last_login_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$function$;

-- End of Trigger Functions
-- ============================================


-- ============================================
-- Blog Trigger Functions
-- ============================================

CREATE OR REPLACE FUNCTION public.update_blog_category_post_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id) THEN
    IF OLD.category_id IS NOT NULL THEN
      UPDATE public.blog_categories
      SET post_count = GREATEST(0, post_count - 1),
          updated_at = NOW()
      WHERE id = OLD.category_id;
    END IF;
  END IF;

  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id) THEN
    IF NEW.category_id IS NOT NULL THEN
      UPDATE public.blog_categories
      SET post_count = post_count + 1,
          updated_at = NOW()
      WHERE id = NEW.category_id;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_blog_comment_counts()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'DELETE' AND OLD.parent_id IS NOT NULL THEN
    UPDATE public.blog_comments
    SET replies_count = GREATEST(0, replies_count - 1),
        updated_at = NOW()
    WHERE id = OLD.parent_id;
  ELSIF TG_OP = 'INSERT' AND NEW.parent_id IS NOT NULL THEN
    UPDATE public.blog_comments
    SET replies_count = replies_count + 1,
        updated_at = NOW()
    WHERE id = NEW.parent_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_blog_comment_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.blog_comments
    SET likes_count = GREATEST(0, likes_count - 1),
        updated_at = NOW()
    WHERE id = OLD.comment_id;
    RETURN OLD;
  ELSIF TG_OP = 'INSERT' THEN
    UPDATE public.blog_comments
    SET likes_count = likes_count + 1,
        updated_at = NOW()
    WHERE id = NEW.comment_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_blog_tag_usage_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.blog_tags
    SET usage_count = GREATEST(0, usage_count - 1)
    WHERE id = OLD.tag_id;
    RETURN OLD;
  ELSIF TG_OP = 'INSERT' THEN
    UPDATE public.blog_tags
    SET usage_count = usage_count + 1
    WHERE id = NEW.tag_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_career_department_job_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.department_id IS DISTINCT FROM NEW.department_id) THEN
    IF OLD.department_id IS NOT NULL THEN
      UPDATE public.career_departments
      SET job_count = GREATEST(0, job_count - 1),
          updated_at = NOW()
      WHERE id = OLD.department_id;
    END IF;
  END IF;

  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.department_id IS DISTINCT FROM NEW.department_id) THEN
    IF NEW.department_id IS NOT NULL THEN
      UPDATE public.career_departments
      SET job_count = job_count + 1,
          updated_at = NOW()
      WHERE id = NEW.department_id;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$function$;

-- End of Blog Trigger Functions
-- ============================================


-- ================================================================
-- END OF FUNCTIONS DOCUMENTATION
-- ================================================================
