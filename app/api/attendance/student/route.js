
const { prisma } = require("@/utils/prisma");
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 🔹 Extract token from cookies
    const token = req.cookies.get("staffToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔹 Decode staffToken to get staffID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const staffID = decoded.staffID; // Extract staffID from token
    const body = await req.json();
    const { attendance } = body;
    console.log("student-attendance",staffID,attendance)

    if (!attendance) {
      return NextResponse.json({ error: "Missing attendance data" }, { status: 400 });
    }

    // 🔹 Prepare attendance records
    const attendanceRecords = Object.entries(attendance).map(([studentID, status]) => ({
      studentID: studentID,
      status,
      staffID, // Automatically extracted from the token
    }));

    // 🔹 Save attendance records in DB
    await prisma.attendance.createMany({
      data: attendanceRecords,
    });

    return NextResponse.json({ message: "Attendance submitted successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error submitting attendance:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
