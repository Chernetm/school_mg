const {prisma}=require("@/utils/prisma");
const { NextResponse } = require("next/server");

export async function GET() {
  try {
    const disciplines = await prisma.discipline.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
      },
    });

    return NextResponse.json(disciplines);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch disciplines" }, { status: 500 });
  }
}