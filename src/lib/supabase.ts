import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          brand: string;
          model: string;
          serial_number: string | null;
          imei: string | null;
          warranty_period: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string;
          brand?: string;
          model?: string;
          serial_number?: string | null;
          imei?: string | null;
          warranty_period?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          brand?: string;
          model?: string;
          serial_number?: string | null;
          imei?: string | null;
          warranty_period?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          name: string;
          position: string;
          department: string | null;
          base_salary: number;
          commission_rate: number;
          join_date: string;
          is_active: boolean;
          phone: string;
          email: string;
          address: string | null;
          emergency_contact: string | null;
          bank_account: string | null;
          pan_number: string | null;
          aadhar_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position?: string;
          department?: string | null;
          base_salary?: number;
          commission_rate?: number;
          join_date?: string;
          is_active?: boolean;
          phone?: string;
          email?: string;
          address?: string | null;
          emergency_contact?: string | null;
          bank_account?: string | null;
          pan_number?: string | null;
          aadhar_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: string;
          department?: string | null;
          base_salary?: number;
          commission_rate?: number;
          join_date?: string;
          is_active?: boolean;
          phone?: string;
          email?: string;
          address?: string | null;
          emergency_contact?: string | null;
          bank_account?: string | null;
          pan_number?: string | null;
          aadhar_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          date: string;
          product_id: string | null;
          quantity: number;
          unit_price: number;
          total_amount: number;
          payment_method: string;
          customer_name: string;
          customer_phone: string;
          sales_person: string;
          commission: number;
          is_returned: boolean;
          warranty_start_date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date?: string;
          product_id?: string | null;
          quantity?: number;
          unit_price?: number;
          total_amount?: number;
          payment_method?: string;
          customer_name?: string;
          customer_phone?: string;
          sales_person?: string;
          commission?: number;
          is_returned?: boolean;
          warranty_start_date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          product_id?: string | null;
          quantity?: number;
          unit_price?: number;
          total_amount?: number;
          payment_method?: string;
          customer_name?: string;
          customer_phone?: string;
          sales_person?: string;
          commission?: number;
          is_returned?: boolean;
          warranty_start_date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          date: string;
          category: string;
          subcategory: string;
          amount: number;
          description: string;
          vendor: string | null;
          receipt: string | null;
          payment_method: string;
          approved_by: string | null;
          status: string;
          is_recurring: boolean;
          recurring_frequency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date?: string;
          category?: string;
          subcategory?: string;
          amount?: number;
          description?: string;
          vendor?: string | null;
          receipt?: string | null;
          payment_method?: string;
          approved_by?: string | null;
          status?: string;
          is_recurring?: boolean;
          recurring_frequency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          category?: string;
          subcategory?: string;
          amount?: number;
          description?: string;
          vendor?: string | null;
          receipt?: string | null;
          payment_method?: string;
          approved_by?: string | null;
          status?: string;
          is_recurring?: boolean;
          recurring_frequency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}