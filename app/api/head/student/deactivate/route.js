import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma"; // adjust import path

// Deactivate all students for a specific grade & year
export async function POST(req) {
  try {
    const body = await req.json();
    const { grade, year } = body;

    if (!grade || !year) {
      return NextResponse.json(
        { message: "grade and year are required" },
        { status: 400 }
      );
    }

    // 1. Find all studentIDs for this grade + year
    const registrations = await prisma.registration.findMany({
      where: {
        grade: Number(grade),
        year: Number(year),
        isActive: true,
      },
      select: { studentID: true },
    });

    const studentIDs = registrations.map((r) => r.studentID);

    if (studentIDs.length === 0) {
      return NextResponse.json(
        { message: "No active students found for this grade/year." },
        { status: 404 }
      );
    }

    // 2. Bulk update all those students -> inactive
    const updateResult = await prisma.student.updateMany({
      where: { studentID: { in: studentIDs } },
      data: { status: "inactive" },
    });

    return NextResponse.json({
      message: `Successfully marked ${updateResult.count} students as inactive`,
      grade,
      year,
    });
  } catch (error) {
    console.error("❌ Error in deactivating students:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
