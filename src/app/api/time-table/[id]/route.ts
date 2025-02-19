import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/session';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireTeacher();
    const { id } = params;
    
    await prisma.timeTable.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error deleting time table:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete time table' },
      { status: 500 }
    );
  }
}
