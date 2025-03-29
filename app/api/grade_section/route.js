const { prisma } = require("@/utils/prisma");
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch grade sections with related grade and section
    const gradeSections = await prisma.gradeSection.findMany({
      include: {
        grade: true,  // Fetch the related grade
        section: true // Fetch the related section
      }
    });

    // Transform data to return grade name and section name
    const formattedData = gradeSections.map(gs => ({
      id: gs.id,
      grade: gs.grade.grade,      // Assuming 'grade' field exists in Grade model
      section: gs.section.section // Assuming 'section' field exists in Section model
    }));
   console.log(formattedData);
    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch grade sections" },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    const { grade, sections, status } = await req.json();

    if (!grade || !sections || sections.length === 0) {
      return NextResponse.json({ error: "Grade and at least one section are required." }, { status: 400 });
    }

    // Ensure grade is an integer
    const gradeNumber = parseInt(grade, 10);
    if (isNaN(gradeNumber)) {
      return NextResponse.json({ error: "Grade must be a valid number." }, { status: 400 });
    }

    // Check if the grade exists or create a new one
    const gradeRecord = await prisma.grade.upsert({
      where: { grade: gradeNumber },
      update: {},
      create: { grade: gradeNumber },
    });

    // Loop through sections and create/update records
    for (const sectionName of sections) {
      const sectionRecord = await prisma.section.upsert({
        where: { section: sectionName.trim() },
        update: {},
        create: { section: sectionName.trim() },
      });

      await prisma.gradeSection.upsert({
        where: {
          gradeId_sectionId: {
            gradeId: gradeRecord.id,
            sectionId: sectionRecord.id,
          },
        },
        update: { status },
        create: {
          gradeId: gradeRecord.id,
          sectionId: sectionRecord.id,
          status,
        },
      });
    }

    return NextResponse.json({
      message: "✅ Grade and sections registered successfully!",
    });
  } catch (error) {
    console.error("Error registering grade and sections:", error);
    return NextResponse.json({ error: "❌ " + (error.message || "An unexpected error occurred.") }, { status: 500 });
  }
}



export async function DELETE(req) {
  try {
    // Extract the `id` from the request body
    const { id } = await req.json();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid or missing grade section ID" }, { status: 400 });
    }

    // Delete the grade section
    const deletedRecord = await prisma.gradeSection.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Grade-Section deleted successfully", deletedRecord },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting grade section:", error);
    return NextResponse.json(
      { error: "Failed to delete grade section. It may not exist." },
      { status: 404 }
    );
  }
}
