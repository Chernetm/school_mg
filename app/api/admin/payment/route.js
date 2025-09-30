

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import {prisma} from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';


export async function GET(req) {
  console.log("🚀 API HIT: /api/teacher/student");

  try {
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade");
    const section = searchParams.get("section");
    const year = searchParams.get("year");
    const month = searchParams.get("month"); // ✅ added month

    console.log("📌 Params Received - Grade:", grade, "Section:", section, "Year:", year, "Month:", month);

    if (!grade || !section || !year || !month) {
      return NextResponse.json(
        { error: "Grade, Section, Year, and Month are required.", students: [] },
        { status: 400 }
      );
    }

    const students = await prisma.student.findMany({
      where: {
        registrations: {
          some: {
            grade: Number(grade),
            section,
            year: parseInt(year),
          },
        },
      },
      select: {
        studentID: true,
        firstName: true,
        middleName: true,
        lastName: true,
        fee: {
          where: {
            grade: Number(grade),
            year: parseInt(year),
            month, // ✅ filter by month
          },
          select: {
            status: true,
          },
          take: 1,
        },
      },
    });

    const studentWithStatus = students.map((s) => ({
      studentID: s.studentID,
      firstName: s.firstName,
      middleName: s.middleName,
      lastName: s.lastName,
      status: s.fee[0]?.status || "unpaid",
    }));

    return NextResponse.json({ students: studentWithStatus }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in API:", error);
    return NextResponse.json(
      { error: "Internal server error", students: [] },
      { status: 500 }
    );
  }
}



export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const staffID = session?.user?.staffID;

    if (!session || !staffID) {
      throw new ApiError(403, "Unauthorized access");
    }

    const body = await req.json();
    const { year, studentID, grade, month, status } = body; // ✅ added month

    if (!year || !studentID || !grade || !month || !status) {
      return NextResponse.json(
        { error: "year, studentID, grade, month and status are required" },
        { status: 400 }
      );
    }

    // ✅ Upsert payment record by year+grade+month
  const payment = await prisma.fee.upsert({
  where: {
    studentID_month_year: {
      studentID,
      month,
      year: Number(year),
    },
  },
  update: {
    status,
    staffID,
  },
  create: {
    studentID,
    month,
    year: Number(year),
    grade: Number(grade), // grade is fine in create, just not in `where`
    status,
    staffID,
  },
});


    // ✅ Update student status if needed
    await prisma.student.update({
      where: { studentID },
      data: {
        status: status === "paid" ? "active" : "inactive",
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("❌ Error in Payment POST:", error);
    return NextResponse.json(
      { error: "Failed to upsert payment" },
      { status: 500 }
    );
  }
}
