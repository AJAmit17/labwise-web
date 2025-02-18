import ExperimentForm from '@/components/forms/ExperimentForm'
import React from 'react'

const Page = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Experiment</h1>
      <ExperimentForm />
    </div>
  )
}

export default Page
