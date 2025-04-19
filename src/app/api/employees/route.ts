import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

// Minimalistische API-Route für Supabase

export async function GET() {
  try {
    console.log('Fetching employees from Supabase...');
    
    const { data, error } = await supabase
      .from('employees')
      .select();
    
    if (error) {
      console.error('Error fetching employees:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('Employees fetched successfully:', data);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('Creating new employee in Supabase...');
    const { name, email, position } = await request.json();
    console.log('Employee data:', { name, email, position });

    // Validierung
    if (!name || !email) {
      return NextResponse.json({ 
        error: "Name and email are required" 
      }, { status: 400 });
    }

    // Generiere Avatar-URL
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email.split('@')[0]}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    
    // Mitarbeiterobjekt mit Avatar
    const newEmployee = { 
      name, 
      email,
      // Nur die Felder, die definitiv in der Tabelle existieren
      role: 'employee',
      // Versuche das Avatar-Feld hinzuzufügen, falls es existiert
      avatarUrl
    };
    
    console.log('Inserting employee with data:', newEmployee);

    // Einfügen des Mitarbeiters
    const { data, error } = await supabase
      .from('employees')
      .insert(newEmployee);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ 
        error: error.message
      }, { status: 500 });
    }

    console.log('Employee created successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ 
      error: "Failed to create employee"
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    console.log('Deleting employee with ID:', id);
    
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting employee:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('Employee deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
