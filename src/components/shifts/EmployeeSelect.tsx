"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Employee {
  id: string;
  name: string;
  position?: string;
  email?: string;
  role?: string;
}

interface EmployeeSelectProps {
  employees: Employee[];
  selectedEmployee?: string;
  onEmployeeSelect: (employeeId: string) => void;
}

export function EmployeeSelect({ employees, selectedEmployee, onEmployeeSelect }: EmployeeSelectProps) {
  return (
    <Select value={selectedEmployee} onValueChange={onEmployeeSelect}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Mitarbeiter auswählen" />
      </SelectTrigger>
      <SelectContent>
        {employees.map((employee) => (
          <SelectItem key={employee.id} value={employee.id}>
            {employee.name} ({employee.position})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
