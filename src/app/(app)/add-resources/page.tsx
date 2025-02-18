/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { pinata } from '@/lib/pinata';
import { FileUpload } from '@/components/fileUpload';
import { Loader2, RefreshCw, Download } from 'lucide-react';
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

interface PinataFile {
  id: string;
  name: string;
  cid: string;
  size: number;
  created_at: string;
}

export default function ResourcePage() {
  // const [files, setFiles] = useState<PinataFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departments[0]);

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

  // const fetchFiles = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch('https://api.pinata.cloud/v3/files', {
  //       headers: {
  //         'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxMDlhNTIyNC03YzFhLTQ4NzMtOTFlMi1hMGNlY2M3YTQyNjYiLCJlbWFpbCI6ImFtaXRhY2hhcnlhMjYzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0YWNlNjM2NGE5ODIzMTcyOWI3YSIsInNjb3BlZEtleVNlY3JldCI6IjIyODAyODIyNWQ2NmZiOGY2YTM3YzU3MTNhYWQ1OTkwNjRhZDMwNTMwMDQ1NWE5NTU1OWE3MmIxOGNhNWYwZmYiLCJleHAiOjE3NjQzMjk0NDd9.LLW_F-su6evJuh_1oNoqUWa76NnbhJD-wmuslKCOwtg`,
  //       },
  //     });

  //     if (!response.ok) throw new Error('Failed to fetch files');

  //     const data = await response.json();
  //     setFiles(data.data.files);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setError('Failed to fetch files');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (data: ResourceFormData) => {
    try {
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
      // fetchFiles();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // useEffect(() => {
  //   fetchFiles();
  // }, []);

  // const formatFileSize = (bytes: number) => {
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  //   if (bytes === 0) return '0 Bytes';
  //   const i = Math.floor(Math.log(bytes) / Math.log(1024));
  //   return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  // };

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
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Resource Management</h1>
          {/* <Button 
            // onClick={fetchFiles}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button> */}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        {professorsByDepartment[selectedDepartment as keyof typeof professorsByDepartment]
                          .find(prof => prof.name === form.getValues('professorName'))
                          ?.subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
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

              <FileUpload onChange={(files) => {
                const dataTransfer = new DataTransfer();
                files.forEach(file => dataTransfer.items.add(file));
                form.setValue('file', dataTransfer.files);
              }} />
              <Button type="submit" disabled={isUploading}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload Resource
              </Button>
            </form>
          </Form>
        </Card>

        {/* <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Files</h2>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {files.map((file) => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      Size: {formatFileSize(file.size)} • 
                      Uploaded: {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${file.cid}`, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card> */}
      </div>
    </div>
  );
}