/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { pinata } from '@/lib/pinata';
import { FileUpload } from '@/components/fileUpload';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { departments, professorsByDepartment, academicYears, years } from '@/constants/academicData';
import { resourceSchema, type ResourceFormData } from '@/lib/schemas/resource';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function ResourcePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departments[0]);
  const [selectedProfessor, setSelectedProfessor] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      resourceName: '',
      course: '',
      description: '',
      department: departments[0],
      year: '1',
      academicYear: academicYears[0],
      professorName: '',
    },
  });

  // Reset course when professor changes
  useEffect(() => {
    if (selectedProfessor) {
      // Reset the course field when professor changes
      form.setValue('course', '');
    }
  }, [selectedProfessor, form]);

  const onSubmit = async (data: ResourceFormData) => {
    try {
      // Check if file is selected
      if (!data.file || data.file.length === 0) {
        setFileError("Please select a file to upload");
        return;
      }

      // Check file size again as a fallback
      if (data.file[0].size > 5 * 1024 * 1024) {
        setFileError("File size exceeds the maximum limit of 5MB");
        return;
      }

      setFileError(null);
      setIsUploading(true);

      const { cid } = await pinata.upload.file(data.file[0]);

      const formData = {
        name: data.resourceName,
        course: data.course,
        description: data.description,
        department: data.department,
        year: parseInt(data.year),
        academicYear: data.academicYear,
        professorName: data.professorName,
        cid: cid
      };

      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to save resource details');
      }

      form.reset();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
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
              <BreadcrumbLink href="/view-resources">Study Resources</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Resource</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="container mr-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Resource Management</h1>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload New Study Material</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="resourceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter resource name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedDepartment(value);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="professorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professor</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedProfessor(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select professor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {professorsByDepartment[selectedDepartment as keyof typeof professorsByDepartment].map((prof) => (
                          <SelectItem key={prof.name} value={prof.name}>{prof.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedProfessor && professorsByDepartment[selectedDepartment as keyof typeof professorsByDepartment]
                          .find(prof => prof.name === selectedProfessor)
                          ?.subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          )) || []}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicYears.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Upload File</FormLabel>
                <FileUpload
                  maxSize={5 * 1024 * 1024} // 5MB limit
                  description="Drag or drop your files here or click to upload (Max: 5MB)"
                  onChange={(files) => {
                    if (files.length > 0) {
                      const dataTransfer = new DataTransfer();
                      files.forEach(file => dataTransfer.items.add(file));
                      form.setValue('file', dataTransfer.files);
                      setFileError(null);
                    }
                  }}
                />
                {fileError && <p className="text-sm font-medium text-red-500">{fileError}</p>}
              </div>

              <Button type="submit" disabled={isUploading}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload Resource
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}