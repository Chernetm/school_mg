const { prisma } = require('@/utils/prisma');
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const grade = parseInt(searchParams.get('grade'), 10);
  const month = searchParams.get('month');
  const year = parseInt(searchParams.get('year'), 10);

  if (!grade || !month || !year) {
    return NextResponse.json({ message: 'Missing query parameters' }, { status: 400 });
  }

  try {
    // 1. Get studentIDs who already paid
    const paidFees = await prisma.fee.findMany({
      where: {
        grade,
        month,
        year,
        status: 'paid',
      },
      select: {
        studentID: true,
      },
    });

    const paidIDs = paidFees.map(fee => fee.studentID);

    // 2. Get all active registered students for that grade and year
    const unpaidStudents = await prisma.registration.findMany({
      where: {
        grade,
        year,
        isActive: true,
        studentID: {
          notIn: paidIDs,
        },
      },
      select: {
        studentID: true,
        grade: true,
        section: true,
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Optional: Format result
    const result = unpaidStudents.map((reg) => ({
      studentID: reg.studentID,
      grade: reg.grade,
      section: reg.section || '',
      firstName: reg.student.firstName,
      lastName: reg.student.lastName,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


// const { prisma } = require('@/utils/prisma');
// import { NextResponse } from 'next/server';

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const grade = parseInt(searchParams.get('grade'), 10);
//   const year = parseInt(searchParams.get('year'), 10);

//   if (!grade || !year) {
//     return NextResponse.json({ message: 'Missing query parameters' }, { status: 400 });
//   }

//   try {
//     // 1. Get studentIDs who already paid
//     const paidFees = await prisma.payment.findMany({
//       where: {
//         grade,
//         year,
//         status: 'paid',
//       },
//       select: {
//         studentID: true,
//       },
//     });

//     const paidIDs = paidFees.map(fee => fee.studentID);

//     // 2. Get all active registered students for that grade and year
//     const unpaidStudents = await prisma.registration.findMany({
//       where: {
//         grade,
//         year,
//         isActive: true,
//         studentID: {
//           notIn: paidIDs,
//         },
//       },
//       select: {
//         studentID: true,
//         grade: true,
//         section: true,
//         student: {
//           select: {
//             firstName: true,
//             middleName: true,
//             lastName: true,
//           },
//         },
//       },
//     });

//     // Optional: Format result
//     const result = unpaidStudents.map((reg) => ({
//       studentID: reg.studentID,
//       grade: reg.grade,
//       section: reg.section || '',
//       firstName: reg.student.firstName,
//       lastName: reg.student.lastName,
//       middleName: reg.student.middleName,
//     }));

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }
