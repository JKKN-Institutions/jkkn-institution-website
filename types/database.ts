export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
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
      cms_component_registry: {
        Row: {
          category: string
          created_at: string | null
          default_props: Json | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          props_schema: Json
          sort_order: number | null
          supports_children: boolean | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          default_props?: Json | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          props_schema?: Json
          sort_order?: number | null
          supports_children?: boolean | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          default_props?: Json | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          props_schema?: Json
          sort_order?: number | null
          supports_children?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_media_library: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          file_url: string
          folder: string | null
          height: number | null
          id: string
          metadata: Json | null
          mime_type: string
          original_name: string
          tags: string[] | null
          updated_at: string | null
          uploaded_by: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          file_url: string
          folder?: string | null
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type: string
          original_name: string
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          file_url?: string
          folder?: string | null
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string
          original_name?: string
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string
          width?: number | null
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
        Relationships: [
          {
            foreignKeyName: "cms_page_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_page_blocks_parent_block_id_fkey"
            columns: ["parent_block_id"]
            isOneToOne: false
            referencedRelation: "cms_page_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_page_fab_config: {
        Row: {
          animation: string | null
          created_at: string | null
          custom_action_icon: string | null
          custom_action_label: string | null
          custom_action_url: string | null
          custom_css: string | null
          delay_ms: number | null
          directions_url: string | null
          email_address: string | null
          hide_on_scroll: boolean | null
          id: string
          is_enabled: boolean | null
          page_id: string
          phone_number: string | null
          position: string | null
          primary_action: string | null
          show_directions: boolean | null
          show_email: boolean | null
          show_phone: boolean | null
          show_whatsapp: boolean | null
          theme: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          animation?: string | null
          created_at?: string | null
          custom_action_icon?: string | null
          custom_action_label?: string | null
          custom_action_url?: string | null
          custom_css?: string | null
          delay_ms?: number | null
          directions_url?: string | null
          email_address?: string | null
          hide_on_scroll?: boolean | null
          id?: string
          is_enabled?: boolean | null
          page_id: string
          phone_number?: string | null
          position?: string | null
          primary_action?: string | null
          show_directions?: boolean | null
          show_email?: boolean | null
          show_phone?: boolean | null
          show_whatsapp?: boolean | null
          theme?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          animation?: string | null
          created_at?: string | null
          custom_action_icon?: string | null
          custom_action_label?: string | null
          custom_action_url?: string | null
          custom_css?: string | null
          delay_ms?: number | null
          directions_url?: string | null
          email_address?: string | null
          hide_on_scroll?: boolean | null
          id?: string
          is_enabled?: boolean | null
          page_id?: string
          phone_number?: string | null
          position?: string | null
          primary_action?: string | null
          show_directions?: boolean | null
          show_email?: boolean | null
          show_phone?: boolean | null
          show_whatsapp?: boolean | null
          theme?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_page_fab_config_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: true
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_page_templates: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          default_blocks: Json | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          slug: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          default_blocks?: Json | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          slug: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          default_blocks?: Json | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          slug?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_page_versions: {
        Row: {
          blocks_snapshot: Json
          change_summary: string | null
          created_at: string | null
          created_by: string
          description: string | null
          fab_snapshot: Json | null
          id: string
          is_auto_save: boolean | null
          is_published_version: boolean | null
          page_id: string
          seo_snapshot: Json | null
          slug: string
          title: string
          version_number: number
        }
        Insert: {
          blocks_snapshot?: Json
          change_summary?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          fab_snapshot?: Json | null
          id?: string
          is_auto_save?: boolean | null
          is_published_version?: boolean | null
          page_id: string
          seo_snapshot?: Json | null
          slug: string
          title: string
          version_number: number
        }
        Update: {
          blocks_snapshot?: Json
          change_summary?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          fab_snapshot?: Json | null
          id?: string
          is_auto_save?: boolean | null
          is_published_version?: boolean | null
          page_id?: string
          seo_snapshot?: Json | null
          slug?: string
          title?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "cms_page_versions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
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
        Relationships: [
          {
            foreignKeyName: "cms_pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_pages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "cms_page_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_seo_metadata: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          custom_head_tags: string | null
          id: string
          last_analyzed_at: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          og_type: string | null
          page_id: string
          robots_directive: string | null
          seo_score: number | null
          structured_data: Json | null
          twitter_card: string | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          custom_head_tags?: string | null
          id?: string
          last_analyzed_at?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_type?: string | null
          page_id: string
          robots_directive?: string | null
          seo_score?: number | null
          structured_data?: Json | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          custom_head_tags?: string | null
          id?: string
          last_analyzed_at?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_type?: string | null
          page_id?: string
          robots_directive?: string | null
          seo_score?: number | null
          structured_data?: Json | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_seo_metadata_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: true
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          chapter: string | null
          created_at: string | null
          id: string
          joined_at: string | null
          member_id: string | null
          membership_type: string | null
          profile_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          chapter?: string | null
          created_at?: string | null
          id?: string
          joined_at?: string | null
          member_id?: string | null
          membership_type?: string | null
          profile_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          chapter?: string | null
          created_at?: string | null
          id?: string
          joined_at?: string | null
          member_id?: string | null
          membership_type?: string | null
          profile_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      system_modules: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_enabled: boolean | null
          module_key: string
          name: string
          order_index: number | null
          route_path: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_enabled?: boolean | null
          module_key: string
          name: string
          order_index?: number | null
          route_path?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_enabled?: boolean | null
          module_key?: string
          name?: string
          order_index?: number | null
          route_path?: string | null
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
      user_role_changes: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: string
          reason: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          reason?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          reason?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_changes_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_email_approved: { Args: { user_email: string }; Returns: boolean }
      get_next_page_version_number: {
        Args: { p_page_id: string }
        Returns: number
      }
      get_role_users_count: { Args: { role_uuid: string }; Returns: number }
      get_user_activity_stats: {
        Args: { days_back?: number; user_uuid: string }
        Returns: {
          activities_by_action: Json
          activities_by_module: Json
          last_activity: string
          total_activities: number
        }[]
      }
      get_user_permissions: {
        Args: { user_uuid: string }
        Returns: {
          permission: string
        }[]
      }
      get_user_roles: {
        Args: { user_uuid: string }
        Returns: {
          assigned_at: string
          role_description: string
          role_display_name: string
          role_id: string
          role_name: string
        }[]
      }
      has_permission: {
        Args: { required_permission: string; user_uuid: string }
        Returns: boolean
      }
      is_super_admin: { Args: { user_uuid: string }; Returns: boolean }
      is_user_guest_only: { Args: { user_uuid: string }; Returns: boolean }
      log_user_activity: {
        Args: {
          p_action: string
          p_ip_address?: unknown
          p_metadata?: Json
          p_module: string
          p_resource_id?: string
          p_resource_type?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
