const { prisma } = require("@/utils/prisma");
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { year, grade, section } = await req.json();

    const passingScore = 50;
    const totalSubjects = 6;

    // 🔍 1️⃣ Get current active semester
    const semester = await prisma.semester.findFirst({
      where: { status: "active" },
      select: { id: true },
    });

    if (!semester) {
      return NextResponse.json({ message: "No active semester found" }, { status: 404 });
    }

    // 📚 2️⃣ Get students in specified group with result details for current semester
    const students = await prisma.registration.findMany({
      where: {
        year: Number(year),
        grade: Number(grade),
        section,
        isActive: true,
      },
      include: {
        resultDetail: {
          where: {
            semesterID: semester.id,
          },
          select: { score: true },
        },
      },
    });

    if (!students.length) {
      return NextResponse.json({ message: "No students found" }, { status: 404 });
    }

    // 🎯 3️⃣ Calculate scores
    let studentScores = students
      .map((student) => {
        const scores = student.resultDetail.map((r) => r.score ?? 0);
        if (scores.length < totalSubjects) return null;

        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        const averageScore = parseFloat((totalScore / totalSubjects).toFixed(2));
        const hasFailed = scores.some((score) => score < passingScore);
        const passStatus = hasFailed ? "failed" : "passed";

        return {
          registrationID: student.registrationID,
          average: averageScore,
          passStatus,
        };
      })
      .filter(Boolean);

    if (!studentScores.length) {
      return NextResponse.json({ message: "Incomplete result data for students" }, { status: 400 });
    }

    // 🏆 4️⃣ Rank students by average score
    studentScores.sort((a, b) => b.average - a.average);
    studentScores.forEach((s, i) => (s.rank = i + 1));

    // 💾 5️⃣ Save to ResultSummary table (create or update)
    await Promise.all(
      studentScores.map((student) =>
        prisma.resultSummary.upsert({
          where: {
            registrationID_semesterID: {
              registrationID: student.registrationID,
              semesterID: semester.id,
            },
          },
          update: {
            average: student.average,
            rank: student.rank,
            passStatus: student.passStatus,
          },
          create: {
            registrationID: student.registrationID,
            semesterID: semester.id,
            average: student.average,
            rank: student.rank,
            passStatus: student.passStatus,
          },
        })
      )
    );

    return NextResponse.json({ message: "Student results summarized successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error processing result summary:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
