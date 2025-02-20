"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ResourcePage from "./ResourceForm";


export default function AddResourcesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Wait until session is loaded
        if (!session || session.user.role !== "TEACHER") {
            router.push("/unauthorized");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <p>Loading...</p>; // Show loading state
    }

    return session?.user.role === "TEACHER" ? <ResourcePage /> : null;
}