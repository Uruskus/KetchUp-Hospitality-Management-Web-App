'use client';

import { useState } from 'react';
import type { InventoryItem } from '@/hooks/useInventory';
import { InventoryCategory, getCategoryIcon } from './InventoryCategories';
import { 
  PlusCircle, 
  MinusCircle, 
  Edit, 
  Trash2, 
  BarChart3, 
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onTransaction: (item: InventoryItem) => void;
  selectedCategory: InventoryCategory;
}

type SortField = 'name' | 'quantity' | 'cost_per_unit';
type SortDirection = 'asc' | 'desc';

export default function InventoryList({ 
  items, 
  onEdit, 
  onDelete,
  onTransaction,
  selectedCategory
}: InventoryListProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState('grid');

  // Filter items by category
  const filteredItems = items.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === 'quantity') {
      return sortDirection === 'asc'
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    } else if (sortField === 'cost_per_unit') {
      return sortDirection === 'asc'
        ? a.cost_per_unit - b.cost_per_unit
        : b.cost_per_unit - a.cost_per_unit;
    }
    return 0;
  });

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate stock level percentage
  const getStockLevelPercentage = (item: InventoryItem) => {
    // If minimum_quantity is 0, we can't calculate a meaningful percentage
    if (item.minimum_quantity === 0) return 100;
    
    // Calculate what percentage of the minimum quantity we have
    // We multiply by 2 to make the progress bar more meaningful (50% = minimum level)
    const percentage = (item.quantity / item.minimum_quantity) * 100;
    
    // Cap at 100% for visual purposes
    return Math.min(percentage, 100);
  };

  // Get color based on stock level
  const getStockLevelColor = (item: InventoryItem) => {
    const ratio = item.quantity / item.minimum_quantity;
    if (ratio <= 0.5) return 'bg-red-500'; // Critical
    if (ratio <= 1) return 'bg-amber-500'; // Warning
    if (ratio <= 2) return 'bg-green-500'; // Good
    return 'bg-blue-500'; // Excellent
  };

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}
            >
              Kacheln
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}
            >
              Tabelle
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sortieren nach:</span>
            <button
              onClick={() => handleSort('name')}
              className={`flex items-center px-2 py-1 rounded ${sortField === 'name' ? 'bg-gray-100' : ''}`}
            >
              Name {sortField === 'name' && <ArrowUpDown className="ml-1 h-3 w-3" />}
            </button>
            <button
              onClick={() => handleSort('quantity')}
              className={`flex items-center px-2 py-1 rounded ${sortField === 'quantity' ? 'bg-gray-100' : ''}`}
            >
              Bestand {sortField === 'quantity' && <ArrowUpDown className="ml-1 h-3 w-3" />}
            </button>
            <button
              onClick={() => handleSort('cost_per_unit')}
              className={`flex items-center px-2 py-1 rounded ${sortField === 'cost_per_unit' ? 'bg-gray-100' : ''}`}
            >
              Preis {sortField === 'cost_per_unit' && <ArrowUpDown className="ml-1 h-3 w-3" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedItems.map((item) => (
            <Card key={item.id} className={item.quantity <= item.minimum_quantity ? 'border-red-300' : ''}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      {item.category ? getCategoryIcon(item.category as InventoryCategory) : null}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      {item.description && (
                        <CardDescription className="text-sm">{item.description}</CardDescription>
                      )}
                    </div>
                  </div>
                  {item.quantity <= item.minimum_quantity && (
                    <Badge variant="destructive" className="ml-2">
                      <AlertTriangle className="h-3 w-3 mr-1" /> Nachbestellen
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Bestand:</span>
                    <span className="font-bold">{item.quantity} {item.unit}</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Mindestbestand: {item.minimum_quantity} {item.unit}</span>
                      <span className="font-medium">
                        {Math.round((item.quantity / item.minimum_quantity) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={getStockLevelPercentage(item)} 
                      className={`h-2 ${getStockLevelColor(item)}`} 
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Preis/Einheit:</span>
                    <span className="font-bold">{item.cost_per_unit.toFixed(2)} €</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Gesamtwert:</span>
                    <span className="font-bold">{(item.quantity * item.cost_per_unit).toFixed(2)} €</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onTransaction(item)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                    title="Eingang buchen"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onTransaction(item)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-full"
                    title="Ausgang buchen"
                  >
                    <MinusCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Bearbeiten"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Löschen"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={() => window.alert('Statistik wird in Kürze verfügbar sein')}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                  title="Statistik anzeigen"
                >
                  <BarChart3 className="h-5 w-5" />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Table view
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}
          >
            Kacheln
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}
          >
            Tabelle
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortField === 'name' && (
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategorie
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center">
                  Bestand
                  {sortField === 'quantity' && (
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Einheit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mindestbestand
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('cost_per_unit')}
              >
                <div className="flex items-center">
                  Preis/Einheit
                  {sortField === 'cost_per_unit' && (
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedItems.map((item) => (
              <tr key={item.id} className={item.quantity <= item.minimum_quantity ? 'bg-red-50' : ''}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-full mr-3">
                      {item.category ? getCategoryIcon(item.category as InventoryCategory) : null}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500">{item.description}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{item.category || 'Keine Kategorie'}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <div className="text-sm font-medium text-gray-900">{item.quantity}</div>
                    </div>
                    <div className="w-24">
                      <Progress 
                        value={getStockLevelPercentage(item)} 
                        className={`h-2 ${getStockLevelColor(item)}`} 
                      />
                    </div>
                  </div>
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
    </div>
  );
}
