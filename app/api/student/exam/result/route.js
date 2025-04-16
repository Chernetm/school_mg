const { prisma } = require("@/utils/prisma");
const { NextResponse } = require("next/server");

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const studentID = req.headers.get("x-student-id");
    if (!title || !studentID) {
      return NextResponse.json({ message: "Exam title and studentID are required" }, { status: 400 });
    }

    // Find the exam by title
    const exam = await prisma.exam.findUnique({
      where: { title },
      select: { id: true },
    });

    if (!exam) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    const examId = exam.id;

    // Fetch responses for the student in the given exam
    const responses = await prisma.response.findMany({
      where: { examId, studentID },
      include: {
        question: true, // Include the related question
      },
    });

    // If no responses found
    if (responses.length === 0) {
      return NextResponse.json({ message: "No responses found for this student" }, { status: 404 });
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
    console.error("Error fetching student answers:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}