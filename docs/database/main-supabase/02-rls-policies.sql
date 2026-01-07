-- ================================================================
-- MAIN SUPABASE DATABASE RLS POLICIES
-- ================================================================
-- Project: JKKN Institution Website
-- Supabase Project ID: pmqodbfhsejbvfbmsfeq
-- Total Policies: 126+
-- Last Updated: 2026-01-07
-- ================================================================
--
-- IMPORTANT: Document changes here BEFORE applying migrations!
--
-- KEY PATTERNS:
-- 1. Use is_super_admin(auth.uid()) for super admin checks
-- 2. Use has_permission(auth.uid(), 'module:resource:action') for permission checks
-- 3. Use user_id = auth.uid() for self-access
-- ================================================================

-- ============================================
-- CMS TEMPLATES EXPORT PERMISSION
-- ============================================
-- Purpose: Grant permission to export templates to global status
-- Created: 2026-01-07
-- Module: cms
-- Resource: templates
-- Action: export
-- Usage: Allows Main institution super_admins to promote local templates to global
-- Security: Only granted to super_admin role by default
-- ============================================

-- Permission: cms:templates:export
-- Required for: promoteToGlobalTemplate() Server Action
-- Granted to: super_admin role (Main institution only in practice)
-- Applied to: Main, Dental, Pharmacy Supabase databases (2026-01-07)
--
-- SQL applied via migration (add_cms_templates_export_permission):
-- INSERT INTO public.role_permissions (role_id, permission)
-- SELECT r.id, 'cms:templates:export'
-- FROM public.roles r
-- WHERE r.name = 'super_admin'
-- ON CONFLICT (role_id, permission) DO NOTHING;
--
-- End of CMS Templates Export Permission
-- ============================================


-- ============================================
-- USER ROLES TABLE POLICIES
-- ============================================
-- CRITICAL: These policies must use is_super_admin() function
-- The is_super_admin() function is SECURITY DEFINER and bypasses RLS
-- Using inline EXISTS queries can cause circular reference issues
-- ============================================

CREATE POLICY "Super admins can view all roles"
ON public.user_roles
FOR SELECT
TO public
USING (is_super_admin(auth.uid()));

CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO public
USING (user_id = auth.uid());

CREATE POLICY "super_admin can assign roles"
ON public.user_roles
FOR INSERT
TO public
WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "super_admin can remove roles"
ON public.user_roles
FOR DELETE
TO public
USING (is_super_admin(auth.uid()));

-- End of user_roles policies
-- ============================================


-- ============================================
-- ROLES TABLE POLICIES
-- ============================================

CREATE POLICY "Everyone can view roles"
ON public.roles
FOR SELECT
TO public
USING (true);

CREATE POLICY "Only super_admin can manage roles"
ON public.roles
FOR ALL
TO public
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

-- End of roles policies
-- ============================================


-- ============================================
-- ROLE PERMISSIONS TABLE POLICIES
-- ============================================

CREATE POLICY "Everyone can view role permissions"
ON public.role_permissions
FOR SELECT
TO public
USING (true);

CREATE POLICY "super_admin can manage permissions"
ON public.role_permissions
FOR ALL
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
));

-- End of role_permissions policies
-- ============================================


-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO public
USING (id = auth.uid());

CREATE POLICY "System can insert profiles"
ON public.profiles
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow service role and super_admin to delete profiles"
ON public.profiles
FOR DELETE
TO public
USING (
    (auth.jwt() ->> 'role' = 'service_role')
    OR is_super_admin(auth.uid())
);

-- End of profiles policies
-- ============================================


-- ============================================
-- MEMBERS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view all members"
ON public.members
FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can update own member record"
ON public.members
FOR UPDATE
TO public
USING (user_id = auth.uid());

CREATE POLICY "System can insert members"
ON public.members
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow service role and super_admin to delete members"
ON public.members
FOR DELETE
TO public
USING (
    (auth.jwt() ->> 'role' = 'service_role')
    OR is_super_admin(auth.uid())
);

-- End of members policies
-- ============================================


-- ============================================
-- APPROVED EMAILS TABLE POLICIES
-- ============================================

