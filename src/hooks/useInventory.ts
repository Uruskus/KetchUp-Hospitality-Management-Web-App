'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { InventoryCategory } from '@/components/inventory/InventoryCategories';

export interface InventoryItem {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: string;
  minimum_quantity: number;
  cost_per_unit: number;
  category: InventoryCategory;
  transaction_type?: 'in' | 'out';
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  quantity: number;
  transaction_type: 'in' | 'out';
  notes: string | null;
  created_at: string;
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    categoryCounts: Record<InventoryCategory, number>;
  }>({ 
    totalItems: 0, 
    totalValue: 0, 
    lowStockItems: 0,
    categoryCounts: {
      'all': 0,
      'beverages-alcoholic': 0,
      'beverages-non-alcoholic': 0,
      'food-fresh': 0,
      'food-dry': 0,
      'food-frozen': 0,
      'food-prepared': 0,
      'supplies': 0
    }
  });

  useEffect(() => {
    fetchItems();
  }, []);
  
  // Berechne Statistiken, wenn sich die Items ändern
  useEffect(() => {
    calculateStats();
  }, [items]);
  
  // Berechne Statistiken für das Dashboard
  const calculateStats = () => {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.cost_per_unit), 0);
    const lowStockItems = items.filter(item => item.quantity <= item.minimum_quantity).length;
    
    // Zähle Items nach Kategorien
    const categoryCounts = items.reduce((counts, item) => {
      const category = item.category || 'all';
      counts[category] = (counts[category] || 0) + 1;
      counts['all'] += 1;
      return counts;
    }, { 
      'all': 0,
      'beverages-alcoholic': 0,
      'beverages-non-alcoholic': 0,
      'food-fresh': 0,
      'food-dry': 0,
      'food-frozen': 0,
      'food-prepared': 0,
      'supplies': 0
    } as Record<InventoryCategory, number>);
    
    setStats({ totalItems, totalValue, lowStockItems, categoryCounts });
  };

  const fetchItems = async () => {
    try {
      const { data: items, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      // Da die category-Spalte noch nicht existiert, fügen wir sie manuell hinzu
      const itemsWithCategory = items.map((item: any) => {
        // Bestimme eine Kategorie basierend auf dem Namen des Artikels
        let category: InventoryCategory = 'supplies';
        
        const name = item.name.toLowerCase();
        if (name.includes('bier') || name.includes('wein') || name.includes('schnaps')) {
          category = 'beverages-alcoholic';
        } else if (name.includes('saft') || name.includes('wasser') || name.includes('kaffee') || name.includes('tee')) {
          category = 'beverages-non-alcoholic';
        } else if (name.includes('obst') || name.includes('gemüse') || name.includes('salat')) {
          category = 'food-fresh';
        } else if (name.includes('mehl') || name.includes('zucker') || name.includes('reis') || name.includes('nudel')) {
          category = 'food-dry';
        } else if (name.includes('eis') || name.includes('tiefkühl') || name.includes('gefrier')) {
          category = 'food-frozen';
        } else if (name.includes('fertig') || name.includes('zubereitet') || name.includes('dessert')) {
          category = 'food-prepared';
        }
        
        return {
          ...item,
          category
        };
      });
      
      setItems(itemsWithCategory);
    } catch (err) {
      console.error('Fehler beim Laden des Inventars:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Laden des Inventars');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<InventoryItem, 'id'>) => {
    try {
      // Entferne die category-Eigenschaft, da sie noch nicht in der Datenbank existiert
      const { category, ...itemWithoutCategory } = item;
      
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([itemWithoutCategory])
        .select()
        .single();

      if (error) throw error;
      
      await fetchItems();
      return data;
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Artikels:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Hinzufügen des Artikels');
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<Omit<InventoryItem, 'id'>>) => {
    try {
      // Entferne die category-Eigenschaft, da sie noch nicht in der Datenbank existiert
      const { category, ...updatesWithoutCategory } = updates;
      
      const { error } = await supabase
        .from('inventory_items')
        .update(updatesWithoutCategory)
        .eq('id', id);

      if (error) throw error;
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren des Artikels');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen des Artikels');
      throw err;
    }
  };

  const addTransaction = async (transaction: Omit<InventoryTransaction, 'id' | 'created_at'>) => {
    try {
      // Start a transaction
      const { data: item } = await supabase
        .from('inventory_items')
        .select('quantity')
        .eq('id', transaction.item_id)
        .single();

      if (!item) throw new Error('Artikel nicht gefunden');

      const newQuantity = transaction.transaction_type === 'in'
        ? item.quantity + transaction.quantity
        : item.quantity - transaction.quantity;

      if (newQuantity < 0) throw new Error('Nicht genügend Lagerbestand');

      // Update inventory quantity
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ quantity: newQuantity })
        .eq('id', transaction.item_id);

      if (updateError) throw updateError;

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('inventory_transactions')
        .insert([transaction]);

      if (transactionError) throw transactionError;

      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler bei der Transaktion');
      throw err;
    }
  };

  // Filtere Items nach Kategorie
  const getItemsByCategory = (category: InventoryCategory) => {
    if (category === 'all') return items;
    return items.filter(item => item.category === category);
  };
  
  // Berechne den Gesamtwert des Inventars
  const getTotalInventoryValue = () => {
    return items.reduce((total, item) => total + (item.quantity * item.cost_per_unit), 0);
  };
  
  // Berechne den Wert pro Kategorie
  const getValueByCategory = (category: InventoryCategory) => {
    const categoryItems = getItemsByCategory(category);
    return categoryItems.reduce((total, item) => total + (item.quantity * item.cost_per_unit), 0);
  };
  
  // Finde Items mit niedrigem Bestand
  const getLowStockItems = () => {
    return items.filter(item => item.quantity <= item.minimum_quantity);
  };

  return {
    items,
    loading,
    error,
    stats,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    addTransaction,
    getItemsByCategory,
    getTotalInventoryValue,
    getValueByCategory,
    getLowStockItems
  };
}
