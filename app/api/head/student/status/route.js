const {prisma}=require("@/utils/prisma"); // adjust the path based on where your prisma client is
import { NextResponse } from 'next/server';

// Only allow PATCH method
export async function PUT(req) {
  try {
    const { studentID, status } = await req.json();

    if (!studentID || !status) {
      return NextResponse.json({ error: 'Student ID and Status are required.' }, { status: 400 });
    }

    const updatedStudent = await prisma.student.update({
      where: { studentID },
      data: { status },
    });

    return NextResponse.json({ student: updatedStudent }, { status: 200 });
  } catch (error) {
    console.error('Error updating student status:', error);
    return NextResponse.json({ error: 'Failed to update student status' }, { status: 500 });
  }
}
