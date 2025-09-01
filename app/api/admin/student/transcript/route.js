import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const year = searchParams.get("year");
  const section = searchParams.get("section");
  const grade = searchParams.get("grade");

  if (!year || !section || !grade) {
    return NextResponse.json(
      { message: "Year, Section, and Grade are required" },
      { status: 400 }
    );
  }

  try {
    const registrations = await prisma.registration.findMany({
      where: {
        grade: parseInt(grade),
        section,
        year: parseInt(year),
      },
      include: {
        student: true,
        resultDetail: {
          include: {
            semesterRef: {
              select: { name: true },
            },
          },
        },
        resultSummary: {
          include: {
            semesterRef: {
              select: { name: true },
            },
          },
        },
      },
    });
    const groupedByStudent = {};

    registrations.forEach((reg) => {
      const studentId = reg.student.id;
      if (!groupedByStudent[studentId]) {
        groupedByStudent[studentId] = {
          student: reg.student,
          results: {},
        };
      }

      const gradeKey = `Grade ${reg.grade}`;
      if (!groupedByStudent[studentId].results[gradeKey]) {
        groupedByStudent[studentId].results[gradeKey] = {};
      }

      // Process resultDetail
      reg.resultDetail.forEach((detail) => {
        const semName = `Semester ${detail.semesterRef.name}`;
        if (!groupedByStudent[studentId].results[gradeKey][semName]) {
          groupedByStudent[studentId].results[gradeKey][semName] = { scores: {} };
        }

        const subjectName = detail.subject || "Unknown Subject";
        groupedByStudent[studentId].results[gradeKey][semName].scores[subjectName] = detail.score ?? 0;
      });

      // Process resultSummary
      reg.resultSummary.forEach((summary) => {
        const semName = `Semester ${summary.semesterRef.name}`;
        if (!groupedByStudent[studentId].results[gradeKey][semName]) {
          groupedByStudent[studentId].results[gradeKey][semName] = { scores: {} };
        }

        groupedByStudent[studentId].results[gradeKey][semName].average = summary.average;
        groupedByStudent[studentId].results[gradeKey][semName].rank = summary.rank;
        groupedByStudent[studentId].results[gradeKey][semName].passStatus = summary.passStatus;
      });
    });

    const result = Object.values(groupedByStudent); // Convert map to array
    console.log(JSON.stringify(result?.[0].results, null, 2));

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error fetching student transcript data:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
