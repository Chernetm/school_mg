import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { year, grade } = await req.json();
    const gradeSections = await prisma.gradeSection.findMany({
      where: {
        grade: {
          grade: grade,
        },
      },
      include: {
        section: true,
      },
      orderBy: {
        section: {
          section: "asc",
        },
      },
    });
    

    if (!gradeSections.length) {
      return NextResponse.json({ message: "No sections defined for this grade." }, { status: 400 });
    }

    // 2️⃣ Get students who need section assignment
    const students = await prisma.registration.findMany({
      where: {
        grade: grade,
        year: year,
        section: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!students.length) {
      return NextResponse.json({ message: "No students to assign." }, { status: 400 });
    }

    // 3️⃣ Track how many students are already in each section
    const sectionOccupancy = await prisma.registration.groupBy({
      by: ["section"],
      where: {
        year,
        grade,
        section: {
          not: null,
        },
      },
      _count: {
        section: true,
      },
    });

    const occupancyMap = {};
    for (const item of sectionOccupancy) {
      occupancyMap[item.section] = item._count.section;
    }

    // 4️⃣ Assign students one-by-one
    const updates = [];
    for (const student of students) {
      let assigned = false;

      for (const gs of gradeSections) {
        const secName = gs.section.section;
        const used = occupancyMap[secName] || 0;

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

      if (!assigned) {
        break; // All sections full
      }
    }

    await Promise.all(updates);

    return NextResponse.json({
      message: `✅ Successfully assigned ${updates.length} students.`,
    });
  } catch (error) {
    console.error("❌ Error assigning sections:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
