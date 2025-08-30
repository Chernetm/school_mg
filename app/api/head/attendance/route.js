
const { prisma } = require("@/utils/prisma");
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const range = searchParams.get("range");

    if (!role || !range) {
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

    // Fetch staff members based on role
    const staffList = await prisma.staff.findMany({
      where: {
        role: role.toString(),
      },
      select: {
        staffID: true,
        firstName: true,
        middleName: true,
        lastName: true,
      },
    });

    if (!staffList.length) {
      return NextResponse.json({ staff: [] });
    }

    const staffIDs = staffList.map((staff) => staff.staffID);

    // Fetch attendance records for staff members
    const attendanceRecords = await prisma.staffAttendance.findMany({
      where: {
        date: { gte: startDate },
        staffID: { in: staffIDs },
      },
      select: {
        staffID: true,
        status: true,
      },
    });

    // Compute attendance percentages for each staff member
    const staffAttendance = staffList.map(({ staffID, firstName, middleName, lastName }) => {
      const records = attendanceRecords.filter((r) => r.staffID === staffID);
      const totalRecords = records.length;
      const presentCount = records.filter((r) => r.status === "present").length;
      const absentCount = records.filter((r) => r.status === "absent").length;
      const lateCount = records.filter((r) => r.status === "late").length;

      return {
        staffID,
        firstName,
        middleName,
        lastName,
        presentPercentage: totalRecords ? (presentCount / totalRecords) * 100 : 0,
        absentPercentage: totalRecords ? (absentCount / totalRecords) * 100 : 0,
        latePercentage: totalRecords ? (lateCount / totalRecords) * 100 : 0,
      };
    });

    return NextResponse.json({ staff: staffAttendance });
  } catch (error) {
    console.error("Error fetching staff attendance:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
