import React from 'react';

import ExperimentForm from '@/components/forms/ExperimentForm'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { requireTeacher } from '@/lib/session';

export default async function EditExperimentPage({ params }: { params: { id: string } }) {
  await requireTeacher();
  
  const { id } = params;
  let experimentDetails = null;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experiments/${id}`);
    const data = await response.json();
    if (data.success) {
      experimentDetails = JSON.stringify(data.data);
    }
  } catch (error) {
    console.error('Error fetching experiment:', error);
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/experiments">Experiments</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Experiment</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold mb-6">Edit Experiment</h1>
        <ExperimentForm experimentDetails={experimentDetails || ""} type="edit" />
      </div>
    </SidebarInset>
  )
}
