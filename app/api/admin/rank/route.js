// const { prisma } = require("@/utils/prisma");
// import { NextResponse } from "next/server";

// export async function PUT(req) {
//   try {
//     const { year, grade, section, semester } = await req.json();

//     if (!year || !grade || !section || !semester) {
//       return NextResponse.json(
//         { message: "Missing required parameters" },
//         { status: 400 }
//       );
//     }

//     const sem = Number(semester);
//     if (![1, 2, 3].includes(sem)) {
//       return NextResponse.json({ message: "Invalid semester value" }, { status: 400 });
//     }

//     // ✅ Check grade and year existence
//     const existingGrade = await prisma.grade.findUnique({
//       where: { grade: Number(grade) },
//     });
//     if (!existingGrade) {
//       return NextResponse.json({ message: "Grade not found" }, { status: 404 });
//     }

//     const existingYear = await prisma.year.findUnique({
//       where: { year: Number(year) },
//     });
//     if (!existingYear) {
//       return NextResponse.json({ message: "Year not found" }, { status: 404 });
//     }

//     // ✅ Check semester existence and status (only for semesters 1 & 2)
//     if (sem !== 3) {
//       const semesterRecord = await prisma.semester.findUnique({
//         where: { name: sem },
//       });
//       if (!semesterRecord) {
//         return NextResponse.json({ message: `Semester ${sem} not found` }, { status: 404 });
//       }
//       if (semesterRecord.status !== "active") {
//         return NextResponse.json({ message: `Semester ${sem} is not active` }, { status: 400 });
//       }
//     }

//     // 📚 Determine total subjects for the grade
//     let totalSubjects = 6;
//     if ([9, 10].includes(Number(grade))) totalSubjects = 5;
//     else if ([11, 12].includes(Number(grade))) totalSubjects = 6;

//     // 👥 Get active registrations with results
//     const registrations = await prisma.registration.findMany({
//       where: { year: Number(year), grade: Number(grade), section, isActive: true },
//       include: {
//         resultDetail: {
//           where: { semester: sem },
//           select: { score: true },
//         },
//         resultSummary: {
//           where: { semester: { in: [1, 2] } }, // for sem 3 calculation
//           select: { semester: true, average: true },
//         },
//       },
//     });

//     let rankedStudents = [];

//     if (sem === 1 || sem === 2) {
//       // Rank based on a single semester
//       rankedStudents = registrations
//         .map((reg) => {
//           const scores = reg.resultDetail.map((r) => r.score ?? 0);
//           if (scores.length < totalSubjects) return null;

//           const totalScore = scores.reduce((sum, s) => sum + s, 0);
//           const average = parseFloat((totalScore / totalSubjects).toFixed(2));
//           return { registrationID: reg.registrationID, average };
//         })
//         .filter(Boolean);
//     } else if (sem === 3) {
//       // Rank based on average of semesters 1 & 2
//       rankedStudents = registrations
//         .map((reg) => {
//           const sem1 = reg.resultSummary.find((r) => r.semester === 1);
//           const sem2 = reg.resultSummary.find((r) => r.semester === 2);
//           if (!sem1?.average || !sem2?.average) return null;

//           const avg = parseFloat(((sem1.average + sem2.average) / 2).toFixed(2));
//           return { registrationID: reg.registrationID, average: avg };
//         })
//         .filter(Boolean);
//     }

//     if (!rankedStudents.length) {
//       return NextResponse.json(
//         { message: `No students with complete results for semester ${sem}.` },
//         { status: 400 }
//       );
//     }

//     // 🏅 Sort & assign ranks
//     rankedStudents.sort((a, b) => b.average - a.average);
//     rankedStudents.forEach((student, index) => {
//       student.rank = index + 1;
//     });

//     // 💾 Upsert rankings safely
//     await Promise.all(
//       rankedStudents.map(async (student) => {
//         // Ensure registration exists
//         const registration = await prisma.registration.findUnique({
//           where: { registrationID: student.registrationID },
//         });
//         if (!registration) return; // skip if registration missing

//         // Ensure semester exists for sem 3
//         if (sem === 3) {
//           const semesterExists = await prisma.semester.findUnique({ where: { name: 3 } });
//           if (!semesterExists) return; // skip if semester 3 missing
//         }

