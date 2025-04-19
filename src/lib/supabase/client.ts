import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Tables = {
  employees: {
    id: string
    created_at: string
    email: string
    name: string
    role: 'admin' | 'manager' | 'employee'
  }
  shifts: {
    id: string
    created_at: string
    employee_id: string
    start_time: string
    end_time: string
    notes?: string
    tips?: number
  }
  inventory_items: {
    id: string
    created_at: string
    updated_at: string
    name: string
    description: string | null
    quantity: number
    unit: string
    minimum_quantity: number
    cost_per_unit: number
  }
  inventory_transactions: {
    id: string
    created_at: string
    item_id: string
    quantity: number
    transaction_type: 'in' | 'out'
    notes: string | null
    performed_by: string | null
  }
}
