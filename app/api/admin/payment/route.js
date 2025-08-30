

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

    console.log("📌 Params Received - Grade:", grade, "Section:", section, "Year:", year);

    if (!grade || !section || !year) {
      return NextResponse.json(
        { error: "Grade, Section, and Year are required.", students: [] },
        { status: 400 }
      );
    }

    const students = await prisma.student.findMany({
      where: {
        registrations: {
          some: {
            grade: parseInt(grade),
            section,
            year: parseInt(year),
            isActive: true,
          },
        },
      },
      select: {
        studentID: true,
        firstName: true,
        middleName: true,
        lastName: true,
        payment: {
          where: {
            grade: parseInt(grade),
            year: parseInt(year),
          },
          select: {
            status: true,
          },
          take: 1, // get only the latest/first payment for that year+grade
        },
      },
    });

    // Map to flatten status (default unpaid if no payment record)
    const studentWithStatus = students.map((s) => ({
      studentID: s.studentID,
      firstName: s.firstName,
      middleName: s.middleName,
      lastName: s.lastName,
      status: s.payment[0]?.status || "unpaid",
    }));

    console.log("📌 Students Found:", studentWithStatus.length);
    return NextResponse.json({ students: studentWithStatus }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in API:", error);
    return NextResponse.json(
      { error: "Internal server error", students: [] },
      { status: 500 }
    );
  }
}


// export async function POST(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     console.log("Session data:", session);
//     const staffID = session?.user?.staffID;

//     if (!session || !staffID) {
//       throw new ApiError(403, "Unauthorized access");
//     }

//     const body = await req.json();
//     const { year, studentID, grade, status } = body;

//     if (!year || !studentID || !grade || !status) {
//       return NextResponse.json(
//         { error: "year, studentID, grade and status are required" },
//         { status: 400 }
//       );
//     }

//     // Upsert payment record
//     const payment = await prisma.payment.upsert({
//       where: {
//         studentID_year_grade: {
//           studentID,
//           year: Number(year),
//           grade: Number(grade),
//         },
//       },
//       update: {
//         status,
//       },
//       create: {
//         studentID,
//         year: Number(year),
//         grade: Number(grade),
//         status,
//         staffID,
//       },
//     });

//     // 🔄 Update student status based on payment status
//     await prisma.student.update({
//       where: { studentID },
//       data: {
//         status: status === "paid" ? "active" : "inactive",
//       },
//     });

//     return NextResponse.json(payment);
//   } catch (error) {
//     console.error("❌ Error in Payment POST:", error);
//     return NextResponse.json(
//       { error: "Failed to upsert payment" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);
    const staffID = session?.user?.staffID;

    if (!session || !staffID) {
      throw new ApiError(403, "Unauthorized access");
    }

    const body = await req.json();
    const { year, studentID, grade, status } = body;

    if (!year || !studentID || !grade || !status) {
      return NextResponse.json(
        { error: "year, studentID, grade and status are required" },
        { status: 400 }
      );
    }

    // Upsert payment record
    const payment = await prisma.payment.upsert({
      where: {
        studentID_year_grade: {
          studentID,
          year: Number(year),
          grade: Number(grade),
        },
      },
      update: {
        status,
        staffID, // ✅ update staffID when status changes
      },
      create: {
        studentID,
        year: Number(year),
        grade: Number(grade),
        status,
        staffID,
      },
    });

    // 🔄 Update student status based on payment status
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