CREATE POLICY "Anyone can check if email is approved"
ON public.approved_emails
FOR SELECT
TO public
USING (status = 'active');

CREATE POLICY "Only super_admin can manage approved emails"
ON public.approved_emails
FOR ALL
TO public
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

-- End of approved_emails policies
-- ============================================


-- ============================================
-- USER ACTIVITY LOGS TABLE POLICIES
-- ============================================

CREATE POLICY "System can insert activity logs"
ON public.user_activity_logs
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Users can view own activity logs"
ON public.user_activity_logs
FOR SELECT
TO public
USING (user_id = auth.uid());

CREATE POLICY "super_admin can view all activity logs"
ON public.user_activity_logs
FOR SELECT
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
));

CREATE POLICY "Users with activity view permission can view all logs"
ON public.user_activity_logs
FOR SELECT
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND (rp.permission = 'users:activity:view'
         OR rp.permission = 'users:*:*'
         OR rp.permission = '*:*:*')
));

-- End of user_activity_logs policies
-- ============================================


-- ============================================
-- USER ROLE CHANGES TABLE POLICIES
-- ============================================

CREATE POLICY "System can insert role changes"
ON public.user_role_changes
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Users can view own role history"
ON public.user_role_changes
FOR SELECT
TO public
USING (user_id = auth.uid());

CREATE POLICY "super_admin can view all role changes"
ON public.user_role_changes
FOR SELECT
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
));

-- End of user_role_changes policies
-- ============================================


-- ============================================
-- CMS PAGES TABLE POLICIES (WITH SOFT DELETE)
-- ============================================
-- Updated: 2026-01-06
-- Changes: Added support for soft delete/trash bin system
-- - SELECT policy excludes soft-deleted pages for normal viewing
-- - New policy for viewing trash (deleted pages)
-- - UPDATE policy supports both normal updates and restore operations
-- - DELETE policy only allows permanent deletion from trash
-- Dependencies: deleted_at, deleted_by columns in cms_pages table
-- ============================================

-- Policy 1: View non-deleted pages
CREATE POLICY "Users can view pages"
ON public.cms_pages
FOR SELECT
TO public
USING (
    -- Exclude soft-deleted pages from normal viewing
    deleted_at IS NULL
    AND (
        -- Public can view published public pages
        (status = 'published' AND visibility = 'public')
        -- Creators can view their own pages
        OR created_by = auth.uid()
        -- Super admins can view all non-deleted pages
        OR EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
        )
        -- Users with cms:pages:view permission can view all non-deleted pages
        OR has_permission(auth.uid(), 'cms:pages:view')
    )
);

-- Policy 2: View trash (deleted pages only)
CREATE POLICY "Users can view trash"
ON public.cms_pages
FOR SELECT
TO public
USING (
    -- Only show deleted pages to authorized users
    deleted_at IS NOT NULL
    AND (
        -- Super admins can view trash
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
        )
        -- Users with cms:pages:restore permission can view trash
        OR has_permission(auth.uid(), 'cms:pages:restore')
        -- Users with cms:pages:delete permission can view trash
        OR has_permission(auth.uid(), 'cms:pages:delete')
    )
);

-- Policy 3: Create new pages
CREATE POLICY "Users with permission can create pages"
ON public.cms_pages
FOR INSERT
TO public
WITH CHECK (
    auth.uid() = created_by
    AND (
        EXISTS (
            SELECT 1 FROM has_permission(auth.uid(), 'cms:pages:create')
            WHERE has_permission = true
        )
        OR EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
        )
    )
);

-- Policy 4: Update pages and restore from trash
CREATE POLICY "Users with permission can update pages"
ON public.cms_pages
FOR UPDATE
TO public
USING (
    -- User can update if:
    created_by = auth.uid() -- They created the page (for non-deleted pages)
    OR EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
    OR has_permission(auth.uid(), 'cms:pages:edit')
    -- Users with restore permission can update (restore) deleted pages
    OR (deleted_at IS NOT NULL AND has_permission(auth.uid(), 'cms:pages:restore'))
)
WITH CHECK (
    -- Additional check: Only allow restoring if user has restore permission
    (deleted_at IS NULL AND updated_by = auth.uid()) -- Normal updates
    OR (deleted_at IS NOT NULL AND has_permission(auth.uid(), 'cms:pages:restore')) -- Restore operations
    OR EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
);

