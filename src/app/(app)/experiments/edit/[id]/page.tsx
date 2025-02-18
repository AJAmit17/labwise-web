"use client"

import React from 'react';
import ExperimentForm from '@/components/forms/ExperimentForm'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
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

export default function EditExperimentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [experimentDetails, setExperimentDetails] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExperiment = async () => {
      try {
        const response = await fetch(`/api/experiments/${id}`)
        const data = await response.json()
        if (data.success) {
          setExperimentDetails(JSON.stringify(data.data))
        }
      } catch (error) {
        console.error('Error fetching experiment:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiment()
  }, [id]) // use the unwrapped id in dependency array

  if (loading) {
    return <Skeleton className="w-full h-[600px]" />
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
