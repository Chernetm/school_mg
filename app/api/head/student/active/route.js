const {prisma} = require("@/utils/prisma");
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get("year");

    const selectedYear = parseInt(yearParam) || new Date().getFullYear();
    const grades = [9, 10, 11, 12];

    const studentCounts = await Promise.all(
      grades.map(async (grade) => {
        const count = await prisma.registration.count({
          where: {
            year: selectedYear,
            grade: grade,
          },
        });
        return { grade, count };
      })
    );

    return NextResponse.json(studentCounts, { status: 200 });
  } catch (error) {
    console.error("Error fetching student counts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
