/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import ExperimentForm from "@/components/forms/ExperimentForm";
import { Skeleton } from "@/components/ui/skeleton";

interface Experiment {
    id: string;
    year: number;
    aceYear: string;
    Branch: string;
    CCode: string;
    CName: string;
    ExpNo: number;
    ExpName: string;
    ExpDesc: string;
    ExpSoln: string;
    youtubeLink?: string;
}

export default function EditExperimentPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const experimentId = params.id as string;
    const [experiment, setExperiment] = useState<Experiment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") return;
        if (!session || session.user.role !== "TEACHER") {
            router.push("/unauthorized");
        }
    }, [session, status, router]);

    useEffect(() => {
        async function fetchExperiment() {
            try {
                const response = await fetch(`/api/experiments/${experimentId}`);
                const result = await response.json();

                if (result.success) {
                    setExperiment(result.data);
                } else {
                    toast.error("Failed to load experiment data");
                    router.push("/experiments");
                }
            } catch (error) {
                toast.error("An error occurred while fetching experiment data");
                router.push("/experiments");
            } finally {
                setLoading(false);
            }
        }

        if (experimentId) {
            fetchExperiment();
        }
    }, [experimentId, router]);

    if (status === "loading" || loading) {
        return (
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
                                <BreadcrumbPage>Edit Experiment</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1 className="text-2xl font-bold mb-6">Edit Experiment</h1>
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </SidebarInset>
        );
    }

    return session?.user.role === "TEACHER" ? (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
                            <BreadcrumbPage>Edit Experiment</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold mb-6">Edit Experiment</h1>
                {experiment && (
                    <ExperimentForm
                        type="edit"
                        experimentDetails={JSON.stringify(experiment)}
                    />
                )}
            </div>
        </SidebarInset>
    ) : null;
}
