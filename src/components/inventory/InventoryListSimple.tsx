'use client';

import { useState } from 'react';
import type { InventoryItem } from '@/hooks/useInventory';
import { 
  PlusCircle, 
  MinusCircle, 
  Edit, 
  Trash2
} from 'lucide-react';

interface InventoryListSimpleProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onTransaction: (item: InventoryItem) => void;
}

export default function InventoryListSimple({ 
  items, 
  onEdit, 
  onDelete,
  onTransaction 
}: InventoryListSimpleProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bestand
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Einheit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mindestbestand
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preis/Einheit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gesamtwert
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className={item.quantity <= item.minimum_quantity ? 'bg-red-50' : ''}>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                {item.description && (
                  <div className="text-sm text-gray-500">{item.description}</div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{item.quantity}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{item.unit}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{item.minimum_quantity}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {item.cost_per_unit.toFixed(2)} €
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {(item.quantity * item.cost_per_unit).toFixed(2)} €
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onTransaction(item)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                    title="Eingang buchen"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onTransaction(item)}
                    className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                    title="Ausgang buchen"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Bearbeiten"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
