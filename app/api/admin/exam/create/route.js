const { prisma } = require("@/utils/prisma");
import { NextResponse } from "next/server";

const { parse } = require("cookie");
const jwt = require("jsonwebtoken"); // Now works in Node.js runtime

 export async function POST(req) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const token = cookies.staffToken;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "Server Error: JWT secret missing" }, { status: 500 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
    }

    // Extract staff info from JWT
    const staff = await prisma.staff.findUnique({
      where: { id: decoded.id },
      select: { id: true, staffID: true },
    });

    if (!staff) {
      return NextResponse.json({ message: "Unauthorized: Staff not found" }, { status: 404 });
    }

    console.log("Staff ID:", staff.staffID);

    // Parse request body
    const body = await req.json();
    console.log("📝 Request body:", body);

    const { examTitle, examDescription, startTime, endTime, questions } = body;

    if (!examTitle || !startTime || !endTime || !Array.isArray(questions)) {
      console.log("❌ Validation failed: Missing fields.");
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    console.log("✅ Validation passed, creating exam...");

    // Step 1: Create exam
    const exam = await prisma.exam.create({
      data: {
        title: examTitle,
        description: examDescription,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        createdBy: staff.staffID,
      },
    });

    console.log("🎉 Exam created:", exam);

    // Step 2: Insert multiple questions
    const createdQuestions = await prisma.question.createMany({
      data: questions.map((q) => ({
        examId: exam.id,
        content: q.content,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correct: q.correct,
      })),
    });

    console.log("✅ Questions added:", createdQuestions);

    return NextResponse.json(
      {
        message: "Exam and questions added successfully",
        exam,
        totalQuestions: createdQuestions.count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating exam:", error);
    return NextResponse.json({ message: "Failed to create exam" }, { status: 500 });
  }
}