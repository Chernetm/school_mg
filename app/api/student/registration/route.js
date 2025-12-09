// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import ApiError from '@/lib/api-error';
// import { prisma } from '@/utils/prisma';
// import { getServerSession } from 'next-auth';
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { year, grade, stream } = body;
//     console.log("Request body:", body);

//     const session = await getServerSession(authOptions);
//     const studentID = session?.user?.studentID;

//     if (!studentID) {
//       throw new ApiError(403, 'Unauthorized access');
//     }

//     // Validate academic year
//     const latestYear = await prisma.year.findFirst({
//       where: { status: "active" },
//       orderBy: { year: "desc" },
//       select: { year: true },
//     });

//     if (!latestYear || latestYear.year !== year) {
//       return NextResponse.json({ message: 'Invalid academic year' }, { status: 400 });
//     }

//     // Get latest registration
//     const latestRegistration = await prisma.registration.findFirst({
//       where: { studentID },
//       orderBy: { year: 'desc' },
//     });

//     if (!latestRegistration) {
//       return NextResponse.json({ message: 'No registration found for student' }, { status: 404 });
//     }

//     const currentGrade = latestRegistration.grade;

//     // Get semester 3 result summary
//     const semester3Summary = await prisma.resultSummary.findFirst({
//       where: {
//         registrationID: latestRegistration.registrationID,
//         semester: 3,
//       },
//     });

//     if (!semester3Summary || semester3Summary.average <= 50) {
//       return NextResponse.json({ message: 'Student is not eligible for promotion' }, { status: 400 });
//     }

//     // Compute next grade
//     const nextGrade = currentGrade + 1;

//     // Validate grade input
//     if (nextGrade !== grade) {
//       return NextResponse.json({ message: 'Invalid grade for registration' }, { status: 400 });
//     }

//     // ✅ Stream requirement for Grade 11
//     if (nextGrade === 11 && !stream) {
//       return NextResponse.json({ message: 'Stream is required for grade 11 registration' }, { status: 400 });
//     }

//     const newStream = stream || latestRegistration.stream;

//     // Create new registration
//     const newRegistration = await prisma.registration.create({
//       data: {
//         studentID,
//         grade: nextGrade,
//         year,
//         stream: newStream,
//         isActive: true,
//       },
//     });

//     return NextResponse.json({
//       message: 'Student registered for next grade',
//       registration: newRegistration,
//     }, { status: 201 });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
//   }
// }

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ApiError from '@/lib/api-error';
import { prisma } from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { year, grade, stream } = body;
    console.log("Request body:", body);

    const session = await getServerSession(authOptions);
    const studentID = session?.user?.studentID;

    if (!studentID) {
      throw new ApiError(403, 'Unauthorized access');
    }

    // ✔ Check if registration year is opened
    const latestYear = await prisma.year.findFirst({
      where: { status: "active" },
      orderBy: { year: "desc" },
      select: { year: true },
    });

    if (!latestYear) {
      return NextResponse.json(
        { message: "No active academic year found" },
        { status: 400 }
      );
    }

    // ✔ Validate that the submitted year matches the active year
    if (year !== latestYear.year) {
      return NextResponse.json(
        { message: `Registration closed for year ${year}. Active year is ${latestYear.year}` },
        { status: 400 }
      );
    }

    // Get student's latest registration
    const latestRegistration = await prisma.registration.findFirst({
      where: { studentID },
      orderBy: { year: 'desc' },
    });

    if (!latestRegistration) {
      return NextResponse.json(
        { message: 'No registration found for student' },
        { status: 404 }
      );
    }

    const currentGrade = latestRegistration.grade;

    // ✔ Year must also match previousYear + 1
    const previousYear = latestRegistration.year;
    const expectedYear = previousYear + 1;

    if (year !== expectedYear) {
      return NextResponse.json(
        { message: `Invalid year progression. Expected ${expectedYear}` },
        { status: 400 }
      );
    }

    // ✔ Next grade must be previous grade + 1
    const nextGrade = currentGrade + 1;

    if (grade !== nextGrade) {
      return NextResponse.json(
        { message: `Invalid grade progression. Expected ${nextGrade}` },
        { status: 400 }
      );
    }

    // Check semester 3 result summary
    const semester3Summary = await prisma.resultSummary.findFirst({
      where: {
        registrationID: latestRegistration.registrationID,
        semester: 3,
      },
    });

    if (!semester3Summary || semester3Summary.average <= 50) {
      return NextResponse.json(
        { message: 'Student is not eligible for promotion' },
        { status: 400 }
      );
    }

    // Grade 11 requires stream
    if (nextGrade === 11 && !stream) {
      return NextResponse.json(
        { message: 'Stream is required for grade 11 registration' },
        { status: 400 }
      );
    }

    const newStream = stream || latestRegistration.stream;

    // Create registration
    const newRegistration = await prisma.registration.create({
      data: {
        studentID,
        grade: nextGrade,
        year: expectedYear,
        stream: newStream,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Student registered for next grade',
        registration: newRegistration,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
