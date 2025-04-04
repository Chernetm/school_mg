const {prisma}=require("@/utils/prisma")
import { NextResponse } from "next/server";


export async function PUT(req) {
  try {
    const { year, grade } = await req.json();

    // ✅ 1️⃣ Get available sections & capacities
    const sections = await prisma.gradeSections.findMany({
      where: { year, grade },
      orderBy: { section: "asc" }, // Ensure ordered assignment (A → B → C)
    });

    if (!sections.length) {
      return NextResponse.json({ message: "No sections defined for this grade" }, { status: 400 });
    }

    // ✅ 2️⃣ Fetch students who need section assignment (ordered by registration)
    let students = await prisma.registration.findMany({
      where: { year, grade, section: null },
      orderBy: { createdAt: "asc" }, // Assign earlier registrations first
    });

    if (!students.length) {
      return NextResponse.json({ message: "No students need section assignment" }, { status: 400 });
    }

    // ✅ 3️⃣ Assign students to sections based on capacity
    let sectionCapacities = {}; // Track assigned students count per section
    for (let sec of sections) {
      sectionCapacities[sec.section] = sec.capacity;
    }

    let studentUpdates = [];
    let sectionIndex = 0;

    for (let student of students) {
      while (sectionIndex < sections.length && sectionCapacities[sections[sectionIndex].section] <= 0) {
        sectionIndex++; // Move to next section if current is full
      }

      if (sectionIndex >= sections.length) break; // No more available sections

      let assignedSection = sections[sectionIndex].section;
      sectionCapacities[assignedSection] -= 1; // Reduce available slots

      studentUpdates.push(
        prisma.registration.update({
          where: { registrationID: student.registrationID },
          data: { section: assignedSection },
        })
      );
    }

    // ✅ 4️⃣ Update database in batch for efficiency
    await Promise.all(studentUpdates);

    return NextResponse.json({ message: "Sections assigned successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error assigning sections:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
