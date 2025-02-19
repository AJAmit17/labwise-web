import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const path = request.nextUrl.pathname

    // Protected teacher routes
    if (path.startsWith("/add-resources") ||
        path.startsWith("/experiments/add") ||
        path.startsWith("/experiments/edit/") ||
        path.startsWith("/api/time-table")) {
        
        if (!token) {
            return NextResponse.redirect(new URL("/auth/signin", request.url))
        }

        if (token.role !== "TEACHER") {
            return NextResponse.redirect(new URL("/unauthorized", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/add-resources",
        "/add-resources/:path*",
        "/experiments/add",
        "/experiments/edit/:path*",
        "/api/time-table/:path*"
    ]
}
