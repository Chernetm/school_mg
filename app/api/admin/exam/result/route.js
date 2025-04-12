const { prisma } = require("@/utils/prisma");
const { NextResponse } = require("next/server");

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");

    if (!title) {
      return NextResponse.json({ message: "Exam title is required" }, { status: 400 });
    }

    // Fetch examId using the title
    const exam = await prisma.exam.findUnique({
      where: { title },
      select: { id: true },
    });

    if (!exam) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
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
          select: { firstName: true }, // Get only student name
        },
        question: {
          select: { correct: true }, // Get only the correct answer
        },
      },
    });

    // Object to store student scores
    const studentScores = {};

    results.forEach((response) => {
      const studentId = response.studentID;
      const studentName = response.student?.firstName || "Unknown";
      const isCorrect = response.answer === response.question?.correct;

      if (!studentScores[studentId]) {
        studentScores[studentId] = { name: studentName, score: 0 };
      }

      if (isCorrect) {
        studentScores[studentId].score += 1;
      }
    });
     console.log(totalQuestions, Object.values(studentScores))
    return NextResponse.json({
      totalQuestions,
      students: Object.values(studentScores),
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching exam results:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}



// const { prisma } = require("@/utils/prisma");
// const { NextResponse } = require("next/server");

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const examId = searchParams.get("examId");

//     if (!examId || isNaN(Number(examId))) {
//       return NextResponse.json({ message: "Invalid examId" }, { status: 400 });
//     }

//     // Fetch exam responses with student and question details
//     const results = await prisma.response.findMany({
//       where: { examId: Number(examId) },
//       include: {
//         student: {
//           select: { firstName: true }, // Get only student name
//         },
//         question: {
//           select: { correct: true }, // Get only the correct answer
//         },
//       },
//     });

//     // Object to store student scores
//     const studentScores = {};

//     results.forEach((response) => {
//       const studentId = response.studentId;
//       const studentName = response.student?.firstName || "Unknown";
//       const isCorrect = response.answer === response.question?.correct;

//       if (!studentScores[studentId]) {
//         studentScores[studentId] = { name: studentName, score: 0 };
//       }

//       if (isCorrect) {
//         studentScores[studentId].score += 1;
//       }
//     });

//     return NextResponse.json(Object.values(studentScores), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching exam results:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }
