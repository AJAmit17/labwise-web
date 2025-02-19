/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departments, academicYears, years } from '@/constants/academicData';
import type { TimeTableSlot, AvailableSlot, TimeTable } from '@/types/timetable';
import { X, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Label } from '@/components/ui/label';
import { requireTeacher } from '@/lib/session';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'break';
  label?: string;
}

const initialSlot: Omit<AvailableSlot, 'id'> = {
  subject: '',
  subjectCode: '',
  professor: '',
  type: 'class',
};

const sections = ['A', 'B', 'C', 'D', 'E'] as const;

const isTimeOverlapping = (start1: string, end1: string, start2: string, end2: string) => {
  const [h1, m1] = start1.split(':').map(Number);
  const [h2, m2] = end1.split(':').map(Number);
  const [h3, m3] = start2.split(':').map(Number);
  const [h4, m4] = end2.split(':').map(Number);

  const time1 = h1 * 60 + m1;
  const time2 = h2 * 60 + m2;
  const time3 = h3 * 60 + m3;
  const time4 = h4 * 60 + m4;

  return (time1 < time4 && time2 > time3);
};


export default async function AddTimeTablePage() {
  await requireTeacher();
  return <TimeTablePage />;
}

function TimeTablePage() {
  const [department, setDepartment] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [slots, setSlots] = useState<TimeTableSlot[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([
    { id: 'slot-1', ...initialSlot },
    { id: 'slot-2', ...initialSlot },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingTimeTable, setExistingTimeTable] = useState<TimeTable | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      startTime: '09:00',
      endTime: '10:00',
      type: 'class'
    }
  ]);

  // Load existing time table when department, year, academicYear, and section change
  useEffect(() => {
    const fetchTimeTable = async () => {
      if (!department || !year || !academicYear || !section) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/time-table?department=${department}&year=${year}&academicYear=${academicYear}&section=${section}`
        );
        const data = await response.json();

        if (data.success && data.timeTables.length > 0) {
          setExistingTimeTable(data.timeTables[0]);

          // Extract unique time slots from existing data
          const uniqueTimeSlots = Array.from(
            new Set(
              data.timeTables[0].slots.map((slot: TimeTableSlot) =>
                `${slot.startTime}-${slot.endTime}`
              )
            )
          );

          // Create time slots array
          const newTimeSlots: TimeSlot[] = uniqueTimeSlots.map((timeSlot: unknown, index) => {
            const [startTime, endTime] = (timeSlot as string).split('-');
            return {
              id: `existing-${index}`,
              startTime,
              endTime,
              type: 'class' as const
            };
          }).sort((a, b) => a.startTime.localeCompare(b.startTime));

          setTimeSlots(newTimeSlots);

          // Set existing slots
          setSlots(data.timeTables[0].slots.map((slot: TimeTableSlot) => ({
            ...slot,
            type: 'class',
            id: `slot-${Math.random()}`
          })));

          toast.info('Loaded existing time table');
        } else {
          setExistingTimeTable(null);
          setSlots([]);
          setTimeSlots([{
            id: '1',
            startTime: '09:00',
            endTime: '10:00',
            type: 'class'
          }]);
        }
      } catch (error) {
        console.error('Error fetching time table:', error);
        toast.error('Failed to load existing time table');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeTable();
  }, [department, year, academicYear, section]);

  const deleteSlot = (slotId: string) => {
    setSlots(slots.filter(slot => slot.id !== slotId));
    toast.success('Slot deleted successfully');
  };

  const deleteAvailableSlot = (slotId: string) => {
    setAvailableSlots(availableSlots.filter(slot => slot.id !== slotId));
    toast.success('Available slot deleted');
  };

  const clearAllSlots = () => {
    setSlots([]);
    toast.success('All slots cleared');
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const [targetDay, targetTime] = destination.droppableId.split('|');

    if (source.droppableId === 'available-slots' && targetDay && targetTime) {
      const sourceSlot = availableSlots[source.index];
      const [startTime, endTime] = targetTime.split('-');

      // Check if slot already exists in this position
      const existingSlot = slots.find(
        slot => slot.day === targetDay && slot.startTime === startTime
      );

      if (existingSlot) {
        toast.error('A class already exists in this time slot');
        return;
      }

      const newSlot = {
        day: targetDay,
        startTime,
        endTime,
        subject: sourceSlot.subject,
        subjectCode: sourceSlot.subjectCode,
        professor: sourceSlot.professor,
        type: 'class' as const,
        id: `temp-${Date.now()}-${Math.random()}`
      };

      setSlots([...slots, newSlot]);
      toast.success('Added new class to time table');
    }
  };

  const addNewSlot = () => {
    const newId = `slot-${availableSlots.length + 1}`;
    setAvailableSlots([...availableSlots, { id: newId, ...initialSlot }]);
  };

  const handleSubmit = async () => {
    if (!department || !year || !academicYear || !section) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // If there's an existing time table, delete it first
      if (existingTimeTable) {
        const deleteResponse = await fetch(`/api/time-table/${existingTimeTable.id}`, {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          throw new Error('Failed to delete existing time table');
        }
      }

      // Remove any temporary IDs or type fields before sending
      const cleanedSlots = slots.map(({ id, ...slot }) => slot);

      const response = await fetch('/api/time-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department,
          year: parseInt(year),
          academicYear,
          section,
          slots: cleanedSlots,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setExistingTimeTable(data.timeTable);
        toast.success('Time table saved successfully');
      } else {
        throw new Error(data.error || 'Failed to save time table');
      }
    } catch (error) {
      console.error('Error saving time table:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save time table');
    }
  };

  const addTimeSlot = () => {
    const lastSlot = timeSlots[timeSlots.length - 1];
    const newStartTime = lastSlot ? lastSlot.endTime : '09:00';
    const [hours, minutes] = newStartTime.split(':');
    const endTime = `${String(parseInt(hours) + 1).padStart(2, '0')}:${minutes}`;

    // Check for overlapping with existing time slots
    const hasOverlap = timeSlots.some(slot =>
      isTimeOverlapping(slot.startTime, slot.endTime, newStartTime, endTime)
    );

    if (hasOverlap) {
      toast.error('New time slot overlaps with existing slots');
      return;
    }

    setTimeSlots([
      ...timeSlots,
      {
        id: `slot-${timeSlots.length + 1}`,
        startTime: newStartTime,
        endTime: endTime,
        type: 'class'
      }
    ]);
  };

  const updateTimeSlot = (id: string, field: 'startTime' | 'endTime' | 'type' | 'label', value: string) => {
    setTimeSlots(slots => {
      const newSlots = [...slots];
      const slotIndex = newSlots.findIndex(slot => slot.id === id);

      if (slotIndex === -1) return slots;

      const updatedSlot = { ...newSlots[slotIndex], [field]: value };

      // Check for overlapping only if updating time
      if (field === 'startTime' || field === 'endTime') {
        const hasOverlap = newSlots.some((slot, index) =>
          index !== slotIndex &&
          isTimeOverlapping(
            slot.startTime,
            slot.endTime,
            field === 'startTime' ? value : updatedSlot.startTime,
            field === 'endTime' ? value : updatedSlot.endTime
          )
        );

        if (hasOverlap) {
          toast.error('Time slot overlaps with existing slots');
          return slots;
        }
      }

      newSlots[slotIndex] = updatedSlot;
      return newSlots;
    });
  };

  const deleteTimeSlot = (id: string) => {
    setTimeSlots(slots => slots.filter(slot => slot.id !== id));
  };

  return (
    <div className="flex flex-col w-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/time-table">Time Table</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Time Table</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="container mr-auto p-6">
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold">Time Table Creation</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-4">
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    Year {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={section} onValueChange={setSection}>
              <SelectTrigger>
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((sec) => (
                  <SelectItem key={sec} value={sec}>
                    Section {sec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Academic Year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((ay) => (
                  <SelectItem key={ay} value={ay}>
                    {ay}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-8">
            <Card className="w-96">
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-xl font-semibold">Available Slots</h3>
                <div className="flex gap-2">
                  <Button onClick={addNewSlot} variant="outline" size="sm">
                    Add New Slot
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="available-slots">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-4"
                    >
                      {availableSlots.map((slot, index) => (
                        <Draggable key={slot.id} draggableId={slot.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 relative"
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2"
                                onClick={() => deleteAvailableSlot(slot.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <div className="space-y-2">
                                <Input
                                  placeholder="Subject"
                                  value={slot.subject}
                                  onChange={(e) => {
                                    const newSlots = [...availableSlots];
                                    newSlots[index].subject = e.target.value;
                                    setAvailableSlots(newSlots);
                                  }}
                                />
                                <Input
                                  placeholder="Subject Code"
                                  value={slot.subjectCode}
                                  onChange={(e) => {
                                    const newSlots = [...availableSlots];
                                    newSlots[index].subjectCode = e.target.value;
                                    setAvailableSlots(newSlots);
                                  }}
                                />
                                <Input
                                  placeholder="Professor"
                                  value={slot.professor}
                                  onChange={(e) => {
                                    const newSlots = [...availableSlots];
                                    newSlots[index].professor = e.target.value;
                                    setAvailableSlots(newSlots);
                                  }}
                                />
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-xl font-semibold">Time Table</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Slots
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <p className="text-sm text-muted-foreground">
                        This action cannot be undone. This will permanently delete all slots from the time table.
                      </p>
                    </DialogHeader>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={clearAllSlots}>
                        Delete All
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-4">
                <Card className="mb-8">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <h3 className="text-xl font-semibold">Time Slots</h3>
                    <Button onClick={addTimeSlot} variant="outline">
                      Add Time Slot
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timeSlots.map((slot) => (
                        <div key={slot.id} className="flex items-center gap-4 p-2 border rounded">
                          <div className="grid grid-cols-2 gap-4 flex-1">
                            <div className="space-y-2">
                              <Label>Start Time</Label>
                              <Input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>End Time</Label>
                              <Input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                              />
                            </div>
                          </div>
                          <Select
                            value={slot.type}
                            onValueChange={(value) => updateTimeSlot(slot.id, 'type', value)}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="class">Class/Lab</SelectItem>
                              <SelectItem value="break">Break</SelectItem>
                            </SelectContent>
                          </Select>
                          {slot.type === 'break' && (
                            <Input
                              placeholder="Break Label"
                              value={slot.label || ''}
                              onChange={(e) => updateTimeSlot(slot.id, 'label', e.target.value)}
                              className="w-[200px]"
                            />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTimeSlot(slot.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2">Time</th>
                      {days.map((day) => (
                        <th key={day} className="border p-2 font-medium">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((timeSlot) => (
                      <tr key={timeSlot.id} className={timeSlot.type === 'break' ? 'bg-muted' : ''}>
                        <td className="border p-2 font-medium">
                          {`${timeSlot.startTime}-${timeSlot.endTime}`}
                          {timeSlot.type === 'break' && (
                            <div className="text-sm text-muted-foreground">{timeSlot.label}</div>
                          )}
                        </td>
                        {days.map((day) => (
                          <td key={`${day}-${timeSlot.startTime}`} className="border p-2">
                            {timeSlot.type === 'break' ? (
                              <div className="text-center text-muted-foreground">{timeSlot.label}</div>
                            ) : (
                              <Droppable droppableId={`${day}|${timeSlot.startTime}-${timeSlot.endTime}`}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="min-h-[100px]"
                                  >
                                    {slots
                                      .filter(
                                        (slot) =>
                                          slot.day === day &&
                                          slot.startTime === timeSlot.startTime
                                      )
                                      .map((slot) => (
                                        <Card key={slot.id} className="p-2 bg-primary/10 relative group">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => slot.id && deleteSlot(slot.id)}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                          <div className="font-medium">{slot.subject}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {slot.subjectCode}
                                          </div>
                                          <div className="text-sm">{slot.professor}</div>
                                        </Card>
                                      ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </DragDropContext>

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <Card className="p-4">
              <p>Loading time table...</p>
            </Card>
          </div>
        )}

        <Button
          className="mt-8"
          onClick={handleSubmit}
          disabled={isLoading || !department || !year || !academicYear || !section}
        >
          {existingTimeTable ? 'Update Time Table' : 'Save Time Table'}
        </Button>
      </div>
    </div>
  );
}
