export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      approved_emails: {
        Row: {
          added_at: string | null
          added_by: string | null
          email: string
          id: string
          notes: string | null
          status: string | null
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          email: string
          id?: string
          notes?: string | null
          status?: string | null
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          email?: string
          id?: string
          notes?: string | null
          status?: string | null
        }
        Relationships: []
      }
      dashboard_layouts: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          layout_config: Json
          role_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          layout_config?: Json
          role_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          layout_config?: Json
          role_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_layouts_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_quick_actions: {
        Row: {
          action_key: string
          created_at: string | null
          icon: string
          id: string
          is_active: boolean | null
          label: string
          link: string
          order_index: number | null
          permission_required: string | null
          role_id: string | null
          updated_at: string | null
        }
        Insert: {
          action_key: string
          created_at?: string | null
          icon: string
          id?: string
          is_active?: boolean | null
          label: string
          link: string
          order_index?: number | null
          permission_required?: string | null
          role_id?: string | null
          updated_at?: string | null
        }
        Update: {
          action_key?: string
          created_at?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          label?: string
          link?: string
          order_index?: number | null
          permission_required?: string | null
          role_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_quick_actions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_widgets: {
        Row: {
          category: string
          component_name: string
          created_at: string | null
          default_config: Json | null
          description: string | null
          id: string
          is_active: boolean | null
          max_height: number | null
          max_width: number | null
          min_height: number | null
          min_width: number | null
          name: string
          required_permissions: string[] | null
          sort_order: number | null
          updated_at: string | null
          widget_key: string
        }
        Insert: {
          category: string
          component_name: string
          created_at?: string | null
          default_config?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_height?: number | null
          max_width?: number | null
          min_height?: number | null
          min_width?: number | null
          name: string
          required_permissions?: string[] | null
          sort_order?: number | null
          updated_at?: string | null
          widget_key: string
        }
        Update: {
          category?: string
          component_name?: string
          created_at?: string | null
          default_config?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_height?: number | null
          max_width?: number | null
          min_height?: number | null
          min_width?: number | null
          name?: string
          required_permissions?: string[] | null
          sort_order?: number | null
          updated_at?: string | null
          widget_key?: string
        }
        Relationships: []
      }
      in_app_notifications: {
        Row: {
          created_at: string | null
          description: string | null
          expires_at: string | null
          icon: string | null
          id: string
          is_read: boolean | null
          link: string | null
          metadata: Json | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          metadata?: Json | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          metadata?: Json | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_of_joining: string | null
          department: string | null
          designation: string | null
          email: string
          employee_id: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_joining?: string | null
          department?: string | null
          designation?: string | null
          email: string
          employee_id?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_joining?: string | null
          department?: string | null
          designation?: string | null
          email?: string
          employee_id?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_system_role: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_system_role?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_system_role?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          module: string
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          module: string
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          module?: string
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_dashboard_preferences: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          is_visible: boolean | null
          position: Json
          updated_at: string | null
          user_id: string
          widget_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          position?: Json
          updated_at?: string | null
          user_id: string
          widget_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          position?: Json
          updated_at?: string | null
          user_id?: string
          widget_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_dashboard_preferences_widget_id_fkey"
            columns: ["widget_id"]
            isOneToOne: false
            referencedRelation: "dashboard_widgets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_pages: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          featured_image: string | null
          id: string
          is_homepage: boolean | null
          metadata: Json | null
          navigation_label: string | null
          parent_id: string | null
          password_hash: string | null
          published_at: string | null
          scheduled_publish_at: string | null
          show_in_navigation: boolean | null
          slug: string
          sort_order: number | null
          status: string
          template_id: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
          visibility: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          featured_image?: string | null
          id?: string
          is_homepage?: boolean | null
          metadata?: Json | null
          navigation_label?: string | null
          parent_id?: string | null
          password_hash?: string | null
          published_at?: string | null
          scheduled_publish_at?: string | null
          show_in_navigation?: boolean | null
          slug: string
          sort_order?: number | null
          status?: string
          template_id?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          visibility?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          featured_image?: string | null
          id?: string
          is_homepage?: boolean | null
          metadata?: Json | null
          navigation_label?: string | null
          parent_id?: string | null
          password_hash?: string | null
          published_at?: string | null
          scheduled_publish_at?: string | null
          show_in_navigation?: boolean | null
          slug?: string
          sort_order?: number | null
          status?: string
          template_id?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          visibility?: string
        }
        Relationships: []
      }
      cms_page_blocks: {
        Row: {
          component_name: string
          created_at: string | null
          custom_classes: string | null
          custom_css: string | null
          id: string
          is_visible: boolean | null
          page_id: string
          parent_block_id: string | null
          props: Json
          responsive_settings: Json | null
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          component_name: string
          created_at?: string | null
          custom_classes?: string | null
          custom_css?: string | null
          id?: string
          is_visible?: boolean | null
          page_id: string
          parent_block_id?: string | null
          props?: Json
          responsive_settings?: Json | null
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          component_name?: string
          created_at?: string | null
          custom_classes?: string | null
          custom_css?: string | null
          id?: string
          is_visible?: boolean | null
          page_id?: string
          parent_block_id?: string | null
          props?: Json
          responsive_settings?: Json | null
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_email_approved: { Args: { user_email: string }; Returns: boolean }
      get_user_permissions: {
        Args: { user_uuid: string }
        Returns: { permission: string }[]
      }
      has_permission: {
        Args: { required_permission: string; user_uuid: string }
        Returns: boolean
      }
      is_super_admin: { Args: { user_uuid: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific entity types
export type Profile = Tables<'profiles'>
export type Role = Tables<'roles'>
export type UserRole = Tables<'user_roles'>
export type RolePermission = Tables<'role_permissions'>
export type UserActivityLog = Tables<'user_activity_logs'>
export type ApprovedEmail = Tables<'approved_emails'>
export type DashboardWidget = Tables<'dashboard_widgets'>
export type DashboardLayout = Tables<'dashboard_layouts'>
export type UserDashboardPreference = Tables<'user_dashboard_preferences'>
export type DashboardQuickAction = Tables<'dashboard_quick_actions'>
export type InAppNotification = Tables<'in_app_notifications'>
export type CmsPage = Tables<'cms_pages'>
export type CmsPageBlock = Tables<'cms_page_blocks'>
