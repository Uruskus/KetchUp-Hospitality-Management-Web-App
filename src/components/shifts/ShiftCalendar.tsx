'use client';

import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import deLocale from '@fullcalendar/core/locales/de';
import { EmployeeSelect } from './EmployeeSelect';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Clock, Edit, Trash2, User, X } from 'lucide-react';

interface Shift {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'morning' | 'afternoon' | 'evening' | 'night';
  employeeId: string;
  extendedProps?: {
    employee?: Employee;
  };
}

interface Employee {
  id: string;
  name: string;
  email: string;
  position?: string;
  role: string;
}

// Echte Mitarbeiterdaten werden aus der API geladen

const shiftColors = {
  morning: {
    background: '#fce7f3',  // Pastellrosa
    text: '#9d174d'
  },
  afternoon: {
    background: '#dbeafe',  // Pastellblau
    text: '#1e40af'
  },
  evening: {
    background: '#dcfce7',  // Pastellgrün
    text: '#166534'
  },
  night: {
    background: '#f3e8ff',  // Pastellviolett
    text: '#6b21a8'
  }
};

export const ShiftCalendar = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentShift, setCurrentShift] = useState<Partial<Shift> | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{x: number, y: number} | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const calendarRef = useRef<any>(null);
  
  // Lade Mitarbeiterdaten beim Komponenten-Mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setEmployees(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    };
    
    const fetchShifts = async () => {
      try {
        const response = await fetch('/api/shifts');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Konvertiere die Schichten in das Format, das FullCalendar erwartet
          const formattedShifts = data.map(shift => {
            const employee = employees.find(emp => emp.id === shift.employee_id);
            
            return {
              id: shift.id,
              title: shift.employees?.name || employee?.name || 'Unbekannt',
              start: shift.start_time,
              end: shift.end_time,
              employeeId: shift.employee_id,
              type: getShiftType(new Date(shift.start_time)),
              extendedProps: {
                employee
              }
            };
          });
          
          setShifts(formattedShifts);
        }
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };
    
    fetchEmployees();
    fetchShifts();
  }, [employees.length]);
  
  // Bestimme den Schichttyp basierend auf der Startzeit
  const getShiftType = (startTime: Date): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = startTime.getHours();
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  };

  // Öffne Dialog für neue Schicht
  const handleDateSelect = (selectInfo: any) => {
    if (selectedEmployee) {
      const employee = employees.find(emp => emp.id === selectedEmployee);
      const startDate = new Date(selectInfo.startStr);
      const endDate = new Date(selectInfo.endStr);
      
      setCurrentShift({
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        employeeId: selectedEmployee,
        type: getShiftType(startDate),
        title: employee?.name || 'Neue Schicht'
      });
      
      setIsEditMode(false);
      setIsShiftDialogOpen(true);
    }
    
    selectInfo.view.calendar.unselect();
  };

  // Rechtsklick auf Schicht
  const handleEventRightClick = (info: any) => {
    info.jsEvent.preventDefault();
    setSelectedEvent(info.event);
    setContextMenuPosition({ x: info.jsEvent.clientX, y: info.jsEvent.clientY });
  };
  
  // Schließe Kontextmenü beim Klick außerhalb
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenuPosition(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Bearbeite Schicht
  const handleEditShift = () => {
    if (!selectedEvent) return;
    
    setCurrentShift({
      id: selectedEvent.id,
      title: selectedEvent.title,
      start: selectedEvent.startStr,
      end: selectedEvent.endStr,
      employeeId: selectedEvent.extendedProps?.employeeId,
      type: selectedEvent.extendedProps?.type || getShiftType(new Date(selectedEvent.startStr))
    });
    
    setIsEditMode(true);
    setIsShiftDialogOpen(true);
    setContextMenuPosition(null);
  };
  
  // Lösche Schicht
  const handleDeleteShift = () => {
    if (!selectedEvent) return;
    
    setShifts(shifts.filter(shift => shift.id !== selectedEvent.id));
    setContextMenuPosition(null);
    
    // TODO: API-Aufruf zum Löschen der Schicht
  };
  
  // Ändere Mitarbeiter der Schicht
  const handleChangeEmployee = (employeeId: string) => {
    if (!selectedEvent) return;
    
    const updatedShifts = shifts.map(shift => {
      if (shift.id === selectedEvent.id) {
        const employee = employees.find(emp => emp.id === employeeId);
        return {
          ...shift,
          employeeId,
          title: employee?.name || 'Unbekannt',
          extendedProps: {
            ...shift.extendedProps,
            employee
          }
        };
      }
      return shift;
    });
    
    setShifts(updatedShifts);
    setContextMenuPosition(null);
    
    // TODO: API-Aufruf zum Aktualisieren der Schicht
  };
  
  // Speichere neue oder bearbeitete Schicht
  const handleSaveShift = () => {
    if (!currentShift) return;
    
    if (isEditMode && currentShift.id) {
      // Aktualisiere bestehende Schicht
      const updatedShifts = shifts.map(shift => {
        if (shift.id === currentShift.id) {
          const employee = employees.find(emp => emp.id === currentShift.employeeId);
          return {
            ...currentShift,
            title: employee?.name || currentShift.title || 'Unbekannt',
            extendedProps: {
              employee
            }
          } as Shift;
        }
        return shift;
      });
      
      setShifts(updatedShifts);
      // TODO: API-Aufruf zum Aktualisieren der Schicht
    } else {
      // Erstelle neue Schicht
      const employee = employees.find(emp => emp.id === currentShift.employeeId);
      const newShift: Shift = {
        id: String(Date.now()),
        title: employee?.name || currentShift.title || 'Unbekannt',
        start: currentShift.start!,
        end: currentShift.end!,
        type: currentShift.type || 'morning',
        employeeId: currentShift.employeeId!,
        extendedProps: {
          employee
        }
      };
      
      setShifts([...shifts, newShift]);
      // TODO: API-Aufruf zum Erstellen der Schicht
    }
    
    setIsShiftDialogOpen(false);
    setCurrentShift(null);
  };
  
  // Event-Drag-and-Drop
  const handleEventDrop = (info: any) => {
    const { event } = info;
    
    const updatedShifts = shifts.map(shift => {
      if (shift.id === event.id) {
        return {
          ...shift,
          start: event.startStr,
          end: event.endStr,
          type: getShiftType(new Date(event.startStr))
        };
      }
      return shift;
    });
    
    setShifts(updatedShifts);
    // TODO: API-Aufruf zum Aktualisieren der Schicht
  };
  
  // Event-Resize
  const handleEventResize = (info: any) => {
    const { event } = info;
    
    const updatedShifts = shifts.map(shift => {
      if (shift.id === event.id) {
        return {
          ...shift,
          start: event.startStr,
          end: event.endStr
        };
      }
      return shift;
    });
    
    setShifts(updatedShifts);
    // TODO: API-Aufruf zum Aktualisieren der Schicht
  };

  return (
    <div className='p-4 space-y-4'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-4'>
          <EmployeeSelect
            employees={employees}
            selectedEmployee={selectedEmployee}
            onEmployeeSelect={setSelectedEmployee}
          />
          {selectedEmployee ? (
            <span className='text-sm text-gray-500 flex items-center gap-2'>
              <Calendar className="h-4 w-4" />
              Klicken Sie auf einen Zeitslot, um eine Schicht hinzuzufügen
            </span>
          ) : (
            <span className='text-sm text-gray-500 flex items-center gap-2'>
              <User className="h-4 w-4" />
              Bitte wählen Sie zuerst einen Mitarbeiter aus
            </span>
          )}
        </div>
      </div>

      {/* macOS-ähnlicher Kalender */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView='timeGridWeek'
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale={deLocale}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={shifts.map(shift => ({
            ...shift,
            backgroundColor: shiftColors[shift.type].background,
            textColor: shiftColors[shift.type].text,
            borderColor: shiftColors[shift.type].text
          }))}
          select={handleDateSelect}
          eventClick={(info) => setSelectedEvent(info.event)}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          height='auto'
          allDaySlot={false}
          slotMinTime='06:00:00'
          slotMaxTime='23:00:00'
          slotDuration='00:30:00'
          expandRows={true}
          stickyHeaderDates={true}
          nowIndicator={true}
          editable={true}
          eventResizableFromStart={true}
          eventContent={(eventInfo) => (
            <div 
              className="p-1 w-full h-full rounded overflow-hidden flex flex-col"
              onContextMenu={(e) => {
                e.preventDefault();
                setSelectedEvent(eventInfo.event);
                setContextMenuPosition({ x: e.clientX, y: e.clientY });
              }}
            >
              <div className="text-xs font-semibold truncate">{eventInfo.event.title}</div>
              <div className="text-xs opacity-80 truncate">
                {new Date(eventInfo.event.start!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                {eventInfo.event.end ? new Date(eventInfo.event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '?'}
              </div>
            </div>
          )}
        />
      </div>
      
      {/* Kontextmenü für Schichten */}
      {contextMenuPosition && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-lg border overflow-hidden py-1"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            onClick={handleEditShift}
          >
            <Edit className="h-4 w-4" />
            Bearbeiten
          </button>
          
          <div className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4" />
              Mitarbeiter zuweisen
            </div>
            <Select 
              value={selectedEvent?.extendedProps?.employeeId || ''}
              onValueChange={handleChangeEmployee}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Mitarbeiter auswählen" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <button 
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            onClick={handleDeleteShift}
          >
            <Trash2 className="h-4 w-4" />
            Löschen
          </button>
        </div>
      )}
      
      {/* Dialog für neue/bearbeitete Schicht */}
      <Dialog open={isShiftDialogOpen} onOpenChange={setIsShiftDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Schicht bearbeiten' : 'Neue Schicht'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Bearbeiten Sie die Details der ausgewählten Schicht.' 
                : 'Fügen Sie eine neue Schicht für den ausgewählten Mitarbeiter hinzu.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">Mitarbeiter</Label>
              <div className="col-span-3">
                <Select 
                  value={currentShift?.employeeId} 
                  onValueChange={(value) => setCurrentShift({...currentShift, employeeId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mitarbeiter auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shift-type" className="text-right">Schichttyp</Label>
              <div className="col-span-3">
                <Select 
                  value={currentShift?.type} 
                  onValueChange={(value: any) => setCurrentShift({...currentShift, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Schichttyp auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Frühschicht</SelectItem>
                    <SelectItem value="afternoon">Mittagsschicht</SelectItem>
                    <SelectItem value="evening">Abendschicht</SelectItem>
                    <SelectItem value="night">Nachtschicht</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-time" className="text-right">Startzeit</Label>
              <Input
                id="start-time"
                type="datetime-local"
                value={currentShift?.start ? new Date(currentShift.start).toISOString().slice(0, 16) : ''}
                onChange={(e) => setCurrentShift({...currentShift, start: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-time" className="text-right">Endzeit</Label>
              <Input
                id="end-time"
                type="datetime-local"
                value={currentShift?.end ? new Date(currentShift.end).toISOString().slice(0, 16) : ''}
                onChange={(e) => setCurrentShift({...currentShift, end: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShiftDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSaveShift}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