-- Policy 5: Permanent deletion (only from trash)
CREATE POLICY "Users with permission can delete pages"
ON public.cms_pages
FOR DELETE
TO public
USING (
    -- Only allow permanent deletion of already soft-deleted pages
    deleted_at IS NOT NULL
    AND (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
        )
        OR has_permission(auth.uid(), 'cms:pages:delete')
    )
);

-- End of cms_pages policies
-- ============================================


-- ============================================
-- CMS PAGE BLOCKS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view blocks of viewable pages"
ON public.cms_page_blocks
FOR SELECT
TO public
USING (EXISTS (
    SELECT 1 FROM cms_pages p
    WHERE p.id = cms_page_blocks.page_id
    AND (
        (p.status = 'published' AND p.visibility = 'public')
        OR p.created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM has_permission(auth.uid(), 'cms:pages:view')
            WHERE has_permission = true
        )
        OR EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
        )
    )
));

CREATE POLICY "Users with permission can manage blocks"
ON public.cms_page_blocks
FOR ALL
TO public
USING (EXISTS (
    SELECT 1 FROM cms_pages p
    WHERE p.id = cms_page_blocks.page_id
    AND (
        p.created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM has_permission(auth.uid(), 'cms:pages:edit')
            WHERE has_permission = true
        )
        OR EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
        )
    )
));

-- End of cms_page_blocks policies
-- ============================================


-- ============================================
-- CMS MEDIA LIBRARY TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view media"
ON public.cms_media_library
FOR SELECT
TO public
USING (auth.role() = 'authenticated');

CREATE POLICY "Users with permission can upload media"
ON public.cms_media_library
FOR INSERT
TO public
WITH CHECK (
    auth.uid() = uploaded_by
    AND (
        EXISTS (
            SELECT 1 FROM has_permission(auth.uid(), 'cms:media:upload')
            WHERE has_permission = true
        )
        OR EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
        )
    )
);

CREATE POLICY "Users can update media"
ON public.cms_media_library
FOR UPDATE
TO public
USING (
    uploaded_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM has_permission(auth.uid(), 'cms:media:edit')
        WHERE has_permission = true
    )
    OR EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
);

CREATE POLICY "Users can delete media"
ON public.cms_media_library
FOR DELETE
TO public
USING (
    uploaded_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM has_permission(auth.uid(), 'cms:media:delete')
        WHERE has_permission = true
    )
    OR EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
);

-- End of cms_media_library policies
-- ============================================


-- ============================================
-- DASHBOARD TABLE POLICIES
-- ============================================

-- dashboard_layouts
CREATE POLICY "Users can view their own dashboard layouts"
ON public.dashboard_layouts
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    OR role_id IN (
        SELECT role_id FROM user_roles WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can create their own dashboard layouts"
ON public.dashboard_layouts
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own dashboard layouts"
ON public.dashboard_layouts
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own dashboard layouts"
ON public.dashboard_layouts
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- dashboard_widgets
CREATE POLICY "Anyone authenticated can view active widgets"
ON public.dashboard_widgets
FOR SELECT
TO authenticated
USING (is_active = true);

-- dashboard_quick_actions
CREATE POLICY "Anyone authenticated can view quick actions"
ON public.dashboard_quick_actions
FOR SELECT
TO authenticated
USING (is_active = true);

-- user_dashboard_preferences
CREATE POLICY "Users can view their own dashboard preferences"
ON public.user_dashboard_preferences
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own dashboard preferences"
ON public.user_dashboard_preferences
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own dashboard preferences"
ON public.user_dashboard_preferences
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own dashboard preferences"
ON public.user_dashboard_preferences
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- End of dashboard policies
-- ============================================


-- ============================================
-- BLOG TABLE POLICIES
-- ============================================

-- blog_posts
CREATE POLICY "blog_posts_public_read"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (status = 'published' AND visibility = 'public');

CREATE POLICY "blog_posts_author_read"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (author_id = auth.uid());

CREATE POLICY "blog_posts_admin_select"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:blog:view', 'cms:blog:*', 'cms:*:*'])
));

