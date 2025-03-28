const { prisma } = require("@/utils/prisma");

// GET - Fetch all years
export async function GET(req) {
  try {
    const years = await prisma.year.findMany();
    return Response.json(years, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to fetch years." }, { status: 500 });
  }
}

// POST - Create a new year
export async function POST(req) {
  try {
    const { year, status } = await req.json(); // Next.js API now uses req.json()
    const newYear = await prisma.year.create({
      data: { year, status },
    });
    return Response.json(newYear, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Year creation failed." }, { status: 500 });
  }
}