//         await prisma.resultSummary.upsert({
//           where: { registrationID_semester: { registrationID: student.registrationID, semester: sem } },
//           update: {
//             average: student.average,
//             rank: student.rank,
//             passStatus: student.average >= 50 ? "passed" : "failed",
//           },
//           create: {
//             registrationID: student.registrationID,
//             semester: sem,
//             average: student.average,
//             rank: student.rank,
//             passStatus: student.average >= 50 ? "passed" : "failed",
//           },
//         });
//       })
//     );

//     return NextResponse.json(
//       { message: `Semester ${sem} rankings saved successfully.` },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error processing result summary:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }



// const { prisma } = require("@/utils/prisma");
// import { NextResponse } from "next/server";

// export async function PUT(req) {
//   try {
//     const { year, grade, section, semester } = await req.json();

//     if (!year || !grade || !section || !semester) {
//       return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
//     }

//     const sem = Number(semester);
//     if (![1, 2, 3].includes(sem)) {
//       return NextResponse.json({ message: "Invalid semester value" }, { status: 400 });
//     }

//     const existingGrade = await prisma.grade.findUnique({
//       where: { grade: Number(grade) },
//     });
//     if (!existingGrade) {
//       return NextResponse.json({ message: "Grade not found" }, { status: 404 });
//     }

//     const existingYear = await prisma.year.findUnique({
//       where: { year: Number(year) },
//     });
//     if (!existingYear) {
//       return NextResponse.json({ message: "Year not found" }, { status: 404 });
//     }

//     if(!sem==3){
//     const semesterRecord = await prisma.semester.findUnique({
//       where: { name: sem },
//     });
//     if (!semesterRecord) {
//       return NextResponse.json({ message: `Semester ${sem} not found` }, { status: 404 });
//     }
//     if (!semesterRecord.status=="active") {
//       return NextResponse.json({ message: `Semester ${sem} is not active` }, { status: 400 });
//     }
//     }
    

//     // 📚 Total subjects required based on grade
//     let totalSubjects = 6; // default
//     if ([9, 10].includes(Number(grade))) {
//       totalSubjects = 5;
//     } else if ([11, 12].includes(Number(grade))) {
//       totalSubjects = 6;
//     }

//     // 👥 Get active registrations + results
//     const registrations = await prisma.registration.findMany({
//       where: {
//         year: Number(year),
//         grade: Number(grade),
//         section,
//         isActive: true,
//       },
//       include: {
//         resultDetail: {
//           where: { semester: sem },
//           select: { score: true },
//         },
//         resultSummary: {
//           where: { semester: { in: [1, 2] } }, // keep for sem=3 calc
//           select: { semester: true, average: true },
//         },
//       },
//     });

//     let rankedStudents = [];

//     if (sem === 1 || sem === 2) {
//       // 📊 Rank based on a single semester (subject-level)
//       rankedStudents = registrations
//         .map((reg) => {
//           const scores = reg.resultDetail.map((r) => r.score ?? 0);
//           if (scores.length < totalSubjects) return null;

//           const totalScore = scores.reduce((sum, s) => sum + s, 0);
//           const average = parseFloat((totalScore / totalSubjects).toFixed(2));

//           return {
//             registrationID: reg.registrationID,
//             average,
//           };
//         })
//         .filter(Boolean);
//     } else if (sem === 3) {
//       // 📊 Rank based on average of semesters 1 & 2 summaries
//       rankedStudents = registrations
//         .map((reg) => {
//           const sem1 = reg.resultSummary.find((r) => r.semester === 1);
//           const sem2 = reg.resultSummary.find((r) => r.semester === 2);
//           if (!sem1?.average || !sem2?.average) return null;

//           const avg = parseFloat(((sem1.average + sem2.average) / 2).toFixed(2));
//           return {
//             registrationID: reg.registrationID,
//             average: avg,
//           };
//         })
//         .filter(Boolean);
//     }

//     if (!rankedStudents.length) {
//       return NextResponse.json(
//         { message: `No students with complete results for semester ${sem}.` },
//         { status: 400 }
//       );
//     }

//     // 🏅 Sort & assign ranks
//     rankedStudents.sort((a, b) => b.average - a.average);
//     rankedStudents.forEach((student, index) => {
//       student.rank = index + 1;
//     });

//     // 💾 Save / update rankings
//     await Promise.all(
//       rankedStudents.map((student) =>
//         prisma.resultSummary.upsert({
//           where: {
//             registrationID_semester: {
//               registrationID: student.registrationID,
//               semester: sem,
//             },
//           },
//           update: {
//             average: student.average,
//             rank: student.rank,
//             passStatus: student.average >= 50 ? "passed" : "failed",
//           },
//           create: {
//             registrationID: student.registrationID,
//             semester: sem,
//             average: student.average,
//             rank: student.rank,
//             passStatus: student.average >= 50 ? "passed" : "failed",
//           },
//         })
//       )
//     );

