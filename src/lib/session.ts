import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "./auth"

export async function auth() {
    const session = await getServerSession(authOptions)
    return session
}

export async function requireTeacher() {
    const session = await auth()

    if (!session) {
        redirect("/auth/signin")
    }

    if (session.user.role !== "TEACHER") {
        redirect("/unauthorized")
    }

    return session
}