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

    const studentID = session.user.studentID;
    const grade = session.user.grade;

    if (!studentID) {
      throw new ApiError(401, 'Student ID missing');
    }

    if (!grade || isNaN(parseInt(grade))) {
      throw new ApiError(400, 'Student grade is required and must be a number');
    }

    // ✅ Fetch responses where the related exam matches the filter
    const submissions = await prisma.response.findMany({
      where: {
        studentID,
        

        exam: {
          //status: 'ACTIVE',
          grade: parseInt(grade),
        },
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Extract unique exams from responses
    const seen = new Set();
    const exams = submissions
      .map((sub) => sub.exam)
      .filter((exam) => exam && !seen.has(exam.id) && seen.add(exam.id));

    return NextResponse.json({ exams }, { status: 200 });
  } catch (error) {
    console.error('Error fetching submitted exams:', error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Failed to fetch exams' }, { status: 500 });
  }
}
