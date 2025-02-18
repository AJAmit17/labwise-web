/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const resources = await prisma.resource.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        course: true,
        description: true,
        department: true,
        year: true,
        academicYear: true,
        professorName: true,
        cid: true,
        fileUrl: true,
        createdAt: true
      }
    });

    if (!resources || resources.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'No resources found'
      }, { status: 404 });
    }

    // Transform the resources safely
    const transformedResources = resources.map(resource => ({
      ...resource,
      cid: resource.cid || null,
      fileUrl: resource.cid ? `https://gateway.pinata.cloud/ipfs/${resource.cid}` : null
    }));

    return NextResponse.json({ 
      success: true, 
      resources: transformedResources
    });

  } catch (error) {
    // Detailed error logging
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error:', {
        code: error.code,
        message: error.message,
        meta: error.meta,
      });
    } else {
      console.error('Unexpected error:', error);
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch resources',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'department', 'year', 'academicYear'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        name: data.name,
        department: data.department,
        year: data.year,
        academicYear: data.academicYear,
        cid: data.cid,
        course: data.course || null,
        description: data.description || null,
        professorName: data.professorName || null,
      },
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error('Resource creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Resource creation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
