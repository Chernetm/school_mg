
const { prisma } = require("@/utils/prisma");
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { year, grade, section } = await req.json();
    if (!year || !grade || !section) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    
    }
    const existingGrade= await prisma.grade.findUnique({
      where: {
        grade: Number(grade),
      },
    });
    if (!existingGrade) {
      return NextResponse.json({ message: "Grade not found" }, { status: 404 });
    }
    const existingYear = await prisma.year.findUnique({
      where: {
        year: Number(year),
      },
    });
    if(!existingYear) {
      return NextResponse.json({ message: "Year not found" }, { status: 404 });
    }
    // ✅ Define semester names (1, 2, 3)
    const [sem1, sem2, sem3] = [1, 2, 3];

    // 📦 Get semester names from the database to confirm they exist
    const semesters = await prisma.semester.findMany({
      where: { name: { in: [sem1, sem2, sem3] } },
      select: { name: true },
    });

    const foundNames = semesters.map(s => s.name);
    if (!foundNames.includes(sem1) || !foundNames.includes(sem2) || !foundNames.includes(sem3)) {
      return NextResponse.json({ message: "Required semesters not found" }, { status: 404 });
    }

    // 👥 Get active registrations for the given year/grade/section
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
            semester: { in: [sem1, sem2] },
          },
          select: {
            semester: true,
            average: true,
          },
        },
      },
    });

    // 📊 Only include students with both semester 1 and 2 averages
    const studentsWithBoth = registrations
      .map((reg) => {
        const sem1Result = reg.resultSummary.find(r => r.semester === sem1);
        const sem2Result = reg.resultSummary.find(r => r.semester === sem2);
        if (!sem1Result?.average || !sem2Result?.average) return null;

        const average = parseFloat(((sem1Result.average + sem2Result.average) / 2).toFixed(2));
        return {
          registrationID: reg.registrationID,
          average,
        };
      })
      .filter(Boolean);

    if (!studentsWithBoth.length) {
      return NextResponse.json({ message: "No students with averages for both semesters." }, { status: 400 });
    }

    // 🏅 Sort and assign ranks
    studentsWithBoth.sort((a, b) => b.average - a.average);
    studentsWithBoth.forEach((student, index) => {
      student.rank = index + 1;
    });

    // 💾 Upsert Semester 3 result summaries (using semester name)
    await Promise.all(
      studentsWithBoth.map((student) =>
        prisma.resultSummary.upsert({
          where: {
            registrationID_semester: {
              registrationID: student.registrationID,
              semester: sem3,
            },
          },
          update: {
            average: student.average,
            rank: student.rank,
            passStatus: student.average >= 50 ? "passed" : "failed",
          },
          create: {
            registrationID: student.registrationID,
            semester: sem3,
            average: student.average,
            rank: student.rank,
            passStatus: student.average >= 50 ? "passed" : "failed",
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
