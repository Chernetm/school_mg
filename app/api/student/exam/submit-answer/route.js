const { prisma } = require("@/utils/prisma");
import { getStudentIDFromToken } from "@/utils/auth";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    const studentID = await getStudentIDFromToken();
    console.log("Student ID from token:", studentID); // Debugging

    if (!studentID) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!studentID) {
      return NextResponse.json({ message: "Unauthorized: Student ID missing" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { examId, answers } = body;
    console.log(body, "CONSOLE");

    if (!examId || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "Invalid request data." }, { status: 400 });
    }

    // Save all answers using upsert
    const responses = await Promise.all(
      answers.map(({ questionId, answer }) =>
        prisma.response.upsert({
          where: {
            studentID_questionId_examId: { studentID, questionId, examId },
          },
          update: { answer },
          create: { examId, studentID, questionId, answer },
        })
      )
    );

    return NextResponse.json({ message: "Responses saved successfully!", responses }, { status: 201 });
  } catch (error) {
    console.error("Error saving responses:", error);
    return NextResponse.json({ error: "Failed to save responses." }, { status: 500 });
  }
}
