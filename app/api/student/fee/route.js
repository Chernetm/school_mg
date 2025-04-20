const {prisma}=require("@/utils/prisma")
import { getStudentIDFromToken } from "@/utils/auth";
import { NextResponse } from 'next/server';

export async function GET(req) {
  const studentID = await getStudentIDFromToken();
  console.log("Student ID from token:", studentID); // Debugging

  if (!studentID) {
    return NextResponse.json({ message: 'Missing studentID' }, { status: 400 });
  }

  try {
    const fees = await prisma.fee.findMany({
      where: { studentID },
      orderBy: { month: 'asc' }, // show Jan to Dec
    });

    return NextResponse.json({ fees });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
