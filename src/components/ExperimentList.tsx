/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Filter, SortAsc, SortDesc, BookOpen, Code, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Experiment {
  id: string
  year: number
  aceYear: string
  Branch: string
  CCode: string
  CName: string
  ExpNo: number
  ExpName: string
  ExpDesc: string
  ExpSoln: string
  youtubeLink?: string
}

interface ApiResponse {
  success: boolean
  data: Experiment[]
}

export default function ExperimentList() {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [search, setSearch] = useState("")
  const [branch, setBranch] = useState("all")
  const [year, setYear] = useState("all")
  const [sortBy, setSortBy] = useState("ExpNo")
  const [sortOrder, setSortOrder] = useState("asc")
  const [loading, setLoading] = useState(false) // Add loading state

  const fetchExperiments = async () => {
    setLoading(true) // Set loading to true before fetching
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (branch !== "all") params.append("branch", branch)
    if (year !== "all") params.append("year", year)
    params.append("sortBy", sortBy)
    params.append("sortOrder", sortOrder)

    try {
      const response = await fetch(`/api/experiments?${params.toString()}`)
      const data: ApiResponse = await response.json()
      if (data.success) {
        setExperiments(data.data)
      }
    } catch (error) {
      console.error("Error fetching experiments:", error)
    } finally {
      setLoading(false) // Set loading to false after fetching, regardless of success or failure
    }
  }

  useEffect(() => {
    fetchExperiments()
  }, [search, branch, year, sortBy, sortOrder])

  const router = useRouter()

  const getBranchIcon = (branch: string) => {
    switch (branch) {
      case "CSE-DS":
        return <Code className="w-4 h-4" />
      case "IT":
        return <Zap className="w-4 h-4" />
      case "ECE":
        return <BookOpen className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">

      <div className="flex flex-wrap gap-4 justify-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search experiments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-64"
          />
        </div>

        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            <SelectItem value="CSE-DS">CSE</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="ECE">ECE</SelectItem>
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="1">1st Year</SelectItem>
            <SelectItem value="2">2nd Year</SelectItem>
            <SelectItem value="3">3rd Year</SelectItem>
            <SelectItem value="4">4th Year</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" /> Sort Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy("ExpNo")}>Experiment No</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("ExpName")}>Experiment Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("year")}>Year</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("Branch")}>Branch</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortOrder("asc")}>
              <SortAsc className="mr-2 h-4 w-4" /> Ascending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("desc")}>
              <SortDesc className="mr-2 h-4 w-4" /> Descending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? ( // Add loading indicator
        <div className="text-center">Loading...</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {experiments.map((experiment) => (
            <motion.div key={experiment.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => router.push(`/experiments/${experiment.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Experiment {experiment.ExpNo}</span>
                    {getBranchIcon(experiment.Branch)}
                  </CardTitle>
                  <CardDescription>{experiment.ExpName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{experiment.ExpDesc.substring(0, 100)}...</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{experiment.Branch}</Badge>
                    <Badge variant="outline">Year {experiment.year}</Badge>
                    <Badge>{experiment.CCode}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">{experiment.CName}</CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}