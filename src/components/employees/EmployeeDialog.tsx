'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  position: string;
  email: string;
  avatarUrl: string;
  loading: boolean;
}

export function EmployeeDialog({ open, onOpenChange }: EmployeeDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    position: '',
    email: '',
    avatarUrl: '',
    loading: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, loading: true }));

    try {
      console.log('Submitting employee data:', {
        name: formData.name,
        email: formData.email,
        position: formData.position
      });

      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          position: formData.position
        }),
      });

      const responseData = await response.json();
      console.log('Response from server:', responseData);

      if (!response.ok) {
        const errorMessage = responseData.details || responseData.error || 'Failed to create employee';
        throw new Error(errorMessage);
      }

      onOpenChange(false);
      setFormData({
        name: '',
        position: '',
        email: '',
        avatarUrl: '',
        loading: false,
      });

      // Refresh the employee list by triggering a page reload
      window.location.reload();
    } catch (error) {
      console.error('Error creating employee:', error);
      alert(`Fehler beim Erstellen des Mitarbeiters: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setFormData(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Neuer Mitarbeiter</DialogTitle>
            <DialogDescription>
              Fügen Sie hier die Details des neuen Mitarbeiters hinzu.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {formData.loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="flex justify-center py-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatarUrl} alt={formData.name || 'Avatar'} />
                  <AvatarFallback>{formData.name ? formData.name.split(' ').map(n => n[0]).join('') : '?'}</AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Position auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="kitchen">Küche</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Hinzufügen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
