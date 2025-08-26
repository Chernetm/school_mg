import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError(403, 'Unauthorized access');
    }
    

    const studentId = session.user.studentID;
    const grade = session.user.grade;

    

    if (!grade || isNaN(parseInt(grade))) {
      throw new ApiError(400, 'Student grade is required and must be a number');
    }

    const exams = await prisma.exam.findMany({
      where: {
        grade: parseInt(grade),
        status: 'ACTIVE',
        type: 'MODEL',
      },
      select: {
        id: true,
        title: true,
      },
    });
  
    return NextResponse.json({ studentId, exams });
  } catch (error) {
    console.error('Error fetching exams:', error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Failed to fetch exams' }, { status: 500 });
  }
}