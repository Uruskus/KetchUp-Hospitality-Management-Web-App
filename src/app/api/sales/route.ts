import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Hole die Umsätze aus der Datenbank
    const { data: sales, error } = await supabase
      .from('sales')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Berechne den Tagesumsatz (falls keine Daten vorhanden, simuliere Beispieldaten)
    const today = new Date().toISOString().split('T')[0]
    
    // Wenn keine Umsätze vorhanden sind, geben wir Beispieldaten zurück
    if (!sales || sales.length === 0) {
      const mockSales = {
        daily: {
          date: today,
          total: 1245.50,
          previousDay: 1120.75,
          percentChange: 11.13
        },
        weekly: {
          total: 8765.25,
          previousWeek: 8234.50,
          percentChange: 6.45
        }
      }
      return NextResponse.json(mockSales)
    }

    // Berechne tatsächliche Umsätze
    const todaySales = sales.filter(sale => sale.date === today)
    const todayTotal = todaySales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
    
    // Berechne Vortagesumsatz
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const yesterdaySales = sales.filter(sale => sale.date === yesterdayStr)
    const yesterdayTotal = yesterdaySales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
    
    // Berechne prozentuale Veränderung
    const percentChange = yesterdayTotal > 0 
      ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100
      : 0
    
    // Berechne Wochenumsatz
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weekSales = sales.filter(sale => {
      const saleDate = new Date(sale.date)
      return saleDate >= oneWeekAgo
    })
    const weekTotal = weekSales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
    
    // Berechne Vorwochenumsatz
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    const prevWeekSales = sales.filter(sale => {
      const saleDate = new Date(sale.date)
      return saleDate >= twoWeeksAgo && saleDate < oneWeekAgo
    })
    const prevWeekTotal = prevWeekSales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
    
    // Berechne prozentuale Veränderung der Woche
    const weekPercentChange = prevWeekTotal > 0 
      ? ((weekTotal - prevWeekTotal) / prevWeekTotal) * 100
      : 0
    
    const salesData = {
      daily: {
        date: today,
        total: todayTotal,
        previousDay: yesterdayTotal,
        percentChange: parseFloat(percentChange.toFixed(2))
      },
      weekly: {
        total: weekTotal,
        previousWeek: prevWeekTotal,
        percentChange: parseFloat(weekPercentChange.toFixed(2))
      }
    }

    return NextResponse.json(salesData)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der Umsätze' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { amount, date, description } = await request.json()

    if (!amount || !date) {
      return NextResponse.json(
        { error: 'Betrag und Datum sind erforderlich' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('sales')
      .insert([{ amount, date, description }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Fehler beim Speichern des Umsatzes' }, { status: 500 })
  }
}
