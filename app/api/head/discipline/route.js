

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);
    const staffID = session?.user?.staffID;
    
    if (!session  || !staffID) {
      throw new ApiError(403, 'Unauthorized access');
    }
    const { studentID, message } = await req.json();
    
  
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
