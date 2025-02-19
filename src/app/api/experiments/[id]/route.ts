/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/session';

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  request: Request,
  { params }: RouteContext 
) {
  const { id } = params;
  try {
    const experiment = await prisma.experiment.findUnique({
      where: { id }
    });

    if (!experiment) {
      return NextResponse.json(
        { success: false, error: 'Experiment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: experiment });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experiment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { id } = params;
  try {
    await requireTeacher();
    const body = await request.json();
    const updatedExperiment = await prisma.experiment.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: updatedExperiment });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update experiment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = params;
  try {
    await requireTeacher();
    await prisma.experiment.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Experiment deleted successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete experiment' },
      { status: 500 }
    );
  }
}