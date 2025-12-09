// import { prisma } from "@/utils/prisma";
// import { NextResponse } from "next/server";

// export async function PUT(req) {
//   try {
//     const { year, grade } = await req.json();
//     const gradeSections = await prisma.gradeSection.findMany({
//       where: {
//         grade: {
//           grade: grade,
//         },
//       },
//       include: {
//         section: true,
//       },
//       orderBy: {
//         section: {
//           section: "asc",
//         },
//       },
//     });
    

//     if (!gradeSections.length) {
//       return NextResponse.json({ message: "No sections defined for this grade." }, { status: 400 });
//     }

//     // 2️⃣ Get students who need section assignment
//     const students = await prisma.registration.findMany({
//       where: {
//         grade: grade,
//         year: year,
//         section: null,
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });

//     if (!students.length) {
//       return NextResponse.json({ message: "No students to assign." }, { status: 400 });
//     }

//     // 3️⃣ Track how many students are already in each section
//     const sectionOccupancy = await prisma.registration.groupBy({
//       by: ["section"],
//       where: {
//         year,
//         grade,
//         section: {
//           not: null,
//         },
//       },
//       _count: {
//         section: true,
//       },
//     });

//     const occupancyMap = {};
//     for (const item of sectionOccupancy) {
//       occupancyMap[item.section] = item._count.section;
//     }

//     // 4️⃣ Assign students one-by-one
//     const updates = [];
//     for (const student of students) {
//       let assigned = false;

//       for (const gs of gradeSections) {
//         const secName = gs.section.section;
//         const used = occupancyMap[secName] || 0;

//         if (used < gs.capacity) {
//           occupancyMap[secName] = used + 1;

//           updates.push(
//             prisma.registration.update({
//               where: { registrationID: student.registrationID },
//               data: { section: secName },
//             })
//           );

//           assigned = true;
//           break;
//         }
//       }

//       if (!assigned) {
//         break; // All sections full
//       }
//     }

//     await Promise.all(updates);

//     return NextResponse.json({
//       message: `✅ Successfully assigned ${updates.length} students.`,
//     });
//   } catch (error) {
//     console.error("❌ Error assigning sections:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }
import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { year, grade } = await req.json();

    // 1️⃣ Get sections for the grade, ordered
    const gradeSections = await prisma.gradeSection.findMany({
      where: { grade: { grade } },
      include: { section: true },
      orderBy: { section: { section: "asc" } },
    });

    if (!gradeSections.length) {
      return NextResponse.json({ message: "No sections defined for this grade." }, { status: 400 });
    }

    // 2️⃣ Get students without assigned sections, ordered by registration time
    const students = await prisma.registration.findMany({
      where: {
        grade,
        year,
        section: null,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!students.length) {
      return NextResponse.json({ message: "No students to assign." }, { status: 400 });
    }

    // 3️⃣ Track occupancy of each section
    const sectionOccupancy = await prisma.registration.groupBy({
      by: ["section"],
      where: { year, grade, section: { not: null } },
      _count: { section: true },
    });

    const occupancyMap = {};
    for (const item of sectionOccupancy) {
      occupancyMap[item.section] = item._count.section;
    }

    // 4️⃣ Split students by stream if grade 11 or 12
    let naturalStudents = [];
    let socialStudents = [];
    if (grade === 11 || grade === 12) {
      naturalStudents = students.filter(s => s.stream === "NATURAL");
      socialStudents = students.filter(s => s.stream === "SOCIAL");
    } else {
      naturalStudents = students; // All others treated normally
    }

    const assignStudents = async (studentList) => {
      const updates = [];

      for (const student of studentList) {
        let assigned = false;

        for (const gs of gradeSections) {
          const secName = gs.section.section;
          const used = occupancyMap[secName] || 0;

          // Allow assigning only if section is empty or for the same stream
          // Here, we ensure Natural & Social are in separate classes
          if (used < gs.capacity) {
            occupancyMap[secName] = used + 1;

            updates.push(
              prisma.registration.update({
                where: { registrationID: student.registrationID },
                data: { section: secName },
              })
            );

            assigned = true;
            break;
          }
        }

        if (!assigned) break; // All sections full
      }

      return updates;
    };

    // 5️⃣ Assign Natural first, then Social
    const naturalUpdates = await assignStudents(naturalStudents);
    const socialUpdates = await assignStudents(socialStudents);

    await Promise.all([...naturalUpdates, ...socialUpdates]);

    return NextResponse.json({
      message: `✅ Successfully assigned ${naturalUpdates.length + socialUpdates.length} students.`,
    });
  } catch (error) {
    console.error("❌ Error assigning sections:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
