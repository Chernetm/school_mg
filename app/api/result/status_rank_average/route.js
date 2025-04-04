const {prisma}=require("@/utils/prisma")
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { year, grade, section } = await req.json();
    const passingScore = 50; // Minimum passing score
    const totalSubjects = 7; // Required subjects per student

    // ✅ 1️⃣ Get all students in the specified grade, section, and year
    const students = await prisma.registration.findMany({
      where: { year, grade, section, isActive: true },
      include: { resultDetail: { select: { score: true } } },
    });

    if (!students.length) {
      return NextResponse.json({ message: "No students found" }, { status: 404 });
    }

    // ✅ 2️⃣ Calculate average scores & determine pass/fail
    let studentScores = students
      .map((student) => {
        const scores = student.resultDetail.map((r) => r.score ?? 0);

        if (scores.length < totalSubjects) return null; // Skip students with incomplete results

        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        const averageScore = totalScore / totalSubjects;
        const hasFailed = scores.some((score) => score < passingScore);
        const passStatus = hasFailed ? "failed" : "passed";

        return {
          registrationID: student.registrationID,
          averageScore,
          passStatus,
        };
      })
      .filter(Boolean); // Remove null values (incomplete results)

    if (!studentScores.length) {
      return NextResponse.json({ message: "Not all students have complete results" }, { status: 400 });
    }

    // ✅ 3️⃣ Rank students based on average score (highest first)
    studentScores.sort((a, b) => b.averageScore - a.averageScore);
    studentScores.forEach((student, index) => {
      student.rank = index + 1;
    });

    // ✅ 4️⃣ Update Registration table
    await Promise.all(
      studentScores.map((student) =>
        prisma.registration.update({
          where: { registrationID: student.registrationID },
          data: {
            averageScore: student.averageScore,
            rank: student.rank,
            passStatus: student.passStatus,
          },
        })
      )
    );

    return NextResponse.json({ message: "Rank, average, and status updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating rank and status:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
