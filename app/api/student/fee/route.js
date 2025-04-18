const {prisma}=require("@/utils/prisma")
import { NextResponse } from 'next/server';

export async function GET(req) {
  const studentID = req.headers.get("x-student-id");

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
