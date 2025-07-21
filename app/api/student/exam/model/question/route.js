import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'STUDENT') {
      throw new ApiError(403, 'Unauthorized access');
    }

    const studentId = session.user.studentID;
    const grade = session.user.grade;
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');

    if (!title) {
      throw new ApiError(400, 'Exam title is required');
    }

    if (!grade || isNaN(parseInt(grade))) {
      throw new ApiError(400, 'Student grade is required and must be a number');
    }

    const exam = await prisma.exam.findFirst({
      where: {
        title: { equals: title},
        status: 'ACTIVE',
        type: 'MODEL',
        grade: parseInt(grade),
      },
      select: {
        id: true,
        title: true,
        description: true,
        grade: true,
        status: true,
        type: true,
        durationMinutes: true,
        questions: {
          select: {
            id: true,
            content: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            correct: true,
          },
        },
      },
    });

    if (!exam) {
      throw new ApiError(404, 'Exam not found, not active, or not a model exam');
    }

    return NextResponse.json({ studentId, exam });
  } catch (error) {
    console.error('Error fetching exam:', error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Failed to fetch exam' }, { status: 500 });
  }
}
