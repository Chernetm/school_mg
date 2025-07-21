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
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');

    if (!title || !studentID) {
      throw new ApiError(400, 'Exam title and studentID are required');
    }

    if (!grade || isNaN(parseInt(grade))) {
      throw new ApiError(400, 'Student grade is required and must be a number');
    }

    // Find the exam by title
    const exam = await prisma.exam.findFirst({
      where: {
        title: { equals: title},
        grade: parseInt(grade),
      },
      select: { id: true },
    });

    if (!exam) {
      throw new ApiError(404, 'Exam not found or not published');
    }

    const examId = exam.id;

    // Check for existing submission
    const submission = await prisma.response.findFirst({
      where: {
        studentID: studentID,
        examId,
      },
    });

    if (!submission) {
      throw new ApiError(404, 'No submission found for this student and exam');
    }

    // Fetch responses for the student in the given exam
    const responses = await prisma.response.findMany({
      where: { examId, studentID },
      include: {
        question: {
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

    // If no responses found
    if (responses.length === 0) {
      throw new ApiError(404, 'No responses found for this student');
    }

    // Format data for frontend
    const formattedQuestions = responses.map(({ question, answer }) => ({
      questionId: question.id,
      content: question.content,
      options: {
        A: question.optionA,
        B: question.optionB,
        C: question.optionC,
        D: question.optionD,
      },
      correctAnswer: question.correct,
      studentAnswer: answer,
      isCorrect: answer === question.correct,
    }));

    return NextResponse.json(formattedQuestions, { status: 200 });
  } catch (error) {
    console.error('Error fetching student answers:', error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Failed to fetch responses' }, { status: 500 });
  }
}