'use client';

import { useState } from 'react';
import { 
  Beer, 
  Coffee, 
  Wine, 
  Utensils, 
  ShoppingBag, 
  Sandwich, 
  Pizza, 
  IceCream, 
  Beef, 
  Fish,
  Carrot,
  Apple,
  Milk,
  Egg
} from 'lucide-react';

export type InventoryCategory = 
  | 'beverages-alcoholic'
  | 'beverages-non-alcoholic'
  | 'food-fresh'
  | 'food-dry'
  | 'food-frozen'
  | 'food-prepared'
  | 'supplies'
  | 'all';

interface CategoryItem {
  id: InventoryCategory;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const categories: CategoryItem[] = [
  {
    id: 'all',
    name: 'Alle Artikel',
    icon: <ShoppingBag className="h-6 w-6" />,
    description: 'Alle Inventarartikel anzeigen'
  },
  {
    id: 'beverages-alcoholic',
    name: 'Alkoholische Getränke',
    icon: <Beer className="h-6 w-6" />,
    description: 'Bier, Wein, Spirituosen'
  },
  {
    id: 'beverages-non-alcoholic',
    name: 'Alkoholfreie Getränke',
    icon: <Coffee className="h-6 w-6" />,
    description: 'Kaffee, Tee, Säfte, Softdrinks'
  },
  {
    id: 'food-fresh',
    name: 'Frische Lebensmittel',
    icon: <Carrot className="h-6 w-6" />,
    description: 'Obst, Gemüse, frische Kräuter'
  },
  {
    id: 'food-dry',
    name: 'Trockene Lebensmittel',
    icon: <Sandwich className="h-6 w-6" />,
    description: 'Mehl, Reis, Nudeln, Konserven'
  },
  {
    id: 'food-frozen',
    name: 'Tiefkühlkost',
    icon: <IceCream className="h-6 w-6" />,
    description: 'Gefrorene Lebensmittel'
  },
  {
    id: 'food-prepared',
    name: 'Zubereitete Speisen',
    icon: <Pizza className="h-6 w-6" />,
    description: 'Vorgekochte Speisen, Desserts'
  },
  {
    id: 'supplies',
    name: 'Verbrauchsmaterial',
    icon: <Utensils className="h-6 w-6" />,
    description: 'Servietten, Einweggeschirr, Reinigungsmittel'
  }
];

interface InventoryCategoriesProps {
  selectedCategory: InventoryCategory;
  onSelectCategory: (category: InventoryCategory) => void;
}

export default function InventoryCategories({ 
  selectedCategory, 
  onSelectCategory 
}: InventoryCategoriesProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Kategorien</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="mb-2">
              {category.icon}
            </div>
            <span className="text-sm font-medium text-center">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Helper-Funktion zum Abrufen des Icons für eine bestimmte Kategorie
export function getCategoryIcon(category: InventoryCategory) {
  const found = categories.find(c => c.id === category);
  return found ? found.icon : <ShoppingBag className="h-6 w-6" />;
}

// Helper-Funktion zum Abrufen des Namens für eine bestimmte Kategorie
export function getCategoryName(category: InventoryCategory) {
  const found = categories.find(c => c.id === category);
  return found ? found.name : 'Unbekannte Kategorie';
}
