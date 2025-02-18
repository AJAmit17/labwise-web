/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const experimentSchema = z.object({
  year: z.number(),
  aceYear: z.string(),
  Branch: z.string(),
  CCode: z.string(),
  CName: z.string(),
  ExpNo: z.number(),
  ExpName: z.string(),
  ExpDesc: z.string(),
  ExpSoln: z.string(),
  youtubeLink: z.string().optional()
});

type ExperimentInput = z.infer<typeof experimentSchema>;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();
    const branch = searchParams.get('branch')?.trim();
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : undefined;
    const sortBy = searchParams.get('sortBy') || 'ExpNo';
    const sortOrderInput = searchParams.get('sortOrder')?.toLowerCase() === 'desc' ? 'desc' : 'asc';

    // Validate sortBy field
    const allowedSortFields = ['ExpNo', 'ExpName', 'year', 'Branch', 'CCode'];
    if (!allowedSortFields.includes(sortBy)) {
      return NextResponse.json(
        { success: false, error: 'Invalid sortBy parameter' },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    
    if (branch) where.Branch = branch;
    if (year) where.year = year;
    
    if (search) {
      where.OR = [
        { ExpName: { contains: search, mode: 'insensitive' } },
        { ExpDesc: { contains: search, mode: 'insensitive' } },
        { CName: { contains: search, mode: 'insensitive' } },
        { CCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const experiments = await prisma.experiment.findMany({
      where,
      orderBy: { [sortBy]: sortOrderInput as 'asc' | 'desc' },
    });

    return NextResponse.json({ success: true, data: experiments });
  } catch (error) {
    console.error('GET experiments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experiments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input using zod schema
    const result = experimentSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    // Check for duplicate experiment
    const existing = await prisma.experiment.findFirst({
      where: {
        AND: [
          { year: body.year },
          { Branch: body.Branch },
          { CCode: body.CCode },
          { ExpNo: body.ExpNo },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Experiment already exists' },
        { status: 409 }
      );
    }

    const experiment = await prisma.experiment.create({
      data: {
        ...result.data,
        youtubeLink: body.youtubeLink || ''
      },
    });

    return NextResponse.json({ success: true, data: experiment }, { status: 201 });
  } catch (error) {
    console.error('POST experiment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create experiment' },
      { status: 500 }
    );
  }
}
