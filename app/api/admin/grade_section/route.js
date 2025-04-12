const { prisma } = require("@/utils/prisma");
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const gradeSections = await prisma.gradeSection.findMany({
      include: {
        grade: true,
        section: true,
      },
    });

    const formattedData = gradeSections.map((gs) => ({
      id: gs.id,
      grade: gs.grade.grade,
      section: {
        section: gs.section.section,
        capacity: gs.capacity ?? 0,
      },
    }));

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
      return NextResponse.json(
        { error: "Grade and at least one section are required." },
        { status: 400 }
      );
    }

    const gradeNumber = parseInt(grade, 10);
    if (isNaN(gradeNumber)) {
      return NextResponse.json(
        { error: "Grade must be a valid number." },
        { status: 400 }
      );
    }

    const gradeRecord = await prisma.grade.upsert({
      where: { grade: gradeNumber },
      update: {},
      create: { grade: gradeNumber },
    });

    for (const { name, capacity } of sections) {
      if (!name.trim() || capacity === undefined || isNaN(Number(capacity))) {
        return NextResponse.json(
          { error: "Each section must have a valid name and capacity." },
          { status: 400 }
        );
      }

      const sectionRecord = await prisma.section.upsert({
        where: { section: name.trim() },
        update: {},
        create: { section: name.trim() },
      });

      await prisma.gradeSection.upsert({
        where: {
          gradeId_sectionId: {
            gradeId: gradeRecord.id,
            sectionId: sectionRecord.id,
          },
        },
        update: {
          status,
          capacity: Number(capacity),
        },
        create: {
          gradeId: gradeRecord.id,
          sectionId: sectionRecord.id,
          status,
          capacity: Number(capacity),
        },
      });
    }

    return NextResponse.json({
      message: "✅ Grade and sections registered successfully!",
    });
  } catch (error) {
    console.error("Error registering grade and sections:", error);
    return NextResponse.json(
      { error: "❌ " + (error.message || "An unexpected error occurred.") },
      { status: 500 }
    );
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
