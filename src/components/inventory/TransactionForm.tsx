'use client';

import { useState } from 'react';
import type { InventoryItem, InventoryTransaction } from '@/hooks/useInventory';

interface TransactionFormProps {
  item: InventoryItem;
  onSubmit: (transaction: Omit<InventoryTransaction, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export default function TransactionForm({ item, onSubmit, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState<Omit<InventoryTransaction, 'id' | 'created_at'>>({
    item_id: item.id,
    quantity: 1,
    transaction_type: 'in',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-lg font-medium text-gray-900 mb-4">
        Transaktion für: {item.name}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="transaction_type" className="block text-sm font-medium text-gray-700">
            Transaktionstyp
          </label>
          <select
            id="transaction_type"
            value={formData.transaction_type}
            onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as 'in' | 'out' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="in">Eingang</option>
            <option value="out">Ausgang</option>
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Menge
          </label>
          <input
            type="number"
            id="quantity"
            value={formData.quantity.toString()}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value ? parseInt(e.target.value) : 1 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="1"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notizen
        </label>
        <textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
        />
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
          Transaktion durchführen
        </button>
      </div>
    </form>
  );
}