CREATE POLICY "blog_posts_admin_insert"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:blog:create', 'cms:blog:*', 'cms:*:*'])
));

CREATE POLICY "blog_posts_admin_update"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:blog:edit', 'cms:blog:*', 'cms:*:*'])
))
WITH CHECK (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:blog:edit', 'cms:blog:*', 'cms:*:*'])
));

CREATE POLICY "blog_posts_admin_delete"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:blog:delete', 'cms:blog:*', 'cms:*:*'])
));

-- blog_categories
CREATE POLICY "blog_categories_public_read"
ON public.blog_categories
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "blog_categories_admin_all"
ON public.blog_categories
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission ~~ 'cms:blog:%'
));

-- blog_tags
CREATE POLICY "blog_tags_public_read"
ON public.blog_tags
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "blog_tags_admin_all"
ON public.blog_tags
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission ~~ 'cms:blog:%'
));

-- blog_comments
CREATE POLICY "blog_comments_public_read"
ON public.blog_comments
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "blog_comments_public_insert"
ON public.blog_comments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "blog_comments_own_update"
ON public.blog_comments
FOR UPDATE
TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

CREATE POLICY "blog_comments_admin_all"
ON public.blog_comments
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:blog:comments', 'cms:blog:*', 'cms:*:*'])
));

-- End of blog policies
-- ============================================


-- ============================================
-- CAREER TABLE POLICIES
-- ============================================

-- career_jobs
CREATE POLICY "career_jobs_public_read"
ON public.career_jobs
FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "career_jobs_admin_select"
ON public.career_jobs
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:careers:view', 'cms:careers:*', 'cms:*:*'])
));

CREATE POLICY "career_jobs_admin_insert"
ON public.career_jobs
FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:careers:create', 'cms:careers:*', 'cms:*:*'])
));

CREATE POLICY "career_jobs_admin_update"
ON public.career_jobs
FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:careers:edit', 'cms:careers:*', 'cms:*:*'])
))
WITH CHECK (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:careers:edit', 'cms:careers:*', 'cms:*:*'])
));

CREATE POLICY "career_jobs_admin_delete"
ON public.career_jobs
FOR DELETE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:careers:delete', 'cms:careers:*', 'cms:*:*'])
));

-- career_applications
CREATE POLICY "career_applications_public_insert"
ON public.career_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "career_applications_own_read"
ON public.career_applications
FOR SELECT
TO authenticated
USING (applicant_user_id = auth.uid());

CREATE POLICY "career_applications_admin_all"
ON public.career_applications
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission = ANY(ARRAY['cms:careers:applications', 'cms:careers:*', 'cms:*:*'])
));

-- career_departments
CREATE POLICY "career_departments_public_read"
ON public.career_departments
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "career_departments_admin_all"
ON public.career_departments
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = auth.uid()
    AND rp.permission ~~ 'cms:careers:%'
));

-- End of career policies
-- ============================================


-- ============================================
-- CONTACT & INQUIRIES TABLE POLICIES
-- ============================================

-- contact_submissions
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Staff can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = ANY(ARRAY['super_admin', 'director', 'chair'])
));

CREATE POLICY "Staff can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = ANY(ARRAY['super_admin', 'director', 'chair'])
));

-- admission_inquiries
CREATE POLICY "Anyone can submit admission inquiry"
ON public.admission_inquiries
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated users with permission can view inquiries"
ON public.admission_inquiries
FOR SELECT
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    LEFT JOIN role_permissions rp ON rp.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (r.name = 'super_admin'
         OR rp.permission = ANY(ARRAY['inquiries:admissions:view', 'inquiries:*:*', '*:*:*']))
));

CREATE POLICY "Authorized users can update inquiries"
ON public.admission_inquiries
FOR UPDATE
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    LEFT JOIN role_permissions rp ON rp.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (r.name = 'super_admin'
         OR rp.permission = ANY(ARRAY['inquiries:admissions:manage', 'inquiries:admissions:reply', 'inquiries:*:*', '*:*:*']))
));

CREATE POLICY "Authorized users can delete inquiries"
ON public.admission_inquiries
FOR DELETE
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    LEFT JOIN role_permissions rp ON rp.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (r.name = 'super_admin'
         OR rp.permission = ANY(ARRAY['inquiries:admissions:delete', 'inquiries:*:*', '*:*:*']))
));

-- End of contact & inquiries policies
-- ============================================


-- ============================================
-- SITE SETTINGS TABLE POLICIES
-- ============================================

CREATE POLICY "Anyone can view public settings"
ON public.site_settings
FOR SELECT
TO public
USING (is_public = true);

CREATE POLICY "Authenticated users can view all settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Super admin can manage settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
))
WITH CHECK (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
));

-- End of site_settings policies
-- ============================================


-- ============================================
-- SYSTEM MODULES TABLE POLICIES
-- ============================================

CREATE POLICY "Everyone can view enabled modules"
ON public.system_modules
FOR SELECT
TO public
USING (is_enabled = true);

CREATE POLICY "super_admin can view all modules"
ON public.system_modules
FOR SELECT
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
));

CREATE POLICY "super_admin can manage modules"
ON public.system_modules
FOR ALL
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
));

-- End of system_modules policies
-- ============================================


-- ============================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view their own notifications"
ON public.in_app_notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "System can create notifications for users"
ON public.in_app_notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications (mark as read)"
ON public.in_app_notifications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
ON public.in_app_notifications
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- End of notifications policies
-- ============================================


-- ============================================
-- PAGE VIEWS TABLE POLICIES (ANALYTICS)
-- ============================================

CREATE POLICY "Anyone can insert page views"
ON public.page_views
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read page views"
ON public.page_views
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = ANY(ARRAY['super_admin', 'director', 'chair'])
));

-- End of page_views policies
-- ============================================


-- ============================================
-- COLLEGES AND COURSES TABLE POLICIES
-- ============================================

-- colleges
CREATE POLICY "Allow public read access to active colleges"
ON public.colleges
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Allow admins to manage colleges"
ON public.colleges
FOR ALL
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = ANY(ARRAY['super_admin', 'director'])
));

-- courses
CREATE POLICY "Allow public read access to active courses"
ON public.courses
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Allow admins to manage courses"
ON public.courses
FOR ALL
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = ANY(ARRAY['super_admin', 'director'])
));

-- End of colleges and courses policies
-- ============================================


-- ============================================
-- EDUCATION VIDEOS TABLE POLICIES
-- ============================================

CREATE POLICY "Public can view active education videos"
ON public.education_videos
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Admins can manage education videos"
ON public.education_videos
FOR ALL
TO public
USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = ANY(ARRAY['super_admin', 'director', 'chair'])
));

-- End of education_videos policies
-- ============================================


-- ============================================
-- DELETED USERS ARCHIVE TABLE POLICIES
-- ============================================
-- Purpose: Archive table for GDPR-compliant user deletion tracking
-- Created: 2026-01-07
-- Modified: 2026-01-07 (Upgraded from simple to advanced schema)
-- Security: Accessible by all authenticated users
-- Features:
--   - Email hashing for privacy
--   - Full profile/role snapshots
--   - Data retention policies
--   - Purge tracking
--   - Anonymization support
-- ============================================

-- Enable RLS
ALTER TABLE public.deleted_users_archive ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view deleted user archives
CREATE POLICY "Deleted users archive viewable by authenticated users"
ON public.deleted_users_archive
FOR SELECT
TO public
USING (auth.role() = 'authenticated'::text);

-- Policy: All authenticated users can manage deleted user archives
CREATE POLICY "Deleted users archive manageable by authenticated users"
ON public.deleted_users_archive
FOR ALL
TO public
USING (auth.role() = 'authenticated'::text);

-- End of deleted_users_archive policies
-- ============================================


-- ================================================================
-- END OF RLS POLICIES DOCUMENTATION
-- ================================================================
