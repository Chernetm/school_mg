const { prisma } = require("@/utils/prisma"); 
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { year, grade, section } = await req.json();

    // ✅ Get semesters with numeric value 1, 2, 3
    const semesters = await prisma.semester.findMany({
      where: { semester: { in: [1, 2, 3] } },
      select: { id: true, semester: true },
    });

    const semesterIDs = Object.fromEntries(semesters.map(s => [s.semester, s.id]));
    const sem1ID = semesterIDs[1];
    const sem2ID = semesterIDs[2];
    const sem3ID = semesterIDs[3];

    if (!sem1ID || !sem2ID || !sem3ID) {
      return NextResponse.json({ message: "Required semesters not found" }, { status: 404 });
    }

    // 👥 Get registrations for the specified grade/section/year
    const registrations = await prisma.registration.findMany({
      where: {
        year: Number(year),
        grade: Number(grade),
        section,
        isActive: true,
      },
      select: {
        registrationID: true,
        resultSummary: {
          where: {
            semesterID: { in: [sem1ID, sem2ID] },
          },
          select: {
            semesterID: true,
            average: true,
          },
        },
      },
    });

    // 📊 Only include students who have both semester 1 and 2 averages
    const studentsWithBoth = registrations
      .map((reg) => {
        const sem1 = reg.resultSummary.find(r => r.semesterID === sem1ID);
        const sem2 = reg.resultSummary.find(r => r.semesterID === sem2ID);
        if (!sem1?.average || !sem2?.average) return null;

        const average = parseFloat(((sem1.average + sem2.average) / 2).toFixed(2));
        return {
          registrationID: reg.registrationID,
          average,
        };
      })
      .filter(Boolean);

    if (!studentsWithBoth.length) {
      return NextResponse.json({ message: "No students with averages for both semesters." }, { status: 400 });
    }

    // 🏅 Sort and rank students
    studentsWithBoth.sort((a, b) => b.average - a.average);
    studentsWithBoth.forEach((student, index) => {
      student.rank = index + 1;
    });

    // 💾 Upsert Semester 3 result summaries
    await Promise.all(
      studentsWithBoth.map((student) =>
        prisma.resultSummary.upsert({
          where: {
            registrationID_semesterID: {
              registrationID: student.registrationID,
              semesterID: sem3ID,
            },
          },
          update: {
            average: student.average,
            rank: student.rank,
            passStatus: "passed",
          },
          create: {
            registrationID: student.registrationID,
            semesterID: sem3ID,
            average: student.average,
            rank: student.rank,
            passStatus: "passed",
          },
        })
      )
    );

    return NextResponse.json({ message: "Semester 3 rankings saved successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error processing result summary:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
