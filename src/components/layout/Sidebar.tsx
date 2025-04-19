'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CalendarDays,
  Package,
  Users,
  CheckSquare,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Schichten', href: '/shifts', icon: CalendarDays },
  { name: 'Inventar', href: '/inventory', icon: Package },
  { name: 'Mitarbeiter', href: '/employees', icon: Users },
  { name: 'Aufgaben', href: '/tasks', icon: CheckSquare },
  { name: 'Einstellungen', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-full bg-blue-800">
      <div className="sticky top-0 flex flex-col min-h-full">
        <div className="flex items-center justify-center h-16 border-b border-blue-700">
          <h1 className="text-xl font-bold text-white">KetchUp</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-2 text-blue-100 rounded-lg hover:bg-blue-700 transition-colors',
                  isActive ? 'bg-blue-700' : ''
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
