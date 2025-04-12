
const { prisma } = require("@/utils/prisma");
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade");
    const section = searchParams.get("section");
    const range = searchParams.get("range");

    if (!grade || !section || !range) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    // Determine the start date based on range
    const today = new Date();
    let startDate;

    switch (range) {
      case "weekly":
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        break;
      case "monthly":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        break;
      case "annually":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        return NextResponse.json({ message: "Invalid range parameter" }, { status: 400 });
    }

    // Fetch students in the specified grade & section
    const registeredStudents = await prisma.registration.findMany({
      where: {
        grade: Number(grade),
        section: section.toString(),
      },
      select: {
        studentID: true,
        student: {
          select: {
            firstName: true,
          },
        },
      },
    });

    if (!registeredStudents.length) {
      return NextResponse.json({ students: [] });
    }

    const studentIDs = registeredStudents.map((reg) => reg.studentID);

    // Fetch attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        date: { gte: startDate },
        studentID: { in: studentIDs },
      },
      select: {
        studentID: true,
        status: true,
      },
    });

    // Compute attendance percentages
    const studentAttendance = registeredStudents.map(({ studentID, student }) => {
      const records = attendanceRecords.filter((r) => r.studentID === studentID);
      const totalRecords = records.length;
      const presentCount = records.filter((r) => r.status === "present").length;
      const absentCount = records.filter((r) => r.status === "absent").length;
      const lateCount = records.filter((r) => r.status === "late").length;

      return {
        studentID,
        name: student.firstName,
        presentPercentage: totalRecords ? (presentCount / totalRecords) * 100 : 0,
        absentPercentage: totalRecords ? (absentCount / totalRecords) * 100 : 0,
        latePercentage: totalRecords ? (lateCount / totalRecords) * 100 : 0,
      };
    });

    return NextResponse.json({ students: studentAttendance });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
