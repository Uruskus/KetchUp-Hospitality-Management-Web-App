'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { ShiftEvent } from '@/components/shifts/ShiftCalendar';

export function useShifts() {
  const [shifts, setShifts] = useState<ShiftEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select(`
          *,
          employees (
            name,
            email
          )
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;

      // Transform the data to match our ShiftEvent type
      const transformedShifts: ShiftEvent[] = data.map((shift) => ({
        id: shift.id,
        title: `${shift.employees.name}'s Shift`,
        employee: shift.employees.name,
        start: new Date(shift.start_time),
        end: new Date(shift.end_time),
      }));

      setShifts(transformedShifts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching shifts');
    } finally {
      setLoading(false);
    }
  };

  const addShift = async (shiftData: Omit<ShiftEvent, 'id'>) => {
    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('name', shiftData.employee)
        .single();

      if (!employee) throw new Error('Employee not found');

      const { data, error } = await supabase
        .from('shifts')
        .insert([
          {
            employee_id: employee.id,
            start_time: shiftData.start.toISOString(),
            end_time: shiftData.end.toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await fetchShifts(); // Refresh the shifts list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding shift');
      throw err;
    }
  };

  const updateShift = async (id: string, shiftData: Omit<ShiftEvent, 'id'>) => {
    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('name', shiftData.employee)
        .single();

      if (!employee) throw new Error('Employee not found');

      const { error } = await supabase
        .from('shifts')
        .update({
          employee_id: employee.id,
          start_time: shiftData.start.toISOString(),
          end_time: shiftData.end.toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      await fetchShifts(); // Refresh the shifts list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating shift');
      throw err;
    }
  };

  const deleteShift = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchShifts(); // Refresh the shifts list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting shift');
      throw err;
    }
  };

  return {
    shifts,
    loading,
    error,
    addShift,
    updateShift,
    deleteShift,
    refreshShifts: fetchShifts,
  };
}
