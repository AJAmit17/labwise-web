/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { departments, academicYears, years } from '@/constants/academicData';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const sections = ['A', 'B', 'C', 'D', 'E'] as const;

export default function TimeTablePage() {
  const [department, setDepartment] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [timeTable, setTimeTable] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTimeTable = async () => {
    if (!department || !year || !academicYear || !section) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/time-table?department=${department}&year=${year}&academicYear=${academicYear}&section=${section}`
      );
      const data = await response.json();

      if (data.success && data.timeTables.length > 0) {
        setTimeTable(data.timeTables[0]);
      } else {
        setTimeTable(null);
        toast.error('No time table found for the selected criteria');
      }
    } catch (error) {
      console.error('Error fetching time table:', error);
      toast.error('Failed to fetch time table');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (department && year && academicYear && section) {
      fetchTimeTable();
    }
  }, [department, year, academicYear, section]);

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
              <BreadcrumbPage>Time Table</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      
      <div className="container mr-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">View Time Table</h1>
          <Button asChild>
            <Link href="/time-table/add">
              <Plus className="mr-2 h-4 w-4" />
              Create New Time Table
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">Select Time Table</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-4">
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>Year {y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={section} onValueChange={setSection}>
              <SelectTrigger>
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((sec) => (
                  <SelectItem key={sec} value={sec}>Section {sec}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Academic Year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((ay) => (
                  <SelectItem key={ay} value={ay}>{ay}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : timeTable ? (
          <Card>
            <CardContent className="p-4">
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
                  {timeTable?.slots
                    .reduce((acc: any[], curr: any) => {
                      const timeKey = `${curr.startTime}-${curr.endTime}`;
                      if (!acc.find((slot) => `${slot.startTime}-${slot.endTime}` === timeKey)) {
                        acc.push({ startTime: curr.startTime, endTime: curr.endTime });
                      }
                      return acc;
                    }, [])
                    .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))
                    .map((timeSlot: any) => (
                      <tr key={`${timeSlot.startTime}-${timeSlot.endTime}`}>
                        <td className="border p-2 font-medium">
                          {`${timeSlot.startTime}-${timeSlot.endTime}`}
                        </td>
                        {days.map((day) => (
                          <td key={`${day}-${timeSlot.startTime}`} className="border p-2">
                            {timeTable.slots
                              .filter(
                                (slot: any) =>
                                  slot.day === day &&
                                  slot.startTime === timeSlot.startTime &&
                                  slot.endTime === timeSlot.endTime
                              )
                              .map((slot: any) => (
                                <div key={slot.id} className="p-2 bg-primary/10 rounded-md">
                                  <div className="font-medium">{slot.subject}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {slot.subjectCode}
                                  </div>
                                  <div className="text-sm">{slot.professor}</div>
                                </div>
                              ))}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {department && year && academicYear && section
              ? "No time table found for the selected criteria"
              : "Select all filters to view the time table"}
          </div>
        )}
      </div>
    </div>
  );
}
