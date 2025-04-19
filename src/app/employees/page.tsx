'use client';

import { EmployeeList } from '@/components/employees/EmployeeList';
import { EmployeeDialog } from '@/components/employees/EmployeeDialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function EmployeesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mitarbeiter</h1>
          <p className="text-gray-500">Verwalten Sie hier Ihre Mitarbeiter und sehen Sie, wer gerade im Dienst ist.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          Mitarbeiter hinzufügen
        </Button>
      </div>

      <EmployeeList />
      <EmployeeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
