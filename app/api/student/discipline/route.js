const { prisma } = require("@/utils/prisma");
const { NextResponse } = require("next/server");

export async function GET() {
  const studentID = 1;
  if (!studentID) {
    return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
  }

  try {
    const disciplines = await prisma.disciplineRecord.findMany({
      where: { studentID : studentID.toString()}, // Ensure it's a number if `studentID` is Int
      select: {
        id: true,
        message: true,
        createdAt: true,
        student: {
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
      },
    });

    return NextResponse.json(disciplines);
  } catch (error) {
    console.error("Error fetching discipline records:", error);
    return NextResponse.json({ error: "Failed to fetch disciplines" }, { status: 500 });
  }
}
