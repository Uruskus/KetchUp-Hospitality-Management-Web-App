'use client';

import { useState, useEffect } from 'react';
import type { InventoryItem } from '@/hooks/useInventory';

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (data: Omit<InventoryItem, 'id' | 'category'>) => void;
  onCancel: () => void;
}

export default function InventoryForm({ item, onSubmit, onCancel }: InventoryFormProps) {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'category'>>({
    name: '',
    description: '',
    quantity: 0,
    unit: '',
    minimum_quantity: 0,
    cost_per_unit: 0,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        minimum_quantity: item.minimum_quantity,
        cost_per_unit: item.cost_per_unit,
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Beschreibung
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
        />
      </div>

      {/* Kategorie-Auswahl wird hinzugefügt, sobald die Datenbank aktualisiert wurde */}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Bestand
          </label>
          <input
            type="number"
            id="quantity"
            value={formData.quantity.toString()}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value ? parseInt(e.target.value) : 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
            Einheit
          </label>
          <input
            type="text"
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="minimum_quantity" className="block text-sm font-medium text-gray-700">
            Mindestbestand
          </label>
          <input
            type="number"
            id="minimum_quantity"
            value={formData.minimum_quantity.toString()}
            onChange={(e) => setFormData({ ...formData, minimum_quantity: e.target.value ? parseInt(e.target.value) : 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="cost_per_unit" className="block text-sm font-medium text-gray-700">
            Preis pro Einheit
          </label>
          <input
            type="number"
            id="cost_per_unit"
            value={formData.cost_per_unit.toString()}
            onChange={(e) => setFormData({ ...formData, cost_per_unit: e.target.value ? parseFloat(e.target.value) : 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {item ? 'Aktualisieren' : 'Hinzufügen'}
        </button>
      </div>
    </form>
  );
}
