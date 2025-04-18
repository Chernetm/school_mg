// const { prisma } = require("@/utils/prisma");
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   const studentID = req.headers.get("x-student-id");
//   if (!studentID) {
//         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//       }
//   try {
//     const registrations = await prisma.registration.findMany({
//       where: { studentID },
//       include: {
//         resultDetail: {
//           include: {
//             semester: true,
//           },
//         },
//         resultSummary: {
//           include: {
//             semester: true,
//           },
//         },
//       },
//     });

//     const resultsByGrade = {};

//     for (const reg of registrations) {
//       const gradeKey = `Grade ${reg.grade}`;
//       if (!resultsByGrade[gradeKey]) resultsByGrade[gradeKey] = {};

//       // Map scores from resultDetail by semester and subject (as string)
//       for (const result of reg.resultDetail) {
//         const semName = result.semester.semester;

//         if (!resultsByGrade[gradeKey][semName]) {
//           resultsByGrade[gradeKey][semName] = {
//             scores: {},
//           };
//         }

//         const subjectName = result.subject || "Unknown Subject";
//         resultsByGrade[gradeKey][semName].scores[subjectName] = result.score ?? 0;
//       }

//       // Map summary info from resultSummary by semester
//       for (const summary of reg.resultSummary) {
//         const semName = summary.semester.semester;

//         if (!resultsByGrade[gradeKey][semName]) {
//           resultsByGrade[gradeKey][semName] = {
//             scores: {},
//           };
//         }

//         resultsByGrade[gradeKey][semName].average = summary.average;
//         resultsByGrade[gradeKey][semName].rank = summary.rank;
//         resultsByGrade[gradeKey][semName].passStatus = summary.passStatus;
//       }
//     }
//     console.log(resultsByGrade);
//     return NextResponse.json({ results: resultsByGrade }, { status: 200 });
//   } catch (err) {
//     console.error("Error fetching student result:", err);
//     return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
//   }
// }

import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const studentID = req.headers.get("x-student-id");
  if (!studentID) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const registrations = await prisma.registration.findMany({
      where: { studentID },
      include: {
        resultDetail: {
          include: {
            semester: {
              select: { name: true },
            },
          },
        },
        resultSummary: {
          include: {
            semester: {
              select: { name: true },
            },
          },
        },
      },
    });

    const resultsByGrade = {};

    for (const reg of registrations) {
      const gradeKey = `Grade ${reg.grade}`;
      if (!resultsByGrade[gradeKey]) resultsByGrade[gradeKey] = {};

      // Map scores from resultDetail by semester and subject
      for (const result of reg.resultDetail) {
        const semName = `Semester ${result.semester.name}`;

        if (!resultsByGrade[gradeKey][semName]) {
          resultsByGrade[gradeKey][semName] = {
            scores: {},
          };
        }

        const subjectName = result.subject || "Unknown Subject";
        resultsByGrade[gradeKey][semName].scores[subjectName] = result.score ?? 0;
      }

      // Map summary info from resultSummary by semester
      for (const summary of reg.resultSummary) {
        const semName = `Semester ${summary.semester.name}`;

        if (!resultsByGrade[gradeKey][semName]) {
          resultsByGrade[gradeKey][semName] = {
            scores: {},
          };
        }

        resultsByGrade[gradeKey][semName].average = summary.average;
        resultsByGrade[gradeKey][semName].rank = summary.rank;
        resultsByGrade[gradeKey][semName].passStatus = summary.passStatus;
      }
    }

    return NextResponse.json({ results: resultsByGrade }, { status: 200 });
  } catch (err) {
    console.error("Error fetching student result:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
