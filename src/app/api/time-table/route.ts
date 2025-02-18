/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const year = searchParams.get('year');
    const academicYear = searchParams.get('academicYear');

    if (!department || !year || !academicYear) {
      return NextResponse.json(
        { success: false, error: 'Missing required query parameters' },
        { status: 400 }
      );
    }

    const timeTables = await prisma.timeTable.findMany({
      where: {
        department,
        year: parseInt(year),
        academicYear
      },
      include: {
        slots: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, timeTables });
  } catch (error) {
    console.error('Error fetching time tables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch time tables' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { department, year, academicYear, slots } = data;

    // Create the time table first
    const timeTable = await prisma.timeTable.create({
      data: {
        department,
        year,
        academicYear,
        slots: {
          create: slots.map((slot: any) => ({
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            subject: slot.subject,
            subjectCode: slot.subjectCode,
            professor: slot.professor,
          }))
        }
      },
      include: {
        slots: true
      }
    });

    return NextResponse.json({ success: true, timeTable });
  } catch (error) {
    console.error('Error creating time table:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create time table' },
      { status: 500 }
    );
  }
}
