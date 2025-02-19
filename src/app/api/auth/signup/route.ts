/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already registered" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "STUDENT",
            },
        });

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            { 
                success: true, 
                message: "User created successfully",
                user: userWithoutPassword
            }, 
            { status: 201 }
        );
    } catch (error) {
        console.error("Sign up error:", error);
        return NextResponse.json(
            { success: false, message: "Error creating user" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}