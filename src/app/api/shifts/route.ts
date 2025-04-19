import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: shifts, error } = await supabase
      .from('shifts')
      .select(`
        *,
        employees (
          name,
          email
        )
      `)
      .order('start_time', { ascending: true })

    if (error) throw error

    return NextResponse.json(shifts)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching shifts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const json = await request.json()

    const { data: shift, error } = await supabase
      .from('shifts')
      .insert([
        {
          employee_id: json.employee_id,
          start_time: json.start_time,
          end_time: json.end_time,
          notes: json.notes,
          tips: json.tips
        }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(shift)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating shift' }, { status: 500 })
  }
}
