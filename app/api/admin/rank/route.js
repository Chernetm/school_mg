// import { prisma } from "@/utils/prisma";
// import { NextResponse } from "next/server";

// export async function PUT(req) {
//   try {
//     const { year, grade, section } = await req.json();

//     const passingScore = 50;

//     // ✅ Subject count based on grade
//     let totalSubjects = 6; // default
//     if (grade === 9 || grade === 10) {
//       totalSubjects = 12;
//     } else if (grade === 11 || grade === 12) {
//       totalSubjects = 10;
//     }

//     // 🔍 1️⃣ Get current active semester
//     const semester = await prisma.semester.findFirst({
//       where: { status: "active" },
//       select: { name: true },
//     });

//     if (!semester) {
//       return NextResponse.json({ message: "No active semester found" }, { status: 404 });
//     }

//     // 📚 2️⃣ Get students in specified group with result details for current semester
//     const students = await prisma.registration.findMany({
//       where: {
//         year: Number(year),
//         grade: Number(grade),
//         section,
//         isActive: true,
//       },
//       include: {
//         resultDetail: {
//           where: {
//             semester: semester.name,
//           },
//           select: { score: true },
//         },
//       },
//     });

//     if (!students.length) {
//       return NextResponse.json({ message: "No students found" }, { status: 404 });
//     }

//     // 🎯 3️⃣ Calculate scores
//     const studentScores = students
//       .map((student) => {
//         const scores = student.resultDetail.map((r) => r.score ?? 0);
//         if (scores.length < totalSubjects) return null;

//         const totalScore = scores.reduce((sum, score) => sum + score, 0);
//         const averageScore = parseFloat((totalScore / totalSubjects).toFixed(2));
//         const hasFailed = scores.some((score) => score < passingScore);
//         const passStatus = hasFailed ? "failed" : "passed";

//         return {
//           registrationID: student.registrationID,
//           average: averageScore,
//           passStatus,
//         };
//       })
//       .filter(Boolean);

//     if (!studentScores.length) {
//       return NextResponse.json({ message: "Incomplete result data for students" }, { status: 400 });
//     }

//     // 🏆 4️⃣ Rank students by average score
//     studentScores.sort((a, b) => b.average - a.average);
//     studentScores.forEach((s, i) => (s.rank = i + 1));

//     // 💾 5️⃣ Save to ResultSummary table (create or update using semester name)
//     await Promise.all(
//       studentScores.map((student) =>
//         prisma.resultSummary.upsert({
//           where: {
//             registrationID_semester: {
//               registrationID: student.registrationID,
//               semester: semester.name,
//             },
//           },
//           update: {
//             average: student.average,
//             rank: student.rank,
//             passStatus: student.passStatus,
//           },
//           create: {
//             registrationID: student.registrationID,
//             semester: semester.name,
//             average: student.average,
//             rank: student.rank,
//             passStatus: student.passStatus,
//           },
//         })
//       )
//     );

//     return NextResponse.json({ message: "Student results summarized successfully." }, { status: 200 });
//   } catch (error) {
//     console.error("Error processing result summary:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

// import { prisma } from "@/utils/prisma";
// import { NextResponse } from "next/server";

// export async function PUT(req) {
//   try {
//     const { year, grade, section } = await req.json();

//     const passingScore = 50;
//     const totalSubjects = 6;

//     // 🔍 1️⃣ Get current active semester
//     const semester = await prisma.semester.findFirst({
//       where: { status: "active" },
//       select: { name: true },
//     });
    

//     if (!semester) {
//       return NextResponse.json({ message: "No active semester found" }, { status: 404 });
//     }

//     // 📚 2️⃣ Get students in specified group with result details for current semester
//     const students = await prisma.registration.findMany({
//       where: {
//         year: Number(year),
//         grade: Number(grade),
//         section,
//         isActive: true,
//       },
//       include: {
//         resultDetail: {
//           where: {
//             semester: semester.name,
//           },
//           select: { score: true },
//         },
//       },
//     });

//     if (!students.length) {
//       return NextResponse.json({ message: "No students found" }, { status: 404 });
//     }

//     // 🎯 3️⃣ Calculate scores
//     const studentScores = students
//       .map((student) => {
//         const scores = student.resultDetail.map((r) => r.score ?? 0);
//         if (scores.length < totalSubjects) return null;

//         const totalScore = scores.reduce((sum, score) => sum + score, 0);
//         const averageScore = parseFloat((totalScore / totalSubjects).toFixed(2));
//         const hasFailed = scores.some((score) => score < passingScore);
//         const passStatus = hasFailed ? "failed" : "passed";