//     return NextResponse.json({ message: `Semester ${sem} rankings saved successfully.` }, { status: 200 });
//   } catch (error) {
//     console.error("Error processing result summary:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }
const { prisma } = require("@/utils/prisma");
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { year, grade, section, semester } = await req.json();

    if (!year || !grade || !section || !semester) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const sem = Number(semester);
    if (![1, 2, 3].includes(sem)) {
      return NextResponse.json({ message: "Invalid semester value" }, { status: 400 });
    }

    // ✅ Check grade and year existence
    const existingGrade = await prisma.grade.findUnique({ where: { grade: Number(grade) } });
    if (!existingGrade) return NextResponse.json({ message: "Grade not found", status: 404 });

    const existingYear = await prisma.year.findUnique({ where: { year: Number(year) } });
    if (!existingYear) return NextResponse.json({ message: "Year not found", status: 404 });

    // ✅ Check semester existence and status (for semesters 1 & 2)
    if (sem !== 3) {
      const semesterRecord = await prisma.semester.findUnique({ where: { name: sem } });
      if (!semesterRecord) return NextResponse.json({ message: `Semester ${sem} not found`, status: 404 });
      if (semesterRecord.status !== "active") return NextResponse.json({ message: `Semester ${sem} is not active`, status: 400 });
    } else {
      // ✅ Ensure semester 3 exists for calculations
      const semester3 = await prisma.semester.findUnique({ where: { name: 3 } });
      if (!semester3) return NextResponse.json({ message: "Semester 3 does not exist", status: 404 });
    }

    // 📚 Determine total subjects for the grade
    let totalSubjects = 6;
    if ([9, 10].includes(Number(grade))) totalSubjects = 5;
    else if ([11, 12].includes(Number(grade))) totalSubjects = 6;

    // 👥 Get active registrations with results
    const registrations = await prisma.registration.findMany({
      where: { year: Number(year), grade: Number(grade), section, isActive: true },
      include: {
        resultDetail: { where: { semester: sem }, select: { score: true } },
        resultSummary: { where: { semester: { in: [1, 2] } }, select: { semester: true, average: true } },
      },
    });

    let rankedStudents = [];

    if (sem === 1 || sem === 2) {
      // Rank based on a single semester
      rankedStudents = registrations
        .map((reg) => {
          const scores = reg.resultDetail.map((r) => r.score ?? 0);
          if (scores.length < totalSubjects) return null;
          const totalScore = scores.reduce((sum, s) => sum + s, 0);
          const average = parseFloat((totalScore / totalSubjects).toFixed(2));
          return { registrationID: reg.registrationID, average };
        })
        .filter(Boolean);
    } else if (sem === 3) {
      // Rank based on average of semesters 1 & 2
      rankedStudents = registrations
        .map((reg) => {
          const sem1 = reg.resultSummary.find((r) => r.semester === 1);
          const sem2 = reg.resultSummary.find((r) => r.semester === 2);
          if (!sem1?.average || !sem2?.average) return null;
          const avg = parseFloat(((sem1.average + sem2.average) / 2).toFixed(2));
          return { registrationID: reg.registrationID, average: avg };
        })
        .filter(Boolean);
    }

    if (!rankedStudents.length) {
      return NextResponse.json(
        { message: `No students with complete results for semester ${sem}.` },
        { status: 400 }
      );
    }

    // 🏅 Sort & assign ranks
    rankedStudents.sort((a, b) => b.average - a.average);
    rankedStudents.forEach((student, index) => { student.rank = index + 1; });

    // 💾 Upsert rankings
    await Promise.all(
      rankedStudents.map(async (student) => {
        const registration = await prisma.registration.findUnique({ where: { registrationID: student.registrationID } });
        if (!registration) return; // skip if registration missing

        await prisma.resultSummary.upsert({
          where: { registrationID_semester: { registrationID: student.registrationID, semester: sem } },
          update: {
            average: student.average,
            rank: student.rank,
            passStatus: student.average >= 50 ? "passed" : "failed",
          },
          create: {
            registrationID: student.registrationID,
            semester: sem,
            average: student.average,
            rank: student.rank,
            passStatus: student.average >= 50 ? "passed" : "failed",
          },
        });
      })
    );

    return NextResponse.json(
      { message: `Semester ${sem} rankings saved successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing result summary:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
