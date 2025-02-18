"use client"

import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import type { experimentFormSchema } from "@/types"
import type { z } from "zod"
import ParseHtml from "@/components/parseHTML"
import { Badge } from "@/components/ui/badge"
import { Youtube, BookOpen, Edit } from "lucide-react"
import { motion } from "framer-motion"

export default function ExperimentPage({ params }: { params: { id: string } }) {
  const { id } = params
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
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-primary mb-4">{experiment.ExpName}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-lg py-1 px-3">
            {experiment.Branch}
          </Badge>
          <Badge variant="secondary" className="text-lg py-1 px-3">
            {experiment.CCode}
          </Badge>
          <Badge variant="secondary" className="text-lg py-1 px-3">
            Year {experiment.year}
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-2xl font-semibold">Description</h2>
              </div>
              <div className="h-[300px] overflow-y-auto">
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
          <Card className="h-full shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Youtube className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-2xl font-semibold">Youtube</h2>
              </div>
              <div className="h-[300px]">
                <iframe
                  title={`YouTube video for ${experiment.ExpName}`}
                  src={`https://www.youtube.com/embed/${(experiment.youtubeLink ?? '').split('/').pop()?.split('?')[0]}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-md"
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
        <Card className="w-full h-full shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Edit className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-2xl font-semibold">Solution</h2>
            </div>
            <div className="w-full h-full overflow-y-auto">
              <ParseHtml data={experiment.ExpSoln} type="solution" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

