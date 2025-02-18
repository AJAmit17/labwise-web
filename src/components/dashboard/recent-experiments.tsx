"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RecentExperiments() {
  const router = useRouter()

  // This would typically come from an API
  const recentExperiments = [
    {
      id: "1",
      ExpNo: 1,
      ExpName: "Binary Search Tree Implementation",
      Branch: "CSE-DS",
      date: "2024-01-15"
    },
    // Add more mock data as needed
  ]

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {recentExperiments.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent"
            onClick={() => router.push(`/experiments/${exp.id}`)}
          >
            <div>
              <div className="font-medium">Experiment {exp.ExpNo}</div>
              <div className="text-sm text-muted-foreground">{exp.ExpName}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{exp.Branch}</Badge>
              <span className="text-xs text-muted-foreground">{exp.date}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
