'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useInventory, type InventoryItem } from '@/hooks/useInventory';
import InventoryListSimple from '@/components/inventory/InventoryListSimple';
import InventoryForm from '@/components/inventory/InventoryForm';
import TransactionForm from '@/components/inventory/TransactionForm';
import { PlusCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ModalContent = {
  type: 'add' | 'edit' | 'transaction';
  item?: InventoryItem;
} | null;

export default function InventoryPage() {
  const { 
    items, 
    loading, 
    error, 
    addItem, 
    updateItem, 
    deleteItem, 
    addTransaction,
    getTotalInventoryValue,
    getLowStockItems
  } = useInventory();
  const [modalContent, setModalContent] = useState<ModalContent>(null);

  const handleSubmit = async (data: Omit<InventoryItem, 'id' | 'category'>) => {
    // Füge die category-Eigenschaft hinzu, da sie im Interface definiert ist, aber in der Datenbank noch nicht existiert
    const dataWithCategory = { ...data, category: 'supplies' as any };
    try {
      if (modalContent?.type === 'edit' && modalContent.item) {
        await updateItem(modalContent.item.id, dataWithCategory);
      } else {
        await addItem(dataWithCategory);
      }
      setModalContent(null);
    } catch (error) {
      console.error('Error:', error);
      // Hier könnte man einen Toast oder eine andere Fehlermeldung anzeigen
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Artikel löschen möchten?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Error:', error);
        // Hier könnte man einen Toast oder eine andere Fehlermeldung anzeigen
      }
    }
  };

  const handleTransaction = async (data: Parameters<typeof addTransaction>[0]) => {
    try {
      await addTransaction(data);
      setModalContent(null);
    } catch (error) {
      console.error('Error:', error);
      // Hier könnte man einen Toast oder eine andere Fehlermeldung anzeigen
    }
  };

  if (loading) {
    return <div className="text-center p-4">Laden...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">Fehler: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventar</h1>
        <div className="flex space-x-4">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Zurück zum Dashboard
          </Link>
          <button
            onClick={() => setModalContent({ type: 'add' })}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Artikel hinzufügen
          </button>
        </div>
      </div>
      
      {/* Inventar-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Gesamtbestand</CardTitle>
            <CardDescription>Aktueller Wert aller Artikel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getTotalInventoryValue().toFixed(2)} €</div>
            <div className="text-sm text-gray-500 mt-1">{items.length} Artikel im Inventar</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nachbestellungen</CardTitle>
            <CardDescription>Artikel unter Mindestbestand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getLowStockItems().length}</div>
            <div className="text-sm text-gray-500 mt-1">Artikel müssen nachbestellt werden</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventarliste */}
      <InventoryListSimple
        items={items}
        onEdit={(item) => setModalContent({ type: 'edit', item })}
        onDelete={handleDelete}
        onTransaction={(item) => setModalContent({ type: 'transaction', item })}
      />

      {modalContent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            {modalContent.type === 'transaction' && modalContent.item ? (
              <TransactionForm
                item={modalContent.item}
                onSubmit={handleTransaction}
                onCancel={() => setModalContent(null)}
              />
            ) : (
              <InventoryForm
                item={modalContent.type === 'edit' ? modalContent.item : undefined}
                onSubmit={handleSubmit}
                onCancel={() => setModalContent(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
