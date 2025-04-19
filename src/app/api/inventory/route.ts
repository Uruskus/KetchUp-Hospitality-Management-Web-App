import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: items, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json(items)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Fehler beim Laden des Inventars' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const json = await request.json()

    const { data: item, error } = await supabase
      .from('inventory_items')
      .insert([{
        name: json.name,
        description: json.description,
        quantity: json.quantity,
        unit: json.unit,
        minimum_quantity: json.minimum_quantity,
        cost_per_unit: json.cost_per_unit,
        category: json.category || 'supplies' // Standardkategorie, falls keine angegeben
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen des Artikels' }, { status: 500 })
  }
}