//         return {
//           registrationID: student.registrationID,
//           average: averageScore,
//           passStatus,
//         };
//       })
//       .filter(Boolean);

//     if (!studentScores.length) {
//       return NextResponse.json({ message: "Incomplete result data for students" }, { status: 400 });
//     }

//     // 🏆 4️⃣ Rank students by average score
//     studentScores.sort((a, b) => b.average - a.average);
//     studentScores.forEach((s, i) => (s.rank = i + 1));

//     // 💾 5️⃣ Save to ResultSummary table (create or update using semester name)
//     await Promise.all(
//       studentScores.map((student) =>
//         prisma.resultSummary.upsert({
//           where: {
//             registrationID_semester: {
//               registrationID: student.registrationID,
//               semester: semester.name,
//             },
//           },
//           update: {
//             average: student.average,
//             rank: student.rank,
//             passStatus: student.passStatus,
//           },
//           create: {
//             registrationID: student.registrationID,
//             semester: semester.name,
//             average: student.average,
//             rank: student.rank,
//             passStatus: student.passStatus,
//           },
//         })
//       )
//     );

//     return NextResponse.json({ message: "Student results summarized successfully." }, { status: 200 });
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
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    const sem = Number(semester);
    if (![1, 2, 3].includes(sem)) {
      return NextResponse.json({ message: "Invalid semester value" }, { status: 400 });
    }

    const existingGrade = await prisma.grade.findUnique({
      where: { grade: Number(grade) },
    });
    if (!existingGrade) {
      return NextResponse.json({ message: "Grade not found" }, { status: 404 });
    }

    const existingYear = await prisma.year.findUnique({
      where: { year: Number(year) },
    });
    if (!existingYear) {
      return NextResponse.json({ message: "Year not found" }, { status: 404 });
    }

    // ✅ Validate semester exists & is active
    const semesterRecord = await prisma.semester.findUnique({
      where: { name: sem },
    });
    if (!semesterRecord) {
      return NextResponse.json({ message: `Semester ${sem} not found` }, { status: 404 });
    }
    if (!semesterRecord.isActive) {
      return NextResponse.json({ message: `Semester ${sem} is not active` }, { status: 400 });
    }

    // 📚 Total subjects required based on grade
    let totalSubjects = 6; // default
    if ([9, 10].includes(Number(grade))) {
      totalSubjects = 5;
    } else if ([11, 12].includes(Number(grade))) {
      totalSubjects = 6;
    }

    // 👥 Get active registrations + results
    const registrations = await prisma.registration.findMany({
      where: {
        year: Number(year),
        grade: Number(grade),
        section,
        isActive: true,
      },
      include: {
        resultDetail: {
          where: { semester: sem },
          select: { score: true },
        },
        resultSummary: {
          where: { semester: { in: [1, 2] } }, // keep for sem=3 calc
          select: { semester: true, average: true },
        },
      },
    });

    let rankedStudents = [];

    if (sem === 1 || sem === 2) {
      // 📊 Rank based on a single semester (subject-level)
      rankedStudents = registrations
        .map((reg) => {
          const scores = reg.resultDetail.map((r) => r.score ?? 0);
          if (scores.length < totalSubjects) return null;

          const totalScore = scores.reduce((sum, s) => sum + s, 0);
          const average = parseFloat((totalScore / totalSubjects).toFixed(2));

          return {
            registrationID: reg.registrationID,
            average,
          };
        })
        .filter(Boolean);
    } else if (sem === 3) {
      // 📊 Rank based on average of semesters 1 & 2 summaries
      rankedStudents = registrations
        .map((reg) => {
          const sem1 = reg.resultSummary.find((r) => r.semester === 1);
          const sem2 = reg.resultSummary.find((r) => r.semester === 2);
          if (!sem1?.average || !sem2?.average) return null;

          const avg = parseFloat(((sem1.average + sem2.average) / 2).toFixed(2));
          return {
            registrationID: reg.registrationID,
            average: avg,
          };
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
    rankedStudents.forEach((student, index) => {
      student.rank = index + 1;
    });

    // 💾 Save / update rankings
    await Promise.all(
      rankedStudents.map((student) =>
        prisma.resultSummary.upsert({
          where: {
            registrationID_semester: {
              registrationID: student.registrationID,
              semester: sem,
            },
          },
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
        })
      )
    );

    return NextResponse.json({ message: `Semester ${sem} rankings saved successfully.` }, { status: 200 });
  } catch (error) {
    console.error("Error processing result summary:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
