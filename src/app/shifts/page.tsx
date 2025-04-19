'use client';

import { ShiftCalendar } from '@/components/shifts/ShiftCalendar';

export default function ShiftsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Schichtplaner</h1>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            onClick={() => {
              // TODO: Implementiere Schicht-Export
              alert('Export-Funktion wird noch implementiert');
            }}
          >
            Export
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={() => {
              // TODO: Implementiere Schicht-Import
              alert('Import-Funktion wird noch implementiert');
            }}
          >
            Import
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ShiftCalendar />
      </div>
    </div>
  );
}
