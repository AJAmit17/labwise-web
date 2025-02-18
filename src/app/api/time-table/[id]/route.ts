import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await prisma.timeTable.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting time table:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete time table' },
      { status: 500 }
    );
  }
}
