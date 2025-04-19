'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { ShiftEvent } from './ShiftCalendar';

interface ShiftFormProps {
  initialData?: Partial<ShiftEvent>;
  onSubmit: (data: Omit<ShiftEvent, 'id'>) => void;
  onCancel: () => void;
}

export default function ShiftForm({ initialData, onSubmit, onCancel }: ShiftFormProps) {
  const [formData, setFormData] = useState({
    employee: initialData?.employee || '',
    date: initialData?.start ? format(initialData.start, 'yyyy-MM-dd') : '',
    startTime: initialData?.start ? format(initialData.start, 'HH:mm') : '',
    endTime: initialData?.end ? format(initialData.end, 'HH:mm') : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);
    
    onSubmit({
      title: `${formData.employee}'s Shift`,
      employee: formData.employee,
      start,
      end,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="employee" className="block text-sm font-medium text-gray-700">
          Employee
        </label>
        <input
          type="text"
          id="employee"
          value={formData.employee}
          onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
          Start Time
        </label>
        <input
          type="time"
          id="startTime"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
          End Time
        </label>
        <input
          type="time"
          id="endTime"
          value={formData.endTime}
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save Shift
        </button>
      </div>
    </form>
  );
}
