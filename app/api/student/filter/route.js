const{prisma}=require('@/utils/prisma')
import { NextResponse } from "next/server";


export async function GET(req) {
  console.log("🚀 API HIT: /api/student/filter");

  try {
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade");
    const section = searchParams.get("section");

    console.log("📌 Params Received - Grade:", grade, "Section:", section);

    if (!grade || !section) {
      return NextResponse.json(
        { error: "Grade and Section are required.", grade, section, students: [] },
        { status: 400 }
      );
    }

    const latestYear = await prisma.year.findFirst({
      where: { status: "active" },
      orderBy: { year: "desc" },
      select: { year: true },
    });

    if (!latestYear) {
      return NextResponse.json(
        { error: "No active academic year found.", grade, section, students: [] },
        { status: 404 }
      );
    }

    const students = await prisma.student.findMany({
      where: {
        registrations: {
          some: {
            grade: parseInt(grade),
            section,
            year: latestYear.year,
            isActive: true,
          },
        },
      },
      select: {
        firstName: true,
        lastName: true,
        studentID: true,
      },
    });

    console.log("📌 Students Found:", students.length);
    console.log(students)
    return NextResponse.json(
      {students },
      { status: 200 } // ✅ Always return 200 even if no students exist
    );
  } catch (error) {
    console.error("❌ Error in API:", error);
    return NextResponse.json(
      { error: "Internal server error", grade: null, section: null, students: [] },
      { status: 500 }
    );
  }
}
