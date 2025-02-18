"use client"

import React from 'react';
import ExperimentForm from '@/components/forms/ExperimentForm'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'

export default function EditExperimentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // unwrapping params with React.use()
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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Experiment</h1>
      <ExperimentForm experimentDetails={experimentDetails || ""} type="edit" />
    </div>
  )
}
