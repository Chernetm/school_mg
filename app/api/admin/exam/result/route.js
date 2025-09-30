
import ApiError from '@/lib/api-error';
import { prisma } from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {

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

const results = await prisma.response.findMany({
  where: { examId },
  include: {
    student: {
      select: {
        studentID: true,
        firstName: true,
        middleName: true,
        lastName: true,
        registrations: {
          where: { isActive: true }, // ✅ only active registration
          select: {
            grade: true,
            section: true,
          },
        },
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

  const studentId = student.studentID;
  const isCorrect = response.answer === response.question?.correct;

  // Get active registration (first match)
  const registration = student.registrations[0];

  if (!studentScores[studentId]) {
    studentScores[studentId] = {
      studentID: student.studentID,
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      grade: registration?.grade || null,
      section: registration?.section || null,
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