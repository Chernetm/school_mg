const {prisma}=require("@/utils/prisma")
import { NextResponse } from "next/server";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const exam = await prisma.exam.findFirst({
      where: { title: { equals: title } }, // Case-insensitive search
      include: { questions: true },
    });

    if (!exam) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    console.error("Error fetching exam:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
