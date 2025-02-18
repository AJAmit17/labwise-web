import ExperimentList from '@/components/ExperimentList'
import { SidebarDemo } from '@/components/Sidebar'
import React from 'react'

const Page = () => {
  return (
    <SidebarDemo>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Experiments</h1>
        <ExperimentList />
      </div>
    </SidebarDemo>
  )
}

export default Page
