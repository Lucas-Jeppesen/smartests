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
      asignatura: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz: {
        Row: {
          asignatura_id: string | null
          created_at: string
          id: string
          name: string
          num_questions: number
          raw_quiz_text: string
          source_url: string
          status: Database["public"]["Enums"]["quiz_status"]
          user_id: string | null
        }
        Insert: {
          asignatura_id?: string | null
          created_at?: string
          id?: string
          name?: string
          num_questions?: number
          raw_quiz_text: string
          source_url: string
          status?: Database["public"]["Enums"]["quiz_status"]
          user_id?: string | null
        }
        Update: {
          asignatura_id?: string | null
          created_at?: string
          id?: string
          name?: string
          num_questions?: number
          raw_quiz_text?: string
          source_url?: string
          status?: Database["public"]["Enums"]["quiz_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_asignatura_id_fkey"
            columns: ["asignatura_id"]
            isOneToOne: false
            referencedRelation: "asignatura"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attemp: {
        Row: {
          attemp_raw_data: Json | null
          created_at: string
          id: number
          quiz_id: string
          score: number | null
          user_id: string | null
        }
        Insert: {
          attemp_raw_data?: Json | null
          created_at?: string
          id?: number
          quiz_id: string
          score?: number | null
          user_id?: string | null
        }
        Update: {
          attemp_raw_data?: Json | null
          created_at?: string
          id?: number
          quiz_id?: string
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attemp_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quiz"
            referencedColumns: ["id"]
          },
        ]
      }
      user_pdf_uploads: {
        Row: {
          expires_at: string | null
          file_path: string
          public_url: string
        }
        Insert: {
          expires_at?: string | null
          file_path: string
          public_url: string
        }
        Update: {
          expires_at?: string | null
          file_path?: string
          public_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      test_average_and_count: {
        Args: { quiz_id_input: string }
        Returns: {
          average: number
          attempt_count: number
        }[]
      }
    }
    Enums: {
      quiz_status: "processing" | "complete"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      quiz_status: ["processing", "complete"],
    },
  },
} as const
