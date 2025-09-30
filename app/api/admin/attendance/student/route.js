const { prisma } = require("@/utils/prisma");
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade");
    const section = searchParams.get("section");
    const range = searchParams.get("range");

    if (!grade || !section || !range) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    // compute startDate/endDate (end of today)
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let startDate = new Date(endDate);

    switch (range) {
      case "weekly":
        // last 7 days (including today)
        startDate.setDate(endDate.getDate() - 6);
        break;
      case "monthly":
        // last 30 days (including today)
        startDate.setDate(endDate.getDate() - 29);
        break;
      case "annually":
        // year-to-date
        startDate = new Date(endDate.getFullYear(), 0, 1, 0, 0, 0, 0);
        break;
      default:
        return NextResponse.json({ message: "Invalid range parameter" }, { status: 400 });
    }

    // Fetch active registrations (students) in the specified grade & section
    const registeredStudents = await prisma.registration.findMany({
      where: {
        grade: Number(grade),
        section: section.toString(),
        isActive: true,
      },
      select: {
        studentID: true,
        student: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
    });

    if (!registeredStudents.length) {
      return NextResponse.json({ students: [] });
    }

    const studentIDs = registeredStudents.map((r) => r.studentID);

    // Fetch attendance records for those students in the date range (inclusive)
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentID: { in: studentIDs },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        studentID: true,
        status: true,
        date: true,
      },
    });

    // If no attendance records at all in the range, return zeros for students
    if (!attendanceRecords.length) {
      const zeroAttendance = registeredStudents.map(({ studentID, student }) => ({
        studentID,
        name: `${student.firstName}${student.middleName ? ` ${student.middleName}` : ""}${student.lastName ? ` ${student.lastName}` : ""}`.trim(),
        totalDays: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        presentPercentage: 0,
        absentPercentage: 0,
        latePercentage: 0,
      }));
      return NextResponse.json({ students: zeroAttendance });
    }

    // Normalize dates to YYYY-MM-DD in the user's timezone (Africa/Addis_Ababa)
    const dateKeyFor = (d) =>
      new Date(d).toLocaleDateString("en-CA", { timeZone: "Africa/Addis_Ababa" }); // 'YYYY-MM-DD'

    // compute distinct class-level attendance dates (the denominator)
    const distinctDatesSet = new Set(attendanceRecords.map((r) => dateKeyFor(r.date)));
    const distinctDates = Array.from(distinctDatesSet).sort(); // optional: sorted list of date-keys
    const expectedDays = distinctDates.length;

    // build quick lookup: (studentID + dateKey) => status
    const recordMap = new Map();
    attendanceRecords.forEach((r) => {
      const key = `${r.studentID}_${dateKeyFor(r.date)}`;
      recordMap.set(key, r.status);
    });

    // For each registered student, compute counts across distinctDates.
    // NOTE: missing record for a (student, date) is treated as 'absent' here.
    // If you prefer to exclude missing records from denominator, change logic below.
    const studentAttendance = registeredStudents.map(({ studentID, student }) => {
      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;

      distinctDates.forEach((dateKey) => {
        const key = `${studentID}_${dateKey}`;
        const status = recordMap.get(key);
        if (!status) {
          // no record => treat as absent (change this behavior if needed)
          absentCount += 1;
        } else if (status === "present") {
          presentCount += 1;
        } else if (status === "late") {
          lateCount += 1;
        } else if (status === "absent") {
          absentCount += 1;
        } else {
          // unknown status => treat as absent (or handle specially)
          absentCount += 1;
        }
      });

      const presentPercentage = expectedDays ? parseFloat(((presentCount / expectedDays) * 100).toFixed(2)) : 0;
      const absentPercentage = expectedDays ? parseFloat(((absentCount / expectedDays) * 100).toFixed(2)) : 0;
      const latePercentage = expectedDays ? parseFloat(((lateCount / expectedDays) * 100).toFixed(2)) : 0;

      return {
        studentID,
        name: `${student.firstName}${student.middleName ? ` ${student.middleName}` : ""}${student.lastName ? ` ${student.lastName}` : ""}`.trim(),
        totalDays: expectedDays,
        presentCount,
        absentCount,
        lateCount,
        presentPercentage,
        absentPercentage,
        latePercentage,
      };
    });

    return NextResponse.json({ students: studentAttendance });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// const { prisma } = require("@/utils/prisma");
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const grade = searchParams.get("grade");
//     const section = searchParams.get("section");
//     const range = searchParams.get("range");

//     if (!grade || !section || !range) {
//       return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
//     }

//     // Determine the start date based on range
//     const today = new Date();
//     let startDate;

//     switch (range) {
//       case "weekly":
//         startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
//         break;
//       case "monthly":
//         startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
//         break;
//       case "annually":
//         startDate = new Date(today.getFullYear(), 0, 1);
//         break;
//       default:
//         return NextResponse.json({ message: "Invalid range parameter" }, { status: 400 });
//     }

//     // Fetch students in the specified grade & section
//     const registeredStudents = await prisma.registration.findMany({
//       where: {
//         grade: Number(grade),
//         section: section.toString(),
//       },
//       select: {
//         studentID: true,
//         student: {
//           select: {
//             firstName: true,
//             middleName:true,
//             lastName:true,
//           },
//         },
//       },
//     });

//     if (!registeredStudents.length) {
//       return NextResponse.json({ students: [] });
//     }

//     const studentIDs = registeredStudents.map((reg) => reg.studentID);

//     // Fetch attendance records
//     const attendanceRecords = await prisma.attendance.findMany({
//       where: {
//         date: { gte: startDate },
//         studentID: { in: studentIDs },
//       },
//       select: {
//         studentID: true,
//         status: true,
//       },
//     });

//     // Compute attendance percentages
//     const studentAttendance = registeredStudents.map(({ studentID, student }) => {
//       const records = attendanceRecords.filter((r) => r.studentID === studentID);
//       const totalRecords = records.length;
//       const presentCount = records.filter((r) => r.status === "present").length;
//       const absentCount = records.filter((r) => r.status === "absent").length;
//       const lateCount = records.filter((r) => r.status === "late").length;

//       return {
//         studentID,
//         name: student.firstName,
//         presentPercentage: totalRecords ? (presentCount / totalRecords) * 100 : 0,
//         absentPercentage: totalRecords ? (absentCount / totalRecords) * 100 : 0,
//         latePercentage: totalRecords ? (lateCount / totalRecords) * 100 : 0,
//       };
//     });

//     return NextResponse.json({ students: studentAttendance });
//   } catch (error) {
//     console.error("Error fetching attendance:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }
