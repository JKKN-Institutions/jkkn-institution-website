-- =====================================================
-- Migration 001: Create Base Authentication Tables
-- =====================================================
-- This migration creates the foundational tables needed
-- for the authentication and user management system.
-- =====================================================

-- 1. APPROVED EMAILS TABLE
-- Whitelist of @jkkn.ac.in emails allowed to access the system
CREATE TABLE IF NOT EXISTS approved_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@jkkn\.ac\.in$'),
  added_by uuid REFERENCES auth.users,
  added_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  notes text
);

-- Index for fast email lookup
CREATE INDEX IF NOT EXISTS idx_approved_emails_email ON approved_emails(email);
CREATE INDEX IF NOT EXISTS idx_approved_emails_status ON approved_emails(status);

-- RLS Policies for approved_emails
ALTER TABLE approved_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can check if email is approved"
  ON approved_emails FOR SELECT
  USING (status = 'active');

CREATE POLICY "Only super_admin can manage approved emails"
  ON approved_emails FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
  );

-- 2. PROFILES TABLE
-- Extended user information beyond auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  department text,
  designation text,
  employee_id text,
  date_of_joining date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "System can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- 3. ROLES TABLE
-- Role definitions (super_admin, director, chair, member, guest)
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  is_system_role boolean DEFAULT false, -- Cannot be deleted if true
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies for roles
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view roles"
  ON roles FOR SELECT
  USING (true);

CREATE POLICY "Only super_admin can manage roles"
  ON roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (SELECT id FROM roles WHERE name = 'super_admin')
    )
  );

-- 4. USER_ROLES TABLE
-- Many-to-many relationship: users can have multiple roles
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role_id uuid REFERENCES roles ON DELETE CASCADE NOT NULL,
  assigned_by uuid REFERENCES auth.users,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role_id)
);

-- Indexes for fast role lookup
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- RLS Policies for user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "super_admin can view all user roles"
  ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
  );

CREATE POLICY "super_admin can assign roles"
  ON user_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
  );

CREATE POLICY "super_admin can remove roles"
  ON user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
  );

-- 5. USER_ROLE_CHANGES TABLE
-- Audit trail for role assignments/removals
CREATE TABLE IF NOT EXISTS user_role_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role_id uuid REFERENCES roles NOT NULL,
  action text NOT NULL CHECK (action IN ('assigned', 'removed')),
  changed_by uuid REFERENCES auth.users,
  changed_at timestamptz DEFAULT now(),
  reason text
);

-- Index for audit queries
CREATE INDEX IF NOT EXISTS idx_user_role_changes_user_id ON user_role_changes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_changes_changed_at ON user_role_changes(changed_at DESC);

-- RLS Policies for user_role_changes
ALTER TABLE user_role_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own role history"
  ON user_role_changes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "super_admin can view all role changes"
  ON user_role_changes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
    )
  );

CREATE POLICY "System can insert role changes"
  ON user_role_changes FOR INSERT
  WITH CHECK (true);

-- 6. MEMBERS TABLE
-- Extended member information linked to profiles
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  member_id text UNIQUE,
  chapter text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  membership_type text CHECK (membership_type IN ('regular', 'life', 'honorary')),
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_profile_id ON members(profile_id);
CREATE INDEX IF NOT EXISTS idx_members_chapter ON members(chapter);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

-- RLS Policies for members
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all members"
  ON members FOR SELECT
  USING (true);

CREATE POLICY "Users can update own member record"
  ON members FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can insert members"
  ON members FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Create member record
  INSERT INTO public.members (user_id, profile_id, member_id)
  VALUES (
    NEW.id,
    NEW.id,
    'MEM' || to_char(NOW(), 'YYYYMMDD') || substring(NEW.id::text from 1 for 6)
  );

  -- Assign default 'guest' role
  INSERT INTO public.user_roles (user_id, role_id, assigned_by)
  SELECT
    NEW.id,
    r.id,
    NEW.id
  FROM public.roles r
  WHERE r.name = 'guest';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger to log role changes
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on user_roles
DROP TRIGGER IF EXISTS on_user_role_change ON user_roles;
CREATE TRIGGER on_user_role_change
  AFTER INSERT OR DELETE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_change();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE approved_emails IS 'Whitelist of authorized @jkkn.ac.in email addresses';
COMMENT ON TABLE profiles IS 'Extended user profile information';
COMMENT ON TABLE roles IS 'System and custom role definitions';
COMMENT ON TABLE user_roles IS 'User to role assignments (many-to-many)';
COMMENT ON TABLE user_role_changes IS 'Audit trail for role changes';
COMMENT ON TABLE members IS 'Member-specific information linked to user profiles';
