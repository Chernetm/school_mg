
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError(403, "Unauthorized access");
    }

    const studentID = session.user.studentID;
    const grade = session.user.grade;

    if (!studentID) {
      throw new ApiError(401, "Student ID missing");
    }

    if (!grade || isNaN(parseInt(grade))) {
      throw new ApiError(400, "Student grade is required and must be a number");
    }

    // Parse request body
    const { examId, answers } = await request.json();
    if (!examId || !Array.isArray(answers) || answers.length === 0) {
      throw new ApiError(400, "Invalid request data: examId and non-empty answers array required");
    }

    const parsedExamId = parseInt(examId);

    // Validate exam
    const exam = await prisma.exam.findUnique({
      where: { id: parsedExamId},
      select: { id: true, status: true, grade: true },
    });

    if (!exam) throw new ApiError(404, "Exam not found");
    if (exam.status !== "ACTIVE") throw new ApiError(403, "Exam is not published");
    if (exam.grade !== parseInt(grade)) throw new ApiError(403, "Exam does not match student grade");

    // Check if already submitted
    const alreadySubmitted = await prisma.response.findFirst({
      where: { studentID, examId: parsedExamId },
    });

    if (alreadySubmitted) {
      // If already submitted, update unanswered questions with `null` answer
      await Promise.all(
        answers.map(async ({ questionId, answer }) => {
          const existingResponse = await prisma.response.findFirst({
            where: {
              studentID,
              examId: parsedExamId,
              questionId: parseInt(questionId),
            },
          });

          // If the question hasn't been answered, update it with `null` as the answer
          if (!existingResponse && !answer) {
            await prisma.response.create({
              data: {
                studentID,
                examId: parsedExamId,
                questionId: parseInt(questionId),
                answer: null, // unanswered question should be `null`
                submittedAt: new Date(),
              },
            });
          }
        })
      );

      return NextResponse.json(
        { message: "Exam automatically submitted, unanswered questions marked as null." },
        { status: 200 }
      );
    } else {
      // Save all responses if not yet submitted
      const responses = await Promise.all(
        answers.map(({ questionId, answer }) =>
          prisma.response.create({
            data: {
              studentID,
              examId: parsedExamId,
              questionId: parseInt(questionId),
              answer: answer || null, // If no answer, set as null
              submittedAt: new Date(),
            },
          })
        )
      );

      return NextResponse.json(
        { message: "Responses saved successfully!", responses },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error saving responses:", error);
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Failed to save responses" }, { status: 500 });
  }
}
