"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
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
import { BookOpen, FilePlus, GraduationCap, Layout, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { StatCard } from "@/components/dashboard/stat-card"
import { BranchDistribution } from "@/components/dashboard/branch-distribution"
import { RecentExperiments } from "@/components/dashboard/recent-experiments"

export default function Page() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
        }
    }, [status, router])

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (!session) {
        return null
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
                    {/* Stats Grid */}
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

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks and operations</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Button asChild>
                                <Link href="/experiments/new">
                                    <FilePlus className="mr-2 h-4 w-4" />
                                    New Experiment
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Recent Experiments */}
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Recent Experiments</CardTitle>
                                <CardDescription>Latest added experiments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentExperiments />
                            </CardContent>
                        </Card>

                        {/* Branch Distribution */}
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
