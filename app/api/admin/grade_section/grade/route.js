const { prisma } = require("@/utils/prisma");

export async function GET() {
  try {
    const grades = await prisma.grade.findMany({
      select: { id: true, grade: true }, // Fetch only necessary fields
    });
    console.log("Grades fetched successfully:", grades);

    return Response.json(grades, { status: 200 });
  } catch (error) {
    console.error("Error fetching grades:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
