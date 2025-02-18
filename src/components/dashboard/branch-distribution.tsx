"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function BranchDistribution() {
  // This would typically come from an API
  const distribution = [
    { branch: "CSE-DS", count: 45, total: 124, color: "bg-blue-500" },
    { branch: "IT", count: 35, total: 124, color: "bg-green-500" },
    { branch: "ECE", count: 24, total: 124, color: "bg-orange-500" },
    { branch: "Others", count: 20, total: 124, color: "bg-purple-500" },
  ]

  return (
    <div className="space-y-4">
      {distribution.map((item) => (
        <div key={item.branch} className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{item.branch}</Badge>
            <span className="text-sm text-muted-foreground">
              {item.count} experiments
            </span>
          </div>
          <Progress
            value={(item.count / item.total) * 100}
            className={item.color}
          />
        </div>
      ))}
    </div>
  )
}
