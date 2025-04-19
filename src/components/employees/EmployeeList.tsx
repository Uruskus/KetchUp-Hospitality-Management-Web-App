'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  is_working: boolean;
  start_date: string;
  avatarUrl: string;
  role: string;
  created_at: string;
}

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      
      // Stellen Sie sicher, dass data ein Array ist
      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (data && typeof data === 'object') {
        // Falls data ein Objekt mit einer employees-Eigenschaft ist
        if (Array.isArray(data.employees)) {
          setEmployees(data.employees);
        } else {
          console.error('Unexpected data format:', data);
          setEmployees([]);
        }
      } else {
        console.error('Unexpected data format:', data);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Mitarbeiter wirklich löschen?')) return;

    try {
      await fetch(`/api/employees`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      fetchEmployees(); // Aktualisiere die Liste
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="rounded-md border">
      {loading ? (
        <div className="p-4 text-center">Laden...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dabei seit</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={employee.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.email.split('@')[0]}&backgroundColor=b6e3f4,c0aede,d1d4f9`} 
                        alt={employee.name || ''} 
                      />
                      <AvatarFallback>{employee.name ? employee.name.split(' ').map(n => n[0]).join('') : '?'}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{employee.name}</span>
                  </div>
                </TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <Badge variant={employee.is_working ? "default" : "secondary"}>
                    {employee.is_working ? "Im Dienst" : "Nicht im Dienst"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(employee.start_date).toLocaleDateString('de-DE')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
