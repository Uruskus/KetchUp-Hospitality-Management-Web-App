import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const json = await request.json()

    // Hole den aktuellen Bestand
    const { data: item, error: fetchError } = await supabase
      .from('inventory_items')
      .select('quantity')
      .eq('id', json.item_id)
      .single()

    if (fetchError) throw fetchError
    if (!item) throw new Error('Artikel nicht gefunden')

    // Berechne den neuen Bestand
    const newQuantity = json.transaction_type === 'in'
      ? item.quantity + json.quantity
      : item.quantity - json.quantity

    if (newQuantity < 0) {
      return NextResponse.json(
        { error: 'Nicht genügend Lagerbestand' },
        { status: 400 }
      )
    }

    // Starte eine Transaktion
    const { error: updateError } = await supabase
      .from('inventory_items')
      .update({ quantity: newQuantity })
      .eq('id', json.item_id)

    if (updateError) throw updateError

    // Speichere die Transaktion
    const { data: transaction, error: transactionError } = await supabase
      .from('inventory_transactions')
      .insert([{
        item_id: json.item_id,
        quantity: json.quantity,
        transaction_type: json.transaction_type,
        notes: json.notes,
      }])
      .select()
      .single()

    if (transactionError) throw transactionError

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Transaction error:', error)
    return NextResponse.json(
      { error: 'Fehler bei der Transaktion' },
      { status: 500 }
    )
  }
}
