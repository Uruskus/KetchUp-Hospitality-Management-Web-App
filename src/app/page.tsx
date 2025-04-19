'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, Package, EuroIcon, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  is_working?: boolean;
}

interface Shift {
  id: string;
  start_time: string;
  end_time: string;
  employee_id: string;
  employees?: {
    name: string;
    email: string;
  };
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  min_quantity: number;
  category: string;
}

interface SalesData {
  daily: {
    date: string;
    total: number;
    previousDay: number;
    percentChange: number;
  };
  weekly: {
    total: number;
    previousWeek: number;
    percentChange: number;
  };
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Lade Mitarbeiterdaten
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setEmployees(data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    
    // Lade Schichtdaten
    const fetchShifts = async () => {
      try {
        const response = await fetch('/api/shifts');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setShifts(data);
        }
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };
    
    // Lade Inventardaten
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setInventory(data);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    
    // Lade Umsatzdaten
    const fetchSales = async () => {
      try {
        const response = await fetch('/api/sales');
        const data = await response.json();
        
        setSales(data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
    fetchShifts();
    fetchInventory();
    fetchSales();
  }, []);
  
  // Berechne aktive Schichten (heute)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const activeShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.start_time);
    return shiftDate.getDate() === today.getDate() && 
           shiftDate.getMonth() === today.getMonth() && 
           shiftDate.getFullYear() === today.getFullYear();
  });
  
  // Berechne aktive Mitarbeiter (heute im Dienst)
  const activeEmployees = employees.filter(employee => employee.is_working);
  
  // Berechne Artikel mit niedrigem Bestand
  const lowStockItems = inventory.filter(item => item.quantity <= item.min_quantity);
  
  // Formatiere Währungsbeträge
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quick Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Schichten</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeShifts.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeShifts.length > 0 ? '+1 seit gestern' : 'Keine Änderung'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Mitarbeiter</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees.length}</div>
            <p className="text-xs text-muted-foreground">
              {employees.length} Mitarbeiter insgesamt
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bestand (niedrig)</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockItems.length > 0 ? (
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  <Link href="/inventory" className="text-blue-500 hover:underline">Nachbestellen</Link>
                </span>
              ) : (
                <span>Alle Artikel auf Lager</span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tagesumsatz</CardTitle>
            <EuroIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sales && sales.daily && typeof sales.daily.total === 'number' 
                ? formatCurrency(sales.daily.total) 
                : '€0,00'}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {sales && sales.daily && typeof sales.daily.percentChange === 'number' && sales.daily.percentChange > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+{sales.daily.percentChange.toFixed(1)}%</span> seit gestern
                </>
              ) : sales && sales.daily && typeof sales.daily.percentChange === 'number' && sales.daily.percentChange < 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                  <span className="text-red-500">{sales.daily.percentChange.toFixed(1)}%</span> seit gestern
                </>
              ) : (
                <>Keine Änderung seit gestern</>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Aktuelle Mitarbeiter */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Aktuelle Mitarbeiter</h2>
          <Link href="/employees">
            <Button variant="outline" size="sm">Alle anzeigen</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p>Lade Mitarbeiterdaten...</p>
          ) : employees.length === 0 ? (
            <p>Keine Mitarbeiter gefunden.</p>
          ) : (
            employees.slice(0, 3).map(employee => (
              <Card key={employee.id}>
                <CardContent className="p-4 flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.email.split('@')[0]}&backgroundColor=b6e3f4,c0aede,d1d4f9`} 
                      alt={employee.name} 
                    />
                    <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.role}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${employee.is_working ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {employee.is_working ? 'Im Dienst' : 'Nicht im Dienst'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Heutige Schichten */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Heutige Schichten</h2>
          <Link href="/shifts">
            <Button variant="outline" size="sm">Alle anzeigen</Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-4">Lade Schichtdaten...</p>
          ) : activeShifts.length === 0 ? (
            <p className="p-4">Keine Schichten für heute gefunden.</p>
          ) : (
            activeShifts.map(shift => {
              const startTime = new Date(shift.start_time);
              const endTime = shift.end_time ? new Date(shift.end_time) : null;
              
              return (
                <div key={shift.id} className="p-4 border-b flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{shift.employees?.name || 'Unbekannter Mitarbeiter'}</p>
                    <p className="text-xs text-gray-500">
                      {startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                      {endTime ? endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Offen'}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
