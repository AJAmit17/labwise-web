"use client"

import { useEffect, useState } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { experimentFormSchema } from "@/types"
import type { z } from "zod"
import ParseHtml from "@/components/parseHTML"
import { Badge } from "@/components/ui/badge"
import { Youtube, BookOpen, Edit, Pencil, Trash2, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ExperimentPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [experiment, setExperiment] = useState<z.infer<typeof experimentFormSchema> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExperiment = async () => {
      try {
        const response = await fetch(`/api/experiments/${id}`)
        const data = await response.json()
        if (data.success) {
          setExperiment(data.data)
        }
      } catch (error) {
        console.error("Error fetching experiment:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiment()
  }, [id])

  if (loading) {
    return <Skeleton className="w-full h-[600px]" />
  }

  if (!experiment) {
    return <div>Experiment not found</div>
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
        <div className="flex items-center gap-2">
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
                <BreadcrumbPage>{experiment?.ExpName || 'View Experiment'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/experiments')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-6 max-w-7xl mr-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-start mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-primary mb-4">{experiment.ExpName}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="text-sm py-1 px-3">
                {experiment.Branch}
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                {experiment.CCode}
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Year {experiment.year}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/experiments/edit/${id}`)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (confirm('Are you sure you want to delete this experiment?')) {
                  const response = await fetch(`/api/experiments/${id}`, {
                    method: 'DELETE',
                  });
                  if (response.ok) {
                    router.push('/experiments');
                  }
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Description</h2>
                </div>
                <div className="h-[300px] overflow-y-auto prose dark:prose-invert">
                  <p className="text-muted-foreground leading-relaxed">{experiment.ExpDesc}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Youtube className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Video Tutorial</h2>
                </div>
                <div className="aspect-video">
                  <iframe
                    title={`YouTube video for ${experiment.ExpName}`}
                    src={`https://www.youtube.com/embed/${(experiment.youtubeLink ?? '').split('/').pop()?.split('?')[0]}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Edit className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-xl font-semibold">Solution</h2>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <ParseHtml data={experiment.ExpSoln} type="solution" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SidebarInset>
  )
}

