const { prisma } = require("@/utils/prisma");
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    // Extract token from Authorization header or cookies
    const authHeader = req.headers.get("Authorization");
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // Extract token from Authorization header
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get("examToken")?.value; // Extract token from cookies
    }

    if (!token) {
      return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
    }

    // Verify and decode JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const studentID = decoded.studentID;
    console.log("Extracted studentID:", studentID);

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
