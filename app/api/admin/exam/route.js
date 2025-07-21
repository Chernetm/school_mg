import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);

    if (!session || !['admin'].includes(session.user.role)) {
      throw new ApiError(403, 'Unauthorized access');
    }

    const staffID = session.user.staffID;
    const { title, description, grade, status, type, durationMinutes, questions } = await request.json();

    if (!title || !grade || !status || !type || !durationMinutes || !Array.isArray(questions)) {
      throw new ApiError(400, 'Missing required fields');
    }

    if (!['EXAM', 'MODEL'].includes(type)) {
      throw new ApiError(400, 'Invalid exam type');
    }

    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      throw new ApiError(400, 'Invalid exam status');
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        grade: parseInt(grade),
        status,
        type,
        durationMinutes: parseInt(durationMinutes),
        user: {
          connect: {
            staffID: staffID,
          },
        },

      },
    });

    const createdQuestions = await prisma.question.createMany({
      data: questions.map((q) => ({
        examId: exam.id,
        content: q.content,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correct: q.correct,
      })),
    });

    console.log("Exam and questions added successfully")

    return NextResponse.json(
      {
        message: 'Exam and questions added successfully',
        exam,
        totalQuestions: createdQuestions.count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating exam:', error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Failed to create exam' }, { status: 500 });
  }
}