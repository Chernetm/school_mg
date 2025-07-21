import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma}  from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin'].includes(session.user.role)) {
      throw new ApiError(403, 'Unauthorized access');
    }
    
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');

    if (!title) {
      throw new ApiError(400, 'Exam title is required');
    }
    
    
    // Fetch exam by title
    const exam = await prisma.exam.findFirst({
      where: {
        title: { equals: title },
      },
      select: { id: true },
    });

    if (!exam) {
      throw new ApiError(404, 'Exam not found, not active, or not a model exam');
    }

    const examId = exam.id;

    // Fetch total number of questions for the exam
    const totalQuestions = await prisma.question.count({
      where: { examId },
    });

    // Fetch exam responses with student and question details
    const results = await prisma.response.findMany({
      where: { examId },
      include: {
        student: {
          select: { 
            firstName: true,
            lastName:true,
            studentID:true,
            grade:true,
            section:true

          },
        },
        question: {
          select: { correct: true },
        },
      },
    });

    // Object to store student scores
    const studentScores = {};
    results.forEach((response) => {
      const student = response.student;
      if (!student) return;
    
      const studentId = student.id;
      const isCorrect = response.answer === response.question?.correct;
    
      if (!studentScores[studentId]) {
        studentScores[studentId] = {
          studentID:student.studentID,
          firstName: student.firstName,
          lastName: student.lastName,
          grade: student.grade,
          section: student.section,
          score: 0,
        };
      }
    
      if (isCorrect) {
        studentScores[studentId].score += 1;
      }
    });
    
    console.log('Total Questions:', totalQuestions, 'Student Scores:', Object.values(studentScores));

    return NextResponse.json(
      {
        totalQuestions,
        students: Object.values(studentScores),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching exam results:', error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Failed to fetch exam results' }, { status: 500 });
  }
}