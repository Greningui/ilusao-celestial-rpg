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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      breathing_forms: {
        Row: {
          breathing_id: string
          cooldown: string | null
          cost: string | null
          damage: string | null
          description: string | null
          duration: string | null
          effect: string | null
          effect_damage: string | null
          effect_duration: string | null
          form_number: number
          id: string
          lvl: string | null
          name: string
        }
        Insert: {
          breathing_id: string
          cooldown?: string | null
          cost?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          form_number: number
          id?: string
          lvl?: string | null
          name: string
        }
        Update: {
          breathing_id?: string
          cooldown?: string | null
          cost?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          form_number?: number
          id?: string
          lvl?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "breathing_forms_breathing_id_fkey"
            columns: ["breathing_id"]
            isOneToOne: false
            referencedRelation: "breathings"
            referencedColumns: ["id"]
          },
        ]
      }
      breathings: {
        Row: {
          created_at: string
          created_by: string
          created_by_name: string | null
          forms_count: number
          id: string
          lvl: string | null
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          created_by_name?: string | null
          forms_count?: number
          id?: string
          lvl?: string | null
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          created_by_name?: string | null
          forms_count?: number
          id?: string
          lvl?: string | null
          name?: string
        }
        Relationships: []
      }
      characters: {
        Row: {
          animal: string | null
          armaduras: string | null
          armas: string | null
          atributos_bonus: string | null
          caldas: string | null
          casa_linhagem: string | null
          cla: string | null
          classe: string | null
          contagem_sangue: string | null
          contagem_sangue_atual: number | null
          contagem_sangue_max: number | null
          contatos: string | null
          cor: string | null
          created_at: string
          elemento: string | null
          especialidade: string | null
          hp_atual: number | null
          hp_max: number | null
          hp_pt: number | null
          id: string
          int_pt: number | null
          int_stat: number | null
          lvl: number | null
          mana_atual: number | null
          mana_max: number | null
          mana_pt: number | null
          mantimentos: string | null
          nome: string
          outros: string | null
          owner_id: string
          pf: number | null
          pf_pt: number | null
          pm: number | null
          pm_pt: number | null
          poderes: string | null
          pt_disponivel: number | null
          raca: string | null
          raca_secundaria: string | null
          rank: string | null
          rf: number | null
          rf_pt: number | null
          rm: number | null
          rm_pt: number | null
          updated_at: string
          vel: number | null
          vel_pt: number | null
          vinculos: string | null
        }
        Insert: {
          animal?: string | null
          armaduras?: string | null
          armas?: string | null
          atributos_bonus?: string | null
          caldas?: string | null
          casa_linhagem?: string | null
          cla?: string | null
          classe?: string | null
          contagem_sangue?: string | null
          contagem_sangue_atual?: number | null
          contagem_sangue_max?: number | null
          contatos?: string | null
          cor?: string | null
          created_at?: string
          elemento?: string | null
          especialidade?: string | null
          hp_atual?: number | null
          hp_max?: number | null
          hp_pt?: number | null
          id?: string
          int_pt?: number | null
          int_stat?: number | null
          lvl?: number | null
          mana_atual?: number | null
          mana_max?: number | null
          mana_pt?: number | null
          mantimentos?: string | null
          nome: string
          outros?: string | null
          owner_id: string
          pf?: number | null
          pf_pt?: number | null
          pm?: number | null
          pm_pt?: number | null
          poderes?: string | null
          pt_disponivel?: number | null
          raca?: string | null
          raca_secundaria?: string | null
          rank?: string | null
          rf?: number | null
          rf_pt?: number | null
          rm?: number | null
          rm_pt?: number | null
          updated_at?: string
          vel?: number | null
          vel_pt?: number | null
          vinculos?: string | null
        }
        Update: {
          animal?: string | null
          armaduras?: string | null
          armas?: string | null
          atributos_bonus?: string | null
          caldas?: string | null
          casa_linhagem?: string | null
          cla?: string | null
          classe?: string | null
          contagem_sangue?: string | null
          contagem_sangue_atual?: number | null
          contagem_sangue_max?: number | null
          contatos?: string | null
          cor?: string | null
          created_at?: string
          elemento?: string | null
          especialidade?: string | null
          hp_atual?: number | null
          hp_max?: number | null
          hp_pt?: number | null
          id?: string
          int_pt?: number | null
          int_stat?: number | null
          lvl?: number | null
          mana_atual?: number | null
          mana_max?: number | null
          mana_pt?: number | null
          mantimentos?: string | null
          nome?: string
          outros?: string | null
          owner_id?: string
          pf?: number | null
          pf_pt?: number | null
          pm?: number | null
          pm_pt?: number | null
          poderes?: string | null
          pt_disponivel?: number | null
          raca?: string | null
          raca_secundaria?: string | null
          rank?: string | null
          rf?: number | null
          rf_pt?: number | null
          rm?: number | null
          rm_pt?: number | null
          updated_at?: string
          vel?: number | null
          vel_pt?: number | null
          vinculos?: string | null
        }
        Relationships: []
      }
      cursed_techniques: {
        Row: {
          category: string
          cooldown: string | null
          cost: string | null
          created_at: string
          created_by: string
          created_by_name: string | null
          damage: string | null
          description: string | null
          duration: string | null
          effect: string | null
          effect_damage: string | null
          effect_duration: string | null
          id: string
          lvl: string | null
          name: string
          type: string
        }
        Insert: {
          category: string
          cooldown?: string | null
          cost?: string | null
          created_at?: string
          created_by: string
          created_by_name?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          id?: string
          lvl?: string | null
          name: string
          type: string
        }
        Update: {
          category?: string
          cooldown?: string | null
          cost?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          id?: string
          lvl?: string | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      individualities: {
        Row: {
          category: string
          created_at: string
          created_by: string
          created_by_name: string | null
          description: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          created_by_name?: string | null
          description?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          created_by_name?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      individuality_techniques: {
        Row: {
          cooldown: string | null
          cost: string | null
          damage: string | null
          description: string | null
          duration: string | null
          effect: string | null
          effect_damage: string | null
          effect_duration: string | null
          id: string
          individuality_id: string
          lvl: string | null
          name: string
        }
        Insert: {
          cooldown?: string | null
          cost?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          id?: string
          individuality_id: string
          lvl?: string | null
          name: string
        }
        Update: {
          cooldown?: string | null
          cost?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          id?: string
          individuality_id?: string
          lvl?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "individuality_techniques_individuality_id_fkey"
            columns: ["individuality_id"]
            isOneToOne: false
            referencedRelation: "individualities"
            referencedColumns: ["id"]
          },
        ]
      }
      jutsu_techniques: {
        Row: {
          cooldown: string | null
          cost: string | null
          damage: string | null
          description: string | null
          duration: string | null
          effect: string | null
          effect_damage: string | null
          effect_duration: string | null
          id: string
          jutsu_id: string
          lvl: string | null
          name: string
        }
        Insert: {
          cooldown?: string | null
          cost?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          id?: string
          jutsu_id: string
          lvl?: string | null
          name: string
        }
        Update: {
          cooldown?: string | null
          cost?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          id?: string
          jutsu_id?: string
          lvl?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "jutsu_techniques_jutsu_id_fkey"
            columns: ["jutsu_id"]
            isOneToOne: false
            referencedRelation: "jutsus"
            referencedColumns: ["id"]
          },
        ]
      }
      jutsus: {
        Row: {
          category: string
          cooldown: string | null
          cost: string | null
          created_at: string
          created_by: string
          created_by_name: string | null
          damage: string | null
          description: string | null
          duration: string | null
          effect: string | null
          effect_damage: string | null
          effect_duration: string | null
          id: string
          lvl: string | null
          name: string
          type: string
        }
        Insert: {
          category: string
          cooldown?: string | null
          cost?: string | null
          created_at?: string
          created_by: string
          created_by_name?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          id?: string
          lvl?: string | null
          name: string
          type: string
        }
        Update: {
          category?: string
          cooldown?: string | null
          cost?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          id?: string
          lvl?: string | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          cooldown: string | null
          cost: string | null
          created_at: string
          created_by: string
          created_by_name: string | null
          damage: string | null
          description: string | null
          duration: string | null
          effect: string | null
          effect_damage: string | null
          effect_duration: string | null
          id: string
          lvl: string | null
          name: string
        }
        Insert: {
          category: string
          cooldown?: string | null
          cost?: string | null
          created_at?: string
          created_by: string
          created_by_name?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          id?: string
          lvl?: string | null
          name: string
        }
        Update: {
          category?: string
          cooldown?: string | null
          cost?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string | null
          damage?: string | null
          description?: string | null
          duration?: string | null
          effect?: string | null
          effect_damage?: string | null
          effect_duration?: string | null
          id?: string
          lvl?: string | null
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "player"
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
    Enums: {
      app_role: ["admin", "player"],
    },
  },
} as const
