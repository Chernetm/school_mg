
const {prisma}=require("@/utils/prisma")
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const studentID = req.headers.get("x-student-id");

  

    if (!studentID) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch student details
    const student = await prisma.student.findUnique({
      where: { studentID },
      select: { firstName: true },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Fetch attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: { studentID },
      select: { status: true },
    });

    if (!attendanceRecords.length) {
      return NextResponse.json({
        studentID,
        name: student.firstName,
        presentPercentage: 0,
        absentPercentage: 0,
        latePercentage: 0,
      });
    }

    // Compute attendance percentages
    const totalRecords = attendanceRecords.length;
    const presentCount = attendanceRecords.filter((r) => r.status === "present").length;
    const absentCount = attendanceRecords.filter((r) => r.status === "absent").length;
    const lateCount = attendanceRecords.filter((r) => r.status === "late").length;

    return NextResponse.json({
      studentID,
      name: student.firstName,
      presentPercentage: (presentCount / totalRecords) * 100,
      absentPercentage: (absentCount / totalRecords) * 100,
      latePercentage: (lateCount / totalRecords) * 100,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}