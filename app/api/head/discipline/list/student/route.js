const {prisma}=require("@/utils/prisma");
const { NextResponse } = require("next/server");

export async function GET() {
    const studentID = Number(req.headers.get("x-student-id"));
    if (!studentID) {
        return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }
  try {
    const disciplines = await prisma.discipline.findMany({
        where: { studentID: studentID },
      include: {
        students: {
          where: { id: studentID },
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
      },
    });

    return NextResponse.json(disciplines);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch disciplines" }, { status: 500 });
  }
}