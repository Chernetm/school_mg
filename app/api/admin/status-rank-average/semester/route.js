// const { prisma } = require("@/utils/prisma"); 
// import { NextResponse } from "next/server";

// export async function PUT(req) {
//   try {
//     const { year, grade, section } = await req.json();

//     // ✅ Get semesters with numeric value 1, 2, 3
//     const semesters = await prisma.semester.findMany({
//       where: { name: { in: [1, 2, 3] } },
//       select: { id: true, name: true },
//     });

//     const semesterIDs = Object.fromEntries(semesters.map(s => [s.name, s.id]));
//     const sem1ID = semesterIDs[1];
//     const sem2ID = semesterIDs[2];
//     const sem3ID = semesterIDs[3];

//     if (!sem1ID || !sem2ID || !sem3ID) {
//       return NextResponse.json({ message: "Required semesters not found" }, { status: 404 });
//     }

//     // 👥 Get registrations for the specified grade/section/year
//     const registrations = await prisma.registration.findMany({
//       where: {
//         year: Number(year),
//         grade: Number(grade),
//         section,
//         isActive: true,
//       },
//       select: {
//         registrationID: true,
//         resultSummary: {
//           where: {
//             semesterID: { in: [sem1ID, sem2ID] },
//           },
//           select: {
//             semesterID: true,
//             average: true,
//           },
//         },
//       },
//     });

//     // 📊 Only include students who have both semester 1 and 2 averages
//     const studentsWithBoth = registrations
//       .map((reg) => {
//         const sem1 = reg.resultSummary.find(r => r.semesterID === sem1ID);
//         const sem2 = reg.resultSummary.find(r => r.semesterID === sem2ID);
//         if (!sem1?.average || !sem2?.average) return null;

//         const average = parseFloat(((sem1.average + sem2.average) / 2).toFixed(2));
//         return {
//           registrationID: reg.registrationID,
//           average,
//         };
//       })
//       .filter(Boolean);

//     if (!studentsWithBoth.length) {
//       return NextResponse.json({ message: "No students with averages for both semesters." }, { status: 400 });
//     }

//     // 🏅 Sort and rank students
//     studentsWithBoth.sort((a, b) => b.average - a.average);
//     studentsWithBoth.forEach((student, index) => {
//       student.rank = index + 1;
//     });

//     // 💾 Upsert Semester 3 result summaries
//     await Promise.all(
//       studentsWithBoth.map((student) =>
//         prisma.resultSummary.upsert({
//           where: {
//             registrationID_semesterID: {
//               registrationID: student.registrationID,
//               semesterID: sem3ID,
//             },
//           },
//           update: {
//             average: student.average,
//             rank: student.rank,
//             passStatus: "passed",
//           },
//           create: {
//             registrationID: student.registrationID,
//             semesterID: sem3ID,
//             average: student.average,
//             rank: student.rank,
//             passStatus: "passed",
//           },
//         })
//       )
//     );

//     return NextResponse.json({ message: "Semester 3 rankings saved successfully." }, { status: 200 });
//   } catch (error) {
//     console.error("Error processing result summary:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }
const { prisma } = require("@/utils/prisma");
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { year, grade, section } = await req.json();

    // ✅ Define semester names (1, 2, 3)
    const [sem1, sem2, sem3] = [1, 2, 3];

    // 📦 Get semester names from the database to confirm they exist
    const semesters = await prisma.semester.findMany({
      where: { name: { in: [sem1, sem2, sem3] } },
      select: { name: true },
    });

    const foundNames = semesters.map(s => s.name);
    if (!foundNames.includes(sem1) || !foundNames.includes(sem2) || !foundNames.includes(sem3)) {
      return NextResponse.json({ message: "Required semesters not found" }, { status: 404 });
    }

    // 👥 Get active registrations for the given year/grade/section
    const registrations = await prisma.registration.findMany({
      where: {
        year: Number(year),
        grade: Number(grade),
        section,
        isActive: true,
      },
      select: {
        registrationID: true,
        resultSummary: {
          where: {
            semester: { in: [sem1, sem2] },
          },
          select: {
            semester: true,
            average: true,
          },
        },
      },
    });

    // 📊 Only include students with both semester 1 and 2 averages
    const studentsWithBoth = registrations
      .map((reg) => {
        const sem1Result = reg.resultSummary.find(r => r.semester === sem1);
        const sem2Result = reg.resultSummary.find(r => r.semester === sem2);
        if (!sem1Result?.average || !sem2Result?.average) return null;

        const average = parseFloat(((sem1Result.average + sem2Result.average) / 2).toFixed(2));
        return {
          registrationID: reg.registrationID,
          average,
        };
      })
      .filter(Boolean);

    if (!studentsWithBoth.length) {
      return NextResponse.json({ message: "No students with averages for both semesters." }, { status: 400 });
    }

    // 🏅 Sort and assign ranks
    studentsWithBoth.sort((a, b) => b.average - a.average);
    studentsWithBoth.forEach((student, index) => {
      student.rank = index + 1;
    });

    // 💾 Upsert Semester 3 result summaries (using semester name)
    await Promise.all(
      studentsWithBoth.map((student) =>
        prisma.resultSummary.upsert({
          where: {
            registrationID_semester: {
              registrationID: student.registrationID,
              semester: sem3,
            },
          },
          update: {
            average: student.average,
            rank: student.rank,
            passStatus: student.average >= 50 ? "passed" : "failed",
          },
          create: {
            registrationID: student.registrationID,
            semester: sem3,
            average: student.average,
            rank: student.rank,
            passStatus: student.average >= 50 ? "passed" : "failed",
          },
        })
      )
    );

    return NextResponse.json({ message: "Semester 3 rankings saved successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error processing result summary:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
