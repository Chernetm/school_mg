
const { prisma } = require("@/utils/prisma")
import { getStaffIDFromToken } from "@/utils/auth";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { studentID, message } = await req.json();
    const staffID = await getStaffIDFromToken();
    if (!staffID) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log("Staff ID:", staffID);

    // Basic field presence check
    if (!studentID || !staffID || !message || message.trim() === "") {
      return NextResponse.json(
        { message: "studentID, staffID, and message are required." },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { studentID},
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 }
      );
    }

    // Check if staff exists
    const staff = await prisma.staff.findUnique({
      where: { id: parseInt(staffID) },
    });

    if (!staff) {
      return NextResponse.json(
        { message: "Staff not found." },
        { status: 404 }
      );
    }

    // Create discipline record
    const newRecord = await prisma.disciplineRecord.create({
      data: {
        studentID,
        staffID: parseInt(staffID),
        message: message.trim(),
      },
    });

    return NextResponse.json(
      { message: "Discipline record created.", record: newRecord },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating discipline record:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
