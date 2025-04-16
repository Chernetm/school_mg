
const { prisma } = require("@/utils/prisma");

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const staffList = await prisma.staff.findMany({
      where: { role },
      select: {
        staffID: true,
        firstName: true,
        lastName: true,
      },
    });

    return NextResponse.json({ staff: staffList }, { status: 200 });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userID = req.headers.get("x-user-id");

  

    if (!userID) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { attendance } = body;

    if (!attendance) {
      return NextResponse.json({ error: "Missing attendance data" }, { status: 400 });
    }

    // Prepare attendance entries based on the new schema
    const attendanceEntries = Object.entries(attendance).map(([staffID, status]) => ({
      staffID: Number(staffID),         // Staff ID being marked
      status,                           // Attendance status (present/absent/late)
      userID: Number(userID),           // Staff ID of the user recording the attendance
    }));

    // Create multiple attendance records in the StaffAttendance model
    await prisma.staffAttendance.createMany({
      data: attendanceEntries.map((entry) => ({
        staffID: entry.staffID,
        status: entry.status,
        userID: entry.userID,
      })),
    });

    return NextResponse.json({ message: "Attendance submitted successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error submitting attendance:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

  