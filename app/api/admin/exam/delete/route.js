import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['admin'].includes(session.user.role)) {
      throw new ApiError(403, 'Unauthorized access');
    }

    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId');

    if (!examId || isNaN(parseInt(examId))) {
      throw new ApiError(400, 'Exam ID is required and must be a valid number');
    }

    await prisma.exam.delete({
      where: {
        id: parseInt(examId),
      },
    });

    return NextResponse.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Failed to delete exam' }, { status: 500 });
  }
}
