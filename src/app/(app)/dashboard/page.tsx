"use client"

import { useSession } from "next-auth/react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FilePlus, GraduationCap, Layout, School, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

import { StatCard } from "@/components/dashboard/stat-card"
import { BranchDistribution } from "@/components/dashboard/branch-distribution"
import { RecentExperiments } from "@/components/dashboard/recent-experiments"

export default function Page() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="w-full max-w-md space-y-4">
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        )
    }

    const isTeacher = session?.user?.role === "TEACHER"

    if (!isTeacher) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-950">
                <div className="max-w-3xl mx-auto text-center px-6 py-16">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-6">
                        Welcome to <span className="text-blue-600 dark:text-blue-400">LabWise</span>
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        A streamlined platform for managing laboratory experiments and resources.
                        Access your experiments, view instructions, and track progress all in one place.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        <Button size="lg" className="gap-2">
                            <Link href="/experiments">Browse Experiments</Link>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-6 p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Experiments"
                            value="124"
                            description="Across all branches"
                            icon={BookOpen}
                        />
                        <StatCard
                            title="Branches"
                            value="4"
                            description="Active departments"
                            icon={School}
                        />
                        <StatCard
                            title="Course Years"
                            value="4"
                            description="Academic years"
                            icon={GraduationCap}
                        />
                        <StatCard
                            title="Lab Courses"
                            value="12"
                            description="Active courses"
                            icon={Layout}
                        />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks and operations</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Button asChild className="group">
                                <Link href="/experiments/new">
                                    <FilePlus className="mr-2 h-4 w-4" />
                                    New Experiment
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Recent Experiments</CardTitle>
                                <CardDescription>Latest added experiments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentExperiments />
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Branch Distribution</CardTitle>
                                <CardDescription>Experiments by department</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BranchDistribution />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </div>
    )
}
